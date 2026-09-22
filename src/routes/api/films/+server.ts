import type { RequestHandler } from './$types'
import { listPublicFilms } from '$lib/server/films'
import { json } from '@sveltejs/kit'

// The /films ledger as JSON, so a click into the room never waits on D1:
// the page shows at once and this fills it. Colo-cached like the page
// itself (edge-cache.ts); an outage answers 503 no-store so it never
// replaces the last good copy.
export const prerender = false

export const GET: RequestHandler = async ({ platform }) => {
	const db = platform?.env?.DB
	try {
		if (!db)
			throw new Error('D1 binding missing')
		const films = await listPublicFilms(db)
		return json(films, { headers: { 'cache-control': films.length ? 'public, max-age=300' : 'no-store' } })
	}
	catch {
		return json([], { status: 503, headers: { 'cache-control': 'no-store' } })
	}
}
