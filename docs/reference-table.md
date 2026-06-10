# Reference table — cross-calendar perfect pi-days, 1831–2226

Status: active

This is the engine's correctness oracle for Phase 2. It is reproduced verbatim from the cross-calendar
pi-day taxonomy compiled by **The Crash** on Flashback (post 95150747), preserved here under CC BY 4.0
with attribution. The engine must reproduce every canonical row; disagreements are recorded in the
variance ledger, never silently resolved.

Columns: **Datum** (Gregorian ISO date — the physical day) · **Format** (reckoning field order) ·
**Kalender** · **Sekvens** (the π digits read, colon-separated, followed by the calendar's full year).
`=` rows are collisions: the same physical day read by another independent calendar.

```
Datum       Format    Kalender     Sekvens

1831-04-27  ÅÅ-M-DD   Juliansk     31:4:15 1831
1838-12-24  ÅÅ-M-DD   Etiopisk     31:4:15 1831
            =         Koptisk      31:4:15 1531
1852-07-06  ÅÅ-M-DD   Persisk      31:4:15 1231
1854-12-05  MM-DD-ÅÅ  Judisk       3:14:15 5615
1862-03-26  MM-DD-ÅÅ  Romersk      3:14:15 2615
1865-03-14  MM-DD-ÅÅ  Assyrisk     3:14:15 6615
1866-03-14  MM-DD-ÅÅ  Armenisk     3:14:15 1315
1871-01-08  ÅÅ-M-DD   Judisk       31:4:15 5631
1872-03-14  MM-DD-ÅÅ  Thailänd.    3:14:15 2415
1875-07-08  ÅÅ-M-DD   Bahá'í       31:4:15 31
1878-04-16  MM-DD-ÅÅ  Kinesisk     3:14:15 15
1878-04-27  ÅÅ-M-DD   Romersk      31:4:15 2631
1882-03-14  MM-DD-ÅÅ  Japansk      3:14:15 15
1882-04-15  ÅÅ-M-DD   Armenisk     31:4:15 1331
1884-05-28  MM-DD-ÅÅ  Nanakshahi   3:14:15 415
1888-04-15  ÅÅ-M-DD   Thailänd.    31:4:15 2431
1893-06-04  MM-DD-ÅÅ  Indisk       3:14:15 1815
1897-08-13  MM-DD-ÅÅ  Islamisk     3:14:15 1315
1898-04-15  ÅÅ-M-DD   Japansk      31:4:15 31
1898-11-23  MM-DD-ÅÅ  Koptisk      3:14:15 1615
1900-06-29  ÅÅ-M-DD   Nanakshahi   31:4:15 431
1902-03-14  MM-DD-ÅÅ  Jul. Period  3:14:15 6615
1903-12-04  MM-DD-ÅÅ  Seleukid.    3:14:15 2215
1906-12-05  MM-DD-ÅÅ  Fransk R.    3:14:15 115
1909-07-06  ÅÅ-M-DD   Indisk       31:4:15 1831
1913-03-24  ÅÅ-M-DD   Islamisk     31:4:15 1331
1914-12-24  ÅÅ-M-DD   Koptisk      31:4:15 1631
1915-03-14  MM-DD-ÅÅ  Gregorian.   3:14:15 1915
            =         Holocen      3:14:15 11915
1915-03-27  MM-DD-ÅÅ  Juliansk     3:14:15 1915
1918-04-15  ÅÅ-M-DD   Jul. Period  31:4:15 6631
1919-04-15  ÅÅ-M-DD   Seleukid.    31:4:15 2231
1923-01-04  ÅÅ-M-DD   Fransk R.    31:4:15 131
1923-03-23  MM-DD-ÅÅ  Etiopisk     3:14:15 1915
1926-03-14  MM-DD-ÅÅ  Juche/Ming.  3:14:15 15
            =         Japansk      3:14:15 15
1931-04-15  ÅÅ-M-DD   Gregorian.   31:4:15 1931
            =         Holocen      31:4:15 11931
1931-04-28  ÅÅ-M-DD   Juliansk     31:4:15 1931
1936-06-04  MM-DD-ÅÅ  Persisk      3:14:15 1315
1938-04-05  MM-DD-ÅÅ  Kinesisk     3:14:15 15
1938-12-24  ÅÅ-M-DD   Etiopisk     31:4:15 1931
1940-03-14  MM-DD-ÅÅ  Japansk      3:14:15 15
1942-04-15  ÅÅ-M-DD   Juche/Ming.  31:4:15 31
1944-11-22  MJD-Format Astro-Met.  31415.926...⁵
1946-03-14  MM-DD-ÅÅ  Zoroastr.    3:14:15 1315
1952-07-06  ÅÅ-M-DD   Persisk      31:4:15 1331
1954-12-09  MM-DD-ÅÅ  Judisk       3:14:15 5715
1956-04-15  ÅÅ-M-DD   Japansk      31:4:15 31
1958-08-01  MM-DD-ÅÅ  Bahá'í       3:14:15 115
1962-03-27  MM-DD-ÅÅ  Romersk      3:14:15 2715
1963-04-15  ÅÅ-M-DD   Zoroastr.    31:4:15 1331
1965-03-14  MM-DD-ÅÅ  Assyrisk     3:14:15 6715
1966-03-14  MM-DD-ÅÅ  Armenisk     3:14:15 1415
1971-01-12  ÅÅ-M-DD   Judisk       31:4:15 5731
1972-03-14  MM-DD-ÅÅ  Thailänd.    3:14:15 2515
1975-07-08  ÅÅ-M-DD   Bahá'í       31:4:15 131
1975-10-28  ÅÅÅÅ-S-D  Discordia.   3141:5:9 3141²
1978-04-28  ÅÅ-M-DD   Romersk      31:4:15 2731
1981-04-15  ÅÅ-M-DD   Assyrisk     31:4:15 6731
1982-04-15  ÅÅ-M-DD   Armenisk     31:4:15 1431
1984-05-28  MM-DD-ÅÅ  Nanakshahi   3:14:15 515
1988-04-15  ÅÅ-M-DD   Thailänd.    31:4:15 2531
1993-06-04  MM-DD-ÅÅ  Indisk       3:14:15 1915
1994-08-22  MM-DD-ÅÅ  Islamisk     3:14:15 1415
1998-04-10  MM-DD-ÅÅ  Kinesisk     3:14:15 15
1998-11-23  MM-DD-ÅÅ  Koptisk      3:14:15 1715
2000-06-29  ÅÅ-M-DD   Nanakshahi   31:4:15 531
2002-03-14  MM-DD-ÅÅ  Jul. Period  3:14:15 6715
2003-03-14  MM-DD-ÅÅ  Japansk      3:14:15 15
2003-12-08  MM-DD-ÅÅ  Seleukid.    3:14:15 2315
2006-12-05  MM-DD-ÅÅ  Fransk R.    3:14:15 215
2009-07-06  ÅÅ-M-DD   Indisk       31:4:15 1931
2010-03-31  ÅÅ-M-DD   Islamisk     31:4:15 1431
2014-12-24  ÅÅ-M-DD   Koptisk      31:4:15 1731
2015-03-14  MM-DD-ÅÅ  Gregorian.   3:14:15 2015
            =         Holocen      3:14:15 12015
2015-03-27  MM-DD-ÅÅ  Juliansk     3:14:15 2015
2018-04-15  ÅÅ-M-DD   Jul. Period  31:4:15 6731
2019-04-15  ÅÅ-M-DD   Japansk      31:4:15 31
            =         Seleukid.    31:4:15 2331
2023-01-04  ÅÅ-M-DD   Fransk R.    31:4:15 231
2023-03-23  MM-DD-ÅÅ  Etiopisk     3:14:15 2015
2026-03-14  MM-DD-ÅÅ  Juche/Ming.  3:14:15 115
2031-04-15  ÅÅ-M-DD   Gregorian.   31:4:15 2031
            =         Holocen      31:4:15 12031
2031-04-28  ÅÅ-M-DD   Juliansk     31:4:15 2031
2033-03-14  MM-DD-ÅÅ  Japansk      3:14:15 15
2036-06-04  MM-DD-ÅÅ  Persisk      3:14:15 1415
2038-12-24  ÅÅ-M-DD   Etiopisk     31:4:15 2031
2042-04-15  ÅÅ-M-DD   Juche/Ming.  31:4:15 131
2046-03-14  MM-DD-ÅÅ  Zoroastr.    3:14:15 1415
2049-04-15  ÅÅ-M-DD   Japansk      31:4:15 31
2052-07-06  ÅÅ-M-DD   Persisk      31:4:15 1431
2054-06-01  Stardate  Star Trek    31415.92653589...³
2054-12-14  MM-DD-ÅÅ  Judisk       3:14:15 5815
2058-04-16  MM-DD-ÅÅ  Kinesisk     3:14:15 15
2058-08-01  MM-DD-ÅÅ  Bahá'í       3:14:15 215
2062-03-27  MM-DD-ÅÅ  Romersk      3:14:15 2815
2063-04-15  ÅÅ-M-DD   Zoroastr.    31:4:15 1431
2065-03-14  MM-DD-ÅÅ  Assyrisk     3:14:15 6815
2066-03-14  MM-DD-ÅÅ  Armenisk     3:14:15 1515
2069-07-21  Timestmp  Unix-tid     3141592653,589⁴
2071-01-17  ÅÅ-M-DD   Judisk       31:4:15 5831
2072-03-14  MM-DD-ÅÅ  Thailänd.    3:14:15 2615
2075-07-08  ÅÅ-M-DD   Bahá'í       31:4:15 231
2075-10-28  ÅÅÅÅ-S-D  Discordia.   3241:5:9 3241²
2078-04-28  ÅÅ-M-DD   Romersk      31:4:15 2831
2081-04-15  ÅÅ-M-DD   Assyrisk     31:4:15 6831
2082-04-15  ÅÅ-M-DD   Armenisk     31:4:15 1531
2084-05-28  MM-DD-ÅÅ  Nanakshahi   3:14:15 615
2088-04-15  ÅÅ-M-DD   Thailänd.    31:4:15 2631
2091-08-29  MM-DD-ÅÅ  Islamisk     3:14:15 1515
2093-06-04  MM-DD-ÅÅ  Indisk       3:14:15 2015
2098-11-23  MM-DD-ÅÅ  Koptisk      3:14:15 1815
2100-06-29  ÅÅ-M-DD   Nanakshahi   31:4:15 631
2102-03-14  MM-DD-ÅÅ  Jul. Period  3:14:15 6815
2103-12-12  MM-DD-ÅÅ  Seleukid.    3:14:15 2415
2106-12-05  MM-DD-ÅÅ  Fransk R.    3:14:15 315
2107-04-05  ÅÅ-M-DD   Islamisk     31:4:15 1531
2109-07-06  ÅÅ-M-DD   Indisk       31:4:15 2031
2112-01-05  ÅÅÅ-M-D   Kali Yuga    314:1:5 5314
2114-12-24  ÅÅ-M-DD   Koptisk      31:4:15 1831
2115-03-14  MM-DD-ÅÅ  Gregorian.   3:14:15 2115
            =         Holocen      3:14:15 12115
2115-03-28  MM-DD-ÅÅ  Juliansk     3:14:15 2115
2118-04-06  MM-DD-ÅÅ  Kinesisk     3:14:15 15
2118-04-15  ÅÅ-M-DD   Jul. Period  31:4:15 6831
2119-04-15  ÅÅ-M-DD   Seleukid.    31:4:15 2431
2123-01-04  ÅÅ-M-DD   Fransk R.    31:4:15 331
2123-03-23  MM-DD-ÅÅ  Etiopisk     3:14:15 2115
2126-03-14  MM-DD-ÅÅ  Juche/Ming.  3:14:15 215
2131-04-15  ÅÅ-M-DD   Gregorian.   31:4:15 2131
            =         Holocen      31:4:15 12131
2131-04-29  ÅÅ-M-DD   Juliansk     31:4:15 2131
2136-06-04  MM-DD-ÅÅ  Persisk      3:14:15 1515
2138-12-24  ÅÅ-M-DD   Etiopisk     31:4:15 2131
2142-04-15  ÅÅ-M-DD   Juche/Ming.  31:4:15 231
2146-03-14  MM-DD-ÅÅ  Zoroastr.    3:14:15 1515
2152-07-06  ÅÅ-M-DD   Persisk      31:4:15 1531
2154-12-11  MM-DD-ÅÅ  Judisk       3:14:15 5915
2158-08-01  MM-DD-ÅÅ  Bahá'í       3:14:15 315
2162-03-27  MM-DD-ÅÅ  Romersk      3:14:15 2915
2163-04-15  ÅÅ-M-DD   Zoroastr.    31:4:15 1531
2165-03-14  MM-DD-ÅÅ  Assyrisk     3:14:15 6915
2166-03-14  MM-DD-ÅÅ  Armenisk     3:14:15 1615
2171-01-13  ÅÅ-M-DD   Judisk       31:4:15 5931
2172-03-14  MM-DD-ÅÅ  Thailänd.    3:14:15 2715
2175-07-08  ÅÅ-M-DD   Bahá'í       31:4:15 331
2175-10-28  ÅÅÅÅ-S-D  Discordia.   3341:5:9 3341²
2178-04-26  MM-DD-ÅÅ  Kinesisk     3:14:15 15
2178-04-28  ÅÅ-M-DD   Romersk      31:4:15 2931
2181-04-15  ÅÅ-M-DD   Assyrisk     31:4:15 6931
2182-04-15  ÅÅ-M-DD   Armenisk     31:4:15 1631
2184-05-28  MM-DD-ÅÅ  Nanakshahi   3:14:15 715
2188-04-15  ÅÅ-M-DD   Thailänd.    31:4:15 2731
2188-09-05  MM-DD-ÅÅ  Islamisk     3:14:15 1615
2193-06-04  MM-DD-ÅÅ  Indisk       3:14:15 2115
2198-11-23  MM-DD-ÅÅ  Koptisk      3:14:15 1915
2200-06-29  ÅÅ-M-DD   Nanakshahi   31:4:15 731
2202-03-14  MM-DD-ÅÅ  Jul. Period  3:14:15 6915
2203-12-14  MM-DD-ÅÅ  Seleukid.    3:14:15 2515
2204-04-12  ÅÅ-M-DD   Islamisk     31:4:15 1631
2206-12-05  MM-DD-ÅÅ  Fransk R.    3:14:15 415
2209-07-06  ÅÅ-M-DD   Indisk       31:4:15 2131
2212-09-15  ÅÅÅ-DD-M  Kali Yuga    314:15:9 5314
2214-12-24  ÅÅ-M-DD   Koptisk      31:4:15 1931
2215-03-14  MM-DD-ÅÅ  Gregorian.   3:14:15 2215
            =         Holocen      3:14:15 12215
2215-03-29  MM-DD-ÅÅ  Juliansk     3:14:15 2215
2218-04-15  ÅÅ-M-DD   Jul. Period  31:4:15 6931
2219-04-15  ÅÅ-M-DD   Seleukid.    31:4:15 2531
2223-01-04  ÅÅ-M-DD   Fransk R.    31:4:15 431
2223-03-23  MM-DD-ÅÅ  Etiopisk     3:14:15 2215
2226-03-14  MM-DD-ÅÅ  Juche/Ming.  3:14:15 315
```

## π-instant clocks

The standard pi-phase clock, unless a footnote says otherwise: **09:26:53,589**.

- **²** Discordian — exact clock **02:06:53,589**
- **³** Star Trek stardate — exact clock **06:53:58,900**
- **⁴** Unix time — exact clock **00:37:33,589**
- **⁵** MJD (Modified Julian Date) — astronomical time matrix; an unbroken sequence in spacetime at **midnight**

## Notes for the engine

- The `Sekvens` column shows the π reading colon-separated (`3:14:15` = depth 5, `31:4:15` = the inverted
  depth-5 reading, `3141:5:9` = depth 6) followed by the calendar's full year, for disambiguation.
- `Holocen` co-reads with `Gregorian` (year + 10000) but is **not** an independent collision gear.
- `Juche/Ming.` (Juche year = Minguo year = Gregorian − 1911) co-reads with `Japansk` on 1926-03-14.
- Several "year-offset" calendars are base-aligned to different calendars: Assyrisk/Armenisk are
  Gregorian-aligned, Romersk/AUC is Julian-aligned. Seleukid., Zoroastr. and others have their own
  month structure — pinned empirically against this table, recorded in `docs/conventions.md`.
