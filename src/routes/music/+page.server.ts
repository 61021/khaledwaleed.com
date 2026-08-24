import type { PageServerLoad } from './$types'
import { env } from '$env/dynamic/private'

// Live data: read from Spotify at request time, not prerendered.
export const prerender = false

const RANGES = { short: 'short_term', medium: 'medium_term', long: 'long_term' } as const
type RangeKey = keyof typeof RANGES

interface SpotImg { url: string }
interface SpotTrack {
	name: string
	external_urls?: { spotify?: string }
	artists?: { name: string }[]
	album?: { images?: SpotImg[] }
}
interface SpotArtist { name: string, external_urls?: { spotify?: string }, images?: SpotImg[] }
interface SpotPlayed { track?: SpotTrack, played_at?: string }

export interface Track { name: string, artists: string, url: string, image: string | null }
export interface Artist { name: string, url: string, image: string | null }
export type Played = Track & { playedAt: string }

// Access tokens last ~1h; reuse within a warm isolate.
let tokenCache: { value: string, expires: number } | null = null

async function accessToken(id: string, secret: string, refresh: string): Promise<string | null> {
	if (tokenCache && tokenCache.expires > Date.now() + 60_000)
		return tokenCache.value
	const res = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Authorization': `Basic ${btoa(`${id}:${secret}`)}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh }),
	})
	if (!res.ok)
		return null
	const json = (await res.json()) as { access_token: string, expires_in: number }
	tokenCache = { value: json.access_token, expires: Date.now() + json.expires_in * 1000 }
	return json.access_token
}

async function fetchTop<T>(
	token: string,
	type: 'tracks' | 'artists',
	range: string,
	limit: number,
): Promise<T[]> {
	const res = await fetch(
		`https://api.spotify.com/v1/me/top/${type}?time_range=${range}&limit=${limit}`,
		{ headers: { Authorization: `Bearer ${token}` } },
	)
	if (!res.ok)
		return []
	const json = (await res.json()) as { items?: T[] }
	return json.items ?? []
}

async function fetchRecent(token: string, limit: number): Promise<SpotPlayed[]> {
	const res = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, {
		headers: { Authorization: `Bearer ${token}` },
	})
	if (!res.ok)
		return []
	const json = (await res.json()) as { items?: SpotPlayed[] }
	return json.items ?? []
}

export const load: PageServerLoad = async ({ url, platform, setHeaders }) => {
	const requested = (url.searchParams.get('range') ?? 'medium') as RangeKey
	const rangeKey: RangeKey = requested in RANGES ? requested : 'medium'
	const range = RANGES[rangeKey]

	// Cloudflare runtime secrets live on platform.env; local dev reads .env.
	const cf = (platform as { env?: Record<string, string | undefined> } | undefined)?.env ?? {}
	const id = cf.SPOTIFY_CLIENT_ID ?? env.SPOTIFY_CLIENT_ID
	const secret = cf.SPOTIFY_CLIENT_SECRET ?? env.SPOTIFY_CLIENT_SECRET
	const refresh = cf.SPOTIFY_REFRESH_TOKEN ?? env.SPOTIFY_REFRESH_TOKEN

	const empty = {
		ok: false,
		range: rangeKey,
		tracks: [] as Track[],
		artists: [] as Artist[],
		recent: [] as Played[],
		renderedAt: new Date().toISOString(),
	}
	if (!id || !secret || !refresh)
		return empty

	const token = await accessToken(id, secret, refresh)
	if (!token)
		return empty

	const [rawTracks, rawArtists, rawRecent] = await Promise.all([
		fetchTop<SpotTrack>(token, 'tracks', range, 12),
		fetchTop<SpotArtist>(token, 'artists', range, 8),
		fetchRecent(token, 8),
	])

	const tracks: Track[] = rawTracks.map(t => ({
		name: t.name,
		artists: (t.artists ?? []).map(a => a.name).join(', '),
		url: t.external_urls?.spotify ?? 'https://open.spotify.com',
		image: t.album?.images?.[1]?.url ?? t.album?.images?.[0]?.url ?? null,
	}))
	const artists: Artist[] = rawArtists.map(a => ({
		name: a.name,
		url: a.external_urls?.spotify ?? 'https://open.spotify.com',
		image: a.images?.[1]?.url ?? a.images?.[0]?.url ?? null,
	}))
	const recent: Played[] = rawRecent
		.filter(r => r.track && r.played_at)
		.map(r => ({
			name: r.track!.name,
			artists: (r.track!.artists ?? []).map(a => a.name).join(', '),
			url: r.track!.external_urls?.spotify ?? 'https://open.spotify.com',
			image: r.track!.album?.images?.[2]?.url ?? r.track!.album?.images?.[0]?.url ?? null,
			playedAt: r.played_at!,
		}))

	// Fresh enough for "last spins" without hammering Spotify: ten minutes.
	setHeaders({ 'cache-control': 'public, max-age=600' })

	return {
		ok: tracks.length > 0 || artists.length > 0 || recent.length > 0,
		range: rangeKey,
		tracks,
		artists,
		recent,
		// Stamped so the relative timestamps hydrate against the same clock
		// that rendered them; this HTML can be minutes old at the edge.
		renderedAt: new Date().toISOString(),
	}
}
