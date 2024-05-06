import { MarkdownInstance } from 'astro';

export const formatDate = (pubDate: string) => {
	var options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		timeZone: 'UTC'
	};

	return new Date(pubDate).toLocaleDateString('pt-BR', options);
};

export const sortPostsByDate = (a: MarkdownInstance<any>, b: MarkdownInstance<any>) => {
	const pubDateA = new Date(a.frontmatter.pubDate);
	const pubDateB = new Date(b.frontmatter.pubDate);
	if (pubDateA < pubDateB) {
		return 1;
	}
	if (pubDateA > pubDateB) {
		return -1;
	}
	return 0;
};
