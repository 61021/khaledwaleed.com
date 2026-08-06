import { describe, expect, test } from 'vitest';
import { formatDate } from './dates';

describe('formatDate', () => {
	test('formats a plain yyyy-mm-dd', () => {
		expect(formatDate('2026-06-22')).toBe('22 June 2026');
	});

	test('is UTC-stable (no off-by-one around midnight)', () => {
		expect(formatDate('2026-01-01')).toBe('1 January 2026');
		expect(formatDate('2025-12-31')).toBe('31 December 2025');
	});

	test('accepts a full ISO timestamp (mdsvex serialises frontmatter dates)', () => {
		expect(formatDate('2026-05-23T00:00:00.000Z')).toBe('23 May 2026');
	});
});
