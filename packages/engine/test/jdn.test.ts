import { describe, expect, it } from 'vitest';

import { eachJdn, isoToJdn, jdnToIso } from '../src/jdn';

describe('isoToJdn', () => {
  it('maps the anchor 2000-01-01 to JDN 2451545', () => {
    expect(isoToJdn('2000-01-01')).toBe(2451545);
  });

  it('maps the Unix epoch 1970-01-01 to JDN 2440588', () => {
    expect(isoToJdn('1970-01-01')).toBe(2440588);
  });
});

describe('jdnToIso / isoToJdn round-trip', () => {
  it('round-trips a sample of dates to identity', () => {
    for (const iso of ['1858-11-17', '1970-01-01', '2000-01-01', '2015-03-14', '2026-06-10', '2197-12-31']) {
      expect(jdnToIso(isoToJdn(iso))).toBe(iso);
    }
  });
});

describe('eachJdn', () => {
  it('yields every JDN in the inclusive ISO range', () => {
    expect([...eachJdn('2015-03-13', '2015-03-15')]).toEqual([
      isoToJdn('2015-03-13'),
      isoToJdn('2015-03-14'),
      isoToJdn('2015-03-15'),
    ]);
  });

  it('yields a single day when start equals end', () => {
    expect([...eachJdn('2000-01-01', '2000-01-01')]).toEqual([2451545]);
  });
});
