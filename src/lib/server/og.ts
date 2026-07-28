// Shared satori → PNG renderer for Open Graph cards.
// Used by /og.png (site-wide card) and /writing/[slug]/og.png (per-essay).
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

function loadFont(...candidates: string[]): Buffer | null {
	for (const p of candidates) {
		try {
			return readFileSync(p);
		} catch {
			/* try next */
		}
	}
	return null;
}

const interRegular = loadFont(
	join(ROOT, 'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff'),
	join(ROOT, 'node_modules/@fontsource/inter/files/inter-latin-all-400-normal.woff')
);
const frauncesItalic = loadFont(
	join(ROOT, 'node_modules/@fontsource/fraunces/files/fraunces-latin-400-italic.woff'),
	join(ROOT, 'node_modules/@fontsource/fraunces/files/fraunces-latin-all-400-italic.woff')
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Node = any;
export const el = (type: string, props: Record<string, unknown>, ...children: Node[]): Node => ({
	type,
	props: { ...props, children: children.length === 1 ? children[0] : children }
});

export type OgPalette = {
	bg: string;
	bgSoft: string;
	ink: string;
	muted: string;
	dim: string;
	accent: string;
};

/** The default (home) room. */
export const homePalette: OgPalette = {
	bg: '#0a1220',
	bgSoft: '#131d34',
	ink: '#ece4ce',
	muted: '#a8b3c9',
	dim: '#6f7d97',
	accent: '#d9b66c'
};

/** The writing room. */
export const writingPalette: OgPalette = {
	bg: '#1c1a17',
	bgSoft: '#25221d',
	ink: '#d8cdb8',
	muted: '#99917f',
	dim: '#6a6353',
	accent: '#b4a16f'
};

export type OgCard = {
	palette: OgPalette;
	/** small uppercase line above the headline */
	eyebrow?: string;
	/** the big Fraunces italic lines */
	headline: string[];
	/** normal-weight line under the headline */
	sub?: string;
	footerLeft: string;
	footerRight: string;
	/** shrink the headline for long titles */
	headlineSize?: number;
};

export async function renderOgPng(card: OgCard): Promise<Uint8Array<ArrayBuffer>> {
	const { palette: c } = card;
	const size = card.headlineSize ?? 96;

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
				fontFamily: '"Inter", sans-serif',
				color: c.ink
			}
		},
		el(
			'div',
			{ style: { display: 'flex', alignItems: 'center', gap: '16px' } },
			el(
				'div',
				{
					style: {
						display: 'flex',
						fontFamily: '"Fraunces", serif',
						fontStyle: 'italic',
						fontSize: '56px',
						color: c.accent,
						lineHeight: 1
					}
				},
				'KW'
			),
			el('div', {
				style: { display: 'flex', height: '1px', width: '80px', background: c.accent, opacity: 0.6 }
			}),
			el(
				'div',
				{
					style: {
						display: 'flex',
						fontSize: '22px',
						letterSpacing: '0.22em',
						textTransform: 'uppercase',
						color: c.muted
					}
				},
				card.eyebrow ?? 'Khaled Waleed'
			)
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
						fontStyle: 'italic',
						fontSize: `${size}px`,
						lineHeight: 1.08,
						color: c.ink,
						letterSpacing: '-0.01em'
					}
				},
				...card.headline.map((line) => el('div', { style: { display: 'flex' } }, line))
			),
			...(card.sub
				? [
						el(
							'div',
							{ style: { display: 'flex', fontSize: '30px', color: c.muted, lineHeight: 1.4 } },
							card.sub
						)
					]
				: [])
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
					color: c.dim
				}
			},
			el('div', { style: { display: 'flex' } }, card.footerLeft),
			el('div', { style: { display: 'flex' } }, card.footerRight)
		)
	);

	const fonts: { name: string; data: Buffer; weight: 400; style: 'normal' | 'italic' }[] = [];
	if (interRegular) fonts.push({ name: 'Inter', data: interRegular, weight: 400, style: 'normal' });
	if (frauncesItalic)
		fonts.push({ name: 'Fraunces', data: frauncesItalic, weight: 400, style: 'italic' });

	const svg = await satori(node, { width: 1200, height: 630, fonts });
	return new Uint8Array(new Resvg(svg).render().asPng());
}

/** Break a title into 1–3 lines that fit the card, and pick a size. */
export function layoutHeadline(title: string): { lines: string[]; size: number } {
	const size = title.length > 70 ? 60 : title.length > 45 ? 68 : title.length > 26 ? 80 : 96;
	// Rough character budget per line at each size (Fraunces italic, 1000px box).
	const budget = size >= 96 ? 24 : size >= 80 ? 29 : size >= 68 ? 34 : 39;

	const words = title.split(' ');
	const lines: string[] = [];
	let line = '';
	for (const word of words) {
		if (line && (line + ' ' + word).length > budget) {
			lines.push(line);
			line = word;
		} else {
			line = line ? `${line} ${word}` : word;
		}
	}
	if (line) lines.push(line);
	return { lines: lines.slice(0, 4), size };
}
