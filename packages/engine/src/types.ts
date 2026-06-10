// The linear day axis on which every calendar is a pure function: an integer Julian Day Number.
export type JDN = number;

// A reckoning either counts toward collisions (a real standard) or is displayed-only (a parody system).
export type Tier = 'canonical' | 'novelty';

export interface CalendarFields {
  year: number;
  month: number; // 1-based
  day: number; // 1-based
  eraYear?: number; // regnal/era count where the calendar uses one
  cycleYear?: number; // position in a repeating cycle (e.g. the 60-year cycle)
}

export interface Calendar {
  id: string; // 'gregorian', 'julian', 'islamic-tbla', 'holocene', ...
  tier: Tier;
  independent: boolean; // counts as a distinct gear for collisions
  fields(jdn: JDN): CalendarFields;
}
