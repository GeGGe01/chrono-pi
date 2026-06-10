import { describe, expect, it } from 'vitest';

import { scan } from '../src/scan';

// A handful of perfect days the engine must keep reproducing. The depth includes the π-instant
// extension where it continues the sequence (it carries 31415 to 3141592653589).
//
// Unix is not fixtured here: its perfect day falls on second 3141592653 (mid-day 2069-07-21), which the
// literal midnight-second model of Steps 6/8 cannot reach. Reproducing it needs an instant-aware Unix
// reckoning — recorded as a Phase 1 finding rather than silently changing the reckoning.
const KNOWN_PERFECT_DAYS = [
  { iso: '2015-03-14', calendarId: 'gregorian', reckoningId: 'mm-dd-yy', depth: 13 },
  { iso: '2031-04-15', calendarId: 'gregorian', reckoningId: 'yy-m-dd', depth: 13 },
  { iso: '3141-05-09', calendarId: 'gregorian', reckoningId: 'yyyy-mm-dd', depth: 6 },
] as const;

describe('smoke: known perfect days', () => {
  for (const expected of KNOWN_PERFECT_DAYS) {
    it(`${expected.iso} reads π via ${expected.reckoningId} to depth ${expected.depth}`, () => {
      const hit = scan(expected.iso, expected.iso).find(
        (day) => day.calendarId === expected.calendarId && day.reckoningId === expected.reckoningId,
      );

      expect(hit).toBeDefined();
      expect(hit?.isoDate).toBe(expected.iso);
      expect(hit?.depth).toBe(expected.depth);
      expect(hit?.tier).toBe('canonical');
    });
  }
});
