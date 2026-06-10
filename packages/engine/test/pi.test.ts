import { describe, expect, it } from 'vitest';

import { PI_DIGITS, matchDepth } from '../src/pi';

describe('matchDepth', () => {
  it('matches the five-digit Pi Day prefix 31415', () => {
    expect(matchDepth('31415')).toBe(5);
  });

  it('matches a thirteen-digit prefix', () => {
    expect(matchDepth('3141592653589')).toBe(13);
  });

  it('stops at the first differing digit', () => {
    expect(matchDepth('314139')).toBe(4);
  });

  it('returns 0 when the first digit already differs', () => {
    expect(matchDepth('2')).toBe(0);
  });

  it('returns 0 for the empty string', () => {
    expect(matchDepth('')).toBe(0);
  });
});

describe('PI_DIGITS', () => {
  it('is the digits of π with no separator, starting at 3', () => {
    expect(PI_DIGITS.startsWith('314159265358979')).toBe(true);
  });

  it('carries at least 100 digits to cover the deepest reckoning', () => {
    expect(PI_DIGITS.length).toBeGreaterThanOrEqual(100);
  });
});
