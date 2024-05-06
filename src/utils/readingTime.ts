import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

export function remarkReadingTime() {
	return function (tree: any, { data }: any) {
		const textOnPage = toString(tree);
		const readingTime = getReadingTime(textOnPage);
		const minutes = Math.ceil(readingTime.minutes);
		data.astro.frontmatter.minutesRead = `${minutes} min${minutes > 1 ? 's' : ''}. de leitura`;
	};
}
