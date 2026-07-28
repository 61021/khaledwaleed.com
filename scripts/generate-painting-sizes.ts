#!/usr/bin/env bun
/**
 * Generate responsive width variants for the hero paintings.
 *
 * Reads each committed `static/paintings/<key>.webp` (the 2000px master),
 * emits `<key>-720.{avif,webp}` and `<key>-1280.{avif,webp}` alongside it,
 * and writes `src/lib/painting-sizes.json` — a manifest of the TRUE pixel
 * widths available per key, which Painting.svelte uses to build honest
 * `srcset` w-descriptors (portrait canvases are narrower than 2000px).
 *
 * Idempotent: re-encoding a downscale of the q78 webp master is visually
 * lossless at these sizes. Run after adding a new painting:
 *   bun run scripts/generate-painting-sizes.ts
 */
import { readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const DIR = path.resolve('static/paintings');
const MANIFEST = path.resolve('src/lib/painting-sizes.json');
const TARGET_WIDTHS = [720, 1280];

const files = (await readdir(DIR)).filter((f) => /^[a-z0-9]+\.webp$/.test(f));

const manifest: Record<string, { widths: number[]; width: number; height: number }> = {};

for (const file of files.sort()) {
	const key = file.replace(/\.webp$/, '');
	const master = path.join(DIR, file);
	const meta = await sharp(master).metadata();
	const masterWidth = meta.width ?? 0;
	const masterHeight = meta.height ?? 0;
	if (!masterWidth || !masterHeight) {
		console.warn(`skip ${key}: no dimensions`);
		continue;
	}

	const widths: number[] = [];
	for (const w of TARGET_WIDTHS) {
		if (w >= masterWidth) continue; // never upscale
		const avifOut = path.join(DIR, `${key}-${w}.avif`);
		const webpOut = path.join(DIR, `${key}-${w}.webp`);
		if (!existsSync(avifOut) || !existsSync(webpOut)) {
			const base = sharp(master).resize({ width: w });
			await base.clone().avif({ quality: 55, effort: 6 }).toFile(avifOut);
			await base.clone().webp({ quality: 78 }).toFile(webpOut);
		}
		widths.push(w);
	}
	widths.push(masterWidth); // the existing <key>.{avif,webp} master
	manifest[key] = { widths, width: masterWidth, height: masterHeight };
	console.log(`${key}: ${widths.join(', ')} (${masterWidth}×${masterHeight})`);
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, '\t') + '\n');
console.log(`wrote ${MANIFEST}`);
