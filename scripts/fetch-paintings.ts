#!/usr/bin/env bun
/**
 * Fetch 10 paintings from Wikimedia and emit AVIF + WebP variants.
 * Run once: `bun run scripts/fetch-paintings.ts`.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

type Painting = {
	slug: string;
	wiki: string; // Wikipedia article title (English)
};

const paintings: Painting[] = [
	{ slug: 'home', wiki: 'View_of_Dresden_by_Moonlight' },
	{ slug: 'about', wiki: 'Two_Men_Contemplating_the_Moon' },
	{ slug: 'writing', wiki: 'The_Abbey_in_the_Oakwood' },
	{ slug: 'now', wiki: 'Riesengebirge_Landscape_with_Rising_Fog' },
	{ slug: 'likes', wiki: 'The_Bookworm_(Spitzweg)' },
	{ slug: 'contact', wiki: 'Frederiksborg_Castle_by_Moonlight' },
	{ slug: '404', wiki: 'The_Monk_by_the_Sea' }
];

const OUT_DIR = path.resolve('static/paintings');

async function getOriginalImageUrl(title: string): Promise<string> {
	const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
	const res = await fetch(url, {
		headers: { 'User-Agent': 'khaledwaleed.com painting fetcher (contact@khaledwaleed.com)' }
	});
	if (!res.ok) throw new Error(`summary ${title} ${res.status}`);
	const json = (await res.json()) as {
		originalimage?: { source: string };
		thumbnail?: { source: string };
	};
	const src = json.originalimage?.source ?? json.thumbnail?.source;
	if (!src) throw new Error(`no image for ${title}`);
	return src;
}

async function download(url: string): Promise<Buffer> {
	const res = await fetch(url, {
		headers: { 'User-Agent': 'khaledwaleed.com painting fetcher (contact@khaledwaleed.com)' }
	});
	if (!res.ok) throw new Error(`download ${url} ${res.status}`);
	return Buffer.from(await res.arrayBuffer());
}

async function process(slug: string, src: Buffer) {
	// Cap longest edge at 2000px (retina-ready for hero), preserve aspect.
	const base = sharp(src, { failOn: 'error' }).rotate().resize({
		width: 2000,
		height: 2000,
		fit: 'inside',
		withoutEnlargement: true
	});

	const avif = await base.clone().avif({ quality: 55, effort: 6 }).toBuffer();
	const webp = await base.clone().webp({ quality: 78 }).toBuffer();
	const meta = await sharp(src).metadata();

	await writeFile(path.join(OUT_DIR, `${slug}.avif`), avif);
	await writeFile(path.join(OUT_DIR, `${slug}.webp`), webp);

	return {
		slug,
		width: meta.width ?? null,
		height: meta.height ?? null,
		avifKb: Math.round(avif.byteLength / 1024),
		webpKb: Math.round(webp.byteLength / 1024)
	};
}

async function main() {
	if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });

	for (const p of paintings) {
		const avifPath = path.join(OUT_DIR, `${p.slug}.avif`);
		if (existsSync(avifPath)) {
			console.log(`skip ${p.slug} (exists)`);
			continue;
		}
		try {
			console.log(`fetch ${p.slug} ← ${p.wiki}`);
			const url = await getOriginalImageUrl(p.wiki);
			console.log(`  url: ${url}`);
			const src = await download(url);
			const out = await process(p.slug, src);
			console.log(`  ✓ ${out.width}×${out.height}, avif ${out.avifKb}kb, webp ${out.webpKb}kb`);
		} catch (e) {
			console.error(`  ✗ ${p.slug}: ${(e as Error).message}`);
		}
	}
}

main();
