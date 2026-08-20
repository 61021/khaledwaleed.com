import type { Space } from './types'

// The studies hung on the space's wall, oldest first; a study's number
// is its position here, so the order never changes once published.
export const spaces: Space[] = [
	{
		slug: 'easing',
		title: 'a study of easing',
		line: 'the browser\'s built-in curves against gsap\'s vocabulary',
		opened: '2026-08-20',
		openedLabel: 'august 2026',
	},
]

export function spaceNumber(index: number): string {
	return String(index + 1).padStart(2, '0')
}
