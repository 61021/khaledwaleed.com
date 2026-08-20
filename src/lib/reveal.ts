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

function ensureObserver() {
	observer ??= new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting)
					continue
				const now = performance.now()
				if (now - lastBurstAt > 200)
					burst = 0
				lastBurstAt = now
				const node = entry.target as HTMLElement
				node.style.setProperty('--rv-wait', `${Math.min(burst++, 3) * 60}ms`)
				node.classList.add('rv-in')
				observer!.unobserve(node)
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
