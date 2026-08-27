# chrono-pi — CI/CD plan

## Overview

| Workflow | Trigger | Purpose | Required for merge? |
|----------|---------|---------|---------------------|
| `ci.yml` | push, PR | Install, lint, typecheck, test, build | Yes |
| `release.yml` | push to `main` | release-please: changelog, version, tag, GitHub Release | No |

CodeQL is not enabled for v1.0 — the project is a deterministic static-data generator with no server runtime processing untrusted input. It can be added later if the Google sync grows a hosted endpoint.

## Workflow: ci.yml

**Triggered on:** `push` to all branches, `pull_request` against `main`.

**Steps:**
1. Checkout.
2. Set up pnpm and Node (version from `.nvmrc`), with pnpm cache.
3. `pnpm install --frozen-lockfile`.
4. Lint across the workspace (`pnpm -r lint`, ESLint flat config).
5. Typecheck across the workspace (`pnpm -r typecheck`, `tsc --noEmit`).
6. Test with coverage (`pnpm -r test -- --coverage`, Vitest).
7. Build (`pnpm -r build`), including the Astro site.
8. Upload coverage as an artifact.

**Exit policy:** Stop on first failure. The regression suite from Phase 2 (the reference-table fixtures) runs inside the test step and gates merge — a convention regression fails CI.

## Workflow: release.yml

**Triggered on:** push to `main` (i.e. a merged PR).

**Steps:**
1. Run release-please (node release type) against the config and manifest.
2. release-please maintains a release PR; merging it tags the version and creates a GitHub Release with the changelog.

No package is published to a registry — chrono-pi is an application, not a library.

## Environments

| Environment | Purpose | Deploy trigger | URL |
|-------------|---------|----------------|-----|
| preview | Per-PR preview of the site | automatic on PR | provider-generated preview URL |
| production | The public site | automatic on push to `main` | `pi.gegge.se` |

The site is static and is built from the committed JSON data, so a deploy is a pure rebuild. Deployment is handled by the hosting provider's Git integration (Cloudflare Pages or Vercel), pointed at `apps/site`; no deploy secrets live in the repo for the site itself.

## Deploy strategy

Direct (atomic static deploy). Each push to `main` rebuilds and replaces the published site; the provider serves the new immutable build atomically.

## Google sync deployment

The `apps/sync` job is run separately from the site, either on a schedule (a Worker or a CI cron) or manually by the operator. It reads the lifetime-window data and upserts events idempotently. OAuth credentials are provided as secrets in the run environment and are never committed.

## Rollback routine

1. Site: redeploy the previous build from the provider dashboard, or revert the offending commit on `main` (a rebuild follows automatically). Recovery is seconds to a minute.
2. Authority: the operator.
3. Automatic rollback trigger: none configured for v1.0 (static site, low blast radius).
4. Communication: not required for a solo project; note the revert in the commit message.

## Observability

- **Logs:** the hosting provider's build and request logs for the site; the sync job's run logs.
- **Metrics:** none custom for v1.0.
- **Alerts:** none for v1.0.
- **Tracing:** N/A.
