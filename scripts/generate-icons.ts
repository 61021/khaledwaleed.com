#!/usr/bin/env node
/**
 * Generate the site icons from the one signature mark: gold on the home
 * room's night blue, matching the header and the OG cards.
 *   - favicon.svg (browser tabs)
 *   - apple-touch-icon.png (180×180, iOS home screen ignores SVG)
 *   - icon-192.png / icon-512.png (web app manifest)
 *   - avatar.svg (the round one structured data hands to search and chat)
 * The favicon wears a small-size cut: the k alone, set nearly edge to
 * edge and dilated by a hairline stroke, because the full pair collapses
 * into a smudge at 16px. Everything with room to breathe keeps the
 * whole signature.
 * Run after changing branding: node scripts/generate-icons.ts
 */
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import { monogram } from '../src/lib/monogram.ts'

const OUT = path.resolve('static')

const BG = '#0a1220'
const BG_SOFT = '#131d34'
const GOLD = '#d9b66c'

interface Cut {
	/** Path data to ink. */
	paths: readonly string[]
	/** Width of the art these paths were drawn in. */
	artWidth: number
	/** Height of the art these paths were drawn in. */
	artHeight: number
	/** How tall to set it inside the square. */
	height: number
	/** Hairline dilation, in art units, for cuts that must survive 16px. */
	stroke?: number
}

function full(height: number): Cut {
	return {
		paths: monogram.paths,
		artWidth: monogram.width,
		artHeight: monogram.height,
		height,
	}
}

const initial: Cut = {
	paths: [monogram.initial.d],
	artWidth: monogram.initial.width,
	artHeight: monogram.initial.height,
	height: 460,
	stroke: 0.5,
}

/** The mark, scaled to the cut's height and centred in a `box`-sided square. */
function mark(box: number, cut: Cut): string {
	const scale = cut.height / cut.artHeight
	const x = (box - cut.artWidth * scale) / 2
	const y = (box - cut.height) / 2
	const dilate = cut.stroke
		? ` stroke="${GOLD}" stroke-width="${cut.stroke}" stroke-linejoin="round"`
		: ''
	const paths = cut.paths.map(d => `<path d="${d}"/>`).join('')
	return `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale.toFixed(4)})" fill="${GOLD}"${dilate}>${paths}</g>`
}

const night = `<defs><linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${BG}"/><stop offset="100%" stop-color="${BG_SOFT}"/></linearGradient></defs>`

function square(box: number, cut: Cut): string {
	return `<svg width="${box}" height="${box}" viewBox="0 0 ${box} ${box}" xmlns="http://www.w3.org/2000/svg">${night}<rect width="${box}" height="${box}" fill="url(#night)"/>${mark(box, cut)}</svg>`
}

writeFileSync(path.join(OUT, 'favicon.svg'), square(512, initial))
console.log('favicon.svg')

writeFileSync(
	path.join(OUT, 'avatar.svg'),
	`<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">${night}<circle cx="64" cy="64" r="64" fill="url(#night)"/>${mark(128, full(52))}</svg>`,
)
console.log('avatar.svg')

const master = new Resvg(square(512, full(230))).render().asPng()

const targets = [
	{ file: 'apple-touch-icon.png', size: 180 },
	{ file: 'icon-192.png', size: 192 },
	{ file: 'icon-512.png', size: 512 },
]

for (const t of targets) {
	await sharp(master).resize(t.size, t.size).png().toFile(path.join(OUT, t.file))
	console.log(`${t.file} (${t.size}×${t.size})`)
}
