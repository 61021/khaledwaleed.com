import type { Handle } from '@sveltejs/kit';
import { roomBg, roomForPath } from '$lib/site';

// Gone-but-indexed URLs. Cloudflare's _redirects file never fires here
// (it only covers static assets; the worker owns every page path), so
// the 301s must come from the app itself.
const redirects: Record<string, string> = {
	// /now was removed — send old links (and indexed URLs) home.
	'/now': '/',
	// Essays that lived briefly at these slugs and were unpublished.
	'/writing/absurdism-without-nihilism': '/writing',
	'/writing/in-defense-of-melancholy': '/writing',
	'/writing/software-you-can-leave-alone': '/writing',
	'/writing/it-hasnt-happened-yet': '/writing',
	// /cv lived for an afternoon; the CV now lives on About.
	'/cv': '/about'
};

// Stamp the per-page room palette into the served HTML so the first paint
// (and no-JS visitors) get the right colors instead of a navy→warm flash.
// app.html ships data-room="home" / theme-color #0a1220 as placeholders.
export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname.replace(/\/+$/, '') || '/';
	const target = redirects[path];
	if (target) return new Response(null, { status: 301, headers: { location: target } });

	const room = event.route.id === null ? '404' : roomForPath(event.url.pathname);
	let buffer = '';
	return resolve(event, {
		transformPageChunk: ({ html, done }) => {
			buffer += html;
			if (!done) return '';
			return buffer
				.replace('data-room="home"', `data-room="${room}"`)
				.replace('content="#0a1220"', `content="${roomBg[room] ?? '#0a1220'}"`);
		}
	});
};
