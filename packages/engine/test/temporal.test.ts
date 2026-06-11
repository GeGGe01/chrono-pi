import { beforeEach, describe, expect, it } from 'vitest';

import { clearCalendars, listCalendars } from '../src/calendars/registry';
import {
  gregorian,
  hebrew,
  islamic,
  persian,
  registerTemporalCalendars,
} from '../src/calendars/temporal';
import { isoToJdn } from '../src/jdn';

const anchor = isoToJdn('2000-01-01');

describe('Temporal-backed calendars at the anchor 2000-01-01', () => {
  it('gregorian reads 2000-01-01', () => {
    expect(gregorian.fields(anchor)).toMatchObject({ year: 2000, month: 1, day: 1 });
  });

  it('hebrew reads 23 Tevet 5760', () => {
    expect(hebrew.fields(anchor)).toMatchObject({ year: 5760, month: 4, day: 23 });
  });

  it('persian reads 11 Dey 1378', () => {
    expect(persian.fields(anchor)).toMatchObject({ year: 1378, month: 10, day: 11 });
  });

  it('islamic (civil epoch) reads 24 Ramadan 1420', () => {
    expect(islamic.fields(anchor)).toMatchObject({ year: 1420, month: 9, day: 24 });
  });
});

describe('seed calendar metadata', () => {
  it('are all canonical and independent gears', () => {
    for (const calendar of [gregorian, hebrew, persian, islamic]) {
      expect(calendar.tier).toBe('canonical');
      expect(calendar.independent).toBe(true);
    }
  });

  it('pins the Islamic calendar id explicitly', () => {
    expect(islamic.id).toBe('islamic');
  });
});

describe('registerTemporalCalendars', () => {
  beforeEach(() => {
    clearCalendars();
  });

  it('registers all four seed calendars', () => {
    registerTemporalCalendars();
    expect(listCalendars().map((c) => c.id)).toEqual(
      expect.arrayContaining(['gregorian', 'hebrew', 'persian', 'islamic', 'indian']),
    );
  });
});
