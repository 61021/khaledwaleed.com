import { describe, expect, it } from 'vitest'
import { composite, contrast, hex, palette, parseColor } from './monochrome'

describe('parseColor', () => {
	it('reads short, long and alpha hex', () => {
		expect(parseColor('#fff')).toEqual([255, 255, 255, 1])
		expect(parseColor('#ffffff0d')[3]).toBeCloseTo(0.051, 3)
	})

	it('reads rgba with commas', () => {
		expect(parseColor('rgba(255, 255, 255, 0.4)')).toEqual([255, 255, 255, 0.4])
	})
})

describe('composite', () => {
	it('recovers linear\'s solid levels from white alpha', () => {
		expect(hex(composite('rgba(255, 255, 255, 0.03)', '#08090a'))).toBe('#0f1011')
		expect(hex(composite('rgba(255, 255, 255, 0.05)', '#08090a'))).toBe('#141516')
	})
})

describe('contrast', () => {
	it('matches the ratios measured on the day', () => {
		expect(contrast('#a1a4a5', '#000')).toBeCloseTo(8.37, 1)
		expect(contrast('#8a8f98', '#08090a')).toBeCloseTo(6.13, 1)
		expect(contrast('#62666d', '#08090a')).toBeCloseTo(3.45, 1)
		expect(contrast('rgba(255, 255, 255, 0.4)', '#07080a')).toBeCloseTo(3.75, 1)
		expect(contrast('#ededed', '#000')).toBeCloseTo(17.94, 1)
	})

	it('puts every site\'s primary text above AAA', () => {
		for (const key of ['resend', 'vercel', 'linear', 'raycast'] as const) {
			const p = palette(key)
			expect(contrast(p.text, p.canvas)).toBeGreaterThan(7)
		}
	})
})
