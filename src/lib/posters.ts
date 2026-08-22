import { PB_URL } from './constants'

// Posters are stored on our own PocketBase, not hotlinked from TMDB: /manage
// uploads the w780 master at save time and PB serves the rendered widths from
// its preconfigured thumbs (see scripts/pb-poster-field.ts). The only TMDB
// images left are the search picker's candidates in /manage, which have no
// record yet; those go through our own proxy, never image.tmdb.org directly.

/** The widths PocketBase is configured to generate thumbs for. */
export type PosterSize = 185 | 342 | 500

export type PosterRef
	= | { kind: 'pb', recordId: string, file: string }
		| { kind: 'tmdb', path: string }

/** A stored poster, or null while a record still has none. */
export function posterRef(f: { id: string, poster?: string }): PosterRef | null {
	return f.poster ? { kind: 'pb', recordId: f.id, file: f.poster } : null
}

/** A TMDB search candidate: /manage only, resolved through our image proxy. */
export function tmdbRef(path: string | null | undefined): PosterRef | null {
	return path ? { kind: 'tmdb', path } : null
}

export function posterSrc(ref: PosterRef, size: PosterSize): string {
	return ref.kind === 'pb'
		? `${PB_URL}/api/files/films/${ref.recordId}/${ref.file}?thumb=${size}x0`
		: `/api/tmdb/poster/w${size}${ref.path}`
}

export function posterSrcset(ref: PosterRef, one: PosterSize, two: PosterSize): string {
	return `${posterSrc(ref, one)} 1x, ${posterSrc(ref, two)} 2x`
}
