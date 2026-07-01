// Shared TMDB shapes used by the /api/tmdb routes, the manage page, and (later)
// the public films page. We key titles by TMDB id + media type now (no IMDb id).

export type MediaType = 'movie' | 'tv';

/** A row in the TMDB search results, enough to pick + store. */
export type SearchResult = {
	tmdbId: number;
	mediaType: MediaType;
	title: string;
	year: number;
	posterPath: string | null;
};

/** Full display metadata for one title. */
export type FilmMeta = {
	title: string;
	year: number;
	type: 'Movie' | 'TV Series' | 'TV Mini Series' | (string & {});
	runtime: number | null;
	genres: string[];
	/** Director(s) for films; creator(s) for TV. */
	directors: string[];
	posterPath: string | null;
};
