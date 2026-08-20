import type { RequestEvent } from '@sveltejs/kit'

// The two live rooms (/films, /music) render in the worker against
// upstreams an ocean away: PocketBase on the VPS, Spotify. Prerendered
// rooms answer from Cloudflare's static pipeline in tens of ms; these two
// paid the full round trip on every view. This module keeps their rendered
// responses (page HTML and __data.json alike) in the colo's cache,
// stale-while-revalidate: a fresh copy answers instantly, a stale one
// answers instantly too while a background subrequest re-renders and
// restocks, and an upstream outage keeps the last good copy on the wall
// (outage responses are no-store, so they never replace it).
const CACHED_PAGES = new Set(['/films', '/music'])

// How long a copy may keep answering while refreshes fail (seconds).
const STALE_CEILING = 24 * 60 * 60

// The background refresh re-enters handle through event.fetch (the outer
// event can't render twice: SvelteKit disarms setHeaders once a response
// is out). This header marks that inner pass: render, restock, done.
const REFRESH_HEADER = 'x-edge-refresh'

// The page a URL renders for: /films/__data.json belongs to /films.
function isCachedPage(pathname: string): boolean {
	const page = pathname.endsWith('/__data.json')
		? pathname.slice(0, -'/__data.json'.length) || '/'
		: pathname
	return CACHED_PAGES.has(page)
}

// The origin's own freshness window; only public, positive-max-age
// responses are cacheable at all.
function freshSeconds(cacheControl: string | null): number {
	if (!cacheControl || !cacheControl.includes('public'))
		return 0
	const maxAge = /(?:^|[,\s])max-age=(\d+)/.exec(cacheControl)
	return maxAge ? Number(maxAge[1]) : 0
}

async function store(cache: Cache, key: Request, response: Response): Promise<void> {
	const originCc = response.headers.get('cache-control')
	const fresh = freshSeconds(originCc)
	if (response.status !== 200 || !fresh || originCc === null || response.headers.has('set-cookie'))
		return
	const copy = new Response(response.body, response)
	copy.headers.set('x-edge-origin-cc', originCc)
	copy.headers.set('x-edge-stored-at', String(Date.now()))
	copy.headers.set('x-edge-fresh', String(fresh))
	// Retention for the colo cache (the stale ceiling); browsers get the
	// origin's own cache-control back when a hit is served.
	copy.headers.set('cache-control', `public, max-age=${STALE_CEILING}`)
	await cache.put(key, copy)
}

/**
 * Serve a cached copy of the render when the URL belongs to a live room,
 * falling through to a plain render everywhere else (and always in dev
 * and prerendering, where there is no Cloudflare cache to speak to).
 */
export async function withEdgeCache(
	event: RequestEvent,
	render: () => Promise<Response>,
): Promise<Response> {
	const { platform, request } = event
	// The raw request URL, not event.url: SvelteKit normalizes event.url to
	// the page's address for __data.json requests, and keying on it would
	// file the HTML and the data payload under one entry.
	const requestUrl = new URL(request.url)
	const cache = platform?.caches?.default
	if (!cache || request.method !== 'GET' || !isCachedPage(requestUrl.pathname))
		return render()

	const key = new Request(requestUrl.href)

	// The refresh subrequest scheduled below: no matching, just restock.
	if (request.headers.has(REFRESH_HEADER)) {
		const response = await render()
		await store(cache, key, response.clone())
		return response
	}

	const waitUntil = platform?.ctx ? platform.ctx.waitUntil.bind(platform.ctx) : null
	const hit = await cache.match(key)
	if (hit) {
		const age = (Date.now() - Number(hit.headers.get('x-edge-stored-at'))) / 1000
		const stale = !Number.isFinite(age) || age > Number(hit.headers.get('x-edge-fresh'))
		if (stale && waitUntil) {
			waitUntil(
				event.fetch(requestUrl.href, { headers: { [REFRESH_HEADER]: '1' } }).catch(() => {}),
			)
		}
		const response = new Response(hit.body, hit)
		response.headers.set('cache-control', hit.headers.get('x-edge-origin-cc') ?? 'no-cache')
		response.headers.set('x-edge-cache', stale ? 'stale' : 'hit')
		for (const internal of ['x-edge-origin-cc', 'x-edge-stored-at', 'x-edge-fresh'])
			response.headers.delete(internal)
		return response
	}

	const response = await render()
	if (waitUntil)
		waitUntil(store(cache, key, response.clone()))
	response.headers.set('x-edge-cache', 'miss')
	return response
}
