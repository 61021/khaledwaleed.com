import type { D1Database, R2Bucket } from '@cloudflare/workers-types'
import { error } from '@sveltejs/kit'

export interface Bindings {
	db: D1Database
	posters: R2Bucket
}

/** The worker's D1 + R2 bindings; a 503 when the platform is missing them. */
export function bindings(platform: App.Platform | undefined): Bindings {
	const db = platform?.env?.DB
	const posters = platform?.env?.POSTERS
	if (!db || !posters)
		error(503, 'Storage bindings are missing.')
	return { db, posters }
}
