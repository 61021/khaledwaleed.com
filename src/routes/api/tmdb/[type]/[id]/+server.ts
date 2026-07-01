import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { FilmMeta } from '$lib/tmdb';

// Live metadata for one title, by TMDB id + media type (no /find hop needed).
// Cached hard at the edge + browser. Replaces the imdb-keyed /api/film/[id].
export const prerender = false;

type TmdbObj = Record<string, unknown>;
const names = (arr: unknown): string[] =>
	Array.isArray(arr) ? arr.map((x) => (x as TmdbObj).name as string).filter(Boolean) : [];

export const GET: RequestHandler = async ({ params, url, platform, fetch }) => {
	const type = params.type;
	const id = params.id;
	if ((type !== 'movie' && type !== 'tv') || !/^\d+$/.test(id))
		return json({ error: 'bad params' }, { status: 400 });

	const cache = (globalThis as { caches?: { default?: Cache } }).caches?.default;
	const cacheKey = new Request(`${url.origin}${url.pathname}`);
	if (cache) {
		const hit = await cache.match(cacheKey);
		if (hit) return hit;
	}

	const cf = (platform as { env?: Record<string, string | undefined> } | undefined)?.env ?? {};
	const key = cf.TMDB_API_KEY ?? env.TMDB_API_KEY;
	if (!key) return json({ error: 'TMDB key not configured' }, { status: 503 });

	const path = type === 'movie' ? `/movie/${id}?append_to_response=credits` : `/tv/${id}`;
	const r = await fetch(
		`https://api.themoviedb.org/3${path}${path.includes('?') ? '&' : '?'}api_key=${key}`,
		{ headers: { Accept: 'application/json' } }
	);
	if (!r.ok) return json({ error: 'not found' }, { status: 404 });
	const d = (await r.json()) as TmdbObj;

	let meta: FilmMeta;
	if (type === 'movie') {
		const crew = ((d.credits as TmdbObj)?.crew as TmdbObj[]) ?? [];
		meta = {
			title: (d.title as string) ?? '',
			year: Number(String(d.release_date ?? '').slice(0, 4)) || 0,
			type: 'Movie',
			runtime: (d.runtime as number) || null,
			genres: names(d.genres),
			directors: crew.filter((c) => c.job === 'Director').map((c) => c.name as string),
			posterPath: (d.poster_path as string) ?? null
		};
	} else {
		meta = {
			title: (d.name as string) ?? '',
			year: Number(String(d.first_air_date ?? '').slice(0, 4)) || 0,
			type: /miniseries/i.test(String(d.type ?? '')) ? 'TV Mini Series' : 'TV Series',
			runtime: (d.episode_run_time as number[])?.[0] ?? null,
			genres: names(d.genres),
			directors: names(d.created_by),
			posterPath: (d.poster_path as string) ?? null
		};
	}

	const res = json(meta, {
		headers: { 'cache-control': 'public, max-age=604800, s-maxage=2592000' }
	});
	if (cache) {
		const ctx = (
			platform as { context?: { waitUntil?: (p: Promise<unknown>) => void } } | undefined
		)?.context;
		ctx?.waitUntil?.(cache.put(cacheKey, res.clone()));
	}
	return res;
};
