# Phase 4 — Data output — Design

Status: implemented

## Context

Phases 1–3 built the engine: the perfect-day scanner, ~19 calendars and reckonings, the reference-table
regression, and collision detection with the verified witnesses (215 CE, 2,197,415 CE). Phase 4 emits the
typed JSON artifacts the site (Phase 5) and the Google sync (Phase 6) consume.

Goal (`docs/02-long-horizon.md`): `perfect-days.json` (lifetime window) and `collisions.json` (historical,
near, deep-future), schema-validated and reproducible from a single command.

**Decision (operator):** the lifetime window is **2000–2226**.

## Design

### 1. `packages/data`

A workspace package depending on `chrono-pi-engine`. It holds the generation script, the zod schemas, the
shared output types (re-exporting the engine's `PerfectDay` / `Collision` plus the artifact envelopes), and
the generated JSON.

### 2. `perfect-days.json`

`scan('2000-01-01', '2226-12-31')` → every perfect day in the window, sorted by JDN. Each entry:
`{ isoDate, jdn, calendarId, reckoningId, digits, depth, tier }`. Includes canonical and novelty readings
(tier-flagged); the site filters.

### 3. `collisions.json`

- **windowCollisions:** `findCollisions` over 2000–2226 — the independent-calendar doubles/triples inside
  the window (expected few or none; the table's clean doubles are ancient or deep-future).
- **witnesses:** the verified **historical** double (215 CE, Gregorian ∩ Julian) and **deep-future** double
  (2,197,415 CE, Gregorian ∩ Islamic = 14 Rabiʿ al-awwal 2,264,215), each with the colliding calendars and
  their readings.

### 4. Schemas and validation

zod schemas for both artifacts. A test validates the committed JSON against the schema and asserts known
anchors (2015-03-14 Gregorian; the two witnesses). The generate script is deterministic (the pure engine
over a fixed window), so a reproducibility check can regenerate and diff.

### 5. Reproducible command

`pnpm --filter chrono-pi-data generate` writes both files deterministically; CI regenerates and diffs to
guard staleness.

## Sequencing (input to implementation)

1. Scaffold `packages/data` (package.json, tsconfig, depends on `chrono-pi-engine`).
2. Output types + zod schemas (`PerfectDay`, `Collision`, the artifact envelopes).
3. The generate script: scan the window → `perfect-days.json`; `findCollisions` + witnesses → `collisions.json`.
4. Validation test (schema + known anchors).
5. Reproducibility check (regenerate = identical) wired into CI.

## Risks

- Scanning 2000–2226 (~83000 days × ~30 reckonings) takes a few seconds with the Temporal calendars —
  acceptable at build time. The validation test reads the committed JSON, not a full re-scan.
- The generated JSON must stay current; the regenerate-and-diff CI check guards it.
- `windowCollisions` may be empty (no clean window doubles) — correct, and recorded.

## Non-goals

- The site (Phase 5) and the Google sync (Phase 6).
- The deferred Phase 2 calendars remain deferred.

## Testing

TDD where it fits (schemas, the generate functions). The artifact-validation test is the phase gate; the
engine reference regression stays green.
