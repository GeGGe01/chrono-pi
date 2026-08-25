# chrono-pi — Whitepaper

> A deterministic engine and companion website that find every day on which an attested calendar-and-format reads out the digits of π, track the upcoming ones in the operator's Google Calendar, and chronicle the rare days where two or three independent calendars read π at once.

## Problem

Most people meet π in the calendar exactly once: 3/14, "Pi Day", in the American month-day order. The phenomenon is far larger. Read across the world's calendars and their genuinely-used date formats, many days spell the digits of π — `3:14:15` in one system, `31:4:15` inverted in another, `3141:5:9` in a four-digit-year format, `3.14.15.9.2` in the Maya long count, `3141592653.589` as a Unix timestamp. Rarer still, two fully independent calendars can read π on the *same* physical day — a "double pi-day", a deterministic collision of two cyclic systems.

No tool enumerates these days, verifies them against a fixed convention, surfaces the next one as a countdown, or quietly drops the upcoming ones into a personal calendar. Doing it by hand is error-prone: calendar conventions differ by a day between variants, so a hand-built table drifts.

## Solution

chrono-pi treats every calendar as a deterministic algorithm on a single linear day axis. For any day it asks each *attested* calendar-and-format: do the rendered digits form a prefix of π? Days that qualify are "perfect pi-days". The engine emits them as typed JSON, which drives three surfaces:

1. A countdown website to the next perfect pi-day, with the upcoming queue and a hall of fame of double/triple collisions.
2. A Google Calendar integration that populates the operator's lifetime window with the perfect days as events, timed to the π-encoded instant.
3. The verified data set itself, regression-tested against a known reference table.

## Core definitions

These are the product, not implementation detail. They are fixed for v1.0.

- **Perfect pi-day.** A day is a perfect pi-day under a given calendar and reckoning if the reckoning renders that day's fields, in a declared field order and width, into a digit string that is a prefix of π's digits (`31415926535897932384…`) to at least a configured depth `N`. Example: month `3`, day `14`, year `15` renders `31415`, which is the 5-digit prefix of π.
- **Depth.** The number of leading π-digits matched. Depth is both the qualifying floor (`minDepth`, default 5) and a quality metric — a day that reads π to 13 digits is "more perfect" than one that reads it to 5. The π-encoded clock time may extend the digit string beyond the date (e.g. `09:26:53,589` continues `…926535 89`).
- **Provenance (validity).** A reckoning is valid only if it is an attested convention — a national or international standard (ISO 8601 big-endian, American middle-endian, little-endian), an attested year rendering (two- or four-digit, era year, cycle year), or an established technical standard (Unix time, MJD). Provenance is the guard against contrivance: invented formats do not qualify, so reality bounds the combinatorics.
- **Tiers.** Each reckoning is `canonical` or `novelty`. Canonical reckonings (real standards) count toward perfect days *and* collisions. Novelty reckonings (parody systems such as the Discordian calendar or Star Trek stardates) are displayed and clearly flagged, but never contribute to collision claims.
- **Collision (double / triple pi-day).** A day on which two or more *distinct independent calendar systems*, each via any valid canonical reckoning, read π. Independence means different calendars, not different formats of the same calendar — two formats of one calendar are the same gear viewed twice. This is what makes the underlying theorem (Bézout / Chinese Remainder Theorem over coprime periods) apply.

## Architecture

A TypeScript monorepo. Components are independent and communicate through generated JSON with shared types.

- **engine** — pure, no I/O. A calendar registry, a reckoning registry, the π-matcher, the perfect-day scanner, and the collision search. The linear axis is the Julian Day Number; ISO dates index it.
- **data** — generated artifacts (`perfect-days.json`, `collisions.json`) plus the shared TypeScript types the engine exports and the other components import.
- **site** — an Astro static site consuming the JSON at build time. The countdown is a small client-side island; everything else is static.
- **sync** — the Google Calendar push. Reads the lifetime-window perfect days and upserts them idempotently into a dedicated calendar.

