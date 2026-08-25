# Phase 2 — Convention pinning & full-table regression — Design

Status: active

## Context

Phase 1 delivered a pure engine (`packages/engine`): the JDN axis, the π matcher, a calendar
registry and reckoning registry, seven seed calendars (gregorian, julian, hebrew, persian,
islamic-tbla, holocene, unix), four standard reckonings, the π-instant clock, and the perfect-day
scanner. 46 tests green on `main`.

Phase 2's goal, per `docs/02-long-horizon.md`: *each calendar is pinned to exactly one documented
convention; the engine reproduces the reference table; a regression suite built from the reference
table (1831–2226 plus the special dates) passes, with any convention variances recorded as known
exceptions rather than failures.*

The reference table — the oracle — is the cross-calendar pi-day taxonomy compiled by The Crash on
Flashback. The operator has supplied it. It spans **~180 rows across ~27 calendars and 8 formats**.
Phase 1's seven calendars reproduce ~46 of those rows; the rest require new calendars and reckonings.

**Decision (operator, 2026-06-11):** Phase 2 implements **all ~27 calendars** to reproduce the full
table — not just the subset Phase 1 covers. This makes Phase 2 weeks of work rather than days; the
estimate in `docs/02` is superseded.

Two findings recorded during Phase 1 fold directly into Phase 2:
1. **Julian** is arithmetic (Temporal/ICU has no Julian calendar) — already done in Phase 1 Step 6.
2. **Unix perfect day** is unreachable by the midnight-second model. The reference table confirms the
   cause: `2069-07-21 · Unix · 3141592653,589` occurs at **00:37:33,589**, not midnight. Phase 2's
   instant-aware timestamp handling fixes it.

## Approach (approved)

**Harness-first, incremental, TDD** — the Phase 1 rhythm. Build the regression harness and the parsed
full-table fixture first, wire it to the seven existing calendars, then grow the engine into the
table batch by batch, each batch turning more fixture rows green. The oracle drives every step. The
table is always the arbiter: where the engine and the table disagree, the disagreement is a recorded
variance, never a silent code change.

Rejected: *calendars-first* (untested calendar code piles up before the oracle checks it) and
*convention-derivation/codegen* (circular — the oracle would become the implementation, defeating
independent validation).

## Design

### 1. Reference fixture (the oracle, as data)

The raw Flashback table is preserved **verbatim** in `docs/reference-table.md` (CC-BY 4.0, attributed
to The Crash), so the source of truth is auditable. A typed, parsed form lives at
`packages/engine/test/fixtures/reference-table.ts`:

```ts
interface ReferenceEntry {
  isoDate: string;            // Gregorian physical day, 'YYYY-MM-DD'
  calendar: string;           // engine calendar id ('coptic', 'assyrian', …)
  format: string;             // reckoning id: 'yy-m-dd' | 'mm-dd-yy' | 'yyyy-s-d'
                              //   | 'yyy-m-d' | 'yyy-dd-m' | 'mjd' | 'stardate' | 'timestamp'
  sequence: string;           // π digits read, colons stripped ('31415')
  fullYear: number;           // the calendar's full year shown (6615), for disambiguation
  tier: 'canonical' | 'novelty';
  clock?: string;             // overriding π-instant, when not the standard 09:26:53.589
  collisionWith?: string[];   // calendar ids co-reading π on the same day (the '=' rows)
}
```

The fixture is hand-transcribed from the raw table (not engine-generated), so it stays an independent
oracle.

### 2. Regression harness and variance ledger

`packages/engine/test/reference.test.ts`: for each **canonical** entry, scan `isoDate` (a single
day) and assert the engine emits a `PerfectDay` whose `(calendarId, reckoningId)` matches, whose
matched digits equal `sequence` to the expected depth, and whose calendar `year` (or `eraYear`)
equals `fullYear`.

