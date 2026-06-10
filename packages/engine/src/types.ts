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

export interface PiRead {
  digits: string; // concatenated field digits, no separators
  clockDigits?: string; // digits the π-instant adds after the date
  label: string; // human label, e.g. 'gregorian · MM-DD-YY → 31:4:15'
}

export interface Reckoning {
  id: string; // 'mm-dd-yy', 'yyyy-mm-dd', 'yy-m-dd', 'unix', ...
  calendarId: string;
  tier: Tier;
  minDepth: number; // qualifying floor (default 5)
  timeExtends: boolean; // whether the π-instant extends the digit string
  read(fields: CalendarFields, jdn: JDN): PiRead;
}

export interface PerfectDay {
  jdn: JDN;
  isoDate: string; // 'YYYY-MM-DD'
  calendarId: string;
  reckoningId: string;
  digits: string; // the matched digit string, including any π-instant extension
  depth: number; // π-prefix length matched
  tier: Tier;
}
