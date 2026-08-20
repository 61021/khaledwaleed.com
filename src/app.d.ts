// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// What adapter-cloudflare hands the worker; absent in dev and
		// during prerendering, so everything stays optional.
		interface Platform {
			/** Runtime secrets (Spotify keys); local dev reads .env instead. */
			env?: Record<string, string | undefined>
			/** Workers execution context: keeps background work alive past the response. */
			ctx?: { waitUntil: (promise: Promise<unknown>) => void }
			/** The colo-local Workers cache (see $lib/server/edge-cache). */
			caches?: CacheStorage & { default: Cache }
		}
	}
}

export {}
