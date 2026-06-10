import { describe, expect, it } from 'vitest';

// Import through the package name, as an external consumer would, to exercise the exports map.
import { matchDepth, PI_DIGITS, scan } from 'chrono-pi-engine';

describe('public entry point', () => {
  it('exposes scan from the package root', () => {
    const days = scan('2015-03-14', '2015-03-14');
    expect(days.some((day) => day.reckoningId === 'mm-dd-yy' && day.calendarId === 'gregorian')).toBe(
      true,
    );
  });

  it('exposes the π matcher and digit string', () => {
    expect(matchDepth('31415')).toBe(5);
    expect(PI_DIGITS.startsWith('314159')).toBe(true);
  });
});
