import type { PerfectDay } from 'chrono-pi-data';
import { PI_DIGITS, getCalendar, isoToJdn, seedDefaults } from 'chrono-pi-engine';

// The reference calendar the whole board is anchored to. Locked to Gregorian for now (the ISO dates are
// Gregorian); a future feature lets the visitor re-anchor, which only re-parameterizes the reading below.
export const ANCHOR_CALENDAR = 'gregorian';

seedDefaults(); // populate the calendar registry for the build-time reads in witnessReading()

function padYmd(year: number, month: number, day: number): string {
  const p = (n: number, w: number) => String(Math.abs(n)).padStart(w, '0');
  return `${year < 0 ? '-' : ''}${p(year, 4)}-${p(month, 2)}-${p(day, 2)}`;
}

// How each calendar actually reads a perfect day — the piece the raw (Gregorian) ISO date hides. Every
// calendar names the SAME underlying day (the JDN); this exposes that calendar's own date and shows where
// the matched digits come from, so a Julian π-day reading 31·4·15 no longer looks wrong next to a
// Gregorian ISO of 04-28.
export interface WitnessReading {
  calendarId: string;
  nativeIso: string; // the calendar's own y-m-d for this day
  anchorIso: string; // the Gregorian anchor date (= day.isoDate)
  segments: string[]; // the digits split into the reading's fields + the π-instant tail: ['31','4','15','92653589']
  offsetDays: number; // days this calendar's date-label lags the Gregorian anchor (Julian ≈ 13 today)
  showOffset: boolean; // only meaningful for Gregorian-year-aligned drift calendars (Julian); false otherwise
  isAnchor: boolean;
}

export function witnessReading(day: PerfectDay): WitnessReading {
  const jdn = isoToJdn(day.isoDate);
  const cal = getCalendar(day.calendarId);
  const f = cal ? cal.fields(jdn) : { year: 0, month: 1, day: 1 };
  const nativeIso = padYmd(f.year, f.month, f.day);

  const fmt = day.reckoningId.split('/')[1] ?? '';
  const order =
    fmt === 'mm-dd-yy'
      ? [f.month, f.day, ((f.year % 100) + 100) % 100]
      : fmt === 'yy-m-dd'
        ? [((f.year % 100) + 100) % 100, f.month, f.day]
        : fmt === 'yyyy-mm-dd'
          ? [f.year, f.month, f.day]
          : null; // non-date reckonings (unix/mjd): leave the digits whole

  let segments: string[];
  if (order) {
    const dateDigits = order.map(String).join('');
    const clockPart = day.digits.slice(dateDigits.length);
    segments = clockPart ? [...order.map(String), clockPart] : order.map(String);
  } else {
    segments = [day.digits];
  }

  // Days the calendar's own label lags the Gregorian proleptic date of the same numbers. Small + non-zero
  // only for Gregorian-year-aligned drift calendars (Julian ≈ 13); huge (skip) for year-shifted / other-era
  // calendars where a day-offset is meaningless.
  const offsetDays = jdn - isoToJdn(nativeIso);
  const showOffset = day.calendarId !== ANCHOR_CALENDAR && offsetDays !== 0 && Math.abs(offsetDays) < 60;

  return {
    calendarId: day.calendarId,
    nativeIso,
    anchorIso: day.isoDate,
    segments,
    offsetDays,
    showOffset,
    isAnchor: day.calendarId === ANCHOR_CALENDAR,
  };
}

// The canonical Pi-instant time-of-day: π continues 3.1415 92653 5897 93…, i.e. 09:26:53.589793. The
// countdown ticks toward this moment on the next perfect day, in the visitor's local time.
export const PI_INSTANT_TIME = '09:26:53.589';

// A local (timezone-free) ISO timestamp for the day's π-instant; the client reads it as local time.
export function piInstant(isoDate: string): string {
  return `${isoDate}T${PI_INSTANT_TIME}`;
}

// Perfect days strictly after `nowIso`, soonest first; capped at `n` when given.
export function upcomingDays(days: readonly PerfectDay[], nowIso: string, n?: number): PerfectDay[] {
  const nowJdn = isoToJdn(nowIso);
  const upcoming = days.filter((day) => day.jdn > nowJdn).sort((a, b) => a.jdn - b.jdn);
  return n === undefined ? upcoming : upcoming.slice(0, n);
}

// The countdown target: the soonest perfect day still ahead, or undefined if the window is exhausted.
export function nextPerfectDay(
  days: readonly PerfectDay[],
  nowIso: string,
): PerfectDay | undefined {
  return upcomingDays(days, nowIso, 1)[0];
}

export function splitByNow(
  days: readonly PerfectDay[],
  nowIso: string,
): { past: PerfectDay[]; upcoming: PerfectDay[] } {
  const nowJdn = isoToJdn(nowIso);
  const past: PerfectDay[] = [];
  const upcoming: PerfectDay[] = [];
  for (const day of days) {
    (day.jdn > nowJdn ? upcoming : past).push(day);
  }
  return { past, upcoming };
}

// Each day's fractional 0–1 position across the lifetime window, for the timeline axis.
export function timelinePositions(
  days: readonly PerfectDay[],
  windowStartIso: string,
  windowEndIso: string,
): { day: PerfectDay; position: number }[] {
  const start = isoToJdn(windowStartIso);
  const span = isoToJdn(windowEndIso) - start;
  return days.map((day) => ({
    day,
    position: span === 0 ? 0 : (day.jdn - start) / span,
  }));
}

// How many leading π digits to emphasise in the π-stream, clamped to what we actually hold.
export function streamHighlight(depth: number): number {
  return Math.max(0, Math.min(depth, PI_DIGITS.length));
}
