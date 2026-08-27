import { describe, expect, it } from 'vitest';

import { jdnToIso } from '../src/jdn';
import { reckon, SEASON0, type ReckonInput } from '../src/reckon';

// A neutral, non-void merge that lands a wide AD window low on the axis (small seed via a zero-prefixed
// sha) so the search reliably catches Gregorian π-days. Wednesday 12:00 UTC → no time fortune.
function merge(over: Partial<ReckonInput> = {}): ReckonInput {
  return {
    sha: '000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    timestampUtc: '2026-08-26T12:00:00Z',
    commits: 100,
    parents: 1,
    touchesLockfile: false,
    hasCrlfOrTrailingWs: false,
    additions: 100,
    deletions: 1, // D < 0.1·A → AD
    ...over,
  };
}

describe('reckon — clock and direction', () => {
  it('commit count is the clock, capped at MAX_TURNS', () => {
    expect(reckon(merge({ commits: 40 })).f).toBe(40);
    expect(reckon(merge({ commits: 1000 })).f).toBe(SEASON0.MAX_TURNS);
    expect(reckon(merge({ commits: 0 })).f).toBe(1);
  });

  it('additions vs deletions choose the era at D = 0.1·A', () => {
    expect(reckon(merge({ additions: 100, deletions: 5 })).direction).toBe('AD'); // 5 < 10
    expect(reckon(merge({ additions: 100, deletions: 10 })).direction).toBe('BC'); // 10 ≥ 10
    expect(reckon(merge({ additions: 100, deletions: 200 })).direction).toBe('BC');
  });

  it('A = 0 voids the merge (no coherent direction)', () => {
    const r = reckon(merge({ additions: 0, deletions: 5 }));
    expect(r.voided).toBe(true);
    expect(r.fPrime).toBe(0);
    expect(r.catches).toEqual([]);
  });
});

describe('reckon — fortunes fold into the effective clock', () => {
  it('a penalty shrinks f′ deterministically', () => {
    // even commits (100) → ×0.9 → round(100 clamped→100 ×0.9) but clamped to MAX first: f=100, f'=90
    const r = reckon(merge({ commits: 100 }));
    expect(r.f).toBe(100);
    expect(r.fPrime).toBe(90); // even-commits 0.9
  });

  it('03:14:15 UTC is legendary — f′ pinned to MAX regardless of penalties', () => {
    const r = reckon(merge({ commits: 2, timestampUtc: '2026-06-10T03:14:15Z' }));
    expect(r.legendary).toBe(true);
    expect(r.fPrime).toBe(SEASON0.MAX_TURNS);
  });

  it('bad luck can round a low-clock merge down to a void search', () => {
    // Friday (×0.25) on a single-commit merge: round(1 × 0.25) = 0 → f′ = 0 → the merge searches nothing.
    const r = reckon(merge({ commits: 1, timestampUtc: '2026-08-28T10:00:00Z' }));
    expect(r.fPrime).toBe(0);
    expect(r.voided).toBe(true);
    expect(r.catches).toEqual([]);
  });
});

describe('reckon — window and catches', () => {
  it('the window stays inside the safe band', () => {
    const r = reckon(merge());
    expect(r.window.start).toBeGreaterThanOrEqual(SEASON0.SAFE_MIN);
    expect(r.window.stop).toBeLessThanOrEqual(SEASON0.SAFE_MAX);
    expect(r.window.stop).toBeGreaterThan(r.window.start);
  });

  it('a wide AD search catches valid, independently-confirmed π-days', () => {
    const r = reckon(merge({ commits: 124, additions: 100, deletions: 1 }));
    expect(r.catches.length).toBeGreaterThan(0);
    for (const c of r.catches) {
      expect(jdnToIso(c.jdn)).toBe(c.isoDate); // date matches the JDN
      expect(c.readings.length).toBeGreaterThan(0);
      for (const read of c.readings) expect(read.depth).toBeGreaterThanOrEqual(SEASON0.QUALIFYING_DEPTH);
      expect(c.multiplicity).toBe(new Set(c.readings.map((x) => x.calendarId)).size);
    }
    // claim = earliest in the AD (forward) direction
    const jdns = r.catches.map((c) => c.jdn);
    expect(jdns[0]).toBe(Math.min(...jdns));
  });

  it('is deterministic — the same merge reckons the same result', () => {
    const m = merge({ commits: 77 });
    expect(reckon(m)).toEqual(reckon(m));
  });
});
