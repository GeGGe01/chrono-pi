import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { writeArtifacts } from '../src/artifacts';

// Regenerating is a full 2000–2226 scan (~20s), so this only runs in CI (which sets CI=true) or on
// demand with REPRO=1 — keeping the local TDD loop fast while still guarding staleness on every PR.
const shouldRun = process.env.CI === 'true' || process.env.REPRO === '1';

const GENERATED = ['perfect-days.json', 'collisions.json', 'collision-searches.json'] as const;

describe.runIf(shouldRun)('reproducibility', () => {
  it(
    'regenerating reproduces the committed artifacts byte-for-byte',
    () => {
      const tmp = mkdtempSync(join(tmpdir(), 'chrono-pi-data-'));
      try {
        writeArtifacts(tmp);
        for (const name of GENERATED) {
          const fresh = readFileSync(join(tmp, name), 'utf8');
          const committed = readFileSync(new URL(`../generated/${name}`, import.meta.url), 'utf8');
          expect(
            fresh === committed,
            `${name} is stale — run: pnpm --filter chrono-pi-data generate`,
          ).toBe(true);
        }
      } finally {
        rmSync(tmp, { recursive: true, force: true });
      }
    },
    120_000,
  );
});
