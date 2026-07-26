import type { Handle } from '@sveltejs/kit';
import { roomBg, roomForPath } from '$lib/site';

// Stamp the per-page room palette into the served HTML so the first paint
// (and no-JS visitors) get the right colors instead of a navy→warm flash.
// app.html ships data-room="home" / theme-color #0a1220 as placeholders.
export const handle: Handle = async ({ event, resolve }) => {
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
