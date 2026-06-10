import type { Reckoning } from '../types';

const reckonings = new Map<string, Reckoning>();

// Register a reckoning, keyed by its id; a later registration with the same id replaces the earlier one.
export function registerReckoning(reckoning: Reckoning): void {
  reckonings.set(reckoning.id, reckoning);
}

export function listReckonings(): Reckoning[] {
  return [...reckonings.values()];
}

// The reckonings declared against a given calendar.
export function reckoningsFor(calendarId: string): Reckoning[] {
  return listReckonings().filter((reckoning) => reckoning.calendarId === calendarId);
}

// Reset the registry — primarily so tests start from a known-empty state.
export function clearReckonings(): void {
  reckonings.clear();
}
