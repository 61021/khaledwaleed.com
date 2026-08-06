import { describe, expect, test } from 'vitest';
import { paintings, roomForPath, site } from './site';
import sizes from './painting-sizes.json';

describe('roomForPath', () => {
	test('maps every route to its room', () => {
		expect(roomForPath('/')).toBe('home');
		expect(roomForPath('')).toBe('home');
		expect(roomForPath('/about')).toBe('about');
		expect(roomForPath('/likes')).toBe('likes');
		expect(roomForPath('/library')).toBe('library');
		expect(roomForPath('/films')).toBe('films');
		expect(roomForPath('/music')).toBe('music');
		expect(roomForPath('/projects')).toBe('projects');
		expect(roomForPath('/contact')).toBe('contact');
		expect(roomForPath('/writing')).toBe('writing');
		expect(roomForPath('/writing/the-thin-line')).toBe('writing');
	});

	test('falls back to home for unknown paths', () => {
		expect(roomForPath('/nonsense')).toBe('home');
	});

	test('every mapped room has a painting entry', () => {
		const routes = [
			'/',
			'/about',
			'/projects',
			'/likes',
			'/library',
			'/films',
			'/music',
			'/contact',
			'/writing'
		];
		for (const r of routes) {
			expect(paintings[roomForPath(r)]).toBeDefined();
		}
	});
	test('every painting key has generated size variants on disk', () => {
		// The manifest is written from the files in static/paintings, so a
		// painting whose key has no manifest entry would render a bare srcset
		// pointing at files that do not exist (the re-hang failure mode).
		for (const [room, p] of Object.entries(paintings)) {
			expect(sizes[p.key as keyof typeof sizes], `room "${room}" → key "${p.key}"`).toBeDefined();
		}
	});
});

describe('site config', () => {
	test('site url has no trailing slash (schema @ids depend on it)', () => {
		expect(site.url.endsWith('/')).toBe(false);
	});

	test('all socials are https', () => {
		for (const s of site.socials) {
			expect(s.href.startsWith('https://')).toBe(true);
		}
	});
});
