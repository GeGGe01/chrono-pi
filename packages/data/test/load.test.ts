import { describe, expect, it } from 'vitest';

import { getCollisionSearches, getCollisions, getPerfectDays } from '../src/load';

describe('getPerfectDays', () => {
  it('returns the validated perfect-days artifact', () => {
    const artifact = getPerfectDays();
    expect(artifact.window).toEqual({ start: '2000-01-01', end: '2226-12-31' });
    expect(artifact.count).toBe(artifact.days.length);
    expect(
      artifact.days.some((day) => day.isoDate === '2015-03-14' && day.calendarId === 'gregorian'),
    ).toBe(true);
  });
});

describe('getCollisions', () => {
  it('returns the validated collisions artifact with both witnesses', () => {
    const artifact = getCollisions();
    expect(artifact.witnesses.map((witness) => witness.kind).sort()).toEqual([
      'deep-future',
      'historical',
    ]);
  });
});

describe('getCollisionSearches', () => {
  it('returns the validated search list including the triple witness', () => {
    const artifact = getCollisionSearches();
    expect(artifact.searches.map((search) => search.kind)).toEqual(['double', 'double', 'triple']);
    expect(artifact.searches.at(-1)?.mechanics?.witnessCount).toBe(36);
  });
});
