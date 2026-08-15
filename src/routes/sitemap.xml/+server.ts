import { posts } from '$lib/posts'
import { site } from '$lib/site'

export const prerender = true

const staticRoutes = ['/', '/story', '/projects', '/likes', '/films', '/tools', '/contact', '/writing']

export function GET() {
	// Only claim a lastmod when we actually know it; search engines learn to
	// distrust sitemaps whose lastmod bumps to "now" on every deploy.
	// (changefreq/priority are ignored by Google and Bing, so they're omitted.)
	const latestPost = posts[0]?.date
	const routes: { loc: string, lastmod?: string }[] = [
		...staticRoutes.map(r => ({
			loc: r,
			lastmod: r === '/writing' ? latestPost : undefined,
		})),
		...posts.map(p => ({ loc: `/writing/${p.slug}`, lastmod: p.date })),
	]
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
	.map((r) => {
		const lastmod = r.lastmod ? `\n\t\t<lastmod>${r.lastmod}</lastmod>` : ''
		return `	<url>
		<loc>${site.url}${r.loc}</loc>${lastmod}
	</url>`
	})
	.join('\n')}
</urlset>`

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600',
		},
	})
}
