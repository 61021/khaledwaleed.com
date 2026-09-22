import type { PersonalFilm } from '$lib/films'
import type { PageLoad } from './$types'
import { browser } from '$app/environment'
import { isHydrated } from '$lib/hydration'

export const prerender = false

// The server awaits the ledger so the HTML (and crawlers) get every title,
// and hydration reads that same response back from the page. A client
// navigation gets the promise instead: the room opens at once and the
// ledger fills in when it lands.
export const load: PageLoad = async ({ fetch, setHeaders }) => {
	const films: Promise<PersonalFilm[]> = fetch('/api/films')
		.then(r => (r.ok ? (r.json() as Promise<PersonalFilm[]>) : []))
		.catch(() => [])
	if (browser && isHydrated())
		return { films }
	const list = await films
	if (!browser)
		setHeaders({ 'cache-control': list.length ? 'public, max-age=300' : 'no-store' })
	return { films: list as PersonalFilm[] | Promise<PersonalFilm[]> }
}
