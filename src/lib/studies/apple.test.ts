import { describe, expect, it } from 'vitest'
import { alphaFor, black, footer, higEm, navLinks, siteEm, siteSizes, SMALL_TEXT_RATIO, TARGET, TARGET_FLOOR } from './apple'
import { contrast } from './monochrome'

function site(px: number): number {
	return siteEm(siteSizes.find(s => s.px === px)!)
}

describe('tracking', () => {
	it('lists every size the site sets', () => {
		for (const s of siteSizes)
			expect(() => higEm(s.px)).not.toThrow()
	})

	it('reads the site\'s spacing back as the em values in its css', () => {
		expect(site(17)).toBeCloseTo(-0.022, 4)
		expect(site(21)).toBeCloseTo(0.011, 4)
		expect(site(80)).toBeCloseTo(-0.015, 4)
	})

	it('tightens body text and loosens display text in both', () => {
		expect(higEm(17)).toBeLessThan(0)
		expect(site(17)).toBeLessThan(0)
		expect(higEm(24)).toBeGreaterThan(0)
		expect(site(24)).toBeGreaterThan(0)
	})

	it('parts ways above 40', () => {
		for (const px of [48, 56, 80]) {
			expect(higEm(px)).toBeGreaterThanOrEqual(0)
			expect(site(px)).toBeLessThan(0)
		}
	})
})

describe('targets', () => {
	it('counts the links narrower than 44', () => {
		const narrow = navLinks.filter(l => l.width < TARGET).map(l => l.label)
		expect(narrow).toEqual(['Apple', 'Mac', 'iPad', 'Search', 'Bag'])
	})

	it('keeps every link above the floor', () => {
		expect(Math.min(...navLinks.map(l => l.width))).toBeGreaterThanOrEqual(TARGET_FLOOR)
	})
})

describe('footer contrast', () => {
	it('matches the ratios on the day', () => {
		expect(contrast(black(footer.fine), footer.ground)).toBeCloseTo(4.84, 1)
		expect(contrast(black(footer.link), footer.ground)).toBeGreaterThan(SMALL_TEXT_RATIO)
	})

	it('finds the alpha that reaches 7:1', () => {
		const alpha = alphaFor(SMALL_TEXT_RATIO, footer.ground)
		expect(contrast(black(alpha), footer.ground)).toBeGreaterThanOrEqual(SMALL_TEXT_RATIO)
		expect(contrast(black(alpha - 0.01), footer.ground)).toBeLessThan(SMALL_TEXT_RATIO)
		expect(alpha).toBeGreaterThan(footer.fine)
	})
})
