import { OpenGraphImage } from '@/components/OpenGraphImage';
import { renderComponentToImage } from '@/utils/image';
import { getPostStaticPaths } from '@/utils/post-paths';
import { APIRoute } from 'astro';
import { getEntryBySlug } from 'astro:content';

export const getStaticPaths = getPostStaticPaths;

export const GET: APIRoute = async function GET({ params }) {
	const post = await getEntryBySlug('blog', params.slug!);

	const png = await renderComponentToImage(
		{
			type: OpenGraphImage,
			props: { post }
		} as any,
		{
			width: 1200,
			height: 630
		}
	);

	return new Response(png, {
		headers: {
			'Content-Type': 'image/png'
		}
	});
};
