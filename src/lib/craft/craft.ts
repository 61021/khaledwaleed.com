import type { CraftItem, CraftLink, CraftMedia, CraftTile } from './types'
import { items } from './items'
import media from './media.json'

export const LINK_LABEL: Record<CraftLink, string> = {
	production: 'View production',
	prototype: 'View prototype',
	study: 'Read the study',
	essay: 'Read the essay',
	code: 'View the pull request',
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/** "2026-08" → "August 2026". */
export function monthLabel(made: string): string {
	const [year, month] = made.split('-').map(Number)
	return `${MONTHS[month - 1]} ${year}`
}

/** Every tile with media, newest first; same-month pieces keep registry order. */
export function craftTiles(list: readonly CraftItem[] = items, library: Record<string, CraftMedia> = media): CraftTile[] {
	return list
		.map((item, i) => ({ item, i }))
		.filter(({ item }) => library[item.id])
		.sort((a, b) => b.item.made.localeCompare(a.item.made) || a.i - b.i)
		.map(({ item }, order) => ({ ...item, media: library[item.id], order }))
}

/**
 * Deal the tiles across n columns like cards, left to right, so reading
 * across the top row still runs newest to oldest.
 */
export function deal<T>(tiles: readonly T[], n: number): T[][] {
	const columns: T[][] = Array.from({ length: n }, () => [])
	tiles.forEach((tile, i) => columns[i % n].push(tile))
	return columns
}
