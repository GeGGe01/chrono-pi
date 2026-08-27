import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

// The blog: essays and the mathematics behind the engine, authored as Markdown in src/content/blog.
// The glob loader picks up every *.md file; the schema below is the contract each post's frontmatter
// must satisfy (validated at build time). Math rendering (MDX/KaTeX) lands in a follow-up (#24); the
// three theorem posts (Kalenderkrockssatsen, Tågrälssatsen, Tibiasatsen) land in #25.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    // Set when a post is the write-up of one of the named Crash theorems — used to badge and order it.
    theorem: z.enum(['kalenderkrockssatsen', 'tagralssatsen', 'tibiasatsen']).optional(),
    // Explicit ordering hint; posts without one fall back to reverse-chronological.
    order: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
