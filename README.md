# chrono-pi

> A **deterministic calendar-collision search engine**. Define exact calendar/date-pattern rules;
> chrono-pi searches exactly that space, returns only independently verified witnesses, and never
> pretends an incomplete search was complete.

A "π-day" is a day whose calendar fields render the digits of π — American `3/14/15` → `31415`. A
**collision** is a day on which two or more independent calendars read π at once. chrono-pi answers,
for any rules and any date range: *does a witness exist, how many, and exactly which* — by exact
number theory, not by scanning the calendar day by day.

## Status: rebuild in progress

The engine is being rebuilt around the mathematics (see the articles: Kalenderkrockssatsen,
Tågrälssatsen I–III, Tibiasatsen / The Flashback Theorem). The v1 site scanned a bounded window;
the rebuild compiles each calendar rule to its periodic **residue classes** and enumerates witnesses
**arithmetically** — so it reaches deep-future collisions a scan can never afford.

- **Governing order:** [`docs/REBUILD.md`](docs/REBUILD.md) — direction, product contract, math core, phases.
- **Working guide:** [`CLAUDE.md`](CLAUDE.md) — architecture, invariants, current state.
- **v1 (reference / regression oracle):** [`docs/v1-archive/`](docs/v1-archive/).

## How it works (the reduction)

Each `(calendar, rule)` compiles to a period `P` and an active residue set `A ⊆ Z/P` — the days, modulo
one supercycle, on which it reads π. For a set of systems, generalized CRT maps coherent residue tuples
bijectively to witness classes `t ≡ t₀ (mod lcm(Pᵢ))` (Tågrälssatsen III). Concrete witnesses are then
`t = t₀ + m·L` over the requested range — no raw-date scan — and each is checked by an **independent
verifier**. The `gcd` compatibility filter is load-bearing: it turns a naive product count into the true
one (the "36 not 396" correction).

## Invariants

Deterministic only (no LLM in the search path) · completeness over the quotient (never silently sample) ·
independent verification · exact / BigInt arithmetic · explicit calendar conventions.

## Layout

| Path | What |
|------|------|
| `packages/engine/src/residue/` | the deterministic core — `compileGear`, `witnessJdns`, `verifyWitness`, CRT collisions |
| `packages/engine/src/{jdn,pi,calendars,reckonings,scan,collisions}.ts` | v1 engine — `scan` retained as the brute-force **regression oracle** |
| `packages/data` | schema-validated reproducible JSON artifacts |
| `apps/site` | Astro site — deterministic **search** UI (per REBUILD §5) |
| `apps/sync` | Google Calendar push |

## Develop

```bash
pnpm install
pnpm -r test     # engine + data + site
```

Source of truth is Forgejo (`git.gegge.me`); land work via PR, one reviewable slice at a time.
Deployment target: Cloudflare (Workers scale execution; they never define search semantics) at
`typ.gegge.org/chrono-pi`.
