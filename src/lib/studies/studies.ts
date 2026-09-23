import type { Study } from './types'

// The studies on the table, oldest first; a study's number is its
// position here, so the order never changes once one is published.
export const studies: Study[] = [
	{
		slug: 'easing',
		title: 'a study of easing',
		line: 'the browser\'s built-in curves against gsap\'s vocabulary',
		opened: '2026-08-20',
		openedLabel: 'august 2026',
	},
	{
		slug: 'monochrome',
		title: 'a study of monochrome',
		line: 'resend, vercel, linear and raycast, measured on one day',
		opened: '2026-09-23',
		openedLabel: 'september 2026',
	},
]

export function studyNumber(index: number): string {
	return String(index + 1).padStart(2, '0')
}
