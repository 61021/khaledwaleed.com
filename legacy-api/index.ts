import { legacyPosterTarget } from '../src/lib/legacy-posters'

// api.khaledwaleed.com was the PocketBase host until 2026-09. Poster file URLs
// move to the R2 bucket for good; nothing else there exists any more.
export default {
	fetch(request: Request): Response {
		const target = request.method === 'GET' || request.method === 'HEAD'
			? legacyPosterTarget(new URL(request.url))
			: null
		if (target) {
			return new Response(null, {
				status: 301,
				headers: { 'location': target, 'cache-control': 'public, max-age=31536000' },
			})
		}
		return new Response('Gone', {
			status: 410,
			headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=86400' },
		})
	},
}
