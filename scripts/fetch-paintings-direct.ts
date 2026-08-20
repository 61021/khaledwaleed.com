#!/usr/bin/env node
import { Buffer } from 'node:buffer'
import { existsSync } from 'node:fs'
/** Fetch the paintings that need a specific Commons file (no usable Wikipedia summary image). */
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

interface Item {
	slug: string
	file: string
	/** request width passed to Special:FilePath; omit for original */
	srcWidth?: number
	/** output max width (default 2000) */
	outWidth?: number
	avifQuality?: number
	webpQuality?: number
	/** apply mild unsharp mask, useful for soft handheld museum captures */
	sharpen?: boolean
}

const items: Item[] = [
	// NOTE: keep outWidth ≤ 2000. Larger AVIFs (2400/2800 tried before) decode
	// but fail to composite in software-rendered/embedded Chromium and risk
	// decoded-size limits on mobile; the hero shows them as a blank wash.
	{
		// Hung on /contact when fetched; the room re-keyed to this
		// content-derived slug at e3d5937 (immutable-cache law).
		slug: 'frederiksborg',
		file: 'JC_Dahl,_Frederiksborg_slot_i_måneskin,_1817,_KMS967,_Statens_Museum_for_Kunst.jpg',
		srcWidth: 3200,
	},
	{
		// Google Art Project scan from Alte Nationalgalerie: 3543×2710, sharp.
		slug: 'likes',
		file: 'Caspar_David_Friedrich_-_Mondaufgang_am_Meer_-_Google_Art_Project.jpg',
		srcWidth: 3200,
	},
	{
		// Tiny oak panel (28×34 cm), only 1013×841 scan available on Commons.
		// Take the original and sharpen lightly for the chiaroscuro detail.
		slug: 'library',
		file: 'Rembrandt_-_The_Philosopher_in_Meditation.jpg',
		outWidth: 1013,
		avifQuality: 68,
		webpQuality: 86,
		sharpen: true,
	},
	{
		// 3481×2843 Google Art Project scan from the Walker Art Gallery.
		// Painted by the Diorama's inventor, and itself a Diorama subject:
		// a surviving still from cinema's prehistory.
		slug: 'films',
		file: 'The_Ruins_of_Holyrood_Chapel_(Louis_Daguerre),_1824_(Google_Art_Project).jpg',
		srcWidth: 3200,
	},
	{
		// NGA's 3267×4096 scan ("Rembrandt van Rijn (and Workshop?)" per
		// their catalogue). Hung on /writing 2026-08-15, replacing the Abbey
		// in the Oakwood and retiring the site's last room-named file key.
		slug: 'apostle',
		file: 'Saint Paul, Rembrandt van Rijn (and Workshop?), c. 1657.jpg',
		srcWidth: 3200,
	},
	{
		// NGI Dublin's 3689×4740 scan. Hung on /contact 2026-08-15 from a
		// six-way letters-and-windows tasting, replacing the Two Men: a
		// correspondence picture for the correspondence room.
		slug: 'man-writing',
		file: 'Man Writing a Letter by Gabriël Metsu.jpg',
		srcWidth: 3200,
	},
	{
		// Städel's 7991×8959 Google Art Project scan. Hung on /projects
		// 2026-08-20 from a six-way tasting, replacing Wright's Alchemist
		// and retiring the house's last room-named file key: the planner
		// mid-thought, dividers in hand, for the shipped-work page.
		slug: 'geographer',
		file: 'Johannes Vermeer - The Geographer - Google Art Project.jpg',
		srcWidth: 3200,
	},
]

const OUT = path.resolve('static/paintings')

for (const item of items) {
	const {
		slug,
		file,
		srcWidth,
		outWidth = 2000,
		avifQuality = 55,
		webpQuality = 78,
		sharpen,
	} = item
	if (existsSync(path.join(OUT, `${slug}.avif`))) {
		console.log(`skip ${slug} (exists)`)
		continue
	}
	// Special:FilePath redirects to the actual uploaded file.
	const widthParam = srcWidth
		? `?width=${srcWidth}`
		: srcWidth === undefined && !sharpen
			? '?width=2400'
			: ''
	const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}${widthParam}`
	console.log(`fetch ${slug} ← ${file}${widthParam || ' (original)'}`)
	const res = await fetch(url, {
		headers: { 'User-Agent': 'khaledwaleed.com painting fetcher (contact@khaledwaleed.com)' },
	})
	if (!res.ok) {
		console.error(`  ✗ ${res.status}`)
		continue
	}
	const src = Buffer.from(await res.arrayBuffer())
	let pipeline = sharp(src, { failOn: 'error' }).rotate().resize({
		width: outWidth,
		height: outWidth,
		fit: 'inside',
		withoutEnlargement: true,
		kernel: 'lanczos3',
	})
	if (sharpen)
		pipeline = pipeline.sharpen({ sigma: 0.6, m1: 0.5, m2: 2 })
	const base = pipeline
	const avifOpts = sharpen
		? { quality: avifQuality, effort: 8, chromaSubsampling: '4:4:4' as const }
		: { quality: avifQuality, effort: 6 }
	const avif = await base.clone().avif(avifOpts).toBuffer()
	const webp = await base.clone().webp({ quality: webpQuality }).toBuffer()
	await writeFile(path.join(OUT, `${slug}.avif`), avif)
	await writeFile(path.join(OUT, `${slug}.webp`), webp)
	const meta = await sharp(src).metadata()
	console.log(
		`  ✓ ${meta.width}×${meta.height}, avif ${Math.round(avif.byteLength / 1024)}kb, webp ${Math.round(webp.byteLength / 1024)}kb`,
	)
}
