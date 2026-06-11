import { findCollisions, scan, type PerfectDay } from 'chrono-pi-engine';
import { describe, expect, it } from 'vitest';

import {
  collisionSchema,
  collisionsArtifactSchema,
  perfectDaySchema,
  perfectDaysArtifactSchema,
  witnessSchema,
} from '../src/schemas';

const samplePerfectDay: PerfectDay = {
  jdn: 2457096,
  isoDate: '2015-03-14',
  calendarId: 'gregorian',
  reckoningId: 'gregorian/mm-dd-yy',
  digits: '31415',
  depth: 5,
  tier: 'canonical',
};

describe('perfectDaySchema', () => {
  it('accepts every PerfectDay the engine emits for Pi Day 2015', () => {
    const days = scan('2015-03-14', '2015-03-14');
    expect(days.length).toBeGreaterThan(0);
    for (const day of days) {
      expect(() => perfectDaySchema.parse(day)).not.toThrow();
    }
  });

  it('rejects an unknown tier', () => {
    expect(() => perfectDaySchema.parse({ ...samplePerfectDay, tier: 'bogus' })).toThrow();
  });

  it('rejects a day missing its depth', () => {
    expect(() =>
      perfectDaySchema.parse({
        jdn: 1,
        isoDate: '2015-03-14',
        calendarId: 'gregorian',
        reckoningId: 'gregorian/mm-dd-yy',
        digits: '31415',
        tier: 'canonical',
      }),
    ).toThrow();
  });
});

describe('collisionSchema', () => {
  it('accepts the historical witness produced by findCollisions', () => {
    const [collision] = findCollisions('0215-03-14', '0215-03-14');
    expect(collision).toBeDefined();
    expect(() => collisionSchema.parse(collision)).not.toThrow();
  });

  it('rejects fewer than two independent calendars (not a collision)', () => {
    const [collision] = findCollisions('0215-03-14', '0215-03-14');
    expect(() =>
      collisionSchema.parse({ ...collision, independentCalendars: ['gregorian'] }),
    ).toThrow();
    expect(() => collisionSchema.parse({ ...collision, independentCalendars: [] })).toThrow();
  });

  it('rejects fewer than two perfect-day reads', () => {
    const [collision] = findCollisions('0215-03-14', '0215-03-14');
    expect(() =>
      collisionSchema.parse({ ...collision, perfectDays: collision.perfectDays.slice(0, 1) }),
    ).toThrow();
  });
});

describe('witnessSchema', () => {
  it('requires a kind on top of the collision shape', () => {
    const [collision] = findCollisions('0215-03-14', '0215-03-14');
    expect(() => witnessSchema.parse(collision)).toThrow();
    expect(() => witnessSchema.parse({ ...collision, kind: 'historical' })).not.toThrow();
  });
});

describe('artifact envelopes', () => {
  it('perfectDaysArtifactSchema validates a window/count/days envelope', () => {
    const artifact = {
      window: { start: '2000-01-01', end: '2226-12-31' },
      count: 1,
      days: [samplePerfectDay],
    };
    expect(() => perfectDaysArtifactSchema.parse(artifact)).not.toThrow();
    expect(() => perfectDaysArtifactSchema.parse({ ...artifact, count: undefined })).toThrow();
  });

  it('collisionsArtifactSchema validates windowCollisions and witnesses', () => {
    const [collision] = findCollisions('0215-03-14', '0215-03-14');
    const artifact = {
      window: { start: '2000-01-01', end: '2226-12-31' },
      windowCollisions: [],
      witnesses: [{ ...collision, kind: 'historical' }],
    };
    expect(() => collisionsArtifactSchema.parse(artifact)).not.toThrow();
    expect(() => collisionsArtifactSchema.parse({ ...artifact, witnesses: [collision] })).toThrow();
  });
});
