import type { Handle } from '@sveltejs/kit'
import { withEdgeCache } from '$lib/server/edge-cache'
import { roomBg, roomForPath } from '$lib/site'

// Gone-but-indexed URLs. Cloudflare's _redirects file never fires here
// (it only covers static assets; the worker owns every page path), so
// the 301s must come from the app itself.
const redirects: Record<string, string> = {
	// /now was removed; send old links (and indexed URLs) home.
	'/now': '/',
	// Essays that lived briefly at these slugs and were unpublished.
	'/writing/absurdism-without-nihilism': '/writing',
	'/writing/in-defense-of-melancholy': '/writing',
	'/writing/software-you-can-leave-alone': '/writing',
	'/writing/it-hasnt-happened-yet': '/writing',
	// /cv lived for an afternoon; the CV now lives on Story.
	'/cv': '/story',
	// About was renamed Story (2026-08-11); the old URL is widely indexed.
	'/about': '/story',
	// Tools lived at /uses until 2026-08-15; the old address is indexed.
	'/uses': '/tools',
}

// Rooms hidden for now, links removed everywhere but the pages kept intact.
// 302 rather than 301 so nothing caches the detour while they're offstage.
const hidden: Record<string, string> = {
	'/library': '/likes',
	'/music': '/likes',
}

// Mirrors the root _headers file, which only reaches the static pipeline
// (prerendered pages, assets); worker-rendered responses (/music, /manage,
// /api/*, these 301s) must carry the security headers themselves.
const securityHeaders: Record<string, string> = {
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'SAMEORIGIN',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
	'Cross-Origin-Opener-Policy': 'same-origin',
	'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}

function withSecurityHeaders(response: Response) {
	for (const [header, value] of Object.entries(securityHeaders)) {
		if (!response.headers.has(header))
			response.headers.set(header, value)
	}
	return response
}

// Stamp the per-page room palette into the served HTML so the first paint
// (and no-JS visitors) get the right colors instead of a navy→warm flash.
// app.html ships data-room="home" / theme-color #0a1220 as placeholders.
export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname.replace(/\/+$/, '') || '/'
	const target = redirects[path]
	if (target) {
		return withSecurityHeaders(new Response(null, { status: 301, headers: { location: target } }))
	}
	const detour = hidden[path]
	if (detour) {
		return withSecurityHeaders(new Response(null, { status: 302, headers: { location: detour } }))
	}

	const room = event.route.id === null ? '404' : roomForPath(event.url.pathname)
	const render = async (): Promise<Response> => {
		let buffer = ''
		const response = await resolve(event, {
			transformPageChunk: ({ html, done }) => {
				buffer += html
				if (!done)
					return ''
				return buffer
					.replace('data-room="home"', `data-room="${room}"`)
					.replace('content="#0a1220"', `content="${roomBg[room] ?? '#0a1220'}"`)
			},
		})
		return withSecurityHeaders(response)
	}
	// The live rooms answer from the colo cache (see edge-cache.ts);
	// every other path renders straight through.
	return withEdgeCache(event, render)
}
