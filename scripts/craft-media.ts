#!/usr/bin/env node
/**
 * Bring recorded clips onto the craft wall.
 *
 * Each recording directory holds `<id>.mp4` (or none, for a still),
 * `<id>.webp` (the poster, the loop's first frame) and `meta.json`
 * (size, loop length, a 24px placeholder). They land in
 * `static/craft-media/` under content-hashed names, since that folder
 * is cached immutable, and `src/lib/craft/media.json` records them.
 *
 *   node scripts/craft-media.ts <recordings-dir> [id ...]
 *
 * With no ids, every recording in the directory is brought over.
 * The share card (static/og-craft.png) is redrawn from the six newest
 * tiles on the wall every run.
 */
import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import sharp from 'sharp'
import { items } from '../src/lib/craft/items.ts'

interface Recorded {
	width: number
	height: number
	seconds: number
	lqip: string
}

const [source, ...only] = process.argv.slice(2)
if (!source) {
	console.error('usage: node scripts/craft-media.ts <recordings-dir> [id ...]')
	process.exit(1)
}

const OUT = path.resolve('static/craft-media')
const MANIFEST = path.resolve('src/lib/craft/media.json')
const manifest: Record<string, unknown> = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {}

function hashed(file: string, id: string, ext: string): string {
	const bytes = readFileSync(file)
	const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 10)
	const name = `${id}.${hash}.${ext}`
	writeFileSync(path.join(OUT, name), bytes)
	return name
}

const ids = only.length
	? only
	: readdirSync(source, { withFileTypes: true }).filter(d => d.isDirectory() && !d.name.startsWith('_')).map(d => d.name)

for (const id of ids) {
	const dir = path.join(source, id)
	const metaFile = path.join(dir, 'meta.json')
	const poster = path.join(dir, `${id}.webp`)
	if (!existsSync(metaFile) || !existsSync(poster)) {
		console.warn(`skip ${id}: no meta.json or poster`)
		continue
	}
	const meta = JSON.parse(readFileSync(metaFile, 'utf8')) as Recorded
	for (const old of readdirSync(OUT).filter(f => f.startsWith(`${id}.`)))
		rmSync(path.join(OUT, old))
	const clip = path.join(dir, `${id}.mp4`)
	manifest[id] = {
		width: meta.width,
		height: meta.height,
		seconds: existsSync(clip) ? meta.seconds : 0,
		...(existsSync(clip) ? { video: hashed(clip, id, 'mp4') } : {}),
		poster: hashed(poster, id, 'webp'),
		lqip: meta.lqip,
	}
	console.log(`${id}: ${meta.width}x${meta.height}`)
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)))
writeFileSync(MANIFEST, `${JSON.stringify(sorted, null, '\t')}\n`)

// The share card: the top of the wall, six posters on the wall's grey.
const W = 1200
const H = 630
const GAP = 8
const COLS = 3
const ROWS = 2
const cellW = Math.floor((W - GAP * (COLS + 1)) / COLS)
const cellH = Math.floor((H - GAP * (ROWS + 1)) / ROWS)
const newest = items
	.map((item, i) => ({ item, i }))
	.filter(({ item }) => sorted[item.id])
	.sort((a, b) => b.item.made.localeCompare(a.item.made) || a.i - b.i)
	.slice(0, COLS * ROWS)
	.map(({ item }) => sorted[item.id] as { poster: string })
if (newest.length === COLS * ROWS) {
	const corner = Buffer.from(`<svg width="${cellW}" height="${cellH}"><rect width="${cellW}" height="${cellH}" rx="12" ry="12"/></svg>`)
	const cells = await Promise.all(newest.map(async (m, i) => ({
		input: await sharp(path.join(OUT, m.poster))
			.resize(cellW, cellH, { fit: 'cover' })
			.composite([{ input: corner, blend: 'dest-in' }])
			.png()
			.toBuffer(),
		left: GAP + (i % COLS) * (cellW + GAP),
		top: GAP + Math.floor(i / COLS) * (cellH + GAP),
	})))
	await sharp({ create: { width: W, height: H, channels: 3, background: '#161616' } })
		.composite(cells)
		.png({ compressionLevel: 9 })
		.toFile(path.resolve('static/og-craft.png'))
	console.log('share card: static/og-craft.png')
}
