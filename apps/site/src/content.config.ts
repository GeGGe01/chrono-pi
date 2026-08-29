import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

// The blog: essays and the mathematics behind the engine, authored as Markdown/MDX in
// src/content/blog. The glob loader picks up every *.md and *.mdx file; the schema below is the
// contract each post's frontmatter must satisfy (validated at build time). Math renders via KaTeX
// (see astro.config.mjs); the three theorem posts land in #25.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    // Set when a post is the write-up of one of the named Crash theorems — used to badge and order it.
    theorem: z.enum(['kalenderkrockssatsen', 'tagralssatsen', 'tibiasatsen']).optional(),
    // Explicit ordering hint; posts without one fall back to reverse-chronological.
    order: z.number().optional(),
    draft: z.boolean().default(false),
    // Byline + section, surfaced in the Swiss-editorial article header. Author defaults to the site
    // owner; `authorUrl` links the byline (GitHub). `category` is the eyebrow label (e.g. 'Mathematics').
    author: z.string().default('GeGGe'),
    authorUrl: z.string().url().default('https://github.com/GeGGe01'),
    category: z.string().default('Essay'),
  }),
});

export const collections = { blog };
