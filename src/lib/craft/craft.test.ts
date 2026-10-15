import type { CraftItem, CraftMedia } from './types'
import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { craftTiles, deal, monthLabel } from './craft'
import { items } from './items'
import media from './media.json'

const still: CraftMedia = { width: 1280, height: 720, seconds: 0, poster: 'x.webp', lqip: 'data:,' }

function item(id: string, made: string): CraftItem {
	return { id, title: id, project: 'p', about: 'a', made, ground: 'dark' }
}

describe('monthLabel', () => {
	it('spells the month out', () => {
		expect(monthLabel('2026-08')).toBe('August 2026')
		expect(monthLabel('2020-01')).toBe('January 2020')
		expect(monthLabel('2024-12')).toBe('December 2024')
	})
})

describe('craftTiles', () => {
	it('orders newest first and keeps registry order inside a month', () => {
		const list = [item('a', '2025-01'), item('b', '2026-03'), item('c', '2026-03'), item('d', '2026-09')]
		const tiles = craftTiles(list, { a: still, b: still, c: still, d: still })
		expect(tiles.map(t => t.id)).toEqual(['d', 'b', 'c', 'a'])
		expect(tiles.map(t => t.order)).toEqual([0, 1, 2, 3])
	})

	it('leaves out anything without media', () => {
		const tiles = craftTiles([item('a', '2025-01'), item('b', '2026-03')], { a: still })
		expect(tiles.map(t => t.id)).toEqual(['a'])
	})
})

describe('deal', () => {
	it('deals left to right so the top row reads newest first', () => {
		expect(deal([1, 2, 3, 4, 5, 6, 7], 3)).toEqual([[1, 4, 7], [2, 5], [3, 6]])
		expect(deal([1, 2, 3], 1)).toEqual([[1, 2, 3]])
	})
})

describe('the wall', () => {
	it('gives every tile its media, on disk', () => {
		const library = media as Record<string, CraftMedia>
		for (const tile of items) {
			const m = library[tile.id]
			expect(m, tile.id).toBeDefined()
			expect(existsSync(`static/craft-media/${m.poster}`), m.poster).toBe(true)
			if (m.video)
				expect(existsSync(`static/craft-media/${m.video}`), m.video).toBe(true)
		}
	})

	it('dates every tile as a real month and links only with a label', () => {
		const ids = new Set<string>()
		for (const tile of items) {
			expect(tile.made, tile.id).toMatch(/^20\d\d-(?:0[1-9]|1[0-2])$/)
			expect(ids.has(tile.id), tile.id).toBe(false)
			ids.add(tile.id)
			if (tile.href)
				expect(tile.link, tile.id).toBeDefined()
			expect(tile.about.endsWith('.'), tile.id).toBe(true)
			expect(`${tile.title} ${tile.about}`, tile.id).not.toMatch(/[\u2013\u2014]/)
		}
	})
})
