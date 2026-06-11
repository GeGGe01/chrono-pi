# Phase 5 — Site — Design

Status: active

## Context

Phases 1–4 are merged. `packages/engine` is the pure engine; `packages/data` emits the schema-validated,
reproducible artifacts: `perfect-days.json` (77 perfect days over 2000–2226 — **65 of them upcoming**, the
soonest being **2031-04-15**, out to 2226-03-14) and `collisions.json` (zero in-window collisions plus the
two verified witnesses: historical 215 CE Gregorian∩Julian, deep-future 2,197,415 CE Gregorian∩Islamic).

Phase 5 is the public face: a polished **Astro static site** at `pi.gegge.se`, built from those JSON
artifacts, in the spirit of a single-purpose countdown.

**Decisions (operator):** hosting **Cloudflare Pages**; styling **Astro scoped CSS + design tokens** (no
Tailwind); scope **all five sections**.

## Design

### Architecture

A static Astro app in `apps/site` (`output: 'static'`). Per the whitepaper, **everything renders at build
time except one small client-side island — the countdown.** No UI framework: the countdown is a plain
client `<script>` (Astro bundles it), keeping the dependency surface to Astro alone. Data is read at build
time from `chrono-pi-data`; nothing is fetched at runtime.

Two small approach choices and why:

- **Countdown as a vanilla-TS island, not a Preact/React island** — one widget doesn't justify a framework
  integration or its dependency; an Astro `<script>` reading a `data-` attribute and updating the DOM is
  the lightest polished path.
- **Data reached through a typed loader in `chrono-pi-data`, not a raw JSON import in the site** — the
  loader (`getPerfectDays()` / `getCollisions()`) parses the committed JSON through the existing zod schemas
  and returns the typed artifact, so the site consumes validated data and a malformed artifact fails the
  build. This is an additive, read-only addition to `chrono-pi-data`; it does not change Phase 4 contracts.

### Data access (`packages/data`)

Add `src/load.ts`: `getPerfectDays(): PerfectDaysArtifact` and `getCollisions(): CollisionsArtifact`, each
importing its committed JSON (`resolveJsonModule`) and validating it through the schema before returning.
Re-exported from the package index. Tested like `generated.test.ts` (validates + anchors).

### Site structure (`apps/site`)

```
apps/site/
  astro.config.mjs        # output: 'static', site: 'https://pi.gegge.se'
  package.json            # astro, @astrojs/check; dep chrono-pi-data; scripts dev/build/preview/typecheck
  tsconfig.json           # extends astro/tsconfigs/strict
  src/
    pages/index.astro     # the single page; composes the five sections
    components/
      Countdown.astro     # hero + the client island
      UpcomingQueue.astro
      PiStream.astro
      HallOfFame.astro
      Timeline.astro
    lib/
      view.ts             # pure derivations (see below) — unit-tested
    styles/tokens.css     # CSS custom properties: colour, spacing, type scale
  public/                 # favicon, etc.
```

### Pure derivation layer (`src/lib/view.ts`) — the TDD core

All build-time data shaping lives here as pure functions, unit-tested with Vitest:

- `nextPerfectDay(days, nowIso)` — the soonest canonical day with `isoDate > nowIso` (the countdown target).
- `upcomingDays(days, nowIso, n)` — the next `n` upcoming days.
- `splitByNow(days, nowIso)` — past vs upcoming (for the timeline).
- `piInstant(isoDate)` — the day's π-instant as an ISO timestamp: the civil date at **09:26:53.589793**
  (the canonical Pi-instant time-of-day), which the countdown island ticks toward in the visitor's local
  time. `nowIso` is computed in UTC at build time for a deterministic "next day".
- `timelinePositions(days, window)` — fractional 0–1 x-positions of each day across 2000–2226 (for the SVG).
- `streamHighlight(depth)` — how many leading π digits the featured day matches (for the π-stream emphasis).

### The five sections

1. **Hero — countdown.** The next perfect day. A large countdown ticking client-side toward that day's
   π-instant (date + 09:26:53.589793, local), shown alongside the date, calendar, reckoning, the matched
   digit string and depth. The countdown spans years→days→h:m:s (the next day is ~5 years out — a long,
   deliberate countdown). The **only** interactive island. Respects `prefers-reduced-motion`.
2. **Upcoming queue.** The next ~12 upcoming canonical days as a list: date, calendar, reckoning, digits,
   depth. Static.
3. **π-stream (signature visual).** A horizontal band of π's digits (from the engine's `PI_DIGITS`) with the
   featured day's matched prefix emphasised. A subtle, optional drift animation gated on
   `prefers-reduced-motion`. Static.
4. **Collision hall of fame.** Cards from `collisions.json`: the historical and deep-future witnesses (date,
   colliding calendars, each reading), plus any in-window collisions (currently none → an honest "none yet
   in this lifetime" note). Static.
5. **Lifetime timeline.** A horizontal SVG of 2000–2226 with every perfect day as a tick; "now" marked; past
   dimmed, upcoming bright. Static.

### Build, CI, deploy

- `pnpm --filter site build` → `apps/site/dist`. The existing `ci.yml` build step (`pnpm -r build`) now
  exercises the site — a broken build fails CI. **No workflow change needed.**
- **Cloudflare Pages**, Git integration: build command `pnpm --filter site build`, output `apps/site/dist`,
  per-PR previews, production on push to `main`, custom domain `pi.gegge.se`. Connecting the Pages project
  and DNS is a one-time **operator** action (documented in this phase); it needs the operator's Cloudflare
  account and is not something the build performs.

### Testing

TDD on the pure layer: `src/lib/view.ts` (every derivation) and the `chrono-pi-data` loaders. The Astro
components are gated by a successful `astro build` (the integration test) plus an optional render smoke test
via Astro's container API. The engine and data suites stay green.

## Sequencing (input to implementation)

1. Scaffold `apps/site` as a minimal Astro app that builds (config, package.json, tsconfig, a stub
   `index.astro`); confirm `pnpm --filter site build` and that `pnpm -r build` picks it up.
2. Add the typed loaders to `chrono-pi-data` (`getPerfectDays`/`getCollisions`) + tests.
3. `src/lib/view.ts` derivations — TDD.
4. Hero countdown component + client island (ticks to the π-instant).
5. Upcoming queue component.
6. π-stream component.
7. Hall of fame component.
8. Lifetime timeline component.
9. Compose `index.astro`, design tokens + scoped styling, polish; build green.
10. Cloudflare Pages deploy docs (settings + custom domain) and a short README for the site.

## Risks

- The next perfect day is ~5 years out, so the countdown must render multi-year durations cleanly — covered
  by the `view.ts` tests.
- π-instant timezone: the target is the civil date at 09:26:53.589793 in the visitor's local time; the
  build-time "now" is UTC for determinism. Documented on the page.
- All 77 days are canonical (no novelty reads in-window), so the tier filter is a no-op today but kept for
  forward-compatibility.

## Non-goals

- Google sync (Phase 6).
- Multiple pages / a CMS; server runtime (the site is fully static).
- Creating the Cloudflare Pages project or DNS (operator one-time action; documented, not automated).
