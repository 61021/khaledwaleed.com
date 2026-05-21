import { site } from '$lib/site';
import { posts } from '$lib/posts';

export const prerender = true;

const escape = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET = async () => {
	const lastBuild = new Date(posts[0]?.date ?? Date.now()).toUTCString();

	const items = posts
		.map((p) => {
			const url = `${site.url}/writing/${p.slug}`;
			return `
		<item>
			<title>${escape(p.title)}</title>
			<description>${escape(p.description)}</description>
			<link>${url}</link>
			<guid isPermaLink="true">${url}</guid>
			<pubDate>${new Date(p.date).toUTCString()}</pubDate>
			${p.tags.map((t) => `<category>${escape(t)}</category>`).join('\n\t\t\t')}
		</item>`;
		})
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${escape(site.name)} — Writing</title>
		<link>${site.url}/writing</link>
		<atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
		<description>${escape(site.tagline)}</description>
		<language>en</language>
		<lastBuildDate>${lastBuild}</lastBuildDate>
		${items}
	</channel>
</rss>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
};
