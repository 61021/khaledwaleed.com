import type { RequestHandler } from './$types'
import { bindings } from '$lib/server/bindings'
import { cleanInput, deleteFilm, FilmInputError, isDuplicate, updateFilm } from '$lib/server/films'
import { deletePoster } from '$lib/server/poster-store'
import { error, json } from '@sveltejs/kit'

export const prerender = false

export const PATCH: RequestHandler = async ({ platform, request, params }) => {
	const { db } = bindings(platform)
	try {
		const film = await updateFilm(db, params.id, cleanInput(await request.json(), true))
		if (!film)
			error(404, 'No such title.')
		return json(film)
	}
	catch (err) {
		if (err instanceof FilmInputError)
			error(400, err.message)
		if (isDuplicate(err))
			error(409, 'That title is already in the collection.')
		throw err
	}
}

export const DELETE: RequestHandler = async ({ platform, params }) => {
	const { db, posters } = bindings(platform)
	const film = await deleteFilm(db, params.id)
	if (!film)
		error(404, 'No such title.')
	await deletePoster(posters, film.id, film.poster)
	return new Response(null, { status: 204 })
}
