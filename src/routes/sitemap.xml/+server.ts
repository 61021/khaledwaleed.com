import { site } from '$lib/site';

export const prerender = true;

const routes = ['/', '/about', '/likes', '/contact'];

export const GET = () => {
	const now = new Date().toISOString();
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
	.map(
		(r) => `	<url>
		<loc>${site.url}${r}</loc>
		<lastmod>${now}</lastmod>
		<changefreq>${r === '/' ? 'weekly' : 'monthly'}</changefreq>
		<priority>${r === '/' ? '1.0' : '0.8'}</priority>
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
