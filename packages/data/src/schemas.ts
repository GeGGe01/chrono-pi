import { z } from 'zod';

// The artifact schemas validate the JSON at rest. They mirror the engine's contract types
// (PerfectDay, Collision) field-for-field; the schema tests parse real engine output to guard drift.

export const tierSchema = z.enum(['canonical', 'novelty']);

export const perfectDaySchema = z.object({
  jdn: z.number().int(),
  isoDate: z.string(),
  calendarId: z.string(),
  reckoningId: z.string(),
  digits: z.string(),
  depth: z.number().int(),
  tier: tierSchema,
});

// A collision is, by definition, two or more independent calendars reading π on one day — so the
// schema requires at least two independent calendars (and at least the two reads that produce them).
export const collisionSchema = z.object({
  isoDate: z.string(),
  jdn: z.number().int(),
  perfectDays: z.array(perfectDaySchema).min(2),
  independentCalendars: z.array(z.string()).min(2),
});

// A witness is a known, verified collision tagged by where it sits relative to the lifetime window.
export const witnessKindSchema = z.enum(['historical', 'deep-future']);

export const witnessSchema = collisionSchema.extend({
  kind: witnessKindSchema,
});

export const windowSchema = z.object({
  start: z.string(),
  end: z.string(),
});

export const perfectDaysArtifactSchema = z.object({
  window: windowSchema,
  count: z.number().int(),
  days: z.array(perfectDaySchema),
});

export const collisionsArtifactSchema = z.object({
  window: windowSchema,
  windowCollisions: z.array(collisionSchema),
  witnesses: z.array(witnessSchema),
});
