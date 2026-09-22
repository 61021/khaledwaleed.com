import type { R2Bucket } from '@cloudflare/workers-types'
import { posterKey, STORED_WIDTHS } from '$lib/posters'

const TMDB_PATH = /^\/[\w-]+\.(?:jpg|jpeg|png|webp)$/

/** Stored poster keys never change in place, so browsers and the edge may keep them. */
const IMMUTABLE = 'public, max-age=31536000, immutable'

export function isTmdbPosterPath(path: unknown): path is string {
	return typeof path === 'string' && TMDB_PATH.test(path)
}

/**
 * Copy every stored width of a TMDB poster into the bucket under the record,
 * and return the filename to save on the row. All widths land or none do.
 */
export async function storePoster(
	bucket: R2Bucket,
	fetcher: typeof fetch,
	recordId: string,
	posterPath: string,
): Promise<string> {
	const file = posterPath.slice(1)
	const images = await Promise.all(
		STORED_WIDTHS.map(async (width) => {
			const res = await fetcher(`https://image.tmdb.org/t/p/w${width}${posterPath}`)
			if (!res.ok)
				throw new Error(`TMDB answered ${res.status} for w${width}${posterPath}`)
			return {
				width,
				bytes: await res.arrayBuffer(),
				contentType: res.headers.get('content-type') ?? 'image/jpeg',
			}
		}),
	)
	await Promise.all(
		images.map(({ width, bytes, contentType }) =>
			bucket.put(posterKey(recordId, width, file), bytes, {
				httpMetadata: { contentType, cacheControl: IMMUTABLE },
			}),
		),
	)
	return file
}

export async function deletePoster(bucket: R2Bucket, recordId: string, file: string): Promise<void> {
	if (file)
		await bucket.delete(STORED_WIDTHS.map(width => posterKey(recordId, width, file)))
}
