import { describe, expect, it } from 'vitest'
import sizes from './painting-sizes.json'
import { paintings, roomForPath, site } from './site'

describe('roomForPath', () => {
	it('maps every route to its room', () => {
		expect(roomForPath('/')).toBe('home')
		expect(roomForPath('')).toBe('home')
		expect(roomForPath('/story')).toBe('story')
		expect(roomForPath('/likes')).toBe('likes')
		expect(roomForPath('/library')).toBe('library')
		expect(roomForPath('/films')).toBe('films')
		expect(roomForPath('/tools')).toBe('tools')
		expect(roomForPath('/music')).toBe('music')
		expect(roomForPath('/projects')).toBe('projects')
		expect(roomForPath('/contact')).toBe('contact')
		expect(roomForPath('/writing')).toBe('writing')
		expect(roomForPath('/writing/the-thin-line')).toBe('writing')
	})

	it('falls back to home for unknown paths', () => {
		expect(roomForPath('/nonsense')).toBe('home')
	})

	it('every mapped room has a painting entry', () => {
		const routes = [
			'/',
			'/story',
			'/projects',
			'/likes',
			'/library',
			'/films',
			'/music',
			'/tools',
			'/contact',
			'/writing',
		]
		for (const r of routes) {
			expect(paintings[roomForPath(r)]).toBeDefined()
		}
	})
	it('every painting key has generated size variants on disk', () => {
		// The manifest is written from the files in static/paintings, so a
		// painting whose key has no manifest entry would render a bare srcset
		// pointing at files that do not exist (the re-hang failure mode).
		for (const [room, p] of Object.entries(paintings)) {
			expect(sizes[p.key as keyof typeof sizes], `room "${room}" → key "${p.key}"`).toBeDefined()
		}
	})
})

describe('site config', () => {
	it('site url has no trailing slash (schema @ids depend on it)', () => {
		expect(site.url.endsWith('/')).toBe(false)
	})

	it('all socials are https', () => {
		for (const s of site.socials) {
			expect(s.href.startsWith('https://')).toBe(true)
		}
	})
})
