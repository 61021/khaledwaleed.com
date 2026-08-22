#!/usr/bin/env node
/**
 * Copy every film's TMDB poster onto our own PocketBase, once.
 *
 * The public /films page renders PB file URLs only, so anything still holding
 * a bare `posterPath` would show the placeholder. Run this after
 * scripts/pb-poster-field.ts and before deploying:
 *   PB_EMAIL=… PB_PASSWORD=… node scripts/backfill-posters.ts
 *
 * Idempotent and resumable: records that already carry a file are skipped, so
 * a half-finished run just picks up where it stopped.
 */
import process from 'node:process'
import PocketBase from 'pocketbase'

const PB_URL = 'https://api.khaledwaleed.com'
const TMDB = 'https://image.tmdb.org/t/p/w780'
const WORKERS = 4

interface Row {
	id: string
	title?: string
	posterPath?: string
	poster?: string
}

const email = process.env.PB_EMAIL
const password = process.env.PB_PASSWORD
if (!email || !password) {
	console.error('Set PB_EMAIL and PB_PASSWORD (PocketBase superuser).')
	process.exit(1)
}

const pb = new PocketBase(PB_URL)
await pb.collection('_superusers').authWithPassword(email, password)

const all = await pb.collection('films').getFullList<Row>({
	fields: 'id,title,posterPath,poster',
	sort: '-rating',
})
const pending = all.filter(r => r.posterPath && !r.poster)
const noArt = all.filter(r => !r.posterPath).length

console.log(`${all.length} records · ${pending.length} to fetch · ${noArt} have no TMDB poster`)
if (!pending.length)
	process.exit(0)

async function store(row: Row): Promise<void> {
	const res = await fetch(`${TMDB}${row.posterPath}`)
	if (!res.ok)
		throw new Error(`TMDB ${res.status}`)
	const form = new FormData()
	form.append('poster', await res.blob(), row.posterPath!.replace(/^\//, ''))
	await pb.collection('films').update(row.id, form)
}

let next = 0
let done = 0
const failed: string[] = []

async function worker(): Promise<void> {
	while (next < pending.length) {
		const row = pending[next++]
		try {
			try {
				await store(row)
			}
			catch {
				await store(row) // one retry: TMDB's CDN blips
			}
			done++
			console.log(`${done}/${pending.length} ${row.title ?? row.id}`)
		}
		catch (err) {
			failed.push(`${row.title ?? row.id}: ${(err as Error).message}`)
		}
	}
}

await Promise.all(Array.from({ length: WORKERS }, worker))

console.log(`stored ${done}, failed ${failed.length}`)
for (const f of failed)
	console.error(`  ${f}`)
process.exit(failed.length ? 1 : 0)
