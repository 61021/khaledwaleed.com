import type { FilmRecord, PersonalFilm } from '$lib/films'
import type { MediaType } from '$lib/tmdb'
import type { D1Database } from '@cloudflare/workers-types'

/** What /films may read: never privateNotes, never the TMDB posterPath. */
export const PUBLIC_COLUMNS
	= 'id, tmdbId, type, rating, watched, watchedOn, notes, title, year, format, directors, poster, runtime, genres'

export const ORDER = 'ORDER BY rating DESC, watchedOn DESC, rowid ASC'

export type FilmRow = Omit<FilmRecord, 'genres' | 'directors'> & { genres: string, directors: string }

type Editable = Omit<FilmRecord, 'id' | 'poster'>

const TEXT = ['watchedOn', 'notes', 'privateNotes', 'title', 'format', 'posterPath'] as const
const INTEGER = ['tmdbId', 'rating', 'watched', 'year', 'runtime'] as const
const LISTS = ['genres', 'directors'] as const
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789'

export class FilmInputError extends Error {}

export function parseList(raw: string | null | undefined): string[] {
	try {
		const value: unknown = JSON.parse(raw ?? '[]')
		return Array.isArray(value) ? value.filter((x): x is string => typeof x === 'string') : []
	}
	catch {
		return []
	}
}

export function toRecord(row: FilmRow): FilmRecord {
	return { ...row, genres: parseList(row.genres), directors: parseList(row.directors) }
}

/** A PocketBase-shaped id, so new rows look like the migrated ones. */
export function newId(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(15))
	return Array.from(bytes, b => ALPHABET[b % ALPHABET.length]).join('')
}

/**
 * Keep only the columns /manage may write, checked and coerced. `partial`
 * allows any subset (updates); otherwise the identity + rating are required.
 */
export function cleanInput(body: unknown, partial: boolean): Partial<Editable> {
	if (!body || typeof body !== 'object')
		throw new FilmInputError('Expected a JSON object.')
	const src = body as Record<string, unknown>
	const out: Record<string, unknown> = {}
	for (const key of TEXT) {
		if (src[key] === undefined)
			continue
		if (typeof src[key] !== 'string')
			throw new FilmInputError(`${key} must be text.`)
		out[key] = src[key]
	}
	for (const key of INTEGER) {
		if (src[key] === undefined)
			continue
		if (!Number.isInteger(src[key]))
			throw new FilmInputError(`${key} must be a whole number.`)
		out[key] = src[key]
	}
	for (const key of LISTS) {
		if (src[key] === undefined)
			continue
		if (!Array.isArray(src[key]) || !(src[key] as unknown[]).every(x => typeof x === 'string'))
			throw new FilmInputError(`${key} must be a list of names.`)
		out[key] = src[key]
	}
	if (src.type !== undefined) {
		if (src.type !== 'movie' && src.type !== 'tv')
			throw new FilmInputError('type must be movie or tv.')
		out.type = src.type as MediaType
	}
	if (out.rating !== undefined && ((out.rating as number) < 1 || (out.rating as number) > 10))
		throw new FilmInputError('rating must be 1 to 10.')
	if (typeof out.watchedOn === 'string' && out.watchedOn && !/^\d{4}-\d{2}-\d{2}$/.test(out.watchedOn))
		throw new FilmInputError('watchedOn must be yyyy-mm-dd.')
	if (!partial && (out.tmdbId === undefined || out.type === undefined || out.rating === undefined))
		throw new FilmInputError('tmdbId, type and rating are required.')
	return out as Partial<Editable>
}

function columnValue(key: string, value: unknown): unknown {
	return Array.isArray(value) ? JSON.stringify(value) : value
}

export async function listFilms(db: D1Database): Promise<FilmRecord[]> {
	const { results } = await db.prepare(`SELECT * FROM films ${ORDER}`).all<FilmRow>()
	return results.map(toRecord)
}

export async function getFilm(db: D1Database, id: string): Promise<FilmRecord | null> {
	const row = await db.prepare('SELECT * FROM films WHERE id = ?').bind(id).first<FilmRow>()
	return row ? toRecord(row) : null
}

export async function createFilm(db: D1Database, input: Partial<Editable>): Promise<FilmRecord> {
	const id = newId()
	const keys = Object.keys(input)
	const columns = ['id', ...keys].join(', ')
	const marks = ['?', ...keys.map(() => '?')].join(', ')
	await db
		.prepare(`INSERT INTO films (${columns}) VALUES (${marks})`)
		.bind(id, ...keys.map(k => columnValue(k, input[k as keyof Editable])))
		.run()
	return (await getFilm(db, id))!
}

export async function updateFilm(
	db: D1Database,
	id: string,
	patch: Partial<Editable> & { poster?: string },
): Promise<FilmRecord | null> {
	const keys = Object.keys(patch)
	if (keys.length) {
		const sets = [...keys.map(k => `${k} = ?`), 'updated = strftime(\'%Y-%m-%dT%H:%M:%fZ\', \'now\')'].join(', ')
		await db
			.prepare(`UPDATE films SET ${sets} WHERE id = ?`)
			.bind(...keys.map(k => columnValue(k, patch[k as keyof typeof patch])), id)
			.run()
	}
	return getFilm(db, id)
}

export async function deleteFilm(db: D1Database, id: string): Promise<FilmRecord | null> {
	const film = await getFilm(db, id)
	if (film)
		await db.prepare('DELETE FROM films WHERE id = ?').bind(id).run()
	return film
}

/** D1 surfaces constraint failures only in the message text. */
export function isDuplicate(err: unknown): boolean {
	return err instanceof Error && /UNIQUE constraint failed/i.test(err.message)
}

type PublicRow = Pick<FilmRow, 'id' | 'tmdbId' | 'type' | 'rating' | 'watched' | 'watchedOn' | 'notes' | 'title' | 'year' | 'format' | 'directors' | 'poster' | 'runtime' | 'genres'>

/** The public log, rating desc then most recently watched. */
export async function listPublicFilms(db: D1Database): Promise<PersonalFilm[]> {
	const rows = (await db.prepare(`SELECT ${PUBLIC_COLUMNS} FROM films ${ORDER}`).all<PublicRow>()).results
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
	films.sort((a, b) => b.rating - a.rating || b.watchedOn.localeCompare(a.watchedOn))
	return films
}
