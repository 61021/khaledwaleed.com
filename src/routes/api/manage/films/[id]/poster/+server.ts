import type { RequestHandler } from './$types'
import { bindings } from '$lib/server/bindings'
import { getFilm, updateFilm } from '$lib/server/films'
import { deletePoster, isTmdbPosterPath, storePoster } from '$lib/server/poster-store'
import { error, json } from '@sveltejs/kit'

export const prerender = false

// Copy the record's TMDB poster into R2 and point the row at it.
export const POST: RequestHandler = async ({ platform, params, request, fetch }) => {
	const { db, posters } = bindings(platform)
	const { posterPath } = (await request.json().catch(() => ({}))) as { posterPath?: unknown }
	if (!isTmdbPosterPath(posterPath))
		error(400, 'posterPath must be a TMDB poster path.')
	const film = await getFilm(db, params.id)
	if (!film)
		error(404, 'No such title.')
	let file: string
	try {
		file = await storePoster(posters, fetch, film.id, posterPath)
	}
	catch (err) {
		error(502, (err as Error).message)
	}
	const updated = await updateFilm(db, film.id, { poster: file })
	if (film.poster && film.poster !== file)
		await deletePoster(posters, film.id, film.poster)
	return json(updated)
}
