#!/usr/bin/env bun
/**
 * Add (or update) a title in src/lib/films.json by IMDb id/URL.
 *
 * films.json stores ONLY your data per title:
 *   { id, rating, watched, watchedOn, notes?, privateNotes? }
 * Title / year / genres / poster and the rest are TMDB metadata, baked into
 * src/lib/films.ts by scripts/build-films.ts — which this script runs for you.
 *
 * Usage:
 *   bun run scripts/add-film.ts <imdb-id-or-url> <rating 1-10> [times-watched]
 *
 * Examples:
 *   bun run scripts/add-film.ts https://www.imdb.com/title/tt37287335/ 8
 *   bun run scripts/add-film.ts tt0111161 9 3
 *
 * Re-running on an existing id updates its rating / watched, keeping its
 * watchedOn date and any notes. Adding a NEW title needs TMDB_API_KEY in .env.
 * Write notes / privateNotes by hand-editing films.json.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

interface Entry {
	id: string;
	rating: number;
	watched: number;
	watchedOn: string;
	notes?: string;
	privateNotes?: string;
}

const SRC = path.resolve('src/lib/films.json');
const OUT = path.resolve('src/lib/films.ts');

const [rawId, rawRating, rawWatched] = process.argv.slice(2);
const id = rawId?.match(/tt\d+/)?.[0];
const rating = Number(rawRating);

if (!id) {
	console.error('Usage: bun run scripts/add-film.ts <imdb-id-or-url> <rating 1-10> [watched]');
	console.error(`  couldn't find an IMDb id (ttNNNNN) in "${rawId ?? ''}"`);
	process.exit(1);
}
if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
	console.error('✗ rating must be a whole number 1–10');
	process.exit(1);
}

const list: Entry[] = JSON.parse(readFileSync(SRC, 'utf8'));
const existing = list.find((f) => f.id === id);
const watched = rawWatched ? Number(rawWatched) : (existing?.watched ?? 1);

if (existing) {
	// Update only your data; keep watchedOn and any notes you've written.
	existing.rating = rating;
	existing.watched = watched;
} else {
	list.push({ id, rating, watched, watchedOn: new Date().toISOString().slice(0, 10) });
}

// Write a provisional films.json so the generator can see the new id …
writeFileSync(SRC, JSON.stringify(list, null, 2) + '\n');

// … then regenerate films.ts (TMDB only for the new id, cache for the rest).
const gen = spawnSync('bun', ['run', 'scripts/build-films.ts'], { stdio: 'inherit' });
if (gen.status !== 0) {
	console.error('✗ build-films failed — films.json was updated but films.ts was not rebuilt.');
	process.exit(gen.status ?? 1);
}

// Reorder films.json to match the canonical sort baked into films.ts.
const built = readFileSync(OUT, 'utf8');
const order = [...built.matchAll(/"id":\s*"(tt\d+)"/g)].map((m) => m[1]);
const rank = new Map(order.map((tid, i) => [tid, i] as const));
list.sort((a, b) => (rank.get(a.id) ?? 1e9) - (rank.get(b.id) ?? 1e9));
writeFileSync(SRC, JSON.stringify(list, null, 2) + '\n');

// Report.
const title = built.match(new RegExp(`"id":\\s*"${id}",\\s*"title":\\s*"([^"]+)"`))?.[1] ?? id;
console.log(`✓ ${existing ? 'Updated' : 'Added'}: ${title}`);
console.log(`  rating ${rating}/10 · seen ${watched}×`);
console.log(`  films.json now has ${list.length} titles. Run \`bun run build\` to ship.`);
