import type { NavLink, SiteSize } from './types'
import { contrast } from './monochrome'

// Apple's SF Pro tracking table for iOS, iPadOS and visionOS, from the
// Human Interface Guidelines (Typography, Tracking values) as published
// on 2026-10-14: [size in points, tracking in 1/1000 em].
export const higTracking: [number, number][] = [
	[6, 41],
	[7, 34],
	[8, 26],
	[9, 19],
	[10, 12],
	[11, 6],
	[12, 0],
	[13, -6],
	[14, -11],
	[15, -16],
	[16, -20],
	[17, -26],
	[18, -25],
	[19, -24],
	[20, -23],
	[21, -18],
	[22, -12],
	[23, -4],
	[24, 3],
	[25, 6],
	[26, 8],
	[27, 11],
	[28, 14],
	[29, 14],
	[30, 14],
	[31, 13],
	[32, 13],
	[33, 12],
	[34, 12],
	[35, 11],
	[36, 10],
	[37, 10],
	[38, 10],
	[39, 10],
	[40, 10],
	[41, 9],
	[42, 9],
	[43, 9],
	[44, 8],
	[45, 8],
	[46, 8],
	[47, 8],
	[48, 8],
	[49, 7],
	[50, 7],
	[51, 7],
	[52, 6],
	[53, 6],
	[54, 6],
	[56, 6],
	[58, 5],
	[60, 4],
	[62, 4],
	[64, 4],
	[66, 3],
	[68, 2],
	[70, 2],
	[72, 2],
	[76, 1],
	[80, 0],
	[84, 0],
	[88, 0],
	[92, 0],
	[96, 0],
]

// Measured on apple.com's home, /iphone and /mac on 2026-10-14
// (getComputedStyle in headless Chromium, 1440x900, light scheme).
// Sizes that only inherit another size's spacing are left out.
export const siteSizes: SiteSize[] = [
	{ px: 10, spacing: -0.08, face: 'text' },
	{ px: 12, spacing: -0.12, face: 'text' },
	{ px: 14, spacing: -0.224, face: 'text' },
	{ px: 17, spacing: -0.374, face: 'text' },
	{ px: 19, spacing: 0.228, face: 'display' },
	{ px: 21, spacing: 0.231, face: 'display' },
	{ px: 24, spacing: 0.216, face: 'display' },
	{ px: 28, spacing: 0.196, face: 'display' },
	{ px: 32, spacing: 0.128, face: 'display' },
	{ px: 40, spacing: 0, face: 'display' },
	{ px: 48, spacing: -0.144, face: 'display' },
	{ px: 56, spacing: -0.28, face: 'display' },
	{ px: 80, spacing: -1.2, face: 'display' },
]

/** The table's tracking at a size it lists, in em. */
export function higEm(px: number): number {
	const row = higTracking.find(([size]) => size === px)
	if (!row)
		throw new Error(`no tracking row for ${px}`)
	return row[1] / 1000
}

/** What apple.com serves at a size, in em. */
export function siteEm(size: SiteSize): number {
	return size.spacing / size.px
}

// The top bar at 1440 wide: every link is 44px tall.
export const NAV_HEIGHT = 44

export const navLinks: NavLink[] = [
	{ label: 'Apple', x: 222, width: 30, icon: 'apple' },
	{ label: 'Store', x: 273.6, width: 46 },
	{ label: 'Mac', x: 341.2, width: 39 },
	{ label: 'iPad', x: 401.8, width: 40 },
	{ label: 'iPhone', x: 463.5, width: 54 },
	{ label: 'Watch', x: 539.1, width: 51 },
	{ label: 'Vision', x: 611.7, width: 50 },
	{ label: 'AirPods', x: 683.3, width: 59 },
	{ label: 'Home', x: 763.9, width: 49 },
	{ label: 'Entertainment', x: 834.5, width: 93 },
	{ label: 'Accessories', x: 949.2, width: 83 },
	{ label: 'Support', x: 1053.8, width: 60 },
	{ label: 'Search', x: 1135.4, width: 31, icon: 'search' },
	{ label: 'Bag', x: 1188, width: 30, icon: 'bag' },
]

// The HIG's control sizes for iOS: the default and the floor.
export const TARGET = 44
export const TARGET_FLOOR = 28

// The home page's fixed bar.
export const glass = {
	tint: 'rgba(255, 255, 255, 0.8)',
	filter: 'saturate(180%) blur(20px)',
}

// The footer: 12px black at three alphas on Apple's light gray.
export const footer = {
	ground: '#f5f5f7',
	heading: 0.88,
	link: 0.72,
	fine: 0.56,
}

/** Apple's own "strive for" ratio for small text. */
export const SMALL_TEXT_RATIO = 7

export function black(alpha: number): string {
	return `rgba(0, 0, 0, ${alpha})`
}

/** The lightest black alpha that reaches a contrast ratio over a ground. */
export function alphaFor(ratio: number, ground: string): number {
	let lo = 0
	let hi = 1
	for (let i = 0; i < 30; i++) {
		const mid = (lo + hi) / 2
		if (contrast(black(mid), ground) >= ratio)
			hi = mid
		else lo = mid
	}
	return Math.ceil(hi * 100) / 100
}

// Nearly half the timing curves in each page's CSS are this one.
export const appleEase: [number, number, number, number] = [0.4, 0, 0.6, 1]
