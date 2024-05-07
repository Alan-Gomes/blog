import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import {
	pluginCollapsibleSections,
	pluginCollapsibleSectionsTexts
} from '@expressive-code/plugin-collapsible-sections';
import { pluginFramesTexts } from '@expressive-code/plugin-frames';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import expressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';
import { remarkReadingTime } from './src/utils/readingTime';

/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
const expressiveCodeOptions = {
	themes: ['material-theme-ocean'],
	plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
	defaultLocale: 'pt-BR',
	defaultProps: {
		wrap: true
	}
};

pluginFramesTexts.overrideTexts('pt-BR', {
	copyButtonTooltip: 'Copiar',
	copyButtonCopied: 'Copiado!'
});

pluginCollapsibleSectionsTexts.overrideTexts('pt-BR', {
	collapsedLines: '{lineCount} {lineCount;1=linha omitida;linhas omitidas}'
});

// https://astro.build/config
export default defineConfig({
	site: 'https://alangomes.dev/',
	markdown: {
		syntaxHighlight: false,
		remarkPlugins: [remarkReadingTime]
	},
	integrations: [tailwind(), react(), sitemap(), expressiveCode(expressiveCodeOptions)],
	output: 'static',
	adapter: netlify()
});
