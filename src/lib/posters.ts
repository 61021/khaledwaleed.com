import { POSTERS_URL } from './constants'

// Posters are stored in our own R2 bucket, not hotlinked from TMDB: /manage
// copies TMDB's w185/w342/w500/w780 renditions at save time, one object per
// width. The only TMDB images left are the search picker's candidates in
// /manage, which have no record yet; those go through our own proxy, never
// image.tmdb.org directly.

/** The widths rendered on the site. */
export type PosterSize = 185 | 342 | 500

/** Every width stored per poster; 780 is the master. */
export const STORED_WIDTHS = [185, 342, 500, 780] as const
export type StoredWidth = (typeof STORED_WIDTHS)[number]

export type PosterRef
	= | { kind: 'stored', recordId: string, file: string }
		| { kind: 'tmdb', path: string }

/** The R2 object key of one stored width. */
export function posterKey(recordId: string, width: StoredWidth, file: string): string {
	return `films/${recordId}/w${width}/${file}`
}

/** A stored poster, or null while a record still has none. */
export function posterRef(f: { id: string, poster?: string }): PosterRef | null {
	return f.poster ? { kind: 'stored', recordId: f.id, file: f.poster } : null
}

/** A TMDB search candidate: /manage only, resolved through our image proxy. */
export function tmdbRef(path: string | null | undefined): PosterRef | null {
	return path ? { kind: 'tmdb', path } : null
}

export function posterSrc(ref: PosterRef, size: PosterSize): string {
	return ref.kind === 'stored'
		? `${POSTERS_URL}/${posterKey(ref.recordId, size, ref.file)}`
		: `/api/tmdb/poster/w${size}${ref.path}`
}

export function posterSrcset(ref: PosterRef, one: PosterSize, two: PosterSize): string {
	return `${posterSrc(ref, one)} 1x, ${posterSrc(ref, two)} 2x`
}
