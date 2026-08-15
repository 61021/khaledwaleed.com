// Cross-component wiring so the header (or anything else) can open the
// command palette without owning its state. Opening is an event, not
// state: the palette registers its open function on mount and request()
// simply calls it, so no effect has to watch a counter.
type Open = () => void

let openPalette: Open | null = null

export const palette = {
	/** The palette registers itself; returns the unregister cleanup. */
	register(fn: Open): () => void {
		openPalette = fn
		return () => {
			if (openPalette === fn)
				openPalette = null
		}
	},
	/** Ask the mounted palette to open (no-op before it mounts). */
	request(): void {
		openPalette?.()
	},
}
