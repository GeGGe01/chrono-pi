import { defineConfig } from 'astro/config';

// Static site deployed to Cloudflare at typ.gegge.org/chrono-pi, built from the committed JSON
// artifacts. Output is static (the default). NOTE: the deploy is path-based (a subpath, not a
// subdomain) — a `base: '/chrono-pi'` must be added here in lockstep with the Cloudflare routing
// (see apps/site/README.md and docs/REBUILD.md); deferred to the deploy slice so the two stay in sync.
export default defineConfig({
  site: 'https://typ.gegge.org',
});
