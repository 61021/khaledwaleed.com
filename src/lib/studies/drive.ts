import type { DriveSpec } from './types'
import { gsap } from 'gsap'

// Moves a runway dot on the engine under study: a real CSS transition
// or a real GSAP tween, never a re-implementation of either. Returns
// a stop function so a replay can cut the previous run short.

export function prefersReducedMotion(): boolean {
	return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function driveDot(el: HTMLElement, spec: DriveSpec, distancePx: number, seconds: number): () => void {
	if (spec.engine === 'gsap') {
		const tween = gsap.fromTo(
			el,
			{ x: 0 },
			{ x: distancePx, duration: seconds, ease: spec.ease, overwrite: true },
		)
		return () => tween.kill()
	}
	el.style.transition = 'none'
	el.style.transform = 'translateX(0)'
	void el.offsetWidth
	el.style.transition = `transform ${seconds}s ${spec.timing}`
	el.style.transform = `translateX(${distancePx}px)`
	return () => {
		el.style.transition = 'none'
	}
}
