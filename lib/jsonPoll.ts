import http from 'node:http';
import https from 'node:https';
import { JsonPollMappingMode, JsonPollSettings } from './types';
import { parseNumber } from './validators';

export const DEFAULT_POLL_INTERVAL_SECONDS = 60;
export const DEFAULT_TIMEOUT_SECONDS = 10;
export const MIN_POLL_INTERVAL_SECONDS = 5;
export const MAX_POLL_INTERVAL_SECONDS = 3600;
export const MIN_TIMEOUT_SECONDS = 1;
export const MAX_TIMEOUT_SECONDS = 300;

export type JsonPollValidationErrorCode =
  | 'invalid_url'
  | 'invalid_interval'
  | 'invalid_timeout'
  | 'invalid_headers_json'
  | 'invalid_headers_shape'
  | 'invalid_mapping_mode'
  | 'missing_value_path'
  | 'missing_device_list_path'
  | 'missing_device_name'
  | 'missing_device_name_field'
  | 'missing_device_value_field';

export class JsonPollValidationError extends Error {
  constructor(public readonly code: JsonPollValidationErrorCode) {
    super(code);
    this.name = 'JsonPollValidationError';
  }
}

export interface JsonPollSettingsInput {
  json_url?: unknown;
  json_poll_interval?: unknown;
  json_timeout?: unknown;
  json_headers?: unknown;
  json_mapping_mode?: unknown;
  json_value_path?: unknown;
  json_device_list_path?: unknown;
  json_device_name?: unknown;
  json_device_name_field?: unknown;
  json_device_value_field?: unknown;
}

export function getJsonPollSettings(raw: JsonPollSettingsInput): JsonPollSettings | null {
  const url = normalizeString(raw.json_url);
  if (url === '') return null;

  const parsedUrl = parseHttpUrl(url);
  if (parsedUrl === null) {
    throw new JsonPollValidationError('invalid_url');
  }

  const intervalSeconds = parseNumber(raw.json_poll_interval) ?? DEFAULT_POLL_INTERVAL_SECONDS;
  if (!Number.isInteger(intervalSeconds) || intervalSeconds < MIN_POLL_INTERVAL_SECONDS || intervalSeconds > MAX_POLL_INTERVAL_SECONDS) {
    throw new JsonPollValidationError('invalid_interval');
  }

  const timeoutSeconds = parseNumber(raw.json_timeout) ?? DEFAULT_TIMEOUT_SECONDS;
  if (!Number.isInteger(timeoutSeconds) || timeoutSeconds < MIN_TIMEOUT_SECONDS || timeoutSeconds > MAX_TIMEOUT_SECONDS) {
    throw new JsonPollValidationError('invalid_timeout');
  }

  const headers = parseHeaders(raw.json_headers);
  const mappingMode = parseMappingMode(raw.json_mapping_mode);
  const valuePath = normalizeString(raw.json_value_path);
  const deviceListPath = normalizeString(raw.json_device_list_path);
  const deviceName = normalizeString(raw.json_device_name);
  const deviceNameField = normalizeString(raw.json_device_name_field) || 'name';
  const deviceValueField = normalizeString(raw.json_device_value_field);

  if (mappingMode === 'path' && valuePath === '') {
    throw new JsonPollValidationError('missing_value_path');
  }

  if (mappingMode === 'device') {
    if (deviceListPath === '') {
      throw new JsonPollValidationError('missing_device_list_path');
    }
    if (deviceName === '') {
      throw new JsonPollValidationError('missing_device_name');
    }
    if (deviceNameField === '') {
      throw new JsonPollValidationError('missing_device_name_field');
    }
    if (deviceValueField === '') {
      throw new JsonPollValidationError('missing_device_value_field');
    }
  }

  return {
    url: parsedUrl.toString(),
    intervalSeconds,
    timeoutSeconds,
    headers,
    mappingMode,
    valuePath,
    deviceListPath,
    deviceName,
    deviceNameField,
    deviceValueField,
  };
}

