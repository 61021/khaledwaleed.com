import type { Attachment } from 'svelte/attachments'

const nearby = 'IntersectionObserver' in globalThis ? new Map<Element, () => void>() : null
const visible = 'IntersectionObserver' in globalThis ? new Map<Element, (seen: boolean) => void>() : null
let near: IntersectionObserver | undefined
let seen: IntersectionObserver | undefined

// Two shared observers for the whole wall: one fetches a clip a screen
// ahead, the other plays it only while some of it is on screen.
function observe(video: HTMLVideoElement, onNear: () => void, onSeen: (seen: boolean) => void): () => void {
	near ??= new IntersectionObserver((entries) => {
		for (const e of entries) {
			if (e.isIntersecting) {
				nearby?.get(e.target)?.()
				near?.unobserve(e.target)
			}
		}
	}, { rootMargin: '100% 0px' })
	seen ??= new IntersectionObserver((entries) => {
		for (const e of entries)
			visible?.get(e.target)?.(e.isIntersecting)
	}, { threshold: 0.1 })
	nearby?.set(video, onNear)
	visible?.set(video, onSeen)
	near.observe(video)
	seen.observe(video)
	return () => {
		nearby?.delete(video)
		visible?.delete(video)
		near?.unobserve(video)
		seen?.unobserve(video)
	}
}

/**
 * A tile's loop: fetched when it comes near, playing only while in view
 * and the tab is showing. Under reduced motion or Save-Data nothing
 * moves on its own; pointing at the tile or focusing it plays the loop,
 * and leaving stops it where it is.
 */
export function clip(src: string): Attachment<HTMLVideoElement> {
	return (video) => {
		const tile = video.closest<HTMLElement>('.tile') ?? video
		const still = window.matchMedia('(prefers-reduced-motion: reduce)')
		const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
		let inView = false
		let asked = false
		let loaded = false

		const load = () => {
			if (loaded)
				return
			loaded = true
			video.src = src
		}
		const sync = () => {
			const auto = !still.matches && !saveData
			const viewing = document.documentElement.hasAttribute('data-viewing')
			if (inView && !document.hidden && !viewing && (auto || asked)) {
				load()
				void video.play().catch(() => {})
			}
			else {
				video.pause()
			}
		}
		const onPlaying = () => tile.setAttribute('data-playing', '')
		const ask = () => {
			asked = true
			sync()
		}
		const release = () => {
			asked = false
			sync()
		}

		const stop = observe(
			video,
			() => {
				if (!still.matches && !saveData)
					load()
			},
			(on) => {
				inView = on
				sync()
			},
		)
		video.addEventListener('playing', onPlaying)
		tile.addEventListener('pointerenter', ask)
		tile.addEventListener('pointerleave', release)
		tile.addEventListener('focusin', ask)
		tile.addEventListener('focusout', release)
		document.addEventListener('visibilitychange', sync)
		document.addEventListener('craftviewer', sync)
		still.addEventListener('change', sync)

		return () => {
			stop()
			video.removeEventListener('playing', onPlaying)
			tile.removeEventListener('pointerenter', ask)
			tile.removeEventListener('pointerleave', release)
			tile.removeEventListener('focusin', ask)
			tile.removeEventListener('focusout', release)
			document.removeEventListener('visibilitychange', sync)
			document.removeEventListener('craftviewer', sync)
			still.removeEventListener('change', sync)
			video.pause()
			video.removeAttribute('src')
			video.load()
		}
	}
}
