import { getCollection } from 'astro:content';

export async function getPostStaticPaths() {
	const blogEntries = await getCollection('blog');
	return blogEntries.map((entry) => ({
		params: { slug: entry.slug },
		props: { entry }
	}));
}
