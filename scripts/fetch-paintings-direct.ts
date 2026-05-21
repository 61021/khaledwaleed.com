#!/usr/bin/env bun
/** Fetch the 4 paintings that lack Wikipedia summary articles. */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

type Item = {
	slug: string;
	file: string;
	/** request width passed to Special:FilePath; omit for original */
	srcWidth?: number;
	/** output max width (default 2000) */
	outWidth?: number;
	avifQuality?: number;
	webpQuality?: number;
	/** apply mild unsharp mask — useful for soft handheld museum captures */
	sharpen?: boolean;
};

const items: Item[] = [
	{
		slug: 'post-baghdad',
		file: 'Johan_Christian_Claussen_Dahl_-_A_Mother_and_Child_by_the_Sea.jpg'
	},
	{
		slug: 'post-hiring',
		file: 'Caspar_David_Friedrich_-_Cross_in_the_Mountains_(Tetschen_Altar)_-_WGA08237.jpg'
	},
	{
		slug: 'now',
		file: 'Caspar_David_Friedrich_-_Riesengebirge_Landscape_with_Rising_Fog_-_WGA8257.jpg'
	},
	{
		slug: 'contact',
		file: 'JC_Dahl,_Frederiksborg_slot_i_måneskin,_1817,_KMS967,_Statens_Museum_for_Kunst.jpg',
		srcWidth: 3200,
		outWidth: 2400
	},
	{
		// Google Art Project scan from Alte Nationalgalerie — 3543×2710, sharp.
		slug: 'likes',
		file: 'Caspar_David_Friedrich_-_Mondaufgang_am_Meer_-_Google_Art_Project.jpg',
		srcWidth: 3200,
		outWidth: 2400
	}
];

const OUT = path.resolve('static/paintings');

for (const item of items) {
	const {
		slug,
		file,
		srcWidth,
		outWidth = 2000,
		avifQuality = 55,
		webpQuality = 78,
		sharpen
	} = item;
	// Special:FilePath redirects to the actual uploaded file.
	const widthParam = srcWidth
		? `?width=${srcWidth}`
		: srcWidth === undefined && !sharpen
			? '?width=2400'
			: '';
	const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}${widthParam}`;
	console.log(`fetch ${slug} ← ${file}${widthParam || ' (original)'}`);
	const res = await fetch(url, {
		headers: { 'User-Agent': 'khaledwaleed.com painting fetcher (contact@khaledwaleed.com)' }
	});
	if (!res.ok) {
		console.error(`  ✗ ${res.status}`);
		continue;
	}
	const src = Buffer.from(await res.arrayBuffer());
	let pipeline = sharp(src, { failOn: 'error' }).rotate().resize({
		width: outWidth,
		height: outWidth,
		fit: 'inside',
		withoutEnlargement: true,
		kernel: 'lanczos3'
	});
	if (sharpen) pipeline = pipeline.sharpen({ sigma: 0.6, m1: 0.5, m2: 2 });
	const base = pipeline;
	const avifOpts = sharpen
		? { quality: avifQuality, effort: 8, chromaSubsampling: '4:4:4' as const }
		: { quality: avifQuality, effort: 6 };
	const avif = await base.clone().avif(avifOpts).toBuffer();
	const webp = await base.clone().webp({ quality: webpQuality }).toBuffer();
	await writeFile(path.join(OUT, `${slug}.avif`), avif);
	await writeFile(path.join(OUT, `${slug}.webp`), webp);
	const meta = await sharp(src).metadata();
	console.log(
		`  ✓ ${meta.width}×${meta.height}, avif ${Math.round(avif.byteLength / 1024)}kb, webp ${Math.round(webp.byteLength / 1024)}kb`
	);
}
