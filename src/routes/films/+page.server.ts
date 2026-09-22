import type { FilmRow } from '$lib/server/films'
import type { MediaType } from '$lib/tmdb'
import type { PageServerLoad } from './$types'
import { ORDER, parseList, PUBLIC_COLUMNS } from '$lib/server/films'

// Your data (ratings, watch dates, notes) AND a denormalized TMDB snapshot
// (title, year, directors, poster) live together in D1; /manage writes the
// snapshot at save time, poster file included. So this page renders complete
// rows from ONE query at request time (not prerendered), and the browser never
// talks to TMDB — not for metadata, not for images. The query names only the
// public columns: `privateNotes` is never read, so it can't reach the browser.
export const prerender = false

type PublicRow = Pick<FilmRow, 'id' | 'tmdbId' | 'type' | 'rating' | 'watched' | 'watchedOn' | 'notes' | 'title' | 'year' | 'format' | 'directors' | 'poster' | 'runtime' | 'genres'>

export interface PersonalFilm {
	/** Record id; half of the poster file URL. */
	id: string
	tmdbId: number
	type: MediaType
	rating: number
	watched: number
	watchedOn: string
	notes?: string
	title: string
	year: number
	format: string
	directors: string[]
	/** Filename of our stored poster; '' until /manage has uploaded one. */
	poster: string
	/** minutes; movie runtime or TV episode runtime; 0 = unknown */
	runtime: number
	genres: string[]
}

export const load: PageServerLoad = async ({ platform, setHeaders }) => {
	let rows: PublicRow[] = []
	let healthy = true
	try {
		const db = platform?.env?.DB
		if (!db)
			throw new Error('D1 binding missing')
		rows = (await db.prepare(`SELECT ${PUBLIC_COLUMNS} FROM films ${ORDER}`).all<PublicRow>()).results
	}
	catch {
		// D1 unreachable; the page renders an honest empty state.
		healthy = false
	}

	// Cache good responses briefly; never cache an outage.
	setHeaders({
		'cache-control': healthy && rows.length ? 'public, max-age=300' : 'no-store',
	})

	const films: PersonalFilm[] = rows.map(f => ({
		id: f.id,
		tmdbId: f.tmdbId,
		type: f.type as MediaType,
		rating: f.rating,
		watched: f.watched,
		watchedOn: f.watchedOn,
		...(f.notes ? { notes: f.notes } : {}),
		title: f.title,
		year: f.year,
		format: f.format,
		directors: parseList(f.directors),
		poster: f.poster,
		runtime: f.runtime,
		genres: parseList(f.genres),
	}))

	// Canonical order: rating desc, then most-recently watched.
	films.sort((a, b) => b.rating - a.rating || b.watchedOn.localeCompare(a.watchedOn))

	return { films }
}
