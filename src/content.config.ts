import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      cover: image(),
      coverAlt: z.string(),
      category: z.string(),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      summary: z.string(),
      client: z.string(),
      industry: z.string(),
      budget: z.string().optional(),
      date: z.coerce.date().optional(),
      stack: z.array(z.string()),
      tasks: z.string(),
      screenshot: image(),
      screenshotAlt: z.string(),
      order: z.number(),
    }),
});

const item = z.object({ title: z.string(), text: z.string() });

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    // titre affiché dans Google (balise <title>) et titre principal de la page (H1), construits autour des mots-clés
    seoTitle: z.string(),
    h1: z.string(),
    // service mis en avant (badge « Service phare »)
    featured: z.boolean().default(false),
    order: z.number(),
    icon: z.string(),
    short: z.string(),
    tagline: z.string(),
    description: z.string(),
    headline: z.string(),
    features: z.array(item),
    featuresTitle: z.string().optional(),
    steps: z.array(item),
    // questions fréquentes propres au service (remplacent celles du site sur cette page)
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  }),
});

export const collections = { blog, projects, services };
