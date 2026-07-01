import PocketBase, { type RecordModel } from 'pocketbase';
import type { MediaType } from './tmdb';

// PocketBase lives on the Contabo box (same as Rocca), exposed over HTTPS so the
// browser can talk to it from this HTTPS site. Wire api.khaledwaleed.com → PB in CF.
export const PB_URL = 'https://api.khaledwaleed.com';

export const pb = new PocketBase(PB_URL);

/** One row in the `films` collection — your data per title. */
export interface FilmRecord extends RecordModel {
	tmdbId: number;
	type: MediaType;
	rating: number;
	watched: number;
	/** yyyy-mm-dd */
	watchedOn: string;
	notes?: string;
	/** Stored, but never rendered on the public site. */
	privateNotes?: string;
}

/** Fields written when adding/updating a title. */
export type FilmInput = {
	tmdbId: number;
	type: MediaType;
	rating: number;
	watched: number;
	watchedOn: string;
	notes?: string;
	privateNotes?: string;
};
