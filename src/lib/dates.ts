/** Format a yyyy-mm-dd date as e.g. "24 May 2026" (UTC, locale-stable). */
export function formatDate(date: string): string {
	return new Date(date).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC',
	})
}

const ROMAN_NUMERALS: [number, string][] = [
	[1000, 'm'],
	[900, 'cm'],
	[500, 'd'],
	[400, 'cd'],
	[100, 'c'],
	[90, 'xc'],
	[50, 'l'],
	[40, 'xl'],
	[10, 'x'],
	[9, 'ix'],
	[5, 'v'],
	[4, 'iv'],
	[1, 'i'],
]

/** A year in lowercase Roman numerals, e.g. 2026 → "mmxxvi". */
export function romanYear(year: number): string {
	let rest = Math.trunc(year)
	let out = ''
	for (const [value, glyph] of ROMAN_NUMERALS) {
		while (rest >= value) {
			out += glyph
			rest -= value
		}
	}
	return out
}
