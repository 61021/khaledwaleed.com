#!/usr/bin/env bun
/**
 * Fetch the Zodiak web fonts into src/lib/fonts/files/ (gitignored).
 * Zodiak is free (Fontshare, Indian Type Foundry) but its EULA forbids
 * redistribution, including "uploading them in a public server" — so the
 * binaries stay out of this public repo and are pinned here by
 * content-addressed CDN URL + sha256 instead, fetched before dev/build.
 * The .woff (v1) italic exists only for satori (og.ts and
 * scripts/generate-icons.ts), which reads neither woff2 nor variable fonts.
 */
import path from 'node:path';

const DIR = path.resolve('src/lib/fonts/files');

const FILES = [
	{
		name: 'zodiak-400-normal.woff2',
		url: 'https://cdn.fontshare.com/wf/ECUEQQ5BLZLFJS3PPLWOEEVS7SQONQMH/WNTXEMDDVWUVWDURRKDXCJC6G7TMP277/TBWKTFSYABV4KN4GNIJMAOQUOTYBUWB3.woff2',
		sha256: '81bf124d17416df8fb656393c46fb34bb74e5d472f07cec9ab295269f372098a'
	},
	{
		name: 'zodiak-400-italic.woff2',
		url: 'https://cdn.fontshare.com/wf/YFLZBMMI3DYRSZHBNXVNB72OCINBINIT/AJUISU4RPSUOUSQPHGNMFKZ4M6TTQGWF/HUKQ64PZXOIVT5LHOHNUDCYHXBK5OR45.woff2',
		sha256: '63af701809888107dcb1d97912db01f713602b83f58b86a67ec404675f8ed0dd'
	},
	{
		name: 'zodiak-400-italic.woff',
		url: 'https://cdn.fontshare.com/wf/YFLZBMMI3DYRSZHBNXVNB72OCINBINIT/AJUISU4RPSUOUSQPHGNMFKZ4M6TTQGWF/HUKQ64PZXOIVT5LHOHNUDCYHXBK5OR45.woff',
		sha256: '8c220c43f0f31fc06e1f5f647caff4a1cb6774592cf3e77cd73538f7e0613e1c'
	}
];

const sha256 = (data: ArrayBuffer) => new Bun.CryptoHasher('sha256').update(data).digest('hex');

for (const file of FILES) {
	const dest = path.join(DIR, file.name);
	const existing = Bun.file(dest);
	if ((await existing.exists()) && sha256(await existing.arrayBuffer()) === file.sha256) continue;

	const res = await fetch(file.url);
	if (!res.ok) throw new Error(`${file.name}: HTTP ${res.status} from ${file.url}`);
	const data = await res.arrayBuffer();
	const hash = sha256(data);
	if (hash !== file.sha256)
		throw new Error(
			`${file.name}: sha256 mismatch (got ${hash}); Fontshare re-released Zodiak, re-pin the URLs and hashes`
		);
	await Bun.write(dest, data);
	console.log(`${file.name} (${(data.byteLength / 1024).toFixed(0)} KB)`);
}
