import { describe, expect, it } from 'vitest';
import {
  clamp,
  inRange,
  isFiniteNumber,
  normalizeText,
  parseBoolean,
  parseNumber,
  roundTo,
  textContains,
  textEquals,
} from '../lib/validators';

describe('isFiniteNumber', () => {
  it('accepts finite numbers', () => {
    expect(isFiniteNumber(0)).toBe(true);
    expect(isFiniteNumber(-12.5)).toBe(true);
  });

  it('rejects non-numbers and non-finite values', () => {
    expect(isFiniteNumber(NaN)).toBe(false);
    expect(isFiniteNumber(Infinity)).toBe(false);
    expect(isFiniteNumber('5')).toBe(false);
    expect(isFiniteNumber(null)).toBe(false);
    expect(isFiniteNumber(undefined)).toBe(false);
  });
});

describe('parseNumber', () => {
  it('passes through finite numbers', () => {
    expect(parseNumber(42)).toBe(42);
    expect(parseNumber(-0.5)).toBe(-0.5);
  });

  it('parses numeric strings', () => {
    expect(parseNumber('42')).toBe(42);
    expect(parseNumber(' 3.14 ')).toBe(3.14);
    expect(parseNumber('-7')).toBe(-7);
  });

  it('returns null for invalid input', () => {
    expect(parseNumber('')).toBeNull();
    expect(parseNumber('  ')).toBeNull();
    expect(parseNumber('abc')).toBeNull();
    expect(parseNumber(NaN)).toBeNull();
    expect(parseNumber(Infinity)).toBeNull();
    expect(parseNumber(null)).toBeNull();
    expect(parseNumber(undefined)).toBeNull();
    expect(parseNumber({})).toBeNull();
    expect(parseNumber(true)).toBeNull();
  });
});

describe('roundTo', () => {
  it('rounds to the given decimals', () => {
    expect(roundTo(3.14159, 2)).toBe(3.14);
    expect(roundTo(3.145, 2)).toBe(3.15);
    expect(roundTo(3.7, 0)).toBe(4);
  });

  it('clamps decimals to a sane range', () => {
    expect(roundTo(3.14159, -3)).toBe(3);
    expect(roundTo(1.123456789, 99)).toBe(1.123457);
  });
});

describe('clamp', () => {
  it('clamps to the range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('handles swapped bounds', () => {
    expect(clamp(15, 10, 0)).toBe(10);
    expect(clamp(-5, 10, 0)).toBe(0);
  });
});

describe('inRange', () => {
  it('is inclusive on both bounds', () => {
    expect(inRange(0, 0, 10)).toBe(true);
    expect(inRange(10, 0, 10)).toBe(true);
    expect(inRange(5, 0, 10)).toBe(true);
  });

  it('rejects values outside the range', () => {
    expect(inRange(-0.001, 0, 10)).toBe(false);
    expect(inRange(10.001, 0, 10)).toBe(false);
  });

  it('handles swapped bounds', () => {
    expect(inRange(5, 10, 0)).toBe(true);
    expect(inRange(11, 10, 0)).toBe(false);
  });

  it('parses numeric strings from flow arguments', () => {
    expect(inRange('5', '0', '10')).toBe(true);
  });

  it('returns false for invalid input instead of throwing', () => {
    expect(inRange(NaN, 0, 10)).toBe(false);
    expect(inRange(null, 0, 10)).toBe(false);
    expect(inRange(undefined, 0, 10)).toBe(false);
    expect(inRange(5, NaN, 10)).toBe(false);
    expect(inRange(5, 0, 'abc')).toBe(false);
  });
});

describe('normalizeText', () => {
  it('passes strings through', () => {
    expect(normalizeText('hello')).toBe('hello');
    expect(normalizeText('')).toBe('');
  });

  it('coerces null/undefined to empty string', () => {
    expect(normalizeText(null)).toBe('');
    expect(normalizeText(undefined)).toBe('');
  });

  it('stringifies other values', () => {
    expect(normalizeText(42)).toBe('42');
    expect(normalizeText(true)).toBe('true');
  });
});

describe('textEquals', () => {
  it('compares case-insensitively by default behavior flag', () => {
    expect(textEquals('Hello', 'hello', false)).toBe(true);
    expect(textEquals('Hello', 'hello', true)).toBe(false);
    expect(textEquals('Hello', 'Hello', true)).toBe(true);
  });

  it('handles null/undefined as empty string', () => {
    expect(textEquals(null, '', false)).toBe(true);
    expect(textEquals(undefined, 'x', false)).toBe(false);
  });
});

describe('textContains', () => {
  it('finds substrings case-insensitively when requested', () => {
    expect(textContains('Hello World', 'world', false)).toBe(true);
    expect(textContains('Hello World', 'world', true)).toBe(false);
    expect(textContains('Hello World', 'World', true)).toBe(true);
  });

  it('never matches an empty needle', () => {
    expect(textContains('Hello', '', false)).toBe(false);
    expect(textContains('', '', true)).toBe(false);
  });

  it('handles null/undefined haystack', () => {
    expect(textContains(null, 'x', false)).toBe(false);
  });
});

describe('parseBoolean', () => {
  it('passes booleans through', () => {
    expect(parseBoolean(true)).toBe(true);
    expect(parseBoolean(false)).toBe(false);
  });

  it("parses the dropdown strings 'true'/'false'", () => {
    expect(parseBoolean('true')).toBe(true);
    expect(parseBoolean('TRUE')).toBe(true);
    expect(parseBoolean('false')).toBe(false);
  });

  it('treats anything else as false', () => {
    expect(parseBoolean('yes')).toBe(false);
    expect(parseBoolean(1)).toBe(false);
    expect(parseBoolean(null)).toBe(false);
    expect(parseBoolean(undefined)).toBe(false);
  });
});
