// Shared types for the creative space (/space) and its studies.

export interface Space {
	slug: string
	title: string
	/** one line under the title on the index wall */
	line: string
	/** ISO date the study opened; sitemap lastmod + the imprint line */
	opened: string
	/** the same date in the space's own lowercase voice */
	openedLabel: string
}

/** An easing curve: linear progress in, eased progress out, both 0..1. */
export type EaseFn = (t: number) => number

export interface PlotCurve {
	fn: EaseFn
	/** any CSS color, usually a room token like var(--accent) */
	stroke: string
	dash?: string
}

export interface PlotTracer {
	fn: EaseFn
	fill: string
}

/** Which real engine moves a runway dot, and with what. */
export interface DriveSpec {
	engine: 'css' | 'gsap'
	/** transition-timing-function, when the engine is css */
	timing?: string
	/** ease string, when the engine is gsap */
	ease?: string
}
