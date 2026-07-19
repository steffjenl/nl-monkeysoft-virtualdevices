import { describe, expect, it } from 'vitest';
import {
  extractJsonPollValue,
  getJsonPollSettings,
  JsonPollValidationError,
} from '../lib/jsonPoll';

describe('getJsonPollSettings', () => {
  it('returns null when no JSON URL is configured', () => {
    expect(getJsonPollSettings({ json_url: '' })).toBeNull();
    expect(getJsonPollSettings({})).toBeNull();
  });

  it('parses a direct-path configuration', () => {
    expect(
      getJsonPollSettings({
        json_url: 'https://example.com/state',
        json_poll_interval: '120',
        json_timeout: '15',
        json_headers: '{"Authorization":"Bearer token"}',
        json_mapping_mode: 'path',
        json_value_path: 'devices[0].on',
      }),
    ).toEqual({
      url: 'https://example.com/state',
      intervalSeconds: 120,
      timeoutSeconds: 15,
      headers: { Authorization: 'Bearer token' },
      mappingMode: 'path',
      valuePath: 'devices[0].on',
      deviceListPath: '',
      deviceName: '',
      deviceNameField: 'name',
      deviceValueField: '',
    });
  });

  it('parses a device-list configuration', () => {
    expect(
      getJsonPollSettings({
        json_url: 'http://example.com/data',
        json_mapping_mode: 'device',
        json_device_list_path: 'devices',
        json_device_name: 'orange',
        json_device_name_field: 'name',
        json_device_value_field: 'on',
      }),
    ).toMatchObject({
      mappingMode: 'device',
      deviceListPath: 'devices',
      deviceName: 'orange',
      deviceNameField: 'name',
      deviceValueField: 'on',
    });
  });

  it('rejects invalid URLs', () => {
    expect(() => getJsonPollSettings({ json_url: 'ftp://example.com', json_value_path: 'value' })).toThrow(
      JsonPollValidationError,
    );
  });

  it('rejects missing path-mode mappings', () => {
    expect(() =>
      getJsonPollSettings({
        json_url: 'https://example.com',
        json_mapping_mode: 'path',
      }),
    ).toThrowError(expect.objectContaining({ code: 'missing_value_path' }));
  });

  it('rejects invalid header JSON', () => {
    expect(() =>
      getJsonPollSettings({
        json_url: 'https://example.com',
        json_value_path: 'value',
        json_headers: '{bad json}',
      }),
    ).toThrowError(expect.objectContaining({ code: 'invalid_headers_json' }));
  });
});

describe('extractJsonPollValue', () => {
  const payload = {
    success: true,
    checked_at: 1784474506,
    devices: [
      { name: 'orange', on: false, value: 12.5 },
      { name: 'apple', on: true, value: 7 },
    ],
  };

  it('extracts a value using a direct path', () => {
    const settings = getJsonPollSettings({
      json_url: 'https://example.com',
      json_mapping_mode: 'path',
      json_value_path: 'devices[1].value',
    });

    expect(settings).not.toBeNull();
    expect(extractJsonPollValue(payload, settings!)).toBe(7);
  });

  it('extracts a value from a matched device in a list', () => {
    const settings = getJsonPollSettings({
      json_url: 'https://example.com',
      json_mapping_mode: 'device',
      json_device_list_path: 'devices',
      json_device_name: 'orange',
      json_device_name_field: 'name',
      json_device_value_field: 'on',
    });

    expect(settings).not.toBeNull();
    expect(extractJsonPollValue(payload, settings!)).toBe(false);
  });

  it('returns undefined when a path does not exist', () => {
    const settings = getJsonPollSettings({
      json_url: 'https://example.com',
      json_mapping_mode: 'path',
      json_value_path: 'devices[9].missing',
    });

    expect(settings).not.toBeNull();
    expect(extractJsonPollValue(payload, settings!)).toBeUndefined();
  });

  it('returns undefined for malformed paths', () => {
    const settings = getJsonPollSettings({
      json_url: 'https://example.com',
      json_mapping_mode: 'path',
      json_value_path: 'devices[abc].value',
    });

    expect(settings).not.toBeNull();
    expect(extractJsonPollValue(payload, settings!)).toBeUndefined();
  });
});