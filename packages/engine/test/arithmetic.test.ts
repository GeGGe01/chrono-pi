import { beforeEach, describe, expect, it } from 'vitest';

import {
  holocene,
  julian,
  registerArithmeticCalendars,
  unix,
} from '../src/calendars/arithmetic';
import { clearCalendars, listCalendars } from '../src/calendars/registry';
import { isoToJdn } from '../src/jdn';

const anchor = isoToJdn('2000-01-01');

describe('arithmetic calendars at the anchor 2000-01-01', () => {
  it('holocene shifts the Gregorian year by 10000', () => {
    expect(holocene.fields(anchor)).toMatchObject({ year: 12000, month: 1, day: 1 });
  });

  it('unix reports the midnight-UTC second count', () => {
    expect(unix.fields(anchor).year).toBe(946684800);
  });

  it('julian reads 1999-12-19, thirteen days behind Gregorian in 2000', () => {
    expect(julian.fields(anchor)).toMatchObject({ year: 1999, month: 12, day: 19 });
  });

  it('holocene is not an independent collision gear (Gregorian relabelled)', () => {
    expect(holocene.independent).toBe(false);
  });
});

describe('registerArithmeticCalendars', () => {
  beforeEach(() => {
    clearCalendars();
  });

  it('registers holocene, unix, and julian', () => {
    registerArithmeticCalendars();
    expect(listCalendars().map((c) => c.id).sort()).toEqual(['holocene', 'julian', 'unix']);
  });
});
