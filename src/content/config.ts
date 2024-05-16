import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		pubDate: z.date(),
		description: z.string(),
		excerpt: z.string().optional(),
		tags: z.array(z.string()),
		image: z.object({ src: z.string(), alt: z.string() }).optional()
	})
});

export const collections = {
	blog: blogCollection
};
