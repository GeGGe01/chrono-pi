# Changelog

## [1.1.0](https://github.com/GeGGe01/chrono-pi/compare/chrono-pi-v1.0.0...chrono-pi-v1.1.0) (2026-08-25)


### Features

* **sync:** implement idempotent Google Calendar sync ([71c8098](https://github.com/GeGGe01/chrono-pi/commit/71c80988a4b6a7cf48581dde4e9b3cdf0ff36be7))


### Bug Fixes

* **ci:** CWE-674 CVE-2026-33532 ([eaa6cb2](https://github.com/GeGGe01/chrono-pi/commit/eaa6cb25975c6529e4a98ad9efc6d3a22f555085))

## 1.0.0 (2026-06-11)


### Features

* **data:** add artifact zod schemas and output types ([58210c0](https://github.com/GeGGe01/chrono-pi/commit/58210c05c0386d96cbfd129344fe36c9b099fdaa))
* **data:** add the artifact generate script ([bb159d0](https://github.com/GeGGe01/chrono-pi/commit/bb159d04b55840c98f79ca38ac4d86f72615caf3))
* **data:** add validated loaders for the committed artifacts ([8c29110](https://github.com/GeGGe01/chrono-pi/commit/8c29110d932a37cb4b2f2ba4576f428e7d3eb9b2))
* **data:** wire chrono-pi-data to the engine with generate tooling ([7eb2163](https://github.com/GeGGe01/chrono-pi/commit/7eb216349b309a0e8a1d820668b760ae5e618c78))
* **engine:** add arithmetic calendars holocene, unix, and julian ([4fb1a4d](https://github.com/GeGGe01/chrono-pi/commit/4fb1a4d0bd1cc864ff0da04f0a54fb98fc189a70))
* **engine:** add assyrian, armenian, and roman calendars ([f175694](https://github.com/GeGGe01/chrono-pi/commit/f1756940991f2e92226fb39237299180f0eb6514))
* **engine:** add calendar registry and Calendar interface ([585889b](https://github.com/GeGGe01/chrono-pi/commit/585889bceb7c0c54ae5e14380435786fd695c6e6))
* **engine:** add coptic, ethiopic, and indian calendars ([af51c48](https://github.com/GeGGe01/chrono-pi/commit/af51c48036a0361089691893eaf3a0ac5a102648))
* **engine:** add Julian Day Number conversions and day iterator ([4531e10](https://github.com/GeGGe01/chrono-pi/commit/4531e10f783d7007804f82eeb88c1d271545befa))
* **engine:** add reckoning registry and Reckoning interface ([b78cf53](https://github.com/GeGGe01/chrono-pi/commit/b78cf539031841ea60cd1fd8330a94e3b098166a))
* **engine:** add standard canonical reckonings ([362d170](https://github.com/GeGGe01/chrono-pi/commit/362d170af5a9547fa452fa725750b8f36da1fa2f))
* **engine:** add Temporal-backed seed calendars ([9107254](https://github.com/GeGGe01/chrono-pi/commit/910725453857526453f5476c64656ebda6e6c25e))
* **engine:** add the buddhist (Thai) and minguo calendars ([28f9c77](https://github.com/GeGGe01/chrono-pi/commit/28f9c77068a435778ccda6b8250248b06646e621))
* **engine:** add the discordian calendar (novelty) ([541d18f](https://github.com/GeGGe01/chrono-pi/commit/541d18f1dc7255070f4ea971f514a0976527290a))
* **engine:** add the japanese calendar with an era-year reckoning ([da0ad0a](https://github.com/GeGGe01/chrono-pi/commit/da0ad0a004a8d7e8d31b2912389b247e9b4a6400))
* **engine:** add the julian-period and mjd calendars ([213242d](https://github.com/GeGGe01/chrono-pi/commit/213242d20648a6b2f88328b9ca85b58c3763620c))
* **engine:** add the perfect-day scanner ([c158090](https://github.com/GeGGe01/chrono-pi/commit/c158090326fc42ee17fd28b4e77d4cc6fca2176b))
* **engine:** add the π-instant clock extension ([164d3e6](https://github.com/GeGGe01/chrono-pi/commit/164d3e6bcdf77615e52b8b444a64dcbe35460e7a))
* **engine:** add window collision detection ([fe0b668](https://github.com/GeGGe01/chrono-pi/commit/fe0b668e31d87ebfa8abed9664740d7b243ec027))
* **engine:** add π digit string and depth matcher ([3a47e1c](https://github.com/GeGGe01/chrono-pi/commit/3a47e1c8be6bcda8163b04c8ef017d4aa133a17c))
* **engine:** expose the public engine entry point ([14a683d](https://github.com/GeGGe01/chrono-pi/commit/14a683da85f43da3c09157a34e98484939da74df))
* **engine:** extend the JDN axis to deep-time years ([7bb9596](https://github.com/GeGGe01/chrono-pi/commit/7bb959665a25f069b5f4b4b389323e0d8000b096))
* **engine:** generalise date reckonings to per-calendar instances ([c29e11f](https://github.com/GeGGe01/chrono-pi/commit/c29e11f1d35695eb9aec7b17dca73368131da6d0))
* **engine:** make the unix reckoning instant-aware ([f733e1b](https://github.com/GeGGe01/chrono-pi/commit/f733e1b9449fdf7234b1673a6354e8df9f0ee6f7))
* **engine:** swap islamic to arithmetic tabular civil for the deep future ([4b5d620](https://github.com/GeGGe01/chrono-pi/commit/4b5d6209cdde5c5002c903681dc6bd94fb739638))
* **engine:** validate hebrew, persian, and islamic against the oracle ([243533c](https://github.com/GeGGe01/chrono-pi/commit/243533c407da2ce9b0c7d71d9b1d6734a78f9fb6))
* **engine:** verify the historical and deep-future collision witnesses ([e8e2e92](https://github.com/GeGGe01/chrono-pi/commit/e8e2e9231f421ccc9e44f5924ed84d31c27f0006))
* **site:** add the layout, tokens, and five section components ([dde9ef7](https://github.com/GeGGe01/chrono-pi/commit/dde9ef7bc871bd0999bf7b14ff06fef947ef6ff3))
* **site:** add the pure view-derivation layer ([74f2f33](https://github.com/GeGGe01/chrono-pi/commit/74f2f33bc26a0f7ae5f9ee1fd3deccdc6bee1fff))
* **site:** compose the page from the five sections ([8a0c088](https://github.com/GeGGe01/chrono-pi/commit/8a0c088529624279d85d9a54fec4bca5d1689fc9))
* **site:** scaffold the Astro static site ([0d5c02d](https://github.com/GeGGe01/chrono-pi/commit/0d5c02d14ca0d5b1e22cfa813544050ce97d6568))


### Bug Fixes

* **data:** require two independent calendars in collisionSchema ([202d0e7](https://github.com/GeGGe01/chrono-pi/commit/202d0e7d66df347464826cb8d4c3978f1a2a7638))


### Documentation

* add agent loop guide ([c1466c7](https://github.com/GeGGe01/chrono-pi/commit/c1466c766b8d632e28658c07b0f632ca2418741c))
* add bootstrap import runbook ([bfcc246](https://github.com/GeGGe01/chrono-pi/commit/bfcc2462f0e579d1365176a7432c0767dd158ada))
* add ci/cd plan ([59fac1e](https://github.com/GeGGe01/chrono-pi/commit/59fac1e863b9c47b7f3ac69c576de9e1330531cf))
* add claude code project guidance ([08c21bb](https://github.com/GeGGe01/chrono-pi/commit/08c21bb715a11a36756db408e7ef9f5b5fa17d79))
* add code of conduct ([f23e1a1](https://github.com/GeGGe01/chrono-pi/commit/f23e1a1a201bfef1c16785418d3a954a8a011ce6))
* add contributing guide ([661de04](https://github.com/GeGGe01/chrono-pi/commit/661de045966fb5dd74e347426e9e0edc6c808299))
* add conventions reference and update CLAUDE.md for the built engine ([95d8d02](https://github.com/GeGGe01/chrono-pi/commit/95d8d0232906b971abe1049dfaccee6986d27c70))
* add engineering handbook ([f446f4f](https://github.com/GeGGe01/chrono-pi/commit/f446f4f76e20a95174b547e76bd16979d3a747f2))
* add phase 2 convention-pinning and regression design ([36a9469](https://github.com/GeGGe01/chrono-pi/commit/36a94697d7af4a74f0cb006ba4fabc7ddd1f81be))
* add phase 3 collisions design ([7ed0050](https://github.com/GeGGe01/chrono-pi/commit/7ed0050397b48ef0d4403998fe9e09979c22612c))
* add phase 4 data output design ([c7cc1fc](https://github.com/GeGGe01/chrono-pi/commit/c7cc1fc5a5399b32ef3df8ccc367363a62371975))
* add phase 5 site design ([86b3559](https://github.com/GeGGe01/chrono-pi/commit/86b3559e40297d7f21cb720d284cfff59e0c60a4))
* add project readme ([4c436c6](https://github.com/GeGGe01/chrono-pi/commit/4c436c614f12c556d8f9a034e4d7f20e5fa34652))
* add security policy ([64e6101](https://github.com/GeGGe01/chrono-pi/commit/64e6101db125497b29bb1508ea03d1e89cac60b7))
* add the reference table oracle (1831-2226) ([6cd8184](https://github.com/GeGGe01/chrono-pi/commit/6cd8184e35555cc5ef456e7f802b720ae3335ead))
* drop interim conventions now that 05-07 exist ([6067cc2](https://github.com/GeGGe01/chrono-pi/commit/6067cc2ad6fc9f4b136897650ea1da9ebdae91a4))
* record the data package and mark phase 4 implemented ([36e8fd1](https://github.com/GeGGe01/chrono-pi/commit/36e8fd17904f32d03942960f529d6874630d6db1))
* **site:** add the Cloudflare Pages deploy guide and record phase 5 ([4b353f6](https://github.com/GeGGe01/chrono-pi/commit/4b353f680abc1626c3e18a79cd025f869d1f62b0))
* update index paths to .github and docs layout ([900cda9](https://github.com/GeGGe01/chrono-pi/commit/900cda954fec03960fcdd829e81214feae0826e3))
