import { describe, expect, it } from 'vitest'
import { formatDate, romanYear } from './dates'

describe('formatDate', () => {
	it('formats a plain yyyy-mm-dd', () => {
		expect(formatDate('2026-06-22')).toBe('22 June 2026')
	})

	it('is UTC-stable (no off-by-one around midnight)', () => {
		expect(formatDate('2026-01-01')).toBe('1 January 2026')
		expect(formatDate('2025-12-31')).toBe('31 December 2025')
	})

	it('accepts a full ISO timestamp (mdsvex serialises frontmatter dates)', () => {
		expect(formatDate('2026-05-23T00:00:00.000Z')).toBe('23 May 2026')
	})
})

describe('romanYear', () => {
	it('renders the current era', () => {
		expect(romanYear(2026)).toBe('mmxxvi')
	})

	it('handles the subtractive forms', () => {
		expect(romanYear(1999)).toBe('mcmxcix')
		expect(romanYear(2044)).toBe('mmxliv')
	})

	it('turns over cleanly at round years', () => {
		expect(romanYear(2030)).toBe('mmxxx')
		expect(romanYear(3000)).toBe('mmm')
	})
})
