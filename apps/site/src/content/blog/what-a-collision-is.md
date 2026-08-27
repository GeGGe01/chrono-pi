---
title: What a π-collision actually is
description: A day on which two independent calendars both read the digits of π — and why chrono-pi finds them by arithmetic, not by scanning.
pubDate: 2026-08-27
order: 1
---

A **π-day** is a day whose calendar fields, read in order and stripped of separators, spell the
digits of π. In the American middle-endian reading, `3/14/15` becomes `31415` — the first five
digits. A **collision** is rarer: a single day on which *two or more independent calendars* each
read π at once.

chrono-pi does not look for these by walking the calendar day by day. Each `(calendar, reckoning)`
pair compiles to a **period** `P` and a set of **active residues** `A ⊆ Z/P` — the days, modulo one
supercycle, on which that calendar reads π. Two calendars collide exactly where their residue classes
are simultaneously satisfiable, which the Chinese Remainder Theorem resolves in closed form. The
witnesses are then enumerated arithmetically, `t = t₀ + m·L`, over whatever range you ask for — even
ranges millions of years out that no scan could ever afford.

That is the whole trick, and the rest of this blog is about the mathematics that makes it exact: the
**Kalenderkrockssaten** (the collision theorem), the **Tågrälssatsen** (the witness-class algebra),
and the **Tibiasatsen** (the dynamic layer for calendars that refuse to be periodic).
