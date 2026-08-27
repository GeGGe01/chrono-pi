import { describe, expect, it } from 'vitest';

import {
  buildCollisionSearchesArtifact,
  buildCollisionsArtifact,
  buildPerfectDaysArtifact,
  buildWitnesses,
} from '../src/artifacts';
import {
  collisionSearchesArtifactSchema,
  collisionsArtifactSchema,
  perfectDaysArtifactSchema,
  witnessSchema,
} from '../src/schemas';

describe('buildPerfectDaysArtifact', () => {
  it('wraps the scan in a validated envelope with a matching count', () => {
    const artifact = buildPerfectDaysArtifact('2015-03-14', '2015-03-14');
    expect(() => perfectDaysArtifactSchema.parse(artifact)).not.toThrow();
    expect(artifact.window).toEqual({ start: '2015-03-14', end: '2015-03-14' });
    expect(artifact.count).toBe(artifact.days.length);
    expect(artifact.count).toBeGreaterThan(0);
    expect(artifact.days.map((day) => day.calendarId)).toContain('gregorian');
  });

  it('sorts days by ascending JDN', () => {
    const { days } = buildPerfectDaysArtifact('2015-03-13', '2015-03-16');
    const jdns = days.map((day) => day.jdn);
    expect(jdns).toEqual([...jdns].sort((a, b) => a - b));
  });
});

describe('buildWitnesses', () => {
  it('produces the historical and deep-future doubles with their calendars', () => {
    const witnesses = buildWitnesses();
    expect(witnesses.map((witness) => witness.kind)).toEqual(['historical', 'deep-future']);
    for (const witness of witnesses) {
      expect(() => witnessSchema.parse(witness)).not.toThrow();
    }
    const byKind = Object.fromEntries(witnesses.map((witness) => [witness.kind, witness]));
    expect([...byKind.historical.independentCalendars].sort()).toEqual(['gregorian', 'julian']);
    expect([...byKind['deep-future'].independentCalendars].sort()).toEqual(['gregorian', 'islamic']);
  });
});

describe('buildCollisionsArtifact', () => {
  it('carries windowCollisions and the witnesses in a validated envelope', () => {
    const artifact = buildCollisionsArtifact('1916-01-01', '1916-12-31');
    expect(() => collisionsArtifactSchema.parse(artifact)).not.toThrow();
    expect(artifact.windowCollisions).toEqual([]);
    expect(artifact.witnesses).toHaveLength(2);
  });
});

describe('buildCollisionSearchesArtifact', () => {
  it('adds the verified doubles and the model-dependent triple search', () => {
    const artifact = buildCollisionSearchesArtifact();
    expect(() => collisionSearchesArtifactSchema.parse(artifact)).not.toThrow();
    expect(artifact.searches.map((search) => search.kind)).toEqual(['double', 'double', 'triple']);
    const triple = artifact.searches.find((search) => search.kind === 'triple');
    expect(triple?.mechanics?.witnessCount).toBe(36);
    expect(triple?.mechanics?.gcdConstraints).toContainEqual({
      left: 'islamic',
      right: 'persian-33y',
      gcd: 10,
    });
  });
});
