# chrono-pi — Long horizon

The coarse plan for v1.0. Phases run in order; `spec-first` mode means each is executed against a pre-approved step list (the nearest phase is detailed in `03-short-horizon.md`, later phases are expanded to the same granularity as they are reached).

## Overview

| Phase | Name | Content | Estimate |
|-------|------|---------|----------|
| 1 | Engine core | Calendar and reckoning interfaces, π-matcher, seed calendars, standard reckonings, perfect-day scanner | 1 week |
| 2 | Convention pinning & regression | Lock one convention per calendar; build the reference fixtures; tests green | 3–5 days |
| 3 | Collisions | Window collision detection plus the deep-future CRT witness search | 3–5 days |
| 4 | Data output | `perfect-days.json` and `collisions.json` with shared types and a schema | 2–3 days |
| 5 | Site | Astro static site: countdown island, upcoming queue, π-stream, hall of fame, lifetime timeline | 1 week |
| 6 | Google sync | Dedicated calendar, idempotent upsert, OAuth, lifetime-window population | 3–5 days |

## Phase 1: Engine core

**Goal:** A pure engine that, given a day, can ask each registered calendar-and-reckoning whether the day reads π and to what depth.
**Done when:** The scanner runs over a date range and emits perfect-day records for the seed calendars, and a smoke test confirms `3/14/15` and the year-`3141` family are detected.
**Dependencies:** None.

## Phase 2: Convention pinning & regression

**Goal:** Each calendar is pinned to exactly one documented convention; the engine reproduces the reference table.
**Done when:** A regression suite built from the reference table (1831–2226 plus the special dates) passes, with any convention variances recorded as known exceptions rather than failures.
**Dependencies:** Phase 1.

## Phase 3: Collisions

**Goal:** Detect double and triple pi-days — both inside the lifetime window (brute force) and in the deep future (constructive Chinese Remainder Theorem witness).
**Done when:** The engine reproduces the historical double (14 March 215 CE) and constructs the next double (14 March 2,197,415 CE = 14 Rabiʿ al-awwal 2,264,215 AH), and the triple search returns a result of the expected order of magnitude.
**Dependencies:** Phases 1–2.

## Phase 4: Data output

**Goal:** Stable, typed JSON artifacts that the site and sync consume.
**Done when:** `perfect-days.json` (lifetime window) and `collisions.json` (historical, near, and deep-future witnesses) validate against a published schema and are reproducible from a single command.
**Dependencies:** Phases 1–3.

## Phase 5: Site

**Goal:** A polished static page in the spirit of a single-purpose countdown: hero countdown to the next perfect day, the upcoming queue, the π-stream signature visual, the collision hall of fame, and the lifetime timeline.
**Done when:** The site builds from the JSON, the countdown ticks client-side to the next day's π-instant, and it deploys to Cloudflare Pages or Vercel.
**Dependencies:** Phase 4.

## Phase 6: Google sync

**Goal:** Seamless, repeatable population of a dedicated "Perfect Pi-Days" calendar over the operator's lifetime window.
**Done when:** Running the sync twice produces no duplicate events, events appear at the π-encoded instant with the reading in the title, and OAuth is documented end to end.
**Dependencies:** Phase 4.

## Milestones

- [ ] Engine detects perfect days for the seed calendars (end of Phase 1)
- [ ] Regression suite green against the reference table (end of Phase 2)
- [ ] Historical and next double reproduced (end of Phase 3)
- [ ] Reproducible JSON artifacts (end of Phase 4)
- [ ] Site deployed (end of Phase 5)
- [ ] Idempotent Google sync over the lifetime window (end of Phase 6)
- [ ] v1.0 tagged

## Risk buffer

Phase 2 carries the project's correctness risk — convention pinning is where hand-built tables and ICU disagree, and resolving each variance takes judgement. Phase 6 carries the only external-dependency risk (Google OAuth and API quotas). Both are scheduled with slack; Phases 1, 3, 4 are deterministic and low-variance.
