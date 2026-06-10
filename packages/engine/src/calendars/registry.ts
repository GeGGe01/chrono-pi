import type { Calendar } from '../types';

const calendars = new Map<string, Calendar>();

// Register a calendar, keyed by its id; a later registration with the same id replaces the earlier one.
export function registerCalendar(calendar: Calendar): void {
  calendars.set(calendar.id, calendar);
}

export function listCalendars(): Calendar[] {
  return [...calendars.values()];
}

export function getCalendar(id: string): Calendar | undefined {
  return calendars.get(id);
}

// Reset the registry — primarily so tests start from a known-empty state.
export function clearCalendars(): void {
  calendars.clear();
}
