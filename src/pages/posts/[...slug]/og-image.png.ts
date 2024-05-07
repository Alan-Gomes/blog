import { OpenGraphImage } from '@/components/OpenGraphImage';
import { APIRoute } from 'astro';
import { getCollection, getEntryBySlug } from 'astro:content';
import fs from 'fs/promises';
import satori from 'satori';
import sharp from 'sharp';

export async function getStaticPaths() {
	const posts = await getCollection('blog');
	return posts.map((post) => ({
		params: { slug: post.slug },
		props: post
	}));
}

const fontData = await fs.readFile(
	'node_modules/@fontsource/ia-writer-mono/files/ia-writer-mono-latin-400-normal.woff'
);

export const GET: APIRoute = async function GET({ params }) {
	const post = await getEntryBySlug('blog', params.slug!);

	const svg = await satori(
		{
			type: OpenGraphImage,
			props: { post }
		} as any,
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					name: 'iA Writer Mono',
					data: fontData,
					weight: 400,
					style: 'normal'
				}
			]
		}
	);

	const png = await sharp(Buffer.from(svg)).png().toBuffer();

	return new Response(png, {
		headers: {
			'Content-Type': 'image/png'
		}
	});
};
