import type { PerfectDay } from 'chrono-pi-data';
import { PI_DIGITS, isoToJdn } from 'chrono-pi-engine';

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
