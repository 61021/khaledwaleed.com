// False until the root layout mounts. A universal load that runs before
// then is the first page's hydration pass, which must return what the
// server rendered; every later run is a client navigation or a preload.
let hydrated = false

export function isHydrated(): boolean {
	return hydrated
}

export function markHydrated(): void {
	hydrated = true
}
