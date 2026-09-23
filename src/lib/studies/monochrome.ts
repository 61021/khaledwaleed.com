import type { SiteKey, SitePalette } from './types'

// Measured on the four homepages on 2026-09-23 (served CSS plus
// getComputedStyle in headless Chromium, dark scheme, 1440x900).

export const palettes: SitePalette[] = [
	{
		key: 'resend',
		name: 'resend',
		canvas: '#000000',
		surface: 'rgba(255, 255, 255, 0.05)',
		border: 'rgba(214, 235, 253, 0.19)',
		text: '#f0f0f0',
		secondary: '#a1a4a5',
		faint: 'rgba(229, 237, 253, 0.48)',
	},
	{
		key: 'vercel',
		name: 'vercel',
		canvas: '#000000',
		surface: '#0a0a0a',
		border: 'rgba(255, 255, 255, 0.145)',
		ring: true,
		text: '#ededed',
		secondary: '#a1a1a1',
	},
	{
		key: 'linear',
		name: 'linear',
		canvas: '#08090a',
		surface: '#0f1011',
		border: 'rgba(255, 255, 255, 0.08)',
		text: '#f7f8f8',
		secondary: '#8a8f98',
		faint: '#62666d',
	},
	{
		key: 'raycast',
		name: 'raycast',
		canvas: '#07080a',
		surface: 'rgba(255, 255, 255, 0.05)',
		border: 'rgba(255, 255, 255, 0.1)',
		text: '#ffffff',
		secondary: 'rgba(255, 255, 255, 0.6)',
		faint: 'rgba(255, 255, 255, 0.4)',
	},
]

export function palette(key: SiteKey): SitePalette {
	return palettes.find(p => p.key === key)!
}

type Rgba = [number, number, number, number]

export function parseColor(input: string): Rgba {
	const s = input.trim().toLowerCase()
	if (s.startsWith('#')) {
		let h = s.slice(1)
		if (h.length === 3 || h.length === 4)
			h = [...h].map(c => c + c).join('')
		const n = (i: number): number => Number.parseInt(h.slice(i, i + 2), 16)
		return [n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1]
	}
	const m = s.match(/^rgba?\(([^)]+)\)$/)
	if (!m)
		throw new Error(`unparsed color ${input}`)
	const [r, g, b, a = '1'] = m[1].split(/[\s,/]+/).filter(Boolean)
	return [Number(r), Number(g), Number(b), Number(a)]
}

/** Paints a color over an opaque ground, the way the page shows it. */
export function composite(color: string, ground: string): [number, number, number] {
	const [r, g, b, a] = parseColor(color)
	const [R, G, B] = parseColor(ground)
	return [r * a + R * (1 - a), g * a + G * (1 - a), b * a + B * (1 - a)]
}

function luminance([r, g, b]: [number, number, number]): number {
	const lin = (c: number): number => {
		const v = c / 255
		return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
	}
	return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

/** WCAG 2.x contrast of a (possibly transparent) color over a ground. */
export function contrast(color: string, ground: string): number {
	const fg = luminance(composite(color, ground))
	const bg = luminance(composite(ground, '#000'))
	const [hi, lo] = fg > bg ? [fg, bg] : [bg, fg]
	return (hi + 0.05) / (lo + 0.05)
}

export function hex([r, g, b]: [number, number, number]): string {
	return `#${[r, g, b].map(c => Math.round(c).toString(16).padStart(2, '0')).join('')}`
}
