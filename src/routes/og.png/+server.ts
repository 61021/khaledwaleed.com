import type { RequestHandler } from './$types';
import { site } from '$lib/site';
import { renderOgPng, homePalette } from '$lib/server/og';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const png = await renderOgPng({
		palette: homePalette,
		eyebrow: site.name,
		headline: ['A lead design engineer', 'in Baghdad.'],
		sub: 'Well-made software for the web, in SvelteKit, Nuxt, and Go.',
		footerLeft: 'khaledwaleed.com',
		footerRight: 'Baghdad · Iraq'
	});

	return new Response(png, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
};
