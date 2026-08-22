import type { MediaType } from '$lib/tmdb'
import type { PageServerLoad } from './$types'
import { PB_URL } from '$lib/constants'

// Your data (ratings, watch dates, notes) AND a denormalized TMDB snapshot
// (title, year, directors, poster) live together in PocketBase; /manage
// writes the snapshot at save time, poster file included. So this page renders
// complete rows from ONE request at request time (not prerendered), and the
// browser never talks to TMDB — not for metadata, not for images. We ask
// PocketBase for only the public fields: `privateNotes` is never requested, so
// it can't reach the browser.
export const prerender = false

const PUBLIC_FIELDS
	= 'id,tmdbId,type,rating,watched,watchedOn,notes,title,year,format,directors,poster,runtime,genres'

interface PbItem {
	id: string
	tmdbId: number
	type: MediaType
	rating: number
	watched?: number
	watchedOn?: string
	notes?: string
	title?: string
	year?: number
	format?: string
	directors?: string[] | null
	poster?: string
	runtime?: number
	genres?: string[] | null
}

export interface PersonalFilm {
	/** PocketBase record id; half of the poster file URL. */
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

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	const items: PbItem[] = []
	let healthy = true
	try {
		// Page through the collection (perPage caps at 500) with a bounded
		// timeout so a wedged PocketBase can't hang the render.
		let page = 1
		let totalPages = 1
		do {
			const res = await fetch(
				`${PB_URL}/api/collections/films/records?page=${page}&perPage=500&fields=${PUBLIC_FIELDS}&sort=-rating,-watchedOn`,
				{ signal: AbortSignal.timeout(5000) },
			)
			if (!res.ok) {
				healthy = false
				break
			}
			const body = (await res.json()) as { items?: PbItem[], totalPages?: number }
			items.push(...(body.items ?? []))
			totalPages = body.totalPages ?? 1
			page += 1
		} while (page <= totalPages)
	}
	catch {
		// PocketBase unreachable; the page renders an honest empty state.
		healthy = false
	}

	// Cache good responses briefly; never cache an outage.
	setHeaders({
		'cache-control': healthy && items.length ? 'public, max-age=300' : 'no-store',
	})

	const films: PersonalFilm[] = items.map(f => ({
		id: f.id,
		tmdbId: f.tmdbId,
		type: f.type,
		rating: f.rating,
		watched: f.watched ?? 1,
		watchedOn: f.watchedOn ?? '',
		...(f.notes ? { notes: f.notes } : {}),
		title: f.title ?? '',
		year: f.year ?? 0,
		format: f.format ?? '',
		directors: Array.isArray(f.directors) ? f.directors : [],
		poster: f.poster ?? '',
		runtime: f.runtime ?? 0,
		genres: Array.isArray(f.genres) ? f.genres : [],
		// privateNotes is never requested, so it is never included
	}))

	// Canonical order: rating desc, then most-recently watched.
	films.sort((a, b) => b.rating - a.rating || b.watchedOn.localeCompare(a.watchedOn))

	return { films }
}
