import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { findCollisions, scan } from 'chrono-pi-engine';

import type { CollisionsArtifact, PerfectDaysArtifact, Witness } from './types';

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

function serialize(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

// Write both artifacts deterministically. The window is fixed; the engine is pure; so regenerating
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
}
