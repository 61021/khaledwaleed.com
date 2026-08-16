// Cross-component wiring for the curtain, in palette.ts's idiom: the
// component registers its encore function on mount, and encore() simply
// calls it (a no-op before the component mounts). Nothing on the site
// links to this; it belongs to the Konami code and the palette's
// hidden Encore entry.
type Encore = () => void

let performEncore: Encore | null = null

export const curtain = {
	/** The curtain registers itself; returns the unregister cleanup. */
	register(fn: Encore): () => void {
		performEncore = fn
		return () => {
			if (performEncore === fn)
				performEncore = null
		}
	},
	/** Ask the house for one more performance. */
	encore(): void {
		performEncore?.()
	},
}
