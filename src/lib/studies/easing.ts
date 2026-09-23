import type { EaseFn } from './types'

// The spec's cubic-bezier timing function: a curve through (0,0) and
// (1,1) where x is time and y is progress. x(t) has no closed inverse,
// so solving x(t) = u runs Newton first and falls back to bisection.

const NEWTON_ROUNDS = 8
const BISECT_ROUNDS = 24
const EPSILON = 1e-6

function axis(a: number, b: number): (t: number) => number {
	return t => (((1 - 3 * b + 3 * a) * t + (3 * b - 6 * a)) * t + 3 * a) * t
}

function slope(a: number, b: number): (t: number) => number {
	return t => (3 * (1 - 3 * b + 3 * a) * t + 2 * (3 * b - 6 * a)) * t + 3 * a
}

export function cubicBezier(x1: number, y1: number, x2: number, y2: number): EaseFn {
	const x = axis(x1, x2)
	const y = axis(y1, y2)
	const dx = slope(x1, x2)
	return (u) => {
		if (u <= 0)
			return 0
		if (u >= 1)
			return 1
		let t = u
		for (let i = 0; i < NEWTON_ROUNDS; i++) {
			const err = x(t) - u
			if (Math.abs(err) < EPSILON)
				return y(t)
			const d = dx(t)
			if (Math.abs(d) < EPSILON)
				break
			t -= err / d
		}
		let lo = 0
		let hi = 1
		t = u
		for (let i = 0; i < BISECT_ROUNDS; i++) {
			if (x(t) < u)
				lo = t
			else hi = t
			t = (lo + hi) / 2
		}
		return y(t)
	}
}

/** CSS steps(count) with the default jump-end behavior. */
export function stepsEase(count: number): EaseFn {
	return t => (t >= 1 ? 1 : Math.floor(Math.max(0, t) * count) / count)
}

/** What a browser does with linear(): straight lines between the stops. */
export function linearStopsFn(stops: number[]): EaseFn {
	return (t) => {
		if (t <= 0)
			return stops[0]
		if (t >= 1)
			return stops[stops.length - 1]
		const pos = t * (stops.length - 1)
		const i = Math.floor(pos)
		return stops[i] + (stops[i + 1] - stops[i]) * (pos - i)
	}
}

/** Sample any ease into evenly spaced linear() stops. */
export function sampleStops(fn: EaseFn, count: number): number[] {
	return Array.from({ length: count }, (_, i) => {
		const v = fn(i / (count - 1))
		return Math.round(v * 10000) / 10000
	})
}

export function toCssLinear(stops: number[]): string {
	return `linear(${stops.join(', ')})`
}

export interface CssKeyword {
	name: string
	timing: string
	/** the cubic-bezier hiding behind the keyword */
	code: string
	fn: EaseFn
}

// The whole built-in vocabulary. Every keyword is one cubic-bezier;
// linear is the same curve with its handles left on the diagonal.
export const cssKeywords: CssKeyword[] = [
	{ name: 'linear', timing: 'linear', code: 'cubic-bezier(0, 0, 1, 1)', fn: t => t },
	{ name: 'ease', timing: 'ease', code: 'cubic-bezier(0.25, 0.1, 0.25, 1)', fn: cubicBezier(0.25, 0.1, 0.25, 1) },
	{ name: 'ease-in', timing: 'ease-in', code: 'cubic-bezier(0.42, 0, 1, 1)', fn: cubicBezier(0.42, 0, 1, 1) },
	{ name: 'ease-out', timing: 'ease-out', code: 'cubic-bezier(0, 0, 0.58, 1)', fn: cubicBezier(0, 0, 0.58, 1) },
	{ name: 'ease-in-out', timing: 'ease-in-out', code: 'cubic-bezier(0.42, 0, 0.58, 1)', fn: cubicBezier(0.42, 0, 0.58, 1) },
]
