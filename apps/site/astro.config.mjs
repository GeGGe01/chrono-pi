import { defineConfig } from 'astro/config';

// Static site at pi.gegge.se, built from the committed JSON artifacts. Output is static (the default);
// the only client-side code is the countdown island.
export default defineConfig({
  site: 'https://pi.gegge.se',
});
