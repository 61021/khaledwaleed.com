// The barrel's build and feel, after Jhey Tompkins' Barrel Grid (its "inside" camera).
export const BARREL = {
	/** Tiles round the drum. */
	columns: 15,
	/** Tile width in px, before the perspective scales it. */
	width: 240,
	/** Tile width over height: a 16:10 well over a 30px caption. */
	aspect: 4 / 3,
	gap: 18,
	/** Camera distance from the axis, in radii: under 1 stands inside the drum. */
	dolly: 0.62,
	perspective: 1300,
	/** Axis tilt in degrees. */
	tilt: -4,
	/** Spare rows above and below the screen. */
	overscan: 1,
	/** Tiles turned past this many degrees are edge-on, so they hide. */
	grazing: 86,
	/** Glide kept per 60Hz frame after a fling. */
	friction: 0.92,
	/** Fastest glide, px per 60Hz frame. */
	maxSpeed: 55,
	wheel: 0.7,
	/** Share of the way a tile travels to the front each 60Hz frame. */
	ease: 0.16,
	/** Pointer travel in px that still counts as a click. */
	slop: 6,
	/** A release this long after the last move is a stop, not a fling. */
	hold: 80,
	/** Fastest a tile may cross the screen, px per frame, and still start its clip. */
	calm: 4,
} as const
