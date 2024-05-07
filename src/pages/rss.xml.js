import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export async function GET(context) {
	return rss({
		title: "Alan's Notes",
		description: '',
		site: context.site,
		items: await pagesGlobToRssItems(import.meta.glob('./posts/*.{md,mdx}')),
		stylesheet: './rss/styles.xsl',
		customData: `<language>pt-br</language>`
	});
}
