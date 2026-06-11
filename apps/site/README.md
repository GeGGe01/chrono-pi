# chrono-pi — site

The public Astro static site at **https://pi.gegge.se**. It builds from the committed JSON artifacts in
`packages/data` (no runtime data fetching); the only client-side code is the countdown island.

## Develop

```bash
pnpm --filter site dev        # local dev server
pnpm --filter site build      # static build → apps/site/dist
pnpm --filter site preview    # serve the build locally
pnpm --filter site typecheck  # astro check
pnpm --filter site test       # vitest (view-layer unit tests)
```

## Sections

- **Hero countdown** — ticks client-side to the next perfect pi-day's π-instant (09:26:53.589, your local time).
- **Upcoming queue** — the next twelve perfect days.
- **π-stream** — π's digits with the next day's matched prefix lit.
- **Collision hall of fame** — the historical (215 CE) and deep-future (2,197,415 CE) witnesses.
- **Lifetime timeline** — every perfect day across 2000–2226.

## Deploy — Cloudflare Pages

A one-time operator setup (needs the chrono-pi Cloudflare account); the build itself does not perform it.

1. Create a Pages project from the GitHub repo `GeGGe01/chrono-pi`.
2. Build settings:
   - **Build command:** `pnpm --filter site build`
   - **Build output directory:** `apps/site/dist`
   - **Root directory:** the repository root (the monorepo root; the command filters to the site).
   - **Node version:** 22 (matches `.nvmrc`; set `NODE_VERSION=22` if Pages does not pick it up).
3. Add the custom domain `pi.gegge.se` and point its DNS at the Pages project.

Cloudflare Pages then deploys production on every push to `main` and a preview per pull request. The site is
fully static — a deploy is a pure rebuild from the committed data — so no deploy secrets live in the repo.
`pnpm install` respects the `allowBuilds` allowlist in `pnpm-workspace.yaml`, so sharp builds during the
Pages install the same way it does in CI.
