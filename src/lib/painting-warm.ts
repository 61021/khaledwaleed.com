// Warming the next room's painting: navigation crossfades old canvas to
// new canvas, which only works if the new canvas is already fetched AND
// decoded when the view transition snapshots the incoming page. This
// module fetches+decodes hero paintings ahead of the visitor — on link
// intent (hover/focus/touch) and again, briefly awaited, in onNavigate.
import { paintings, roomForPath } from '$lib/site';
import sizes from '$lib/painting-sizes.json';

/** Responsive candidates for a painting, from the generated manifest.
    The single source for hero srcsets — Painting.svelte renders these
    exact strings, so a warmed image is a cache + decode hit, never a
    second download. */
export function paintingSrcset(key: string, ext: 'avif' | 'webp'): string {
	const src = `/paintings/${key}`;
	const entry = sizes[key as keyof typeof sizes];
	if (!entry) return `${src}.${ext}`;
	return entry.widths
		.map((w) => `${w === entry.width ? src : `${src}-${w}`}.${ext} ${w}w`)
		.join(', ');
}

/** The hero painting key a pathname will hang, or null for none. */
export function paintingKeyForPath(pathname: string): string | null {
	return paintings[roomForPath(pathname)]?.key ?? null;
}

const warming = new Map<string, Promise<void>>();
const warm = new Set<string>();

/** True once the painting is decoded and ready to paint on first frame. */
export function isPaintingWarm(key: string): boolean {
	return warm.has(key);
}

/** Fetch + decode a hero painting off-screen. Idempotent; a failed warm
    forgets itself so a later intent can retry. */
export function warmPainting(key: string | null): Promise<void> {
	if (!key || !(key in paintings) || warm.has(key)) return Promise.resolve();
	let pending = warming.get(key);
	if (!pending) {
		const img = new Image();
		// Heroes render sizes="100vw", and every evergreen engine takes the
		// AVIF source, so this resolves to the same candidate the room will.
		img.sizes = '100vw';
		img.srcset = paintingSrcset(key, 'avif');
		pending = img.decode().then(
			() => {
				warm.add(key);
			},
			() => {
				warming.delete(key);
			}
		);
		warming.set(key, pending);
	}
	return pending;
}
