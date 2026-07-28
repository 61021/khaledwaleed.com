import type { RequestHandler } from './$types';
import { site } from '$lib/site';
import { renderOgPng, homePalette } from '$lib/server/og';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const png = await renderOgPng({
		palette: homePalette,
		eyebrow: site.name,
		headline: ['A senior software engineer', 'in Baghdad.'],
		sub: 'SvelteKit · Nuxt · Go — quiet, well-made software for the web.',
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
