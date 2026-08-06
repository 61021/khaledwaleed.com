#!/usr/bin/env bun
/**
 * Generate the PNG icons that SVG can't cover:
 *   - apple-touch-icon.png (180×180, iOS home screen ignores SVG)
 *   - icon-192.png / icon-512.png (web app manifest)
 * The mark is the site wordmark — "KW" in Playfair Display gold on
 * the home room's night blue — matching the header and the OG cards.
 * Run after changing branding: bun run scripts/generate-icons.ts
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

const OUT = path.resolve('static');

const playfair = readFileSync(
	path.resolve(
		'node_modules/@fontsource/playfair-display/files/playfair-display-latin-400-normal.woff'
	)
);

const node = {
	type: 'div',
	props: {
		style: {
			width: '512px',
			height: '512px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			background: 'linear-gradient(180deg, #0a1220 0%, #131d34 100%)',
			fontFamily: '"Playfair Display", serif',
			fontStyle: 'normal',
			fontSize: '268px',
			color: '#d9b66c'
		},
		children: 'KW'
	}
};

const svg = await satori(node, {
	width: 512,
	height: 512,
	fonts: [{ name: 'Playfair Display', data: playfair, weight: 400, style: 'normal' }]
});
const master = new Resvg(svg).render().asPng();

const targets = [
	{ file: 'apple-touch-icon.png', size: 180 },
	{ file: 'icon-192.png', size: 192 },
	{ file: 'icon-512.png', size: 512 }
];

for (const t of targets) {
	await sharp(master).resize(t.size, t.size).png().toFile(path.join(OUT, t.file));
	console.log(`${t.file} (${t.size}×${t.size})`);
}
