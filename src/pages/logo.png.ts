import { Logo } from '@/components/Logo';
import { renderComponentToImage } from '@/utils/image';
import { APIRoute } from 'astro';

export const GET: APIRoute = async function GET() {
	const png = await renderComponentToImage(
		{
			type: 'div',
			props: {
				style: {
					display: 'flex',
					backgroundColor: 'transparent',
					width: '100%',
					height: '100%',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: '6rem'
				},
				children: { type: Logo, props: {} }
			}
		} as any,
		{
			width: 1000,
			height: 300
		}
	);

	return new Response(png, {
		headers: {
			'Content-Type': 'image/png'
		}
	});
};
