import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

// Live data — read from Spotify at request time, not prerendered.
export const prerender = false;

const RANGES = { short: 'short_term', medium: 'medium_term', long: 'long_term' } as const;
type RangeKey = keyof typeof RANGES;

type SpotImg = { url: string };
type SpotTrack = {
	name: string;
	external_urls?: { spotify?: string };
	artists?: { name: string }[];
	album?: { images?: SpotImg[] };
};
type SpotArtist = { name: string; external_urls?: { spotify?: string }; images?: SpotImg[] };

export type Track = { name: string; artists: string; url: string; image: string | null };
export type Artist = { name: string; url: string; image: string | null };

// Access tokens last ~1h; reuse within a warm isolate.
let tokenCache: { value: string; expires: number } | null = null;

async function accessToken(id: string, secret: string, refresh: string): Promise<string | null> {
	if (tokenCache && tokenCache.expires > Date.now() + 60_000) return tokenCache.value;
	const res = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			Authorization: 'Basic ' + btoa(`${id}:${secret}`),
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh })
	});
	if (!res.ok) return null;
	const json = (await res.json()) as { access_token: string; expires_in: number };
	tokenCache = { value: json.access_token, expires: Date.now() + json.expires_in * 1000 };
	return json.access_token;
}

async function fetchTop<T>(
	token: string,
	type: 'tracks' | 'artists',
	range: string,
	limit: number
): Promise<T[]> {
	const res = await fetch(
		`https://api.spotify.com/v1/me/top/${type}?time_range=${range}&limit=${limit}`,
		{ headers: { Authorization: `Bearer ${token}` } }
	);
	if (!res.ok) return [];
	const json = (await res.json()) as { items?: T[] };
	return json.items ?? [];
}

export const load: PageServerLoad = async ({ url, platform, setHeaders }) => {
	const requested = (url.searchParams.get('range') ?? 'medium') as RangeKey;
	const rangeKey: RangeKey = requested in RANGES ? requested : 'medium';
	const range = RANGES[rangeKey];

	// Cloudflare runtime secrets live on platform.env; local dev reads .env.
	const cf = (platform as { env?: Record<string, string | undefined> } | undefined)?.env ?? {};
	const id = cf.SPOTIFY_CLIENT_ID ?? env.SPOTIFY_CLIENT_ID;
	const secret = cf.SPOTIFY_CLIENT_SECRET ?? env.SPOTIFY_CLIENT_SECRET;
	const refresh = cf.SPOTIFY_REFRESH_TOKEN ?? env.SPOTIFY_REFRESH_TOKEN;

	const empty = { ok: false, range: rangeKey, tracks: [] as Track[], artists: [] as Artist[] };
	if (!id || !secret || !refresh) return empty;

	const token = await accessToken(id, secret, refresh);
	if (!token) return empty;

	const [rawTracks, rawArtists] = await Promise.all([
		fetchTop<SpotTrack>(token, 'tracks', range, 12),
		fetchTop<SpotArtist>(token, 'artists', range, 8)
	]);

	const tracks: Track[] = rawTracks.map((t) => ({
		name: t.name,
		artists: (t.artists ?? []).map((a) => a.name).join(', '),
		url: t.external_urls?.spotify ?? 'https://open.spotify.com',
		image: t.album?.images?.[1]?.url ?? t.album?.images?.[0]?.url ?? null
	}));
	const artists: Artist[] = rawArtists.map((a) => ({
		name: a.name,
		url: a.external_urls?.spotify ?? 'https://open.spotify.com',
		image: a.images?.[1]?.url ?? a.images?.[0]?.url ?? null
	}));

	// Top lists change slowly — let the edge cache the response for an hour.
	setHeaders({ 'cache-control': 'public, max-age=3600' });

	return { ok: tracks.length > 0 || artists.length > 0, range: rangeKey, tracks, artists };
};
