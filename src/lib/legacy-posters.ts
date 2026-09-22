import type { StoredWidth } from './posters'
import { POSTERS_URL } from './constants'
import { posterKey } from './posters'

const FILE_PATH = /^\/api\/files\/(?:films|pbc_95057082)\/([a-z0-9]{15})\/([\w.-]+)$/
const THUMBS: Record<string, StoredWidth> = { '185x0': 185, '342x0': 342, '500x0': 500 }

/**
 * Where an old PocketBase poster URL (api.khaledwaleed.com/api/files/…) lives
 * now, or null for anything that was never a poster. Migrated records kept
 * their PocketBase ids and filenames, so the move is mechanical.
 */
export function legacyPosterTarget(url: URL): string | null {
	const match = FILE_PATH.exec(url.pathname)
	if (!match)
		return null
	const [, recordId, file] = match
	const width = THUMBS[url.searchParams.get('thumb') ?? ''] ?? 780
	return `${POSTERS_URL}/${posterKey(recordId, width, file)}`
}