- **Variance ledger** — `packages/engine/test/fixtures/variances.ts`: a committed list of known
  `(isoDate, calendar, format) → reason` entries (e.g. "ICU islamic-tbla differs by one day at this
  Hijri checkpoint"). A fixture row covered by the ledger is asserted as a *recorded variance*
  (expected mismatch), not a failure.
- **Pending coverage** — calendars whose batch has not yet landed are listed `pending`; their rows
  are skipped, not failed, until the batch arrives.
- **Coverage report** — the harness logs reproduced / pending / variance counts, so progress is
  visible and there are no silent gaps (no truncation reads as full coverage).

The suite is the Phase 2 gate and runs inside CI's test step, so a convention regression fails CI.

### 3. Calendars and reckonings — four implementation types

- **Temporal-backed** (the Phase 1 Step 5 pattern, explicit ICU ids, pinned): `coptic`, `ethiopic`,
  `indian`, `japanese` (era-based — exposes `eraYear`), `chinese` (lunisolar — read through Temporal,
  the whitepaper's hardest case), `buddhist` (Thai solar), `roc` (Minguo).
- **Base-aligned shifted-year** (arithmetic): the base calendar's month/day plus a fixed year offset,
  both derived from the table and regression-pinned. **The base differs per calendar** — Assyrian is
  Gregorian-aligned (`+4750`: 1865 → 6615), Roman/AUC is Julian-aligned (`+753`: Julian 1878-04-15 =
  Gregorian 1878-04-27 → 31:4:15 2631), Armenian is Gregorian-aligned (`−551`), Juche/Minguo is
  Gregorian year `−1911`. Which further calendars are clean shifted-year versus own-structure — e.g.
  Seleucid and Zoroastrian, whose months do not track Gregorian or Julian and whose year boundary
  drifts — is determined empirically as each batch lands. The table is the arbiter; no offset is
  assumed.
- **Own-structure arithmetic**: calendars with their own month/day cycles — Bahá'í (19×19 + Ayyám-i-Há),
  Nanakshahi, French Republican, Kali Yuga, Julian Period (a day count), MJD. Hand-rolled JDN math.
- **Novelty** (`tier: 'novelty'`, displayed but **never** counted toward collisions): Discordian,
  Star Trek stardate, Kali Yuga.

### 4. New formats, era-year reckonings, and instant-aware timestamps

- **New reckoning formats**: `yyyy-s-d` (4-digit year, e.g. Discordian `3141:5:9` → depth 6),
  `yyy-m-d` and `yyy-dd-m` (3-digit year, Kali Yuga), `mjd`, `stardate`, `timestamp`.
- **Era-year reckonings**: read `eraYear` rather than `year` (Japanese era year, Juche year). The
  `CalendarFields.eraYear` slot already exists from Phase 1.
- **Instant-aware timestamps** — fixes the Phase 1 finding. Unix, MJD, and Stardate read the count at
  the π-instant **time of day**, not midnight, so Unix reads `3141592653.589` on 2069-07-21. The clock
  module gains per-reckoning instants:

  | Instant | Time | Used by |
  |---|---|---|
  | standard | 09:26:53.589 | the date reckonings |
  | Discordian | 02:06:53.589 | Discordian |
  | Star Trek | 06:53:58.900 | stardate |
  | Unix | 00:37:33.589 | unix-timestamp |
  | MJD | midnight | mjd |

### 5. Convention pinning and collisions

- Each calendar's pinned convention (ICU id, or arithmetic epoch/offset and base alignment) is
  documented in `docs/conventions.md`, each anchored to the table row that fixes it.
- The harness also validates **collisions** — the `=` rows: on a double's date, two or more
  *independent* calendars read π. Holocene-with-Gregorian co-reads are asserted as co-reads but
  **excluded from collision counts** (Holocene is the Gregorian gear relabelled, `independent: false`).
  This seeds Phase 3 (collision detection).

## Sequencing (input to writing-plans)

1. Parse the table → fixture + harness, wired to the seven existing calendars (green + seed the
   variance ledger).
2. Instant-aware timestamp fix — the Unix perfect day (2069-07-21) goes green.
3. Temporal batch — coptic, ethiopic, indian, japanese, chinese, buddhist, roc.
4. Shifted-year arithmetic batch — the calendars the table shows as base-aligned year offsets
   (assyrian, roman, armenian, juche/minguo, …).
5. Own-structure arithmetic batch — calendars with their own month rules (bahá'í, nanakshahi,
   french-republican, kali-yuga, julian-period, mjd), plus any shifted-year candidates that prove
   own-structure (e.g. seleucid, zoroastrian).
6. New formats (yyyy-s-d, 3-digit, mjd, stardate) + era-year reckonings.
7. Novelty batch — discordian, stardate.
8. Collision validation + `docs/conventions.md`. Full table green, modulo recorded variances.

## Risks and findings

- **Convention drift is the central risk** (per the whitepaper). The variance ledger is the
  mitigation: ICU-vs-table and tabular-variant disagreements are recorded, not resolved by changing
  code. Every produced date that disagrees with the table is a ledger entry with both values.
- **The own-structure calendars are each a small project** — Bahá'í, French Republican, and
  Nanakshahi have non-trivial month rules. They carry the most schedule risk and are batched together
  (step 5) so the risk is contained.
- **Chinese lunisolar is genuinely hard**; it is read through Temporal where possible. If it slips,
  the theorem shows it cannot collide with the Gregorian pi-day anyway, so its absence affects only
  its own single-calendar rows.
- **Base-alignment ambiguity** (Gregorian vs Julian month/day) for shifted-year calendars is resolved
  empirically against the table, not assumed.

## Non-goals

- Deep-future collision witnesses (CRT) — that is Phase 3.
- JSON data artifacts, the site, and the Google sync — Phases 4–6.
- The parked lore modules (Chrono-Lock, Tolkien wheels, π-primes) — out of scope for v1.0.

## Testing

TDD per the Phase 1 rhythm: a failing fixture/test before each calendar or reckoning, minimal code to
turn the targeted rows green, one logical change per commit. `pnpm -r exec tsc --noEmit` and every CI
step stay green throughout. The reference suite is the phase gate.
