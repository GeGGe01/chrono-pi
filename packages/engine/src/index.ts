// The engine's public surface: the scan, the π matcher, the JDN axis, the registries, the seed
// calendars and reckonings, and the shared contract types.
export { scan, seedDefaults } from './scan';
export { PI_DIGITS, matchDepth } from './pi';
export { eachJdn, isoToJdn, jdnToIso } from './jdn';
export { clockDigits, FRACTIONAL_PI_INSTANT, STANDARD_PI_INSTANT } from './clock';

export { clearCalendars, getCalendar, listCalendars, registerCalendar } from './calendars/registry';
export {
  clearReckonings,
  listReckonings,
  reckoningsFor,
  registerReckoning,
} from './reckonings/registry';

export {
  gregorian,
  hebrew,
  islamic,
  persian,
  registerTemporalCalendars,
  temporalCalendars,
} from './calendars/temporal';
export {
  arithmeticCalendars,
  holocene,
  julian,
  registerArithmeticCalendars,
  unix,
} from './calendars/arithmetic';
export {
  mmddyy,
  registerStandardReckonings,
  standardReckonings,
  unixTimestamp,
  yymdd,
  yyyymmdd,
} from './reckonings/standard';

export type {
  Calendar,
  CalendarFields,
  JDN,
  PerfectDay,
  PiRead,
  Reckoning,
  Tier,
} from './types';
