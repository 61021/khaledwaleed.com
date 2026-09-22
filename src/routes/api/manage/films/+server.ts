import type { RequestHandler } from './$types'
import { bindings } from '$lib/server/bindings'
import { cleanInput, createFilm, FilmInputError, isDuplicate, listFilms } from '$lib/server/films'
import { error, json } from '@sveltejs/kit'

export const prerender = false

export const GET: RequestHandler = async ({ platform }) => {
	const { db } = bindings(platform)
	return json({ films: await listFilms(db) }, { headers: { 'cache-control': 'no-store' } })
}

export const POST: RequestHandler = async ({ platform, request }) => {
	const { db } = bindings(platform)
	try {
		const film = await createFilm(db, cleanInput(await request.json(), false))
		return json(film, { status: 201 })
	}
	catch (err) {
		if (err instanceof FilmInputError)
			error(400, err.message)
		if (isDuplicate(err))
			error(409, 'That title is already in the collection.')
		throw err
	}
}
