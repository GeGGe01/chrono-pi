# Phase 3 — Collisions — Design

Status: active

## Context

Phase 2 built the engine and reproduced 102 reference rows across 19 calendars, with window collision
detection seeded (`findCollisions`). Phase 3 detects the double and triple pi-days: a window brute-force
plus the historical and deep-future witnesses.

Goal (`docs/02-long-horizon.md`): reproduce the historical double (14 March 215 CE), confirm the next
double (Gregorian 14 March 2,197,415 CE = Islamic 14 Rabiʿ al-awwal 2,264,215 AH), and a triple of the
expected order of magnitude.

**Decision (operator):** *verify the known witnesses* rather than build the full constructive CRT. Phase 3
implements the deep-time machinery and an arithmetic Islamic calendar, then asserts the engine confirms
the known doubles read π in both calendars at their JDNs.

**Key technical reality:** the Temporal calendars max out near year 275760 — confirmed, year 2,197,415
throws "outside of supported range". So deep-time collision checks require pure-arithmetic conversions.

## Design

### 1. Deep-time JDN axis

Extend `isoToJdn` / `jdnToIso` to handle years outside 1000–9999 (ISO 8601 extended `±YYYYYY`, and ancient
years). The Fliegel / Richards formulas already work for any integer year; only the parse and format
widths change. Collision search and witnesses operate on the JDN; ISO is for display only.

### 2. Arithmetic tabular Islamic

Replace the Temporal `islamic` calendar with a pure-formula tabular **civil** conversion (30-year cycle,
the civil leap set, epoch JDN 1948440), valid for any JDN — Temporal cannot reach the deep future. The
Phase 2 reference regression is the guard: the arithmetic Islamic must still reproduce the same window
rows the Temporal `islamic-civil` did (same convention), with the recorded Islamic variances unchanged.

### 3. Window collision search

Extend `findCollisions` to accept a configurable JDN range (it already groups perfect days by date and
counts independent calendars). Brute-force the lifetime window and any requested span.

### 4. Witness verification

- **Historical (215 CE):** at 14 March 215, confirm two or more *independent* calendars read π. Gregorian
  `mm-dd-yy` reads 31415 on a year ending 15; the second independent reading is computed and asserted, not
  assumed — the verification records the actual composition.
- **Deep-future double:** confirm the JDN of Gregorian 2197415-03-14 has Islamic = 14 Rabiʿ al-awwal
  2264215, so both read 31415 — a confirmed double on a single physical day.
- **Triple:** confirm a triple of the expected order of magnitude (verify a known triple JDN, or assert the
  search returns one at the expected scale).

### 5. Public surface

Export the range collision search and the witness helpers from the engine; the Phase 4 data layer consumes
them.

## Sequencing (input to implementation)

1. Deep-time `isoToJdn` / `jdnToIso` (extended-year parse and format) + round-trip tests.
2. Arithmetic tabular Islamic; swap the calendar — the Phase 2 regression must stay green.
3. Extend `findCollisions` to a JDN range.
4. Verify the historical 215 CE double (record its composition).
5. Verify the deep-future Gregorian ∩ Islamic double.
6. Triple-of-magnitude check.

## Risks

- Swapping Islamic to arithmetic risks changing the Phase 2 window results — the regression suite is the
  gate; any new disagreement is a recorded variance.
- The 215 CE double's exact composition is unverified until computed; the verification reveals it rather
  than asserting a guessed pair.
- Extended-year ISO must round-trip cleanly; tested both directions.

## Non-goals

- Full constructive CRT derivation of the next double (deferred — verification was chosen).
- The deferred Phase 2 calendars (Chinese, Bahá'í, …) remain deferred.
- Data artifacts, the site, and the Google sync — Phases 4–6.

## Testing

TDD throughout. The Phase 2 reference regression must stay green at every step. New tests cover the
deep-time round-trips, the arithmetic Islamic anchors, and the two witness verifications.
