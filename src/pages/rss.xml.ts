import { AppConfig } from '@/utils/AppConfig';
import rss from '@astrojs/rss';
import { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const { site_name, locale_region, description } = AppConfig;

export const GET: APIRoute = async (context) => {
	const posts = await getCollection('blog');

	return rss({
		title: site_name,
		description: description,
		site: context.site!,
		items: posts.map(({ data: post, slug }) => ({
			title: post.title,
			link: `/posts/${slug}`,
			pubDate: post.pubDate,
			description: post.description,
			categories: post.tags
		})),
		stylesheet: './rss/styles.xsl',
		customData: `<language>${locale_region}</language>`
	});
};
