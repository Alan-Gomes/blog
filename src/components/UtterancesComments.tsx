import { useIsDarkMode } from '@/utils/dark-mode';
import { useEffect, useState } from 'react';

interface UtterancesCommentsProps {
	slug: string;
}

export function UtterancesComments({ slug }: UtterancesCommentsProps) {
	const [section, setSection] = useState<HTMLDivElement | null>(null);
	const darkMode = useIsDarkMode();
	const theme = darkMode ? 'github-dark' : 'github-light';

	useEffect(() => {
		if (!section) {
			return;
		}

		const scriptElem = document.createElement('script');
		scriptElem.src = 'https://utteranc.es/client.js';
		scriptElem.async = true;
		scriptElem.crossOrigin = 'anonymous';
		scriptElem.setAttribute('repo', 'Alan-Gomes/blog');
		scriptElem.setAttribute('issue-term', `Post ${slug}`);
		scriptElem.setAttribute('label', 'comentarios');
		scriptElem.setAttribute('theme', theme);
		section.innerHTML = '';
		section.appendChild(scriptElem);
	}, [section]);

	useEffect(() => {
		const iframe = section?.querySelector<HTMLIFrameElement>('.utterances-frame');
		if (iframe) {
			iframe.contentWindow?.postMessage(
				{
					type: 'set-theme',
					theme: theme
				},
				'https://utteranc.es'
			);
		}
	}, [theme]);

	return <section ref={(ref: HTMLDivElement | null) => setSection(ref)} />;
}
