import { describe, expect, it } from 'vitest'
import { layoutHeadline } from './og'

describe('layoutHeadline', () => {
	it('keeps a short title on one line at the largest size', () => {
		const { lines, size } = layoutHeadline('The thin line')
		expect(lines).toEqual(['The thin line'])
		expect(size).toBe(96)
	})

	it('wraps a medium title without splitting words', () => {
		const { lines } = layoutHeadline('Sitting in discomfort on purpose')
		expect(lines.join(' ')).toBe('Sitting in discomfort on purpose')
		for (const line of lines) {
			expect(line.length).toBeGreaterThan(0)
		}
	})

	it('shrinks long titles and caps at four lines', () => {
		const long
			= 'A very long meandering essay title that keeps going well past any sensible length for a card'
		const { lines, size } = layoutHeadline(long)
		expect(size).toBeLessThan(96)
		expect(lines.length).toBeLessThanOrEqual(4)
	})

	it('never drops words on realistic titles', () => {
		const titles = [
			'Life is interesting',
			'Deploying Bun projects to Cloudflare Pages',
			'Sitting in discomfort on purpose',
		]
		for (const t of titles) {
			expect(layoutHeadline(t).lines.join(' ')).toBe(t)
		}
	})
})
