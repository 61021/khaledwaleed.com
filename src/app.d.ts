// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { D1Database, R2Bucket } from '@cloudflare/workers-types'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			/** The Cloudflare Access identity on /manage and /api/manage. */
			owner?: string
		}
		// interface PageData {}
		// interface PageState {}
		// What adapter-cloudflare hands the worker; absent during prerendering,
		// so everything stays optional.
		interface Platform {
			env?: {
				DB?: D1Database
				POSTERS?: R2Bucket
				ACCESS_TEAM_DOMAIN?: string
				ACCESS_AUD?: string
				/** Runtime secrets (Spotify, TMDB); local dev reads .env instead. */
				[secret: string]: unknown
			}
			/** Workers execution context: keeps background work alive past the response. */
			ctx?: { waitUntil: (promise: Promise<unknown>) => void }
			/** The colo-local Workers cache (see $lib/server/edge-cache). */
			caches?: CacheStorage & { default: Cache }
		}
	}
}

export {}
