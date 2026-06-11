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

  // julian (Richards arithmetic; 12–13 days behind Gregorian in this window)
  { isoDate: '1831-04-27', calendar: 'julian', format: 'yy-m-dd', sequence: '31415', fullYear: 1831, tier: 'canonical' },
  { isoDate: '1915-03-27', calendar: 'julian', format: 'mm-dd-yy', sequence: '31415', fullYear: 1915, tier: 'canonical' },
  { isoDate: '1931-04-28', calendar: 'julian', format: 'yy-m-dd', sequence: '31415', fullYear: 1931, tier: 'canonical' },
  { isoDate: '2015-03-27', calendar: 'julian', format: 'mm-dd-yy', sequence: '31415', fullYear: 2015, tier: 'canonical' },
  { isoDate: '2031-04-28', calendar: 'julian', format: 'yy-m-dd', sequence: '31415', fullYear: 2031, tier: 'canonical' },
  { isoDate: '2115-03-28', calendar: 'julian', format: 'mm-dd-yy', sequence: '31415', fullYear: 2115, tier: 'canonical' },
  { isoDate: '2131-04-29', calendar: 'julian', format: 'yy-m-dd', sequence: '31415', fullYear: 2131, tier: 'canonical' },
  { isoDate: '2215-03-29', calendar: 'julian', format: 'mm-dd-yy', sequence: '31415', fullYear: 2215, tier: 'canonical' },

  // holocene — co-reads with gregorian (year + 10000)
  { isoDate: '1915-03-14', calendar: 'holocene', format: 'mm-dd-yy', sequence: '31415', fullYear: 11915, tier: 'canonical' },
  { isoDate: '1931-04-15', calendar: 'holocene', format: 'yy-m-dd', sequence: '31415', fullYear: 11931, tier: 'canonical' },
  { isoDate: '2015-03-14', calendar: 'holocene', format: 'mm-dd-yy', sequence: '31415', fullYear: 12015, tier: 'canonical' },
  { isoDate: '2031-04-15', calendar: 'holocene', format: 'yy-m-dd', sequence: '31415', fullYear: 12031, tier: 'canonical' },
  { isoDate: '2115-03-14', calendar: 'holocene', format: 'mm-dd-yy', sequence: '31415', fullYear: 12115, tier: 'canonical' },
  { isoDate: '2131-04-15', calendar: 'holocene', format: 'yy-m-dd', sequence: '31415', fullYear: 12131, tier: 'canonical' },
  { isoDate: '2215-03-14', calendar: 'holocene', format: 'mm-dd-yy', sequence: '31415', fullYear: 12215, tier: 'canonical' },

  // hebrew (Temporal 'hebrew')
  { isoDate: '1854-12-05', calendar: 'hebrew', format: 'mm-dd-yy', sequence: '31415', fullYear: 5615, tier: 'canonical' },
  { isoDate: '1871-01-08', calendar: 'hebrew', format: 'yy-m-dd', sequence: '31415', fullYear: 5631, tier: 'canonical' },
  { isoDate: '1954-12-09', calendar: 'hebrew', format: 'mm-dd-yy', sequence: '31415', fullYear: 5715, tier: 'canonical' },
  { isoDate: '1971-01-12', calendar: 'hebrew', format: 'yy-m-dd', sequence: '31415', fullYear: 5731, tier: 'canonical' },
  { isoDate: '2054-12-14', calendar: 'hebrew', format: 'mm-dd-yy', sequence: '31415', fullYear: 5815, tier: 'canonical' },
  { isoDate: '2071-01-17', calendar: 'hebrew', format: 'yy-m-dd', sequence: '31415', fullYear: 5831, tier: 'canonical' },
  { isoDate: '2154-12-11', calendar: 'hebrew', format: 'mm-dd-yy', sequence: '31415', fullYear: 5915, tier: 'canonical' },
  { isoDate: '2171-01-13', calendar: 'hebrew', format: 'yy-m-dd', sequence: '31415', fullYear: 5931, tier: 'canonical' },

  // persian (Temporal 'persian')
  { isoDate: '1852-07-06', calendar: 'persian', format: 'yy-m-dd', sequence: '31415', fullYear: 1231, tier: 'canonical' },
  { isoDate: '1936-06-04', calendar: 'persian', format: 'mm-dd-yy', sequence: '31415', fullYear: 1315, tier: 'canonical' },
  { isoDate: '1952-07-06', calendar: 'persian', format: 'yy-m-dd', sequence: '31415', fullYear: 1331, tier: 'canonical' },
  { isoDate: '2036-06-04', calendar: 'persian', format: 'mm-dd-yy', sequence: '31415', fullYear: 1415, tier: 'canonical' },
  { isoDate: '2052-07-06', calendar: 'persian', format: 'yy-m-dd', sequence: '31415', fullYear: 1431, tier: 'canonical' },
  { isoDate: '2136-06-04', calendar: 'persian', format: 'mm-dd-yy', sequence: '31415', fullYear: 1515, tier: 'canonical' },
  { isoDate: '2152-07-06', calendar: 'persian', format: 'yy-m-dd', sequence: '31415', fullYear: 1531, tier: 'canonical' },

  // islamic (Temporal 'islamic-civil', the tabular civil epoch — the oracle's variant)
  { isoDate: '1897-08-13', calendar: 'islamic', format: 'mm-dd-yy', sequence: '31415', fullYear: 1315, tier: 'canonical' },
  { isoDate: '1913-03-24', calendar: 'islamic', format: 'yy-m-dd', sequence: '31415', fullYear: 1331, tier: 'canonical' },
  { isoDate: '1994-08-22', calendar: 'islamic', format: 'mm-dd-yy', sequence: '31415', fullYear: 1415, tier: 'canonical' },
  { isoDate: '2010-03-31', calendar: 'islamic', format: 'yy-m-dd', sequence: '31415', fullYear: 1431, tier: 'canonical' },
  { isoDate: '2091-08-29', calendar: 'islamic', format: 'mm-dd-yy', sequence: '31415', fullYear: 1515, tier: 'canonical' },
  { isoDate: '2107-04-05', calendar: 'islamic', format: 'yy-m-dd', sequence: '31415', fullYear: 1531, tier: 'canonical' },
  { isoDate: '2188-09-05', calendar: 'islamic', format: 'mm-dd-yy', sequence: '31415', fullYear: 1615, tier: 'canonical' },
  { isoDate: '2204-04-12', calendar: 'islamic', format: 'yy-m-dd', sequence: '31415', fullYear: 1631, tier: 'canonical' },

  // coptic (Temporal 'coptic')
  { isoDate: '1838-12-24', calendar: 'coptic', format: 'yy-m-dd', sequence: '31415', fullYear: 1531, tier: 'canonical' },
  { isoDate: '1898-11-23', calendar: 'coptic', format: 'mm-dd-yy', sequence: '31415', fullYear: 1615, tier: 'canonical' },
  { isoDate: '1914-12-24', calendar: 'coptic', format: 'yy-m-dd', sequence: '31415', fullYear: 1631, tier: 'canonical' },
  { isoDate: '1998-11-23', calendar: 'coptic', format: 'mm-dd-yy', sequence: '31415', fullYear: 1715, tier: 'canonical' },
  { isoDate: '2014-12-24', calendar: 'coptic', format: 'yy-m-dd', sequence: '31415', fullYear: 1731, tier: 'canonical' },
  { isoDate: '2098-11-23', calendar: 'coptic', format: 'mm-dd-yy', sequence: '31415', fullYear: 1815, tier: 'canonical' },
  { isoDate: '2114-12-24', calendar: 'coptic', format: 'yy-m-dd', sequence: '31415', fullYear: 1831, tier: 'canonical' },
  { isoDate: '2198-11-23', calendar: 'coptic', format: 'mm-dd-yy', sequence: '31415', fullYear: 1915, tier: 'canonical' },
  { isoDate: '2214-12-24', calendar: 'coptic', format: 'yy-m-dd', sequence: '31415', fullYear: 1931, tier: 'canonical' },

  // ethiopic (Temporal 'ethiopic')
  { isoDate: '1838-12-24', calendar: 'ethiopic', format: 'yy-m-dd', sequence: '31415', fullYear: 1831, tier: 'canonical' },
  { isoDate: '1923-03-23', calendar: 'ethiopic', format: 'mm-dd-yy', sequence: '31415', fullYear: 1915, tier: 'canonical' },
  { isoDate: '1938-12-24', calendar: 'ethiopic', format: 'yy-m-dd', sequence: '31415', fullYear: 1931, tier: 'canonical' },
  { isoDate: '2023-03-23', calendar: 'ethiopic', format: 'mm-dd-yy', sequence: '31415', fullYear: 2015, tier: 'canonical' },
  { isoDate: '2038-12-24', calendar: 'ethiopic', format: 'yy-m-dd', sequence: '31415', fullYear: 2031, tier: 'canonical' },
  { isoDate: '2123-03-23', calendar: 'ethiopic', format: 'mm-dd-yy', sequence: '31415', fullYear: 2115, tier: 'canonical' },
  { isoDate: '2138-12-24', calendar: 'ethiopic', format: 'yy-m-dd', sequence: '31415', fullYear: 2131, tier: 'canonical' },
  { isoDate: '2223-03-23', calendar: 'ethiopic', format: 'mm-dd-yy', sequence: '31415', fullYear: 2215, tier: 'canonical' },

  // indian (Temporal 'indian', Saka era)
  { isoDate: '1893-06-04', calendar: 'indian', format: 'mm-dd-yy', sequence: '31415', fullYear: 1815, tier: 'canonical' },
  { isoDate: '1909-07-06', calendar: 'indian', format: 'yy-m-dd', sequence: '31415', fullYear: 1831, tier: 'canonical' },
  { isoDate: '1993-06-04', calendar: 'indian', format: 'mm-dd-yy', sequence: '31415', fullYear: 1915, tier: 'canonical' },
  { isoDate: '2009-07-06', calendar: 'indian', format: 'yy-m-dd', sequence: '31415', fullYear: 1931, tier: 'canonical' },
  { isoDate: '2093-06-04', calendar: 'indian', format: 'mm-dd-yy', sequence: '31415', fullYear: 2015, tier: 'canonical' },
  { isoDate: '2109-07-06', calendar: 'indian', format: 'yy-m-dd', sequence: '31415', fullYear: 2031, tier: 'canonical' },
  { isoDate: '2193-06-04', calendar: 'indian', format: 'mm-dd-yy', sequence: '31415', fullYear: 2115, tier: 'canonical' },
  { isoDate: '2209-07-06', calendar: 'indian', format: 'yy-m-dd', sequence: '31415', fullYear: 2131, tier: 'canonical' },

  // buddhist (Thai Buddhist Era, Gregorian months + 543)
  { isoDate: '1872-03-14', calendar: 'buddhist', format: 'mm-dd-yy', sequence: '31415', fullYear: 2415, tier: 'canonical' },
  { isoDate: '1888-04-15', calendar: 'buddhist', format: 'yy-m-dd', sequence: '31415', fullYear: 2431, tier: 'canonical' },
  { isoDate: '1972-03-14', calendar: 'buddhist', format: 'mm-dd-yy', sequence: '31415', fullYear: 2515, tier: 'canonical' },
  { isoDate: '1988-04-15', calendar: 'buddhist', format: 'yy-m-dd', sequence: '31415', fullYear: 2531, tier: 'canonical' },
  { isoDate: '2072-03-14', calendar: 'buddhist', format: 'mm-dd-yy', sequence: '31415', fullYear: 2615, tier: 'canonical' },
  { isoDate: '2088-04-15', calendar: 'buddhist', format: 'yy-m-dd', sequence: '31415', fullYear: 2631, tier: 'canonical' },
  { isoDate: '2172-03-14', calendar: 'buddhist', format: 'mm-dd-yy', sequence: '31415', fullYear: 2715, tier: 'canonical' },
  { isoDate: '2188-04-15', calendar: 'buddhist', format: 'yy-m-dd', sequence: '31415', fullYear: 2731, tier: 'canonical' },

  // minguo / juche (ROC year = Gregorian − 1911)
  { isoDate: '1926-03-14', calendar: 'minguo', format: 'mm-dd-yy', sequence: '31415', fullYear: 15, tier: 'canonical' },
  { isoDate: '1942-04-15', calendar: 'minguo', format: 'yy-m-dd', sequence: '31415', fullYear: 31, tier: 'canonical' },
  { isoDate: '2026-03-14', calendar: 'minguo', format: 'mm-dd-yy', sequence: '31415', fullYear: 115, tier: 'canonical' },
  { isoDate: '2042-04-15', calendar: 'minguo', format: 'yy-m-dd', sequence: '31415', fullYear: 131, tier: 'canonical' },
  { isoDate: '2126-03-14', calendar: 'minguo', format: 'mm-dd-yy', sequence: '31415', fullYear: 215, tier: 'canonical' },
  { isoDate: '2142-04-15', calendar: 'minguo', format: 'yy-m-dd', sequence: '31415', fullYear: 231, tier: 'canonical' },
  { isoDate: '2226-03-14', calendar: 'minguo', format: 'mm-dd-yy', sequence: '31415', fullYear: 315, tier: 'canonical' },

  // assyrian (Gregorian months + 4750)
  { isoDate: '1865-03-14', calendar: 'assyrian', format: 'mm-dd-yy', sequence: '31415', fullYear: 6615, tier: 'canonical' },
  { isoDate: '1965-03-14', calendar: 'assyrian', format: 'mm-dd-yy', sequence: '31415', fullYear: 6715, tier: 'canonical' },
  { isoDate: '2065-03-14', calendar: 'assyrian', format: 'mm-dd-yy', sequence: '31415', fullYear: 6815, tier: 'canonical' },
  { isoDate: '2165-03-14', calendar: 'assyrian', format: 'mm-dd-yy', sequence: '31415', fullYear: 6915, tier: 'canonical' },
  { isoDate: '1981-04-15', calendar: 'assyrian', format: 'yy-m-dd', sequence: '31415', fullYear: 6731, tier: 'canonical' },
  { isoDate: '2081-04-15', calendar: 'assyrian', format: 'yy-m-dd', sequence: '31415', fullYear: 6831, tier: 'canonical' },
  { isoDate: '2181-04-15', calendar: 'assyrian', format: 'yy-m-dd', sequence: '31415', fullYear: 6931, tier: 'canonical' },

  // armenian (Gregorian months − 551)
  { isoDate: '1866-03-14', calendar: 'armenian', format: 'mm-dd-yy', sequence: '31415', fullYear: 1315, tier: 'canonical' },
  { isoDate: '1966-03-14', calendar: 'armenian', format: 'mm-dd-yy', sequence: '31415', fullYear: 1415, tier: 'canonical' },
  { isoDate: '2066-03-14', calendar: 'armenian', format: 'mm-dd-yy', sequence: '31415', fullYear: 1515, tier: 'canonical' },
  { isoDate: '2166-03-14', calendar: 'armenian', format: 'mm-dd-yy', sequence: '31415', fullYear: 1615, tier: 'canonical' },
  { isoDate: '1882-04-15', calendar: 'armenian', format: 'yy-m-dd', sequence: '31415', fullYear: 1331, tier: 'canonical' },
  { isoDate: '1982-04-15', calendar: 'armenian', format: 'yy-m-dd', sequence: '31415', fullYear: 1431, tier: 'canonical' },
  { isoDate: '2082-04-15', calendar: 'armenian', format: 'yy-m-dd', sequence: '31415', fullYear: 1531, tier: 'canonical' },
  { isoDate: '2182-04-15', calendar: 'armenian', format: 'yy-m-dd', sequence: '31415', fullYear: 1631, tier: 'canonical' },

  // roman / AUC (Julian months + 753)
  { isoDate: '1862-03-26', calendar: 'roman', format: 'mm-dd-yy', sequence: '31415', fullYear: 2615, tier: 'canonical' },
  { isoDate: '1962-03-27', calendar: 'roman', format: 'mm-dd-yy', sequence: '31415', fullYear: 2715, tier: 'canonical' },
  { isoDate: '2062-03-27', calendar: 'roman', format: 'mm-dd-yy', sequence: '31415', fullYear: 2815, tier: 'canonical' },
  { isoDate: '2162-03-27', calendar: 'roman', format: 'mm-dd-yy', sequence: '31415', fullYear: 2915, tier: 'canonical' },
  { isoDate: '1878-04-27', calendar: 'roman', format: 'yy-m-dd', sequence: '31415', fullYear: 2631, tier: 'canonical' },
  { isoDate: '1978-04-28', calendar: 'roman', format: 'yy-m-dd', sequence: '31415', fullYear: 2731, tier: 'canonical' },
  { isoDate: '2078-04-28', calendar: 'roman', format: 'yy-m-dd', sequence: '31415', fullYear: 2831, tier: 'canonical' },
  { isoDate: '2178-04-28', calendar: 'roman', format: 'yy-m-dd', sequence: '31415', fullYear: 2931, tier: 'canonical' },

  // julian-period (Gregorian months + 4713)
  { isoDate: '1902-03-14', calendar: 'julian-period', format: 'mm-dd-yy', sequence: '31415', fullYear: 6615, tier: 'canonical' },
  { isoDate: '2002-03-14', calendar: 'julian-period', format: 'mm-dd-yy', sequence: '31415', fullYear: 6715, tier: 'canonical' },
  { isoDate: '2102-03-14', calendar: 'julian-period', format: 'mm-dd-yy', sequence: '31415', fullYear: 6815, tier: 'canonical' },
  { isoDate: '2202-03-14', calendar: 'julian-period', format: 'mm-dd-yy', sequence: '31415', fullYear: 6915, tier: 'canonical' },
  { isoDate: '1918-04-15', calendar: 'julian-period', format: 'yy-m-dd', sequence: '31415', fullYear: 6631, tier: 'canonical' },
  { isoDate: '2018-04-15', calendar: 'julian-period', format: 'yy-m-dd', sequence: '31415', fullYear: 6731, tier: 'canonical' },
  { isoDate: '2118-04-15', calendar: 'julian-period', format: 'yy-m-dd', sequence: '31415', fullYear: 6831, tier: 'canonical' },
  { isoDate: '2218-04-15', calendar: 'julian-period', format: 'yy-m-dd', sequence: '31415', fullYear: 6931, tier: 'canonical' },

  // mjd — day count; 1944-11-22 is MJD 31415, extended by the π-instant to depth 13
  { isoDate: '1944-11-22', calendar: 'mjd', format: 'mjd', sequence: '31415', fullYear: 31415, tier: 'canonical' },

  // japanese (Temporal 'japanese', era year — Meiji / Taishō / Shōwa / Heisei / Reiwa)
  { isoDate: '1882-03-14', calendar: 'japanese', format: 'mm-dd-yy', sequence: '31415', fullYear: 15, tier: 'canonical' },
  { isoDate: '1898-04-15', calendar: 'japanese', format: 'yy-m-dd', sequence: '31415', fullYear: 31, tier: 'canonical' },
  { isoDate: '1926-03-14', calendar: 'japanese', format: 'mm-dd-yy', sequence: '31415', fullYear: 15, tier: 'canonical' },
  { isoDate: '1940-03-14', calendar: 'japanese', format: 'mm-dd-yy', sequence: '31415', fullYear: 15, tier: 'canonical' },
  { isoDate: '1956-04-15', calendar: 'japanese', format: 'yy-m-dd', sequence: '31415', fullYear: 31, tier: 'canonical' },
  { isoDate: '2003-03-14', calendar: 'japanese', format: 'mm-dd-yy', sequence: '31415', fullYear: 15, tier: 'canonical' },
  { isoDate: '2019-04-15', calendar: 'japanese', format: 'yy-m-dd', sequence: '31415', fullYear: 31, tier: 'canonical' },
  { isoDate: '2033-03-14', calendar: 'japanese', format: 'mm-dd-yy', sequence: '31415', fullYear: 15, tier: 'canonical' },
  { isoDate: '2049-04-15', calendar: 'japanese', format: 'yy-m-dd', sequence: '31415', fullYear: 31, tier: 'canonical' },

  // unix — instant-aware (the π-prefix second falls mid-day; .589 carries it to depth 13)
  { isoDate: '2069-07-21', calendar: 'unix', format: 'timestamp', sequence: '3141592653589', fullYear: 3141592653, tier: 'canonical' },
];
