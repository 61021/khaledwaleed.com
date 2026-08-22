import type { RequestHandler } from './$types'

// Same-origin proxy for TMDB poster images. /manage uses it twice: to preview
// search candidates (no PocketBase record exists yet) and to pull the bytes it
// then uploads to PB. Nothing on the public site touches image.tmdb.org.
export const prerender = false

const SIZES = new Set(['w185', 'w342', 'w500', 'w780'])
const FILE = /^[\w-]+\.(?:jpg|jpeg|png|webp)$/

export const GET: RequestHandler = async ({ params, url, platform, fetch }) => {
	if (!SIZES.has(params.size) || !FILE.test(params.file))
		return new Response('bad params', { status: 400 })

	const cache = (globalThis as { caches?: { default?: Cache } }).caches?.default
	const cacheKey = new Request(`${url.origin}${url.pathname}`)
	if (cache) {
		const hit = await cache.match(cacheKey)
		if (hit)
			return hit
	}

	const upstream = await fetch(`https://image.tmdb.org/t/p/${params.size}/${params.file}`)
	if (!upstream.ok)
		return new Response('not found', { status: 404 })

	// TMDB filenames are content hashes, so a given URL never changes.
	const res = new Response(upstream.body, {
		headers: {
			'content-type': upstream.headers.get('content-type') ?? 'image/jpeg',
			'cache-control': 'public, max-age=604800, s-maxage=2592000, immutable',
		},
	})
	if (cache) {
		const ctx = (
			platform as { context?: { waitUntil?: (p: Promise<unknown>) => void } } | undefined
		)?.context
		ctx?.waitUntil?.(cache.put(cacheKey, res.clone()))
	}
	return res
}
