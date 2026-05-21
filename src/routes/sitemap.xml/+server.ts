import { site } from '$lib/site';
import { posts } from '$lib/posts';

export const prerender = true;

const staticRoutes = ['/', '/about', '/now', '/likes', '/contact', '/writing'];

export const GET = () => {
	const now = new Date().toISOString();
	const routes = [
		...staticRoutes.map((r) => ({ loc: r, lastmod: now })),
		...posts.map((p) => ({ loc: `/writing/${p.slug}`, lastmod: new Date(p.date).toISOString() }))
	];
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
	.map(
		(r) => `	<url>
		<loc>${site.url}${r.loc}</loc>
		<lastmod>${r.lastmod}</lastmod>
		<changefreq>${r.loc === '/' ? 'weekly' : 'monthly'}</changefreq>
		<priority>${r.loc === '/' ? '1.0' : '0.8'}</priority>
	</url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
