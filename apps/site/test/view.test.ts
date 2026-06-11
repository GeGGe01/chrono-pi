import type { PerfectDay } from 'chrono-pi-data';
import { PI_DIGITS, isoToJdn } from 'chrono-pi-engine';
import { describe, expect, it } from 'vitest';

import {
  nextPerfectDay,
  piInstant,
  splitByNow,
  streamHighlight,
  timelinePositions,
  upcomingDays,
} from '../src/lib/view';

function day(isoDate: string, depth = 13): PerfectDay {
  return {
    jdn: isoToJdn(isoDate),
    isoDate,
    calendarId: 'gregorian',
    reckoningId: 'gregorian/mm-dd-yy',
    digits: '3141592653589',
    depth,
    tier: 'canonical',
  };
}

const days = [day('2015-03-14'), day('2031-04-15'), day('2033-03-14'), day('2226-03-14')];
const now = '2026-06-11';

describe('upcomingDays', () => {
  it('returns future days sorted by JDN', () => {
    expect(upcomingDays(days, now).map((d) => d.isoDate)).toEqual([
      '2031-04-15',
      '2033-03-14',
      '2226-03-14',
    ]);
  });

  it('limits to n when given', () => {
    expect(upcomingDays(days, now, 2).map((d) => d.isoDate)).toEqual(['2031-04-15', '2033-03-14']);
  });
});

describe('nextPerfectDay', () => {
  it('is the soonest future day', () => {
    expect(nextPerfectDay(days, now)?.isoDate).toBe('2031-04-15');
  });

  it('is undefined when none remain', () => {
    expect(nextPerfectDay(days, '2300-01-01')).toBeUndefined();
  });
});

describe('splitByNow', () => {
  it('partitions past and upcoming', () => {
    const { past, upcoming } = splitByNow(days, now);
    expect(past.map((d) => d.isoDate)).toEqual(['2015-03-14']);
    expect(upcoming.map((d) => d.isoDate)).toEqual(['2031-04-15', '2033-03-14', '2226-03-14']);
  });
});

describe('piInstant', () => {
  it('places the day at the canonical π-instant time-of-day', () => {
    expect(piInstant('2031-04-15')).toBe('2031-04-15T09:26:53.589');
  });
});

describe('timelinePositions', () => {
  it('maps JDN to a non-decreasing 0–1 fraction across the window', () => {
    const positions = timelinePositions(days, '2000-01-01', '2226-12-31');
    const fractions = positions.map((p) => p.position);
    expect(Math.min(...fractions)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...fractions)).toBeLessThanOrEqual(1);
    expect(fractions).toEqual([...fractions].sort((a, b) => a - b));
  });

  it('puts the window start at 0 and the window end at 1', () => {
    expect(timelinePositions([day('2000-01-01')], '2000-01-01', '2226-12-31')[0]?.position).toBe(0);
    expect(timelinePositions([day('2226-12-31')], '2000-01-01', '2226-12-31')[0]?.position).toBe(1);
  });
});

describe('streamHighlight', () => {
  it('clamps the highlight to the available π digits', () => {
    expect(streamHighlight(5)).toBe(5);
    expect(streamHighlight(0)).toBe(0);
    expect(streamHighlight(-3)).toBe(0);
    expect(streamHighlight(PI_DIGITS.length + 100)).toBe(PI_DIGITS.length);
  });
});
