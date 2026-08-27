import { describe, expect, it } from 'vitest';

import { fortunes, type MergeFacts } from '../src/reckon';

// A neutral merge: Wednesday 12:00 UTC (no time fortune), single non-merge commit count 3 (odd → no
// even penalty; prime → we'll account for it), clean diff. Callers override one field to isolate a rule.
function base(over: Partial<MergeFacts> = {}): MergeFacts {
  return {
    sha: 'abcdef012345',
    timestampUtc: '2026-08-26T12:00:00Z', // Wednesday, hour 12
    commits: 9, // odd, not prime
    parents: 1,
    touchesLockfile: false,
    hasCrlfOrTrailingWs: false,
    ...over,
  };
}

const names = (m: MergeFacts) => fortunes(m).applied.map((f) => f.name);

describe('fortunes — penalties (all UTC)', () => {
  it('Friday ×0.25', () => {
    expect(names(base({ timestampUtc: '2026-08-28T10:00:00Z' }))).toContain('friday'); // Fri
  });
  it('Sunday ×0.5', () => {
    expect(names(base({ timestampUtc: '2026-08-30T10:00:00Z' }))).toContain('sunday'); // Sun
  });
  it('lockfile, merge-commit, crlf, even commits', () => {
    expect(names(base({ touchesLockfile: true }))).toContain('lockfile');
    expect(names(base({ parents: 2 }))).toContain('merge-commit');
    expect(names(base({ hasCrlfOrTrailingWs: true }))).toContain('crlf-or-trailing-ws');
    expect(names(base({ commits: 8 }))).toContain('even-commits');
  });
});

describe('fortunes — bonuses (all UTC)', () => {
  it('π-hour 03:14 and 15:14 ×3.14', () => {
    expect(names(base({ timestampUtc: '2026-06-10T03:14:00Z' }))).toContain('pi-hour-0314');
    expect(names(base({ timestampUtc: '2026-06-10T15:14:00Z' }))).toContain('pi-hour-0314');
  });
  it('03:14:15 is legendary', () => {
    const r = fortunes(base({ timestampUtc: '2026-06-10T03:14:15Z' }));
    expect(r.legendary).toBe(true);
  });
  it('Wednesday 14:00 ×2', () => {
    expect(names(base({ timestampUtc: '2026-08-26T14:00:00Z' }))).toContain('wednesday-14');
  });
  it('Pi Day 03-14 ×3.14', () => {
    expect(names(base({ timestampUtc: '2026-03-14T12:00:00Z' }))).toContain('pi-day');
  });
  it('π-instant minute 09:26 ×1.5', () => {
    expect(names(base({ timestampUtc: '2026-06-10T09:26:00Z' }))).toContain('pi-instant-0926');
  });
  it('SHA contains 314 ×1.5', () => {
    expect(names(base({ sha: 'aa314bb00000' }))).toContain('sha-314');
  });
  it('prime commit count ×1.2', () => {
    expect(names(base({ commits: 7 }))).toContain('prime-commits');
    expect(names(base({ commits: 9 }))).not.toContain('prime-commits'); // 9 = 3×3
  });
});

describe('fortunes — product', () => {
  it('multiplies the fired factors', () => {
    // Friday (0.25) + lockfile (0.5) on an odd non-prime count → 0.125
    const r = fortunes(base({ timestampUtc: '2026-08-28T10:00:00Z', touchesLockfile: true, commits: 9 }));
    expect(r.product).toBeCloseTo(0.125, 10);
  });
  it('a neutral merge has product 1', () => {
    // Wednesday 12:00, commits 9 (odd, non-prime), clean → nothing fires
    expect(fortunes(base()).applied).toHaveLength(0);
    expect(fortunes(base()).product).toBe(1);
  });
});
