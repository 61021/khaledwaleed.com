import type { RecordModel } from 'pocketbase'
import type { FilmMeta, MediaType } from './tmdb'
import PocketBase from 'pocketbase'
import { PB_URL } from './constants'

// PocketBase lives on the Contabo box (same as Rocca), exposed over HTTPS so the
// browser can talk to it from this HTTPS site. Wire api.khaledwaleed.com → PB in CF.
export const pb = new PocketBase(PB_URL)

/**
 * The TMDB snapshot denormalized onto each record. /manage writes it at save
 * time (and can re-sync it), so the public /films page renders everything from
 * PB in one request: no TMDB calls at view time.
 */
export interface FilmMetaFields {
	title: string
	year: number
	/** Display label: 'Movie' | 'TV Series' | 'TV Mini Series'. */
	format: string
	/** Minutes; 0 = unknown. */
	runtime: number
	genres: string[]
	/** Director(s) for films; creator(s) for TV. */
	directors: string[]
	/** TMDB poster_path; '' = none. */
	posterPath: string
}

/** Shape a TMDB FilmMeta response into the stored snapshot columns. */
export function metaToFields(m: FilmMeta): FilmMetaFields {
	return {
		title: m.title,
		year: m.year,
		format: m.type,
		runtime: m.runtime ?? 0,
		genres: m.genres,
		directors: m.directors,
		posterPath: m.posterPath ?? '',
	}
}

/** One row in the `films` collection: your data per title + the snapshot. */
export interface FilmRecord extends RecordModel, Partial<FilmMetaFields> {
	tmdbId: number
	type: MediaType
	rating: number
	watched: number
	/** yyyy-mm-dd */
	watchedOn: string
	notes?: string
	/** Stored, but never rendered on the public site. */
	privateNotes?: string
	/** Our own copy of the poster; '' until /manage has uploaded it. */
	poster?: string
}

/** Fields written when adding/updating a title. */
export type FilmInput = {
	tmdbId: number
	type: MediaType
	rating: number
	watched: number
	watchedOn: string
	notes?: string
	privateNotes?: string
} & Partial<FilmMetaFields>
