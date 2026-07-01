import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { RequestHandler } from './$types';
import { site } from '$lib/site';

export const prerender = true;

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
const el = (type: string, props: Record<string, unknown>, ...children: Node[]): Node => ({
	type,
	props: { ...props, children: children.length === 1 ? children[0] : children }
});

export const GET: RequestHandler = async () => {
	const node = el(
		'div',
		{
			style: {
				width: '1200px',
				height: '630px',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				background: 'linear-gradient(180deg, #0a1220 0%, #131d34 100%)',
				padding: '80px 100px',
				fontFamily: '"Inter", sans-serif',
				color: '#ece4ce'
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
						color: '#d9b66c',
						lineHeight: 1
					}
				},
				'KW'
			),
			el('div', {
				style: {
					display: 'flex',
					height: '1px',
					width: '80px',
					background: '#d9b66c',
					opacity: 0.6
				}
			}),
			el(
				'div',
				{
					style: {
						display: 'flex',
						fontSize: '22px',
						letterSpacing: '0.22em',
						textTransform: 'uppercase',
						color: '#a8b3c9'
					}
				},
				site.name
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
						fontSize: '96px',
						lineHeight: 1.05,
						color: '#ece4ce',
						letterSpacing: '-0.01em'
					}
				},
				el('div', { style: { display: 'flex' } }, 'A senior software engineer'),
				el('div', { style: { display: 'flex' } }, 'in Baghdad.')
			),
			el(
				'div',
				{
					style: {
						display: 'flex',
						fontSize: '30px',
						color: '#a8b3c9',
						lineHeight: 1.4
					}
				},
				'SvelteKit · Nuxt · Go — quiet, well-made software for the web.'
			)
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
					color: '#6f7d97'
				}
			},
			el('div', { style: { display: 'flex' } }, 'khaledwaleed.com'),
			el('div', { style: { display: 'flex' } }, 'Baghdad · Iraq')
		)
	);

	const fonts: { name: string; data: Buffer; weight: 400; style: 'normal' | 'italic' }[] = [];
	if (interRegular) fonts.push({ name: 'Inter', data: interRegular, weight: 400, style: 'normal' });
	if (frauncesItalic)
		fonts.push({ name: 'Fraunces', data: frauncesItalic, weight: 400, style: 'italic' });

	const svg = await satori(node, { width: 1200, height: 630, fonts });
	const png = new Resvg(svg).render().asPng();

	return new Response(new Uint8Array(png), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
};
