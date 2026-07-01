import type { PageServerLoad } from './$types';

// Your data (ratings, watch dates, notes) lives in PocketBase on the Contabo
// box, so titles you add from /manage show up here immediately. We read it at
// request time (this page is NOT prerendered) and ask PocketBase for only the
// public fields — `privateNotes` is never requested, so it can't reach the
// browser. Everything descriptive (title, poster, …) is fetched live from
// /api/tmdb/[type]/[id] on the client.
export const prerender = false;

const PB_URL = 'https://api.khaledwaleed.com';
const PUBLIC_FIELDS = 'tmdbId,type,rating,watched,watchedOn,notes';

type PbItem = {
	tmdbId: number;
	type: 'movie' | 'tv';
	rating: number;
	watched?: number;
	watchedOn?: string;
	notes?: string;
};

export type PersonalFilm = {
	tmdbId: number;
	type: 'movie' | 'tv';
	rating: number;
	watched: number;
	watchedOn: string;
	notes?: string;
};

export const load: PageServerLoad = async ({ fetch }) => {
	let items: PbItem[] = [];
	try {
		const res = await fetch(
			`${PB_URL}/api/collections/films/records?perPage=500&fields=${PUBLIC_FIELDS}&sort=-rating,-watchedOn`
		);
		if (res.ok) {
			const body = (await res.json()) as { items?: PbItem[] };
			items = body.items ?? [];
		}
	} catch {
		// If PocketBase is unreachable, render an empty log rather than a 500.
	}

	const films: PersonalFilm[] = items.map((f) => ({
		tmdbId: f.tmdbId,
		type: f.type,
		rating: f.rating,
		watched: f.watched ?? 1,
		watchedOn: f.watchedOn ?? '',
		...(f.notes ? { notes: f.notes } : {})
		// privateNotes is never requested, so it is never included
	}));

	// Canonical order: rating desc, then most-recently watched.
	films.sort((a, b) => b.rating - a.rating || b.watchedOn.localeCompare(a.watchedOn));

	return { films };
};
