import fs from 'fs/promises';
import { ReactNode } from 'react';
import satori from 'satori';
import sharp from 'sharp';

const fontData = await fs.readFile(
	'node_modules/@fontsource/ia-writer-mono/files/ia-writer-mono-latin-400-normal.woff'
);

export async function renderComponentToImage(
	element: ReactNode,
	options: { width: number; height: number }
) {
	const svg = await satori(element, {
		width: options.width,
		height: options.height,
		fonts: [
			{
				name: 'iA Writer Mono',
				data: fontData,
				weight: 400,
				style: 'normal'
			}
		]
	});

	const png = await sharp(Buffer.from(svg)).png().toBuffer();

	return png;
}
