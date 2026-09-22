import { describe, expect, it } from 'vitest'
import { posterKey, posterRef, posterSrc, posterSrcset, tmdbRef } from './posters'

const stored = { id: 'co01u9erkri9fcc', poster: 'vug1dv_di1t_sa60_z8qj_cu_ue7ntk_o_1as85yyjl0.jpg' }

describe('posterRef', () => {
	it('points at the stored file', () => {
		expect(posterRef(stored)).toEqual({
			kind: 'stored',
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

describe('posterKey', () => {
	it('files each width under the record', () => {
		expect(posterKey(stored.id, 780, stored.poster)).toBe(`films/${stored.id}/w780/${stored.poster}`)
	})
})

describe('posterSrc', () => {
	it('serves a stored width from the posters bucket', () => {
		expect(posterSrc(posterRef(stored)!, 185)).toBe(
			`https://posters.khaledwaleed.com/films/${stored.id}/w185/${stored.poster}`,
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
