# chrono-pi — site

The public Astro static site, deployed to Cloudflare at **`typ.gegge.org/chrono-pi`**. It builds from the
committed JSON artifacts in `packages/data` (no runtime data fetching).

> **Rebuild note:** the collision surface is now a deterministic **search** view (see `docs/REBUILD.md` §5) —
> each known witness shown with its CRT mechanics: witness count N, gcd filters, supercycle, mean interval,
> and a model-dependence flag. A live query box over the residue engine is the next step.

## Develop

```bash
pnpm --filter site dev        # local dev server
pnpm --filter site build      # static build → apps/site/dist
pnpm --filter site preview    # serve the build locally
pnpm --filter site typecheck  # astro check
pnpm --filter site test       # vitest (view-layer unit tests)
```

## Sections

- **Hero countdown** — ticks client-side to the next perfect pi-day's π-instant (09:26:53.589, local time).
- **Calendar filter** — pick which calendars appear; remembered on-device via an eternity cookie.
- **Upcoming queue** — the next twelve perfect days.
- **π-stream** — π's digits with the next day's matched prefix lit.
- **Collision search** — the historical double, the deep-future double, and the model-pinned triple witness,
  each with CRT witness counts, gcd filters, and supercycle metadata.
- **Lifetime timeline** — every perfect day across the lifetime window.

## Deploy — Cloudflare (path-based)

Served at `typ.gegge.org/chrono-pi` — a **subpath**, not a subdomain. Two settings must agree or assets 404:

- Astro `base: '/chrono-pi'` (so asset/route URLs are prefixed).
- Cloudflare routing maps `typ.gegge.org/chrono-pi/*` to the Pages project (Worker route or Pages path).

Operator + alchemist own the Cloudflare side (via the fleet cf-mcp token broker — never raw CF creds).
Build command `pnpm --filter site build`, output `apps/site/dist`, from the monorepo root. Pages-first for
the static site; the deterministic search API runs on Workers (`docs/REBUILD.md` §Architecture).
