/** What the button under a linked tile says it opens. */
export type CraftLink = 'production' | 'prototype' | 'study' | 'essay'

/** One tile: a single interaction, animation or piece, as a looping clip or a still. */
export interface CraftItem {
	/** Media key: the clip and poster under static/craft-media share it. */
	id: string
	title: string
	/** The product or site it comes from. */
	project: string
	/** One plain sentence on what happens in the clip, for screen readers and search. */
	about: string
	/** Month it was made, yyyy-mm. */
	made: string
	/** Where the piece lives, when it can be visited. */
	href?: string
	link?: CraftLink
	/**
	 * The clip's own ground, which decides the caption ink and its scrim:
	 * light footage takes dark type, dark footage light type.
	 */
	ground: 'light' | 'dark'
	/** Set the caption over the top edge when the bottom is busy. */
	caption?: 'top' | 'bottom'
}

/** Encoded media for one tile, written by scripts/craft-media.ts. */
export interface CraftMedia {
	width: number
	height: number
	/** Seconds of loop. 0 for a still. */
	seconds: number
	/** Content-hashed file names under /craft-media/. */
	video?: string
	poster: string
	/** A 24px-wide PNG, blurred up behind the poster while it loads. */
	lqip: string
}

/** A tile with its media resolved and its place in the date order. */
export interface CraftTile extends CraftItem {
	media: CraftMedia
	/** Position in the newest-first order; the barrel's source index. */
	order: number
}

export interface BarrelOptions {
	/** A click or Enter on the tile in front. */
	onopen: (source: number) => void
	/** An arrow key put this source in front. */
	onfront: (source: number) => void
}

/** One place on the drum; the barrel deals it a source as it turns. */
export interface BarrelSlot {
	el: HTMLElement
	/** Its seat round the ring, in degrees. */
	angle: number
	/** Its row among the slots, before wrapping. */
	row: number
	/** The world row it stands on, null until placed. */
	at: number | null
	hidden: boolean | null
	source: number
	content: HTMLElement | null
	video: HTMLVideoElement | null
}

export interface BarrelLayout {
	stepX: number
	stepY: number
	angleStep: number
	radius: number
	/** How far the ring's axis comes toward the camera. */
	anchorZ: number
	rows: number
	/** Sources per world row, so the row below runs on from this one. */
	across: number
	degPerPx: number
}
