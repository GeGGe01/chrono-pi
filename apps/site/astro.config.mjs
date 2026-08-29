import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

// Static site deployed to Cloudflare at typ.gegge.org/chrono-pi, built from the committed JSON
// artifacts. Output is static (the default). NOTE: the deploy is path-based (a subpath, not a
// subdomain) — a `base: '/chrono-pi'` must be added here in lockstep with the Cloudflare routing
// (see apps/site/README.md and docs/REBUILD.md); deferred to the deploy slice so the two stay in sync.
//
// Blog authoring: Markdown + MDX, with LaTeX via remark-math → rehype-katex (KaTeX renders to HTML at
// build time and ships its own vendored fonts — no CDN, no client-side math runtime). MDX lets a post
// embed components (e.g. a future <Mermaid/> diagram island) without changing this pipeline.
export default defineConfig({
  site: 'https://typ.gegge.org',
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