Calendars that the JavaScript `Temporal` API and ICU support (Gregorian, Julian, Hebrew, Persian, Indian, tabular Islamic, Chinese, Japanese, Coptic, Ethiopic) are read through `Temporal` with an explicit calendar identifier. Calendars ICU does not provide (Holocene, Unix time, MJD, Juche/Minguo, Roman AUC, and the novelty systems) are pure arithmetic over the Julian Day Number and are hand-implemented. Adding either a calendar or a reckoning is one file plus one regression test; the engine core does not change.

## Design choices and motivation

| Choice | Alternatives considered | Motivation |
|--------|-------------------------|------------|
| TypeScript | Python, Go, Rust | One language for engine, site, and the Google push; shared types prevent schema drift between computed data and the rendered site; native fit for the Cloudflare/Vercel deploy target |
| `Temporal` + ICU for supported calendars | convertdate (Python), hand-rolling all | Reached Stage 4 in 2026; covers the major calendars natively; exposes arithmetic Islamic variants via explicit IDs |
| Explicit calendar IDs (e.g. `islamic-tbla`) | Astronomical/Umm al-Qura variants | The phenomenon requires fixed-period tabular conventions; astronomical variants use a different convention and have limited date ranges |
| Julian Day Number as the linear axis | Per-calendar epochs | A single integer axis lets every calendar be a pure function and makes collisions a group-by operation |
| Astro static site | Next.js, plain Vite + TS | Data is fully precomputed and static; static-first with one interactive island is the lightest path to a polished page |
| Idempotent `iCalUID` per event | Re-create on each run | A stable ID derived from (date, calendar, reckoning) makes the Google sync safe to re-run without duplicates |
| Regression tests against a reference table | Trust the conversions | Convention drift is the central correctness risk; a fixture table is the acceptance criterion |

## Dependencies

- `Temporal` (native where available; `@js-temporal/polyfill` otherwise)
- `googleapis` for the Google Calendar push
- Astro for the site
- Deploy target: Cloudflare Pages or Vercel

## Limitations and risks

- **Convention drift.** Tabular calendar variants can differ by a day (the reference table itself notes a one-day variance at one Hijri checkpoint). Mitigation: pin one convention per calendar via explicit IDs, regression-test against the reference table, and label the convention on every produced date.
- **ICU convention vs the reference table.** ICU's calendar conventions may not match the reference table's hand-computed dates. Mitigation: the regression suite is the arbiter; documented variances are recorded, not silently resolved.
- **Deep-future collision figures are convention-dependent.** The specific year of a far-future double or triple depends on each calendar's leap-rule variant. Mitigation: the engine reports the convention used; only the order of magnitude (which follows from period lengths alone) is presented as robust.
- **Chinese lunisolar conversion is genuinely hard.** Mitigation: it is read through `Temporal` where possible; if it slips, the theorem shows it can never collide with the Gregorian pi-day anyway, so its absence does not affect collision results — only its own single-calendar perfect days.

## Future direction

Out of scope for v1.0, parked as lore modules:

- **Chrono-Lock** time-locked cipher. Noted explicitly as *not* a working cryptosystem — the Chinese Remainder Theorem reconstructs the answer rather than hiding it, so the construction is thematic, not secure. Any future module presents it as flavour, never as a security claim.
- **Tolkien calendar wheels** (Kings', Shire, Stewards', Imladris, Dwarven reckonings) as additional novelty calendars.
- **π-primes** — perfect days whose Unix-second value is prime.

## Assumptions for Phase B

Operationalization assumptions taken during Phase A, carried into Phase B for confirmation. License is not an assumption — it was decided explicitly in Phase A and is recorded as fact.

- **License (fact):** MIT.
- **Strictness level:** `solo` (motivation: a personal project; no external contributors mentioned).
- **Repo visibility:** public (motivation: MIT plus a public-facing website; confirm at handoff — flipping to private changes the CoC/SECURITY and branch-protection decisions below).
- **Release cadence:** continuous via release-please (motivation: spec-first mode produces the granular, conventional commit history release-please consumes).
- **Distribution:** static site deployed to Cloudflare Pages or Vercel; the Google sync runs as a scheduled Worker or a local script. No package registry — chrono-pi is an application, not a library.
- **CoC / SECURITY:** generated (motivation: public repo). Skipped if visibility flips to private.
- **Documentation license:** CC-BY 4.0 (motivation: permissive source license MIT maps to permissive docs).
