#!/usr/bin/env node
/**
 * Generate the site icons from the one wordmark: "KW" in Playfair
 * Display gold on the home room's night blue, matching the header
 * and the OG cards.
 *   - favicon.svg (browser tabs)
 *   - apple-touch-icon.png (180×180, iOS home screen ignores SVG)
 *   - icon-192.png / icon-512.png (web app manifest)
 * The favicon wears a small-size cut: SemiBold with tightened
 * tracking so the hairlines survive 16px, nudged by padding so the
 * pair sits optically centered (measured ink margins, not line box).
 * The large PNGs keep the Regular the header wears.
 * Run after changing branding: node scripts/generate-icons.ts
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'
import sharp from 'sharp'

const OUT = path.resolve('static')

function playfair(weight: 400 | 600) {
	return readFileSync(
		path.resolve(
			`node_modules/@fontsource/playfair-display/files/playfair-display-latin-${weight}-normal.woff`,
		),
	)
}

interface MarkCut {
	weight: 400 | 600
	fontSize: number
	letterSpacing: string
	paddingBottom: number
	paddingRight: number
}

async function mark(cut: MarkCut): Promise<string> {
	return satori(
		{
			type: 'div',
			props: {
				style: {
					width: '512px',
					height: '512px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background: 'linear-gradient(180deg, #0a1220 0%, #131d34 100%)',
					paddingBottom: `${cut.paddingBottom}px`,
					paddingRight: `${cut.paddingRight}px`,
					fontFamily: '"Playfair Display", serif',
					fontStyle: 'normal',
					fontSize: `${cut.fontSize}px`,
					letterSpacing: cut.letterSpacing,
					color: '#d9b66c',
				},
				children: 'KW',
			},
		},
		{
			width: 512,
			height: 512,
			fonts: [
				{ name: 'Playfair Display', data: playfair(cut.weight), weight: 400, style: 'normal' },
			],
		},
	)
}

const favicon = await mark({
	weight: 600,
	fontSize: 288,
	letterSpacing: '-0.015em',
	paddingBottom: 34,
	paddingRight: 15,
})
writeFileSync(path.join(OUT, 'favicon.svg'), favicon)
console.log('favicon.svg')

const master = new Resvg(
	await mark({ weight: 400, fontSize: 268, letterSpacing: '0', paddingBottom: 0, paddingRight: 0 }),
)
	.render()
	.asPng()

const targets = [
	{ file: 'apple-touch-icon.png', size: 180 },
	{ file: 'icon-192.png', size: 192 },
	{ file: 'icon-512.png', size: 512 },
]

for (const t of targets) {
	await sharp(master).resize(t.size, t.size).png().toFile(path.join(OUT, t.file))
	console.log(`${t.file} (${t.size}×${t.size})`)
}
