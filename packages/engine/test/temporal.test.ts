import { beforeEach, describe, expect, it } from 'vitest';

import { clearCalendars, listCalendars } from '../src/calendars/registry';
import {
  gregorian,
  hebrew,
  islamicTabular,
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

  it('islamic-tbla reads 25 Ramadan 1420 (tabular, astronomical epoch)', () => {
    expect(islamicTabular.fields(anchor)).toMatchObject({ year: 1420, month: 9, day: 25 });
  });
});

describe('seed calendar metadata', () => {
  it('are all canonical and independent gears', () => {
    for (const calendar of [gregorian, hebrew, persian, islamicTabular]) {
      expect(calendar.tier).toBe('canonical');
      expect(calendar.independent).toBe(true);
    }
  });

  it('pins the tabular Islamic id explicitly', () => {
    expect(islamicTabular.id).toBe('islamic-tbla');
  });
});

describe('registerTemporalCalendars', () => {
  beforeEach(() => {
    clearCalendars();
  });

  it('registers all four seed calendars', () => {
    registerTemporalCalendars();
    expect(listCalendars().map((c) => c.id).sort()).toEqual([
      'gregorian',
      'hebrew',
      'islamic-tbla',
      'persian',
    ]);
  });
});
