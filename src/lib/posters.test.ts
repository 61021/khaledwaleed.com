import { describe, expect, it } from 'vitest'
import { posterRef, posterSrc, posterSrcset, tmdbRef } from './posters'

const stored = { id: 'co01u9erkri9fcc', poster: 'vug1dvDI1tSa60Z8qjCuUE7ntkO_9fzX2k1p8m.jpg' }

describe('posterRef', () => {
	it('points at the stored file', () => {
		expect(posterRef(stored)).toEqual({
			kind: 'pb',
			recordId: stored.id,
			file: stored.poster,
		})
	})

	it('is null until a record has one', () => {
		expect(posterRef({ id: 'co01u9erkri9fcc' })).toBeNull()
		expect(posterRef({ id: 'co01u9erkri9fcc', poster: '' })).toBeNull()
	})
})

describe('tmdbRef', () => {
	it('is null for a title TMDB has no poster for', () => {
		expect(tmdbRef(null)).toBeNull()
		expect(tmdbRef('')).toBeNull()
	})
})

describe('posterSrc', () => {
	it('asks PocketBase for a preconfigured thumb width', () => {
		expect(posterSrc(posterRef(stored)!, 185)).toBe(
			`https://api.khaledwaleed.com/api/files/films/${stored.id}/${stored.poster}?thumb=185x0`,
		)
	})

	it('routes TMDB candidates through our own proxy, never image.tmdb.org', () => {
		const src = posterSrc(tmdbRef('/abc.jpg')!, 342)
		expect(src).toBe('/api/tmdb/poster/w342/abc.jpg')
		expect(src).not.toContain('image.tmdb.org')
	})
})

describe('posterSrcset', () => {
	it('pairs a width with its retina step', () => {
		expect(posterSrcset(tmdbRef('/abc.jpg')!, 185, 342)).toBe(
			'/api/tmdb/poster/w185/abc.jpg 1x, /api/tmdb/poster/w342/abc.jpg 2x',
		)
	})
})
