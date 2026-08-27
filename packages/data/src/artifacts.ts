import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { findCollisions, isoToJdn, scan } from 'chrono-pi-engine';

import type {
  CollisionSearch,
  CollisionSearchesArtifact,
  CollisionsArtifact,
  PerfectDaysArtifact,
  Witness,
} from './types';

// The lifetime window (operator decision): 2000–2226.
export const WINDOW = { start: '2000-01-01', end: '2226-12-31' } as const;

// The verified collision witnesses outside the window: the historical double (215 CE, Gregorian ∩
// Julian) and the deep-future double (2,197,415 CE, Gregorian ∩ Islamic). Each is recomputed from
// the engine, never hard-coded, so the artifact stays honest to the engine.
const WITNESS_DATES = [
  { kind: 'historical', date: '0215-03-14' },
  { kind: 'deep-future', date: '2197415-03-14' },
] as const;

// Where the generated JSON lands: packages/data/generated/.
const GENERATED_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'generated');

export function buildPerfectDaysArtifact(start: string, end: string): PerfectDaysArtifact {
  const days = [...scan(start, end)].sort((a, b) => a.jdn - b.jdn);
  return { window: { start, end }, count: days.length, days };
}

export function buildWitnesses(): Witness[] {
  return WITNESS_DATES.map(({ kind, date }) => {
    const [collision] = findCollisions(date, date);
    if (!collision) throw new Error(`expected a collision witness on ${date}`);
    return { ...collision, kind };
  });
}

export function buildCollisionsArtifact(start: string, end: string): CollisionsArtifact {
  return {
    window: { start, end },
    windowCollisions: findCollisions(start, end),
    witnesses: buildWitnesses(),
  };
}

const TRIPLE_SEARCH: CollisionSearch = {
  id: 'gregorian-islamic-persian33-triple',
  label: 'Triple π witness',
  kind: 'triple',
  status: 'model-dependent',
  isoDate: '195360930015-03-14',
  jdn: isoToJdn('195360930015-03-14'),
  calendars: [
    { id: 'gregorian', label: 'Gregorian', read: '3/14/15', periodDays: 146097 },
    {
      id: 'islamic',
      label: 'Tabular Hijri',
      read: "14 Rabi' al-awwal · year …15",
      periodDays: 106310,
    },
    {
      id: 'persian-33y',
      label: 'Persian 33-year model',
      read: '14 Khordad · year …15',
      periodDays: 1205300,
    },
  ],
  mechanics: {
    supercycleDays: 1872020381597100,
    witnessCount: 36,
    meanIntervalYears: 142372714444.44446,
    gcdConstraints: [
      { left: 'gregorian', right: 'islamic', gcd: 1 },
      { left: 'gregorian', right: 'persian-33y', gcd: 1 },
      { left: 'islamic', right: 'persian-33y', gcd: 10 },
    ],
  },
  model: 'Tabular Hijri + cyclic 33-year Persian arithmetic model',
  note: 'The gcd=10 compatibility filter is structural for these periods; N=36 and the exact witness are convention-dependent.',
};

function witnessSearch(witness: Witness): CollisionSearch {
  const isHistorical = witness.kind === 'historical';
  const calendars = witness.independentCalendars.map((calendarId) => {
    return {
      id: calendarId,
      label:
        calendarId === 'gregorian'
          ? 'Gregorian'
          : calendarId === 'julian'
            ? 'Julian'
            : 'Tabular Hijri',
      read: '3/14/15',
      ...(calendarId === 'gregorian'
        ? { periodDays: 146097 }
        : calendarId === 'islamic'
          ? { periodDays: 106310 }
          : {}),
    };
  });

  return {
    id: isHistorical ? 'gregorian-julian-215' : 'gregorian-islamic-2197415',
    label: isHistorical ? 'Historical double π' : 'Deep-future double π',
    kind: 'double',
    status: 'verified',
    isoDate: witness.isoDate,
    jdn: witness.jdn,
    calendars,
    ...(!isHistorical
      ? {
          mechanics: {
            supercycleDays: 15531572070,
            witnessCount: 12,
            meanIntervalYears: 3543666.6666666665,
            gcdConstraints: [{ left: 'gregorian', right: 'islamic', gcd: 1 }],
          },
        }
      : {}),
  };
}

export function buildCollisionSearchesArtifact(): CollisionSearchesArtifact {
  const searches = [...buildWitnesses().map(witnessSearch), TRIPLE_SEARCH];
  return { searches };
}

function serialize(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

// Write all artifacts deterministically. The window is fixed; the engine is pure; so regenerating
// produces byte-identical files (the reproducibility check depends on this — no timestamps).
export function writeArtifacts(outDir: string = GENERATED_DIR): void {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    join(outDir, 'perfect-days.json'),
    serialize(buildPerfectDaysArtifact(WINDOW.start, WINDOW.end)),
  );
  writeFileSync(
    join(outDir, 'collisions.json'),
    serialize(buildCollisionsArtifact(WINDOW.start, WINDOW.end)),
  );
  writeFileSync(
    join(outDir, 'collision-searches.json'),
    serialize(buildCollisionSearchesArtifact()),
  );
}