export function extractJsonPollValue(payload: unknown, settings: JsonPollSettings): unknown {
  if (settings.mappingMode === 'path') {
    return getPathValue(payload, settings.valuePath);
  }

  const collection = getPathValue(payload, settings.deviceListPath);
  if (!Array.isArray(collection)) return undefined;

  for (const item of collection) {
    if (getPathValue(item, settings.deviceNameField) === settings.deviceName) {
      return getPathValue(item, settings.deviceValueField);
    }
  }

  return undefined;
}

export async function fetchJsonPollPayload(settings: JsonPollSettings): Promise<unknown> {
  const url = new URL(settings.url);
  const client = url.protocol === 'https:' ? https : http;

  return await new Promise<unknown>((resolve, reject) => {
    const request = client.request(
      url,
      {
        method: 'GET',
        headers: settings.headers,
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on('data', (chunk: Buffer | string) => {
          chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
        });
        response.on('end', () => {
          const statusCode = response.statusCode ?? 0;
          if (statusCode < 200 || statusCode >= 300) {
            reject(new Error(`Request failed with status ${statusCode}`));
            return;
          }

          try {
            const body = Buffer.concat(chunks).toString('utf8');
            resolve(JSON.parse(body) as unknown);
          } catch (err) {
            reject(err);
          }
        });
      },
    );

    request.setTimeout(settings.timeoutSeconds * 1000, () => {
      request.destroy(new Error('Request timed out'));
    });
    request.on('error', (err) => reject(err));
    request.end();
  });
}

function parseHttpUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url;
  } catch {
    return null;
  }
}

function parseHeaders(value: unknown): Record<string, string> {
  const text = normalizeString(value);
  if (text === '') return {};

  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    throw new JsonPollValidationError('invalid_headers_json');
  }

  if (parsed === null || Array.isArray(parsed) || typeof parsed !== 'object') {
    throw new JsonPollValidationError('invalid_headers_shape');
  }

  const headers: Record<string, string> = {};
  for (const [key, headerValue] of Object.entries(parsed)) {
    if (typeof headerValue !== 'string') {
      throw new JsonPollValidationError('invalid_headers_shape');
    }
    headers[key] = headerValue;
  }

  return headers;
}

function parseMappingMode(value: unknown): JsonPollMappingMode {
  const text = normalizeString(value);
  if (text === '' || text === 'path') return 'path';
  if (text === 'device') return 'device';
  throw new JsonPollValidationError('invalid_mapping_mode');
}

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function getPathValue(source: unknown, path: string): unknown {
  const segments = parsePath(path);
  if (segments === null) return undefined;
  let current: unknown = source;

  for (const segment of segments) {
    if (typeof segment === 'number') {
      if (!Array.isArray(current) || segment < 0 || segment >= current.length) return undefined;
      current = current[segment];
      continue;
    }

    if (current === null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}

function parsePath(path: string): Array<string | number> | null {
  const segments: Array<string | number> = [];
  const normalized = path.trim();
  if (normalized === '') return segments;

  let buffer = '';
  for (let index = 0; index < normalized.length; index += 1) {
    const character = normalized[index];
    if (character === '.') {
      pushSegment(buffer, segments);
      buffer = '';
      continue;
    }

    if (character === '[') {
      pushSegment(buffer, segments);
      buffer = '';
      const endIndex = normalized.indexOf(']', index);
      if (endIndex === -1) return null;
      const token = normalized.slice(index + 1, endIndex).trim();
      if (!/^\d+$/.test(token)) return null;
      segments.push(Number(token));
      index = endIndex;
      continue;
    }

    buffer += character;
  }

  pushSegment(buffer, segments);
  return segments;
}

function pushSegment(segment: string, segments: Array<string | number>): void {
  const normalized = segment.trim();
  if (normalized !== '') {
    segments.push(normalized);
  }
}