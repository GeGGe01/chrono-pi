import type { Tier } from '../../src/types';

// One canonical reading from the reference table (docs/reference-table.md). The fixture grows as each
// calendar batch lands; the engine must reproduce every entry whose (calendar, format) is implemented.
export interface ReferenceEntry {
  isoDate: string; // Gregorian physical day
  calendar: string; // engine calendar id
  format: string; // engine reckoning format
  sequence: string; // the π digits the date reads, colons stripped ('31415')
  fullYear: number; // the calendar's full year, for disambiguation
  tier: Tier;
}

export const REFERENCE_ENTRIES: ReferenceEntry[] = [
  // gregorian
  { isoDate: '1915-03-14', calendar: 'gregorian', format: 'mm-dd-yy', sequence: '31415', fullYear: 1915, tier: 'canonical' },
  { isoDate: '1931-04-15', calendar: 'gregorian', format: 'yy-m-dd', sequence: '31415', fullYear: 1931, tier: 'canonical' },
  { isoDate: '2015-03-14', calendar: 'gregorian', format: 'mm-dd-yy', sequence: '31415', fullYear: 2015, tier: 'canonical' },
  { isoDate: '2031-04-15', calendar: 'gregorian', format: 'yy-m-dd', sequence: '31415', fullYear: 2031, tier: 'canonical' },
  { isoDate: '2115-03-14', calendar: 'gregorian', format: 'mm-dd-yy', sequence: '31415', fullYear: 2115, tier: 'canonical' },
  { isoDate: '2131-04-15', calendar: 'gregorian', format: 'yy-m-dd', sequence: '31415', fullYear: 2131, tier: 'canonical' },
  { isoDate: '2215-03-14', calendar: 'gregorian', format: 'mm-dd-yy', sequence: '31415', fullYear: 2215, tier: 'canonical' },

  // holocene — co-reads with gregorian (year + 10000); pending a holocene reckoning
  { isoDate: '1915-03-14', calendar: 'holocene', format: 'mm-dd-yy', sequence: '31415', fullYear: 11915, tier: 'canonical' },
  { isoDate: '1931-04-15', calendar: 'holocene', format: 'yy-m-dd', sequence: '31415', fullYear: 11931, tier: 'canonical' },
  { isoDate: '2015-03-14', calendar: 'holocene', format: 'mm-dd-yy', sequence: '31415', fullYear: 12015, tier: 'canonical' },
  { isoDate: '2031-04-15', calendar: 'holocene', format: 'yy-m-dd', sequence: '31415', fullYear: 12031, tier: 'canonical' },
  { isoDate: '2115-03-14', calendar: 'holocene', format: 'mm-dd-yy', sequence: '31415', fullYear: 12115, tier: 'canonical' },
  { isoDate: '2131-04-15', calendar: 'holocene', format: 'yy-m-dd', sequence: '31415', fullYear: 12131, tier: 'canonical' },
  { isoDate: '2215-03-14', calendar: 'holocene', format: 'mm-dd-yy', sequence: '31415', fullYear: 12215, tier: 'canonical' },

  // unix — recorded variance (mid-day perfect second, not midnight); fixed in the timestamp batch
  { isoDate: '2069-07-21', calendar: 'unix', format: 'timestamp', sequence: '3141592653589', fullYear: 3141592653, tier: 'canonical' },
];
