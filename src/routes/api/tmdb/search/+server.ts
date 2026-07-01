import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { MediaType, SearchResult } from '$lib/tmdb';

// Live TMDB title search for the manage page. Key stays server-side.
export const prerender = false;

type TmdbObj = Record<string, unknown>;

export const GET: RequestHandler = async ({ url, platform, fetch }) => {
	const q = (url.searchParams.get('q') ?? '').trim();
	if (!q) return json({ results: [] satisfies SearchResult[] });

	const cf = (platform as { env?: Record<string, string | undefined> } | undefined)?.env ?? {};
	const key = cf.TMDB_API_KEY ?? env.TMDB_API_KEY;
	if (!key) return json({ error: 'TMDB key not configured' }, { status: 503 });

	const tmdb = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
		q
	)}&include_adult=false&api_key=${key}`;
	const r = await fetch(tmdb, { headers: { Accept: 'application/json' } });
	if (!r.ok) return json({ results: [] satisfies SearchResult[] });
	const data = (await r.json()) as { results?: TmdbObj[] };

	const results: SearchResult[] = (data.results ?? [])
		.filter((x) => x.media_type === 'movie' || x.media_type === 'tv')
		.map((x) => {
			const date = String(x.release_date ?? x.first_air_date ?? '');
			return {
				tmdbId: x.id as number,
				mediaType: x.media_type as MediaType,
				title: (x.title ?? x.name ?? '') as string,
				year: Number(date.slice(0, 4)) || 0,
				posterPath: (x.poster_path as string) ?? null
			};
		})
		.slice(0, 12);

	return json({ results }, { headers: { 'cache-control': 'public, max-age=300' } });
};
