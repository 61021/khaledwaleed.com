// Film data lives in films.json — the single, hand-edited source of truth.
// To change anything (add a title, tweak a rating, set `watched`), edit that
// file directly. Originally imported from an IMDb ratings export; the CSV and
// its generator are gone — this is maintained by hand now.

import data from './films.json';

export type TitleType =
	| 'Movie'
	| 'TV Series'
	| 'TV Mini Series'
	| 'Short'
	| 'TV Movie'
	| (string & {});

export interface Film {
	/** IMDb const, e.g. tt0166924 */
	id: string;
	title: string;
	year: number;
	type: TitleType;
	/** Personal rating, 1–10 */
	rating: number;
	/** Public IMDb rating */
	imdbRating: number;
	/** Runtime in minutes, when known */
	runtime: number | null;
	genres: string[];
	directors: string[];
	/** Date rated, ISO yyyy-mm-dd */
	rated: string;
	url: string;
	/** Times watched (default 1) */
	watched: number;
}

export const films: Film[] = data as Film[];
