import { describe, expect, it } from 'vitest';

import { clockDigits, FRACTIONAL_PI_INSTANT, STANDARD_PI_INSTANT } from '../src/clock';
import { matchDepth } from '../src/pi';
import { mmddyy } from '../src/reckonings/standard';

describe('the π-instant', () => {
  it('the standard instant digits continue π after a depth-5 date', () => {
    expect(STANDARD_PI_INSTANT.digits).toBe('92653589');
  });

  it('extends a mm-dd-yy perfect day from depth 5 to depth 13', () => {
    const read = mmddyy.read({ year: 2015, month: 3, day: 14 }, 0);
    const extended = read.digits + clockDigits(mmddyy);
    expect(extended).toBe('3141592653589');
    expect(matchDepth(extended)).toBe(13);
  });

  it('extends a unix timestamp with the fractional instant', () => {
    const extended = '3141592653' + clockDigits({ timeExtends: true, calendarId: 'unix' });
    expect(extended).toBe('3141592653589');
    expect(matchDepth(extended)).toBe(13);
    expect(FRACTIONAL_PI_INSTANT.digits).toBe('589');
  });

  it('appends nothing when a reckoning does not extend', () => {
    expect(clockDigits({ timeExtends: false, calendarId: 'gregorian' })).toBe('');
  });
});
