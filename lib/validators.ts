/**
 * Pure validation and normalization helpers, shared by all virtual devices.
 * These functions never throw; callers decide how to handle invalid input.
 */

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Parses arbitrary input (number, numeric string) to a finite number.
 * Returns null for anything that is not a clean finite number.
 */
export function parseNumber(value: unknown): number | null {
  if (isFiniteNumber(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

/**
 * Rounds to a fixed number of decimals. Decimals are clamped to 0..6 to
 * avoid floating point noise from nonsensical settings.
 */
export function roundTo(value: number, decimals: number): number {
  const safeDecimals = Math.min(Math.max(Math.trunc(decimals), 0), 6);
  const factor = 10 ** safeDecimals;
  return Math.round(value * factor) / factor;
}

export function clamp(value: number, min: number, max: number): number {
  const [lo, hi] = min <= max ? [min, max] : [max, min];
  return Math.min(Math.max(value, lo), hi);
}

/**
 * Inclusive range check: min <= value <= max.
 * Returns false when any input is not a finite number.
 * Swapped bounds (min > max) are treated as the equivalent valid range.
 */
export function inRange(value: unknown, min: unknown, max: unknown): boolean {
  const parsedValue = parseNumber(value);
  const parsedMin = parseNumber(min);
  const parsedMax = parseNumber(max);
  if (parsedValue === null || parsedMin === null || parsedMax === null) return false;
  const [lo, hi] = parsedMin <= parsedMax ? [parsedMin, parsedMax] : [parsedMax, parsedMin];
  return parsedValue >= lo && parsedValue <= hi;
}

/**
 * Coerces any input to a string. null/undefined become an empty string.
 */
export function normalizeText(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

export function textEquals(a: unknown, b: unknown, caseSensitive: boolean): boolean {
  const left = normalizeText(a);
  const right = normalizeText(b);
  if (caseSensitive) return left === right;
  return left.toLowerCase() === right.toLowerCase();
}

export function textContains(haystack: unknown, needle: unknown, caseSensitive: boolean): boolean {
  const text = normalizeText(haystack);
  const search = normalizeText(needle);
  if (search === '') return false;
  if (caseSensitive) return text.includes(search);
  return text.toLowerCase().includes(search.toLowerCase());
}

/**
 * Coerces flow argument input to a boolean. Dropdown arguments arrive as
 * the strings 'true'/'false'; API calls may pass real booleans.
 */
export function parseBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  return normalizeText(value).toLowerCase() === 'true';
}
