import { site } from '$lib/site'

export const prerender = true

export function GET() {
	const body = `User-agent: *
Allow: /
Disallow: /manage
Disallow: /api/

Sitemap: ${site.url}/sitemap.xml
`

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain' },
	})
}
