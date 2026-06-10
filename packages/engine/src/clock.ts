import type { Reckoning } from './types';

// The π-encoded clock instant 09:26:53.589. Rendered as natural digits it continues π straight after a
// depth-5 date (…31415 → 92653589), carrying a Gregorian perfect day from depth 5 to depth 13.
export const STANDARD_PI_INSTANT = { time: '09:26:53.589', digits: '92653589' } as const;

// Timestamp reckonings (Unix, MJD-style) instead extend with the fractional second .589 → 589.
export const FRACTIONAL_PI_INSTANT = { time: '.589', digits: '589' } as const;

// The digits the π-instant appends after a reckoning's date digits, or '' when it does not extend.
// Timestamp calendars use the fractional instant; everything else uses the standard clock.
export function clockDigits(reckoning: Pick<Reckoning, 'timeExtends' | 'calendarId'>): string {
  if (!reckoning.timeExtends) return '';
  return reckoning.calendarId === 'unix' ? FRACTIONAL_PI_INSTANT.digits : STANDARD_PI_INSTANT.digits;
}
