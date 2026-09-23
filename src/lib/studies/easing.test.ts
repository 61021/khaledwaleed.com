import { gsap } from 'gsap'
import { describe, expect, it } from 'vitest'
import { cssKeywords, cubicBezier, linearStopsFn, sampleStops, stepsEase, toCssLinear } from './easing'

describe('cubicBezier', () => {
	it('anchors at 0 and 1', () => {
		const ease = cubicBezier(0.25, 0.1, 0.25, 1)
		expect(ease(0)).toBe(0)
		expect(ease(1)).toBe(1)
	})

	it('reproduces linear when the handles sit on the diagonal', () => {
		const ease = cubicBezier(0.25, 0.25, 0.75, 0.75)
		for (const t of [0.1, 0.3, 0.5, 0.7, 0.9])
			expect(ease(t)).toBeCloseTo(t, 5)
	})

	it('crosses the midpoint of the symmetric ease-in-out at 0.5', () => {
		expect(cubicBezier(0.42, 0, 0.58, 1)(0.5)).toBeCloseTo(0.5, 5)
	})

	it('overshoots past 1 when a y handle does', () => {
		const spring = cubicBezier(0.34, 1.56, 0.64, 1)
		const peak = Math.max(...Array.from({ length: 200 }, (_, i) => spring(i / 199)))
		expect(peak).toBeGreaterThan(1.05)
	})

	it('keeps every keyword monotonic', () => {
		for (const { fn } of cssKeywords) {
			let prev = 0
			for (let i = 1; i <= 100; i++) {
				const v = fn(i / 100)
				expect(v).toBeGreaterThanOrEqual(prev - 1e-9)
				prev = v
			}
		}
	})
})

describe('stepsEase', () => {
	it('holds each plateau and lands on 1', () => {
		const five = stepsEase(5)
		expect(five(0)).toBe(0)
		expect(five(0.19)).toBe(0)
		expect(five(0.21)).toBeCloseTo(0.2, 9)
		expect(five(0.99)).toBeCloseTo(0.8, 9)
		expect(five(1)).toBe(1)
	})
})

describe('linear() stops', () => {
	it('samples endpoints exactly', () => {
		const stops = sampleStops(t => t * t, 21)
		expect(stops).toHaveLength(21)
		expect(stops[0]).toBe(0)
		expect(stops[20]).toBe(1)
	})

	it('interpolates between stops the way the browser does', () => {
		const fn = linearStopsFn([0, 1, 0.5])
		expect(fn(0.25)).toBeCloseTo(0.5, 9)
		expect(fn(0.5)).toBeCloseTo(1, 9)
		expect(fn(0.75)).toBeCloseTo(0.75, 9)
	})

	it('prints valid linear() syntax', () => {
		expect(toCssLinear([0, 0.25, 1])).toBe('linear(0, 0.25, 1)')
	})
})

describe('gsap eases off the browser', () => {
	// The study samples gsap.parseEase during prerender, so the eases
	// must resolve in plain node, config strings included.
	it('parses config strings server-side', () => {
		const elastic = gsap.parseEase('elastic.out(1, 0.3)')
		expect(elastic(0)).toBe(0)
		expect(elastic(1)).toBe(1)
		const peak = Math.max(...Array.from({ length: 400 }, (_, i) => elastic(i / 399)))
		expect(peak).toBeGreaterThan(1.2)
	})

	it('grades the power family by steepness', () => {
		const p1 = gsap.parseEase('power1.out')(0.25)
		const p4 = gsap.parseEase('power4.out')(0.25)
		expect(p4).toBeGreaterThan(p1)
	})
})
