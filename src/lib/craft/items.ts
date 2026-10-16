import type { CraftItem } from './types'

// The tiles on /craft. Order within a month is the order here; the page
// sorts by month, newest first. Media comes from scripts/craft-media.ts.
const enjaz = 'https://enjaz.tech/en'
const quickev = 'https://quickev.net/en'
const tally = 'https://tally.vitex.dev'
const loto = 'https://42.iraqloto.iq'
const auctionKey = 'https://auctionkey.app'

export const items: CraftItem[] = [
	// October 2026
	{ id: 'loto-scratch-card', title: 'Scratch card', project: 'Iraq Loto', about: 'A finger scratches the foil off the gold ball, the five white balls wake with a hop, two swipes clear them and confetti bursts from the matching ball.', made: '2026-10', href: `${loto}/scratch/sc1k`, link: 'production', ground: 'dark' },
	{ id: 'enjaz-annotated-headline', title: 'Annotated headline', project: 'Enjaz', about: 'Two words in a headline take turns being annotated the way their discipline works: a design selection frame with its size, then a code highlight that gets approved.', made: '2026-10', href: `${enjaz}/design`, link: 'production', ground: 'dark' },
	{ id: 'quickev-charging-favicon', title: 'Charging favicon', project: 'Quick EV', about: 'The tab icon charges with amber in ten steps as the page scrolls down and turns back into the real icon at the top.', made: '2026-10', href: quickev, link: 'production', ground: 'dark' },
	{ id: 'enjaz-warp-cta', title: 'Warp button', project: 'Enjaz', about: 'A starfield drifts behind the closing call to action and jumps to warp while the pointer rests on the button.', made: '2026-10', href: `${enjaz}/design`, link: 'production', ground: 'dark' },
	{ id: 'loto-rolling-clock', title: 'Rolling clock', project: 'Iraq Loto', about: 'The countdown to sales close rolls only the digit that changes, and a whole row of cells rolls at once when the hour turns.', made: '2026-10', href: `${loto}/play`, link: 'production', ground: 'dark' },
	{ id: 'tally-atlas-pin-reveal', title: 'Pin the country', project: 'Tally', about: 'A pin drops where you think a country is, the real one fills gold and a dotted line measures how far off you were.', made: '2026-10', href: `${tally}/atlas/asia`, link: 'production', ground: 'dark' },
	{ id: 'loto-quick-pick', title: 'Quick pick', project: 'Iraq Loto', about: 'The dice tumbles while six gold balls land in the tray on a slowing beat, then the ticket drops into the cart.', made: '2026-10', href: `${loto}/play`, link: 'production', ground: 'dark' },
	{ id: 'enjaz-scroll-favicon', title: 'Scroll-drawn favicon', project: 'Enjaz', about: 'The tab icon draws the Enjaz mark with a pen exactly as far as the page has been scrolled, and unwinds on the way back up.', made: '2026-10', href: 'https://enjaz.tech', link: 'production', ground: 'dark' },
	{ id: 'quickev-charger-lineup', title: 'Charger lineup', project: 'Quick EV', about: 'Four chargers drawn to scale in hairline boot up one after another, their screens and lamps flickering on.', made: '2026-10', href: quickev, link: 'production', ground: 'dark' },
	{ id: 'enjaz-tab-puck', title: 'Tab puck', project: 'Enjaz', about: 'One soft puck glides under whichever section tab the pointer is on, and fades when the pointer leaves.', made: '2026-10', href: `${enjaz}/design`, link: 'production', ground: 'dark' },
	{ id: 'clasping-corners', title: 'Clasping corners', project: 'khaledwaleed.com', about: 'Engraved corner brackets stand just outside each button and step in to grip it under the pointer.', made: '2026-10', ground: 'dark' },
	{ id: 'enjaz-header-notch', title: 'Header notch', project: 'Enjaz', about: 'A flush header bar springs into a floating glass pill that hugs its content once the page scrolls, and opens back out at the top.', made: '2026-10', href: enjaz, link: 'production', ground: 'dark' },
	{ id: 'enjaz-sample-review', title: 'Fix the review', project: 'Enjaz', about: 'A sample design review you can work through: each finding ticks to fixed, a counter climbs, and the last fix stamps it ready to ship.', made: '2026-10', href: `${enjaz}/design`, link: 'production', ground: 'dark' },
	{ id: 'loto-pull-to-dismiss', title: 'Pull to dismiss', project: 'Iraq Loto', about: 'The cart sheet follows the finger, rubber-bands when pulled up, springs back from a short pull and leaves at the speed of a flick.', made: '2026-10', href: `${loto}/play`, link: 'production', ground: 'dark' },
	{ id: 'quickev-self-drawing-reveal', title: 'Line drawing reveal', project: 'Quick EV', about: 'Each line drawing draws its own strokes as its card scrolls in, and the words follow.', made: '2026-10', href: quickev, link: 'production', ground: 'dark', caption: 'top' },
	{ id: 'enjaz-name-egg', title: 'Type the name', project: 'Enjaz', about: 'Typing the company name anywhere on the page dims it, draws the mark large with a pen and flies it into the header logo.', made: '2026-10', href: enjaz, link: 'production', ground: 'dark' },
	{ id: 'quickev-charge-route', title: 'Charge route', project: 'Quick EV', about: 'A hairline map of Iraq where the charging route draws itself out of Baghdad to Erbil and Basra.', made: '2026-10', href: quickev, link: 'production', ground: 'dark' },
	{ id: 'tally-painted-scenes', title: 'Painted scenes', project: 'Tally', about: 'Picking a scene swaps the painting behind every page and retints the whole interface with its colours.', made: '2026-10', href: `${tally}/settings`, link: 'production', ground: 'light', caption: 'top' },
	{ id: 'enjaz-design-starfield', title: 'Traced mark', project: 'Enjaz', about: 'Over a starfield and a planet horizon, the Enjaz mark traces itself as a glowing line.', made: '2026-10', href: `${enjaz}/design`, link: 'production', ground: 'dark', caption: 'top' },
	{ id: 'loto-ball-drop-empty', title: 'Ball drop', project: 'Iraq Loto', about: 'The empty state for a player with no tickets: six gold balls drop into their cups one by one above the jackpot and the way to play.', made: '2026-10', ground: 'dark' },
	{ id: 'quickev-footer-cable', title: 'Charging cable', project: 'Quick EV', about: 'A drawn cable with a coil hangs over the footer, and current runs its length with a soft amber glow.', made: '2026-10', href: quickev, link: 'production', ground: 'dark' },
	{ id: 'away-tab', title: 'Away tab', project: 'khaledwaleed.com', about: 'Switch to another tab and this one says it will be here, its icon turning from the k to a gold crescent until you come back.', made: '2026-10', ground: 'dark' },
	{ id: 'enjaz-governorates-code', title: 'Nineteen lights', project: 'Enjaz', about: 'A secret arrow-key code lights all 19 governorate capitals on the map of Iraq, Baghdad first and the rest outward.', made: '2026-10', href: enjaz, link: 'production', ground: 'dark' },
	{ id: 'enjaz-rule-lens', title: 'Rule lens', project: 'Enjaz', about: 'A list of interface rules steps through a lens, each rule lighting up as it passes through the window.', made: '2026-10', href: `${enjaz}/design`, link: 'production', ground: 'dark', caption: 'top' },
	{ id: 'enjaz-ecosystem-funnel', title: 'Ecosystem funnel', project: 'Enjaz', about: 'The institutions Enjaz works for fan through hairline curves into its ring, then on to Super Qi and the citizen, each curve lighting under the pointer.', made: '2026-10', href: enjaz, link: 'production', ground: 'dark' },

	// September 2026
	{ id: 'auction-key-lot-404', title: 'Lot 404', project: 'Auction Key', about: 'A voxel 404 where the key logo stands in for the zero; tap its fallen tooth and it snaps back, the key rattles, and the tooth drops out again.', made: '2026-09', href: `${auctionKey}/lot-404`, link: 'production', ground: 'light' },
	{ id: 'room-walk', title: 'Room walk', project: 'khaledwaleed.com', about: 'Changing pages walks along one wall: the old room slides off as the next arrives, its painting travelling half as far as the words.', made: '2026-09', ground: 'dark' },
	{ id: 'loto-draw-reveal', title: 'Draw reveal', project: 'Iraq Loto', about: 'The six winning balls land one beat apart while matching numbers on the tickets light gold, then the red extra ball and the win.', made: '2026-09', ground: 'dark' },
	{ id: 'auction-key-cube-toss', title: 'Cube toss', project: 'Auction Key', about: 'Every button press tosses a few of the logo\'s cubes out of the click point, and they land in a row on the button\'s edge.', made: '2026-09', href: auctionKey, link: 'production', ground: 'light' },
	{ id: 'cuneiform-edge', title: 'Cuneiform edge', project: 'Ishtar Center', about: 'The footer\'s top edge presses in like a clay tablet, wedge by wedge from left to right.', made: '2026-09', href: 'https://ishtarcenter.com', link: 'production', ground: 'dark', caption: 'top' },
	{ id: 'curtain-menu', title: 'Curtain menu', project: 'khaledwaleed.com', about: 'On phones the menu is a velvet curtain drawn shut over the page, with the rooms rising onto the cloth.', made: '2026-09', ground: 'dark' },
	{ id: 'proscenium-toggle', title: 'Menu toggle', project: 'khaledwaleed.com', about: 'The phone menu icon is a rod over two drapes: opening, the rod lifts away and the drapes swing into a close mark.', made: '2026-09', ground: 'dark' },
	{ id: 'auction-key-key-assembly', title: 'Voxel key', project: 'Auction Key', about: 'The logo, a key built from eleven amber cubes, assembles cube by cube on a spring.', made: '2026-09', href: auctionKey, link: 'production', ground: 'light' },
	{ id: 'tread-roll', title: 'Tread roll', project: 'Auto Zone', about: 'The wheel mark rolls across the footer\'s edge and presses a tire tread in behind it, hot cyan cooling to asphalt.', made: '2026-09', href: 'https://auto-zone.co', link: 'production', ground: 'dark', caption: 'top' },
	{ id: 'pen-crossing', title: 'Pen crossing', project: 'khaledwaleed.com', about: 'Stepping from the dark museum into the paper studies, a leaning edge sweeps across the screen with a pen stroke riding it.', made: '2026-09', ground: 'dark' },
	{ id: 'footer-signature', title: 'Signed footer', project: 'khaledwaleed.com', about: 'Every page is signed like a canvas: the drawn kw writes itself stroke by stroke at the end of a fading hairline.', made: '2026-09', ground: 'dark' },
	{ id: 'honeycomb-edge', title: 'Vial lattice', project: 'Almadafaat', about: 'A honeycomb edge of vials spins out from the logo cell and fills, and the pointer floods the cells it passes.', made: '2026-09', ground: 'light', caption: 'top' },
	{ id: 'auction-key-cube-skyline', title: 'Cube skyline', project: 'Auction Key', about: 'The footer rises into the page as a skyline of cubes that drop onto the base row as it scrolls into view.', made: '2026-09', href: auctionKey, link: 'production', ground: 'light', caption: 'top' },
	{ id: 'diamond-ledger', title: 'Diamond ledger', project: 'Al-Obaidi General Trading', about: 'The logo\'s diamonds stack onto the footer rule column by column, then ripple as the pointer runs along them.', made: '2026-09', ground: 'light', caption: 'top' },

	// August 2026
	{ id: 'curtain-overture', title: 'Curtain overture', project: 'khaledwaleed.com', about: 'Every first visit opens on a velvet curtain cut from the room\'s own colour, which parts on a room that is already hung.', made: '2026-08', ground: 'dark' },
	{ id: 'vitex-wet-ink-masthead', title: 'Wet ink', project: 'Vitex', about: 'The word Vitex as wet ink in a fluid simulation: the pointer smears it into swirls and the letters heal back.', made: '2026-08', ground: 'light' },
	{ id: 'after-hours-screensaver', title: 'After hours', project: 'khaledwaleed.com', about: 'Leave a page still and the lights go down while the signature writes itself onto the dark wall.', made: '2026-08', ground: 'dark' },
	{ id: 'vitex-measured-selection', title: 'Measured selection', project: 'Vitex', about: 'A retired hero where the claim arrives already under inspection, a design selection box measuring the last word.', made: '2026-08', ground: 'dark' },
	{ id: 'service-corridor', title: 'Command palette', project: 'khaledwaleed.com', about: 'The palette searches the pages, and a typed fragment surfaces a hidden encore that lowers the curtain again.', made: '2026-08', ground: 'dark' },
	{ id: 'dipper-overture', title: 'Big Dipper loader', project: 'Morshed', about: 'A loader traces the Big Dipper logo star by star, handle to bowl.', made: '2026-08', ground: 'dark', caption: 'top' },

	// July 2026
	{ id: 'auction-key-voxel-scenes', title: 'Voxel scenes', project: 'Auction Key', about: 'Empty states drawn in cubes: a cargo ship on drifting waves, a crane swinging a block, a magnifier over a missing tile.', made: '2026-07', ground: 'light' },

	// Pixel art
	{ id: 'solace-palette-swap', title: 'Solace', project: 'Pixel art', about: 'A pixel scene of a torii gate, a samurai and a dragon crossing the moon, cycling through its three palettes.', made: '2021-11', ground: 'dark', caption: 'top' },
	{ id: 'px-sunset-city', title: 'Sunset city', project: 'Pixel art', about: 'A skyline burning orange at dusk over the water, with a Ferris wheel and the E Corp tower.', made: '2021-05', ground: 'light', caption: 'top' },
	{ id: 'px-sorrow', title: 'Sorrow', project: 'Pixel art', about: 'A boy sits alone on a bench under his own rain cloud while the city sleeps, a star falls and the lamp breathes.', made: '2021-04', ground: 'dark', caption: 'top' },
	{ id: 'px-evil-tower', title: 'The evil that does not sleep', project: 'Pixel art', about: 'A dark tower with a watching eye under a sky of burning clouds and a crescent moon.', made: '2021-02', ground: 'dark' },
	{ id: 'px-bow-shot', title: 'Bow shot', project: 'Pixel art', about: 'A bow draws its string and looses an arrow, frame by frame.', made: '2021-01', ground: 'dark' },
	{ id: 'px-peace', title: 'Peace', project: 'Pixel art', about: 'A strip of pink sunset clouds over a quiet green shore.', made: '2021-01', ground: 'dark' },
	{ id: 'px-storm-clouds', title: 'Storm clouds', project: 'Pixel art', about: 'Purple storm clouds over the hills, lit by a strike of lightning and a full moon.', made: '2020-11', ground: 'dark' },
	{ id: 'px-pines', title: 'Pines', project: 'Pixel art', about: 'A pine forest under a misty full moon, with a small cabin among the trees.', made: '2020-09', ground: 'dark' },
	{ id: 'px-night-lake', title: 'Night lake', project: 'Pixel art', about: 'A full moon over the mountains and its reflection in a still lake, with a shooting star.', made: '2020-06', ground: 'dark', caption: 'top' },
	{ id: 'px-city-of-lights', title: 'City of lights', project: 'Pixel art', about: 'A city skyline under a crescent moon, swapping between its pink and purple palettes.', made: '2020-06', ground: 'dark', caption: 'top' },
	{ id: 'px-iroh-moods', title: 'Iroh’s moods', project: 'Pixel art', about: 'Uncle Iroh in three moods, angry, disappointed and happy, one after another.', made: '2020-06', ground: 'dark', caption: 'top' },
	{ id: 'px-eye-of-cthulhu', title: 'Eye of Cthulhu', project: 'Pixel art', about: 'A lone figure with a torch under a black eclipse in the night sky.', made: '2020-06', ground: 'dark' },
	{ id: 'px-red-dusk', title: 'Red dusk', project: 'Pixel art', about: 'A red sun setting behind autumn trees.', made: '2020-06', ground: 'dark' },
	{ id: 'px-aang', title: 'Aang', project: 'Pixel art', about: 'Aang meditating, drawn in pixels.', made: '2020-05', ground: 'dark', caption: 'top' },
	{ id: 'px-nether', title: 'Nether', project: 'Pixel art', about: 'A dark cave with falls of lava and a glowing portal.', made: '2020-04', ground: 'dark', caption: 'top' },
	{ id: 'campfire-glade', title: 'Campfire', project: 'Pixel art', about: 'A looping pixel forest clearing with a flickering campfire, fireflies and a shimmering river.', made: '2020-04', ground: 'dark', caption: 'top' },
]
