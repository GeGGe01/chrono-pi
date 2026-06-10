import { beforeEach, describe, expect, it } from 'vitest';

import { clearCalendars, listCalendars, registerCalendar } from '../src/calendars/registry';
import type { Calendar } from '../src/types';

const stub: Calendar = {
  id: 'stub',
  tier: 'canonical',
  independent: true,
  fields: () => ({ year: 1, month: 1, day: 1 }),
};

describe('calendar registry', () => {
  beforeEach(() => {
    clearCalendars();
  });

  it('starts empty', () => {
    expect(listCalendars()).toEqual([]);
  });

  it('lists a registered calendar', () => {
    registerCalendar(stub);
    expect(listCalendars()).toContain(stub);
  });

  it('keys by id, so re-registering replaces', () => {
    registerCalendar(stub);
    registerCalendar({ ...stub, independent: false });
    expect(listCalendars()).toHaveLength(1);
    expect(listCalendars()[0]?.independent).toBe(false);
  });
});
