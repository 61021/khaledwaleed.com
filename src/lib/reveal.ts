// Reveal on approach: the attachment side of the .rv/.rv-in pair in
// app.css. Attachments only run in the browser, so marked elements hide
// only once JS is running (no-JS visitors see plain content) and rise as
// they enter the viewport, so a page fills up as the visitor walks it.
// Reduced-motion visitors are never hidden at all. Elements crossing the
// threshold in the same beat cascade 60ms apart via a shared burst
// counter, capped at four seats: uncapped, one long scroll stacked
// delays without bound and left stragglers fading after the wheel
// stopped.
let observer: IntersectionObserver | undefined
let burst = 0
let lastBurstAt = 0

// Risers crossing the threshold mid blur-swap wait in the wings: every
// frame they moved under the animating filter re-rastered the whole
// stage (dropped frames on both engines). They rise together once the
// room is sharp, cascading as one burst.
let pending: HTMLElement[] = []
let swapWatch: MutationObserver | undefined

function seat(node: HTMLElement) {
	const now = performance.now()
	if (now - lastBurstAt > 200)
		burst = 0
	lastBurstAt = now
	node.style.setProperty('--rv-wait', `${Math.min(burst++, 3) * 60}ms`)
	node.classList.add('rv-in')
}

function seatOrHold(node: HTMLElement) {
	if (!document.documentElement.hasAttribute('data-swap')) {
		seat(node)
		return
	}
	pending.push(node)
	if (!swapWatch) {
		swapWatch = new MutationObserver(() => {
			if (document.documentElement.hasAttribute('data-swap'))
				return
			// One frame after the swap ends: the stage's layer demotion
			// rasters on its own before the risers start moving.
			requestAnimationFrame(() => {
				const seated = pending
				pending = []
				for (const held of seated)
					seat(held)
			})
		})
		swapWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-swap'] })
	}
}

function ensureObserver() {
	observer ??= new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting)
					continue
				seatOrHold(entry.target as HTMLElement)
				observer!.unobserve(entry.target)
			}
		},
		{ rootMargin: '0px 0px -8% 0px' },
	)
	return observer
}

/** Use as `{@attach reveal}`. */
export function reveal(node: HTMLElement): (() => void) | undefined {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches)
		return
	node.classList.add('rv')
	ensureObserver().observe(node)
	return () => observer?.unobserve(node)
}
