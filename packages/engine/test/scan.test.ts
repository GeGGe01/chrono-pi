import { describe, expect, it } from 'vitest';

import { scan } from '../src/scan';

describe('scan', () => {
  it('finds the Gregorian mm-dd-yy perfect day on 2015-03-14', () => {
    const days = scan('2015-01-01', '2015-12-31');
    const piDay = days.find((d) => d.isoDate === '2015-03-14' && d.reckoningId === 'mm-dd-yy');

    expect(piDay).toBeDefined();
    expect(piDay?.calendarId).toBe('gregorian');
    expect(piDay?.digits.startsWith('31415')).toBe(true);
    expect(piDay?.depth).toBeGreaterThanOrEqual(5);
    expect(piDay?.tier).toBe('canonical');
  });

  it('emits nothing across a quiet week below the minimum depth', () => {
    expect(scan('2015-01-01', '2015-01-07')).toEqual([]);
  });
});
