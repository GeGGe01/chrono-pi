# Pinned calendar conventions

Status: active

Each calendar is pinned to exactly one documented convention, anchored to the reference table
(`reference-table.md`). Where the engine and the table disagree, the disagreement is a recorded
variance — the engine uses the correct standard calendar; the table value is the recorded side.

## Reproduced calendars (the Phase 2 core)

102 reference rows across 19 calendars are reproduced and regression-locked
(`packages/engine/test/reference.test.ts`).

| Calendar | id | Convention | Independent? |
|----------|-----|------------|--------------|
| Gregorian | `gregorian` | Temporal `gregory` | yes |
| Julian | `julian` | Richards algorithm over the JDN | yes |
| Hebrew | `hebrew` | Temporal `hebrew` | yes |
| Persian | `persian` | Temporal `persian` (33-year arithmetic) | yes |
| Islamic | `islamic` | Temporal `islamic-civil` — **the oracle uses the civil epoch, not `islamic-tbla`** | yes |
| Indian | `indian` | Temporal `indian` (Śaka) | yes |
| Japanese | `japanese` | Temporal `japanese`, **era year** (Meiji/Taishō/Shōwa/Heisei/Reiwa) | yes |
| Coptic | `coptic` | arithmetic (AM epoch JDN 1825030, year≡3 leap) — polyfill mishandles its era | yes |
| Ethiopic | `ethiopic` | arithmetic (epoch JDN 1724221) — polyfill mishandles its era | yes |
| Unix | `unix` | second count; the perfect day holds a π-prefix timestamp at its π-instant | yes |
| MJD | `mjd` | day count, JD − 2400000.5 | yes |
| Holocene | `holocene` | Gregorian year + 10000 | no (Gregorian relabelled) |
| Buddhist (Thai) | `buddhist` | Gregorian + 543 | no |
| Minguo / Juche | `minguo` | Gregorian − 1911 | no |
| Assyrian | `assyrian` | Gregorian + 4750 | no |
| Armenian | `armenian` | Gregorian − 551 | no |
| Roman (AUC) | `roman` | **Julian** date + 753 | no |
| Julian Period | `julian-period` | Gregorian + 4713 | no |
| Discordian | `discordian` | Gregorian + 1166, five 73-day seasons | no (novelty) |

The non-independent calendars share another calendar's days, so they read π on their own dates but never
contribute to a collision.

## Recorded variances (26)

Most variances are errors in the hand-built reference table, not the engine:

- **Persian** (4) — ICU's 33-year arithmetic runs one day ahead of the table after ~2025 (leap-cycle).
- **Hebrew** (4) — ICU's deterministic Hebrew diverges from the table in the far future (±1 day to ~1 month).
- **Islamic** (4) — ICU `islamic-civil` differs from the table by 1–5 days in the far future (leap-set drift).
- **Coptic** (5) — ±1-day cases, and 1838 carries year 1531 where the table's own epoch gives 1555 (typo).
- **Ethiopic** (6) — the March rows read month 7 (Mägabit) astronomically, not the table's month 3 (error).
- **Roman** (2) — the table assumes a constant 13-day Julian–Gregorian gap; it widens to 14 after 2100.
- **MJD** (1) — MJD 31415 is 1944-11-21; the table dates it 1944-11-22 (one day late).

Each is keyed and explained in `packages/engine/test/fixtures/variances.ts`.

## Deferred calendars

These appear in the reference table but are not reproduced — the table's data does not match the standard
calendar, or the calendar is blocked or out of scope. The reliable core above stands; these are recorded
rather than reverse-engineered from idiosyncratic or erroneous table values.

- **Chinese** — the `@js-temporal/polyfill` throws on its leap-month suffix; hand-rolling lunisolar is out
  of scope. The whitepaper permits omitting it (it cannot collide with the Gregorian pi-day).
- **Bahá'í** — the table's month-3/4 readings fall in July/August, but standard Bahá'í months 3–4 are
  April–June (year starts at Naw-Rúz, 21 March). The table's values do not match the Badí' calendar.
- **Seleucid** — the table reads month 3 on December dates; the Babylonian/Macedonian calendar is lunisolar
  and does not align this way.
- **Zoroastrian** — vague-year drift; no fixed offset reproduces the table.
- **Kali Yuga**, **Star Trek stardate** — lunisolar / fuzzy conventions with no single agreed algorithm.
