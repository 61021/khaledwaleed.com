// The glide: GSAP's ScrollSmoother carrying the museum's scroll on a
// short catch-up (0.7s), subtle enough to read as weight rather than
// syrup. Desktop pointers only: touch compositors already glide, and
// pinning the wrapper on phones buys jank for nothing; reduced-motion
// visitors are never smoothed at all. GSAP loads on demand so the
// museum's first paint never carries it.
import type { ScrollSmoother } from 'gsap/ScrollSmoother'

let smoother: ScrollSmoother | undefined
let refreshTriggers: (() => void) | undefined
let epoch = 0

/**
 * Mounts the glide over the museum. Returns its disposer; call it when
 * the wrapper leaves the DOM (the layout's effect does).
 */
export function mountSmoother(wrapper: HTMLElement, content: HTMLElement): () => void {
	const token = ++epoch
	const wants
		= matchMedia('(pointer: fine)').matches
			&& !matchMedia('(prefers-reduced-motion: reduce)').matches
	if (wants) {
		void (async () => {
			const [{ gsap }, { ScrollTrigger }, { ScrollSmoother: Smoother }] = await Promise.all([
				import('gsap'),
				import('gsap/ScrollTrigger'),
				import('gsap/ScrollSmoother'),
			])
			// A navigation into /space can outrun the import.
			if (token !== epoch || !wrapper.isConnected)
				return
			gsap.registerPlugin(ScrollTrigger, Smoother)
			// Before create(), not after: app.css flips scroll-behavior to
			// auto under this attribute, and ScrollTrigger caches the
			// computed value at init — registered against `smooth`, it
			// re-stamps an inline `smooth` after every refresh, a second
			// clock under the same wheel.
			document.documentElement.setAttribute('data-smoother', '')
			smoother = Smoother.create({ wrapper, content, smooth: 0.7, effects: false })
			refreshTriggers = () => ScrollTrigger.refresh()
		})()
	}
	return () => {
		if (token !== epoch)
			return
		epoch++
		document.documentElement.removeAttribute('data-smoother')
		smoother?.kill()
		smoother = undefined
		refreshTriggers = undefined
		// kill() can leave the body's synthetic height and the inline
		// scroll-behavior GSAP stamps on both roots; the next world
		// (/space) scrolls its own content under its own CSS.
		document.body.style.removeProperty('height')
		document.body.style.removeProperty('scroll-behavior')
		document.documentElement.style.removeProperty('scroll-behavior')
	}
}

/**
 * Squares the glide with the router's scroll reset: re-measures the new
 * room, then snaps the content transform to wherever the native bar
 * landed (0 forward, the restored seat on back/forward). Without this
 * the transform eases toward the reset, an eased scroll still running
 * when the new room appears. Call it under the blur swap's dip.
 */
export function snapSmoother(): void {
	if (!smoother)
		return
	refreshTriggers?.()
	smoother.scrollTop(window.scrollY)
}
