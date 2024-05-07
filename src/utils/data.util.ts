import { CollectionEntry } from 'astro:content';

export const formatDate = (pubDate: Date) => {
	var options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		timeZone: 'UTC'
	};

	return pubDate.toLocaleDateString('pt-BR', options);
};

export const sortPostsByDate = (a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) => {
	const pubDateA = new Date(a.data.pubDate);
	const pubDateB = new Date(b.data.pubDate);
	if (pubDateA < pubDateB) {
		return 1;
	}
	if (pubDateA > pubDateB) {
		return -1;
	}
	return 0;
};
