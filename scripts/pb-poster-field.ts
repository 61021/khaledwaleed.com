#!/usr/bin/env node
/**
 * Add the `poster` file field to the PocketBase `films` collection, so posters
 * live on our own box instead of being hotlinked from TMDB at view time.
 *
 * The stored file is TMDB's w780 master; PocketBase renders the three widths
 * the site asks for from its preconfigured thumbs (an unlisted size silently
 * serves the master, so the list here and src/lib/posters.ts must agree).
 *
 * Idempotent. Run once:
 *   PB_EMAIL=… PB_PASSWORD=… node scripts/pb-poster-field.ts
 */
import process from 'node:process'
import PocketBase from 'pocketbase'

const PB_URL = 'https://api.khaledwaleed.com'

const email = process.env.PB_EMAIL
const password = process.env.PB_PASSWORD
if (!email || !password) {
	console.error('Set PB_EMAIL and PB_PASSWORD (PocketBase superuser).')
	process.exit(1)
}

const pb = new PocketBase(PB_URL)
await pb.collection('_superusers').authWithPassword(email, password)

const films = await pb.collections.getOne('films')
if (films.fields.some((f: { name: string }) => f.name === 'poster')) {
	console.log('films.poster already exists; nothing to do.')
	process.exit(0)
}

// The collections API replaces the whole field list, so the existing fields
// (ids included) go back untouched alongside the new one.
await pb.collections.update(films.id, {
	fields: [
		...films.fields,
		{
			name: 'poster',
			type: 'file',
			required: false,
			presentable: false,
			hidden: false,
			protected: false,
			maxSelect: 1,
			maxSize: 5_000_000,
			mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
			thumbs: ['185x0', '342x0', '500x0'],
		},
	],
})

console.log('films.poster added (thumbs 185x0, 342x0, 500x0).')
