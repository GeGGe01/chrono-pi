import { describe, expect, it } from 'vitest';

import { getCalendar } from '../src/calendars/registry';
import { findCollisions } from '../src/collisions';
import { scan } from '../src/scan';

describe('findCollisions', () => {
  it('keeps the Gregorian + Holocene co-read but does not count it as a collision', () => {
    // 1915-03-14: Gregorian and Holocene both read π, but Holocene is the Gregorian gear relabelled.
    const readings = scan('1915-03-14', '1915-03-14').map((day) => day.calendarId);
    expect(readings).toContain('gregorian');
    expect(readings).toContain('holocene');
    expect(getCalendar('gregorian')?.independent).toBe(true);
    expect(getCalendar('holocene')?.independent).toBe(false);

    // Only one independent gear, so it is not a double.
    expect(findCollisions('1915-03-14', '1915-03-14')).toEqual([]);
  });

  it('finds no spurious collisions across a quiet stretch', () => {
    expect(findCollisions('1916-01-01', '1916-12-31')).toEqual([]);
  });
});
