# chrono-pi — Short horizon

Detail plan for **Phase 1: Engine core**. `spec-first` mode: these steps are pre-approved and executed verbatim, one logical change per commit. The interface contracts below are part of the spec — do not redesign them mid-build; if reality forces a change, escalate per `07-agent-loop.md` before deviating.

Later phases (2–6 in `02-long-horizon.md`) are expanded to this granularity when reached.

## Contracts (fixed for Phase 1)

```ts
// The linear axis is the Julian Day Number (integer).
type JDN = number;

interface CalendarFields {
  year: number;
  month: number;       // 1-based
  day: number;         // 1-based
  eraYear?: number;    // regnal/era count where the calendar uses one
  cycleYear?: number;  // position in a repeating cycle (e.g. the 60-year cycle)
}

interface Calendar {
  id: string;                       // 'gregorian', 'julian', 'islamic-tbla', 'holocene', ...
  tier: 'canonical' | 'novelty';
  independent: boolean;             // counts as a distinct gear for collisions
  fields(jdn: JDN): CalendarFields;
}

interface PiRead {
  digits: string;                   // concatenated field digits, no separators
  clockDigits?: string;             // digits the π-instant adds after the date
  label: string;                    // human label, e.g. 'gregorian · MM-DD-YY → 31:4:15'
}

interface Reckoning {
  id: string;                       // 'mm-dd-yy', 'yyyy-mm-dd', 'yy-m-dd', 'unix', ...
  calendarId: string;
  tier: 'canonical' | 'novelty';
  minDepth: number;                 // qualifying floor (default 5)
  timeExtends: boolean;             // whether the π-instant extends the digit string
  read(fields: CalendarFields, jdn: JDN): PiRead;
}

interface PerfectDay {
  jdn: JDN;
  isoDate: string;                  // 'YYYY-MM-DD'
  calendarId: string;
  reckoningId: string;
  digits: string;
  depth: number;                    // π-prefix length matched
  tier: 'canonical' | 'novelty';
}
```

## Step 1: Repository and workspace

**Task:** Initialise a pnpm monorepo with strict TypeScript.
**Output:** `package.json` with pnpm workspaces, `tsconfig.base.json` with `strict: true`, and the empty package folders `packages/engine`, `packages/data`, `apps/site`, `apps/sync`.
**Commands:**
```bash
pnpm init
pnpm add -D typescript vitest @types/node
```
**Done when:** `pnpm -r exec tsc --noEmit` runs clean on the empty workspace.

## Step 2: π constant and matcher

**Task:** Add the π digit string (no decimal point; enough digits to cover the deepest reckoning, at least 100) and a depth function.
**Output:** `packages/engine/src/pi.ts` exporting `PI_DIGITS` and `matchDepth(digits: string): number` returning the length of the common leading prefix with `PI_DIGITS`.
**Done when:** `matchDepth('31415')` is 5, `matchDepth('3141592653589')` is 13, `matchDepth('314139')` is 4.

## Step 3: Julian Day Number helpers

**Task:** Add ISO-date ↔ JDN conversion and a day-range iterator.
**Output:** `packages/engine/src/jdn.ts` exporting `isoToJdn`, `jdnToIso`, and `eachJdn(startIso, endIso)`.
**Done when:** Round-tripping a sample of dates is identity, and a known anchor (1 January 2000 → JDN 2451545) holds.

## Step 4: Calendar registry and the `Calendar` interface

**Task:** Add the registry and the `Calendar` interface from the contracts above.
**Output:** `packages/engine/src/calendars/registry.ts` with `registerCalendar` and `listCalendars`.
**Done when:** Registering a stub calendar and listing it returns it.

## Step 5: Temporal-backed seed calendars

**Task:** Implement Gregorian, Julian, tabular Islamic (`islamic-tbla`), Hebrew, and Persian as `Calendar`s, reading fields through `Temporal` with an explicit calendar identifier. Use the polyfill where native `Temporal` is unavailable.
**Output:** `packages/engine/src/calendars/temporal.ts`.
**Blocker:** Confirm the exact ICU identifier per calendar before wiring (the Islamic one must be the tabular/arithmetic variant, not the astronomical one).
**Done when:** Each calendar converts the anchor 2000-01-01 to its documented year/month/day.

## Step 6: Arithmetic seed calendars

**Task:** Implement Holocene (Gregorian year + 10000) and Unix time as arithmetic `Calendar`s over the JDN, with no dependency on `Temporal`.
**Output:** `packages/engine/src/calendars/arithmetic.ts`.
**Done when:** Holocene reports year 12000 for 2000-01-01; Unix reports the correct second count for the same instant at midnight UTC.

## Step 7: Reckoning registry and the `Reckoning` interface

**Task:** Add the reckoning registry and the `Reckoning` interface from the contracts.
**Output:** `packages/engine/src/reckonings/registry.ts`.
**Done when:** Registering a stub reckoning and listing reckonings for a calendar returns it.

## Step 8: Standard reckonings

**Task:** Implement the canonical reckonings: `mm-dd-yy` (American, year mod 100), `yyyy-mm-dd` (ISO, four-digit year), `yy-m-dd` (year mod 100 first — the inverted `31:4:15`), plus `unix-timestamp` for the Unix calendar. Each declares its `minDepth`, `tier`, and `timeExtends`.
**Output:** `packages/engine/src/reckonings/standard.ts`.
**Done when:** For 2015-03-14 Gregorian, `mm-dd-yy` reads `31415` at depth 5; for the year-3141 family, `yyyy-mm-dd` reads `314159` at depth 6.

## Step 9: π-instant (clock) extension

**Task:** Add the π-encoded clock time and let reckonings with `timeExtends` append its digits to the date digits before matching.
**Output:** `packages/engine/src/clock.ts` exporting the standard π-instant `09:26:53,589` and its digit string, and the special instants used by Unix/MJD-style reckonings.
**Done when:** A `mm-dd-yy` read of a perfect day, extended by the clock, reaches depth 13.

## Step 10: Perfect-day scanner

**Task:** Implement the scan: for each JDN in a range, for each (calendar, reckoning), build the read, compute depth, and emit a `PerfectDay` when depth ≥ `minDepth`.
**Output:** `packages/engine/src/scan.ts` exporting `scan(startIso, endIso): PerfectDay[]`.
**Done when:** `scan('2015-01-01','2015-12-31')` includes the Gregorian `mm-dd-yy` hit on 2015-03-14.

## Step 11: Smoke fixtures

**Task:** Add a small fixture of known perfect days (a handful drawn from the reference table) and a test asserting the scanner finds them with the right calendar, reckoning, and depth.
**Output:** `packages/engine/test/smoke.test.ts`.
**Done when:** `pnpm -r test` passes.

## Step 12: Engine entry point

**Task:** Export a clean public surface from the engine package: `scan`, the registries, and the shared types.
**Output:** `packages/engine/src/index.ts` and the package `exports` map.
**Done when:** A consumer can `import { scan } from 'chrono-pi-engine'` and run it.

## Critical path

Step 2 → Step 3 → Step 4 → Step 5 → Step 8 → Step 10. Steps 6 and 9 can follow their prerequisites in parallel; Steps 11–12 close the phase.

## Test points

- After Step 2: the three `matchDepth` cases.
- After Step 5: each Temporal-backed calendar against the anchor date.
- After Step 8: the `31415` (depth 5) and `314159` (depth 6) reads.
- After Step 11: the full smoke suite green — the gate for Phase 2.
