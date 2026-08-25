import { Buffer } from 'node:buffer'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
// Shared satori → PNG renderer for Open Graph cards.
// Used by /og.png (site-wide card) and /writing/[slug]/og.png (per-essay).
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'
import { monogram } from '../monogram'

const ROOT = process.cwd()

function loadFont(...candidates: string[]): Buffer | null {
	for (const p of candidates) {
		try {
			return readFileSync(p)
		}
		catch {
			/* try next */
		}
	}
	return null
}

const franklinRegular = loadFont(
	join(ROOT, 'node_modules/@fontsource/libre-franklin/files/libre-franklin-latin-400-normal.woff'),
)
const frauncesRegular = loadFont(
	join(ROOT, 'node_modules/@fontsource/fraunces/files/fraunces-latin-400-normal.woff'),
)

type Node = any
export function el(type: string, props: Record<string, unknown>, ...children: Node[]): Node {
	return {
		type,
		props: { ...props, children: children.length === 1 ? children[0] : children },
	}
}

export interface OgPalette {
	bg: string
	bgSoft: string
	ink: string
	muted: string
	dim: string
	accent: string
}

/** The default (home) room. */
export const homePalette: OgPalette = {
	bg: '#0a1220',
	bgSoft: '#131d34',
	ink: '#ece4ce',
	muted: '#a8b3c9',
	dim: '#6f7d97',
	accent: '#d9b66c',
}

/** The writing room. */
export const writingPalette: OgPalette = {
	bg: '#1b1410',
	bgSoft: '#241c15',
	ink: '#dccdb2',
	muted: '#9c8d78',
	dim: '#6d604e',
	accent: '#c99f5b',
}

/**
 * The signature mark as a data URI, inked in the room's gilt. Satori
 * has no `currentColor`, so each palette gets its own copy.
 */
function markSrc(accent: string): string {
	const paths = monogram.paths.map(d => `<path d="${d}"/>`).join('')
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${monogram.viewBox}" fill="${accent}">${paths}</svg>`
	return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

export interface OgCard {
	palette: OgPalette
	/** small uppercase line above the headline */
	eyebrow?: string
	/** the big roman lines */
	headline: string[]
	/** normal-weight line under the headline */
	sub?: string
	footerLeft: string
	footerRight: string
	/** shrink the headline for long titles */
	headlineSize?: number
}

export async function renderOgPng(card: OgCard): Promise<Uint8Array<ArrayBuffer>> {
	const { palette: c } = card
	const size = card.headlineSize ?? 96

	const node = el(
		'div',
		{
			style: {
				width: '1200px',
				height: '630px',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				background: `linear-gradient(180deg, ${c.bg} 0%, ${c.bgSoft} 100%)`,
				padding: '80px 100px',
				fontFamily: '"Libre Franklin", sans-serif',
				color: c.ink,
			},
		},
		el(
			'div',
			{ style: { display: 'flex', alignItems: 'center', gap: '16px' } },
			el('img', {
				src: markSrc(c.accent),
				width: 84,
				height: 51,
				style: { display: 'flex' },
			}),
			el('div', {
				style: {
					display: 'flex',
					height: '1px',
					width: '80px',
					background: c.accent,
					opacity: 0.6,
				},
			}),
			el(
				'div',
				{
					style: {
						display: 'flex',
						fontSize: '22px',
						letterSpacing: '0.22em',
						textTransform: 'uppercase',
						color: c.muted,
					},
				},
				card.eyebrow ?? 'Khaled Waleed',
			),
		),
		el(
			'div',
			{ style: { display: 'flex', flexDirection: 'column', gap: '24px' } },
			el(
				'div',
				{
					style: {
						display: 'flex',
						flexDirection: 'column',
						fontFamily: '"Fraunces", serif',
						fontStyle: 'normal',
						fontSize: `${size}px`,
						lineHeight: 1.08,
						color: c.ink,
						letterSpacing: '-0.01em',
					},
				},
				...card.headline.map(line => el('div', { style: { display: 'flex' } }, line)),
			),
			...(card.sub
				? [
						el(
							'div',
							{ style: { display: 'flex', fontSize: '30px', color: c.muted, lineHeight: 1.4 } },
							card.sub,
						),
					]
				: []),
		),
		el(
			'div',
			{
				style: {
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					fontSize: '20px',
					letterSpacing: '0.2em',
					textTransform: 'uppercase',
					color: c.dim,
				},
			},
			el('div', { style: { display: 'flex' } }, card.footerLeft),
			el('div', { style: { display: 'flex' } }, card.footerRight),
		),
	)

	const fonts: { name: string, data: Buffer, weight: 400, style: 'normal' | 'italic' }[] = []
	if (franklinRegular)
		fonts.push({ name: 'Libre Franklin', data: franklinRegular, weight: 400, style: 'normal' })
	if (frauncesRegular) {
		fonts.push({
			name: 'Fraunces',
			data: frauncesRegular,
			weight: 400,
			style: 'normal',
		})
	}

	const svg = await satori(node, { width: 1200, height: 630, fonts })
	return new Uint8Array(new Resvg(svg).render().asPng())
}

/** Break a title into 1–3 lines that fit the card, and pick a size. */
export function layoutHeadline(title: string): { lines: string[], size: number } {
	const size = title.length > 70 ? 60 : title.length > 45 ? 68 : title.length > 26 ? 80 : 96
	// Rough character budget per line at each size (Fraunces roman, 1000px
	// box). Measured off satori's own output rather than the browser's:
	// satori sets this font about 17% wider than Chromium does, so metrics
	// taken in a page under-count the line and starve the budget.
	const budget = size >= 96 ? 19 : size >= 80 ? 23 : size >= 68 ? 27 : 31

	const words = title.split(' ')
	const lines: string[] = []
	let line = ''
	for (const word of words) {
		if (line && (`${line} ${word}`).length > budget) {
			lines.push(line)
			line = word
		}
		else {
			line = line ? `${line} ${word}` : word
		}
	}
	if (line)
		lines.push(line)
	return { lines: lines.slice(0, 4), size }
}
