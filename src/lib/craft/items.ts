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
	{ id: 'tally-atlas-pin-reveal', title: 'Pin the country', project: 'Tally', about: 'A pin drops where you think a country is, the real one fills gold and a dotted line measures how far off you were.', made: '2026-10', href: `${tally}/atlas/asia`, link: 'production', ground: 'dark' },
	{ id: 'loto-quick-pick', title: 'Quick pick', project: 'Iraq Loto', about: 'The dice tumbles while six gold balls land in the tray on a slowing beat, then the ticket drops into the cart.', made: '2026-10', href: `${loto}/play`, link: 'production', ground: 'dark' },
	{ id: 'enjaz-scroll-favicon', title: 'Scroll-drawn favicon', project: 'Enjaz', about: 'The tab icon draws the Enjaz mark with a pen exactly as far as the page has been scrolled, and unwinds on the way back up.', made: '2026-10', href: 'https://enjaz.tech', link: 'production', ground: 'dark' },
	{ id: 'quickev-charger-lineup', title: 'Charger lineup', project: 'Quick EV', about: 'Four chargers drawn to scale in hairline boot up one after another, their screens and lamps flickering on.', made: '2026-10', href: quickev, link: 'production', ground: 'dark' },
	{ id: 'clasping-corners', title: 'Clasping corners', project: 'khaledwaleed.com', about: 'Engraved corner brackets stand just outside each button and step in to grip it under the pointer.', made: '2026-10', ground: 'dark' },
	{ id: 'enjaz-header-notch', title: 'Header notch', project: 'Enjaz', about: 'A flush header bar springs into a floating glass pill that hugs its content once the page scrolls, and opens back out at the top.', made: '2026-10', href: enjaz, link: 'production', ground: 'dark' },
	{ id: 'loto-pull-to-dismiss', title: 'Pull to dismiss', project: 'Iraq Loto', about: 'The cart sheet follows the finger, rubber-bands when pulled up, springs back from a short pull and leaves at the speed of a flick.', made: '2026-10', href: `${loto}/play`, link: 'production', ground: 'dark' },
	{ id: 'quickev-self-drawing-reveal', title: 'Line drawing reveal', project: 'Quick EV', about: 'Each line drawing draws its own strokes as its card scrolls in, and the words follow.', made: '2026-10', href: quickev, link: 'production', ground: 'dark', caption: 'top' },
	{ id: 'enjaz-name-egg', title: 'Type the name', project: 'Enjaz', about: 'Typing the company name anywhere on the page dims it, draws the mark large with a pen and flies it into the header logo.', made: '2026-10', href: enjaz, link: 'production', ground: 'dark' },
	{ id: 'tally-painted-scenes', title: 'Painted scenes', project: 'Tally', about: 'Picking a scene swaps the painting behind every page and retints the whole interface with its colours.', made: '2026-10', href: `${tally}/settings`, link: 'production', ground: 'light', caption: 'top' },
	{ id: 'enjaz-design-starfield', title: 'Traced mark', project: 'Enjaz', about: 'Over a starfield and a planet horizon, the Enjaz mark traces itself as a glowing line.', made: '2026-10', href: `${enjaz}/design`, link: 'production', ground: 'dark', caption: 'top' },
	{ id: 'glass-bench', title: 'Frosted bar', project: 'khaledwaleed.com', about: 'Coloured tiles slide up under a recreated frosted top bar, comparing the real recipe with blur alone.', made: '2026-10', href: '/studies/apple', link: 'study', ground: 'light' },
	{ id: 'quickev-footer-cable', title: 'Charging cable', project: 'Quick EV', about: 'A drawn cable with a coil hangs over the footer, and current runs its length with a soft amber glow.', made: '2026-10', href: quickev, link: 'production', ground: 'dark' },
	{ id: 'enjaz-governorates-code', title: 'Nineteen lights', project: 'Enjaz', about: 'A secret arrow-key code lights all 19 governorate capitals on the map of Iraq, Baghdad first and the rest outward.', made: '2026-10', href: enjaz, link: 'production', ground: 'dark' },
	{ id: 'enjaz-rule-lens', title: 'Rule lens', project: 'Enjaz', about: 'A list of interface rules steps through a lens, each rule lighting up as it passes through the window.', made: '2026-10', href: `${enjaz}/design`, link: 'production', ground: 'dark', caption: 'top' },

	// September 2026
	{ id: 'auction-key-lot-404', title: 'Lot 404', project: 'Auction Key', about: 'A voxel 404 where the key logo stands in for the zero; tap its fallen tooth and it snaps back, the key rattles, and the tooth drops out again.', made: '2026-09', href: `${auctionKey}/lot-404`, link: 'production', ground: 'light' },
	{ id: 'tally-moonrise-finish', title: 'Moonrise', project: 'Tally', about: 'When the last Sudoku digit lands, the grid thins out, a moon rises behind the board and the digits brighten from the bottom row up.', made: '2026-09', href: tally, link: 'production', ground: 'dark' },
	{ id: 'room-walk', title: 'Room walk', project: 'khaledwaleed.com', about: 'Changing pages walks along one wall: the old room slides off as the next arrives, its painting travelling half as far as the words.', made: '2026-09', ground: 'dark' },
	{ id: 'loto-draw-reveal', title: 'Draw reveal', project: 'Iraq Loto', about: 'The six winning balls land one beat apart while matching numbers on the tickets light gold, then the red extra ball and the win.', made: '2026-09', ground: 'dark' },
	{ id: 'auction-key-cube-toss', title: 'Cube toss', project: 'Auction Key', about: 'Every button press tosses a few of the logo\'s cubes out of the click point, and they land in a row on the button\'s edge.', made: '2026-09', href: auctionKey, link: 'production', ground: 'light' },
	{ id: 'cuneiform-edge', title: 'Cuneiform edge', project: 'Ishtar Center', about: 'The footer\'s top edge presses in like a clay tablet, wedge by wedge from left to right.', made: '2026-09', href: 'https://ishtarcenter.com', link: 'production', ground: 'dark', caption: 'top' },
	{ id: 'curtain-menu', title: 'Curtain menu', project: 'khaledwaleed.com', about: 'On phones the menu is a velvet curtain drawn shut over the page, with the rooms rising onto the cloth.', made: '2026-09', ground: 'dark' },
	{ id: 'auction-key-key-assembly', title: 'Voxel key', project: 'Auction Key', about: 'The logo, a key built from eleven amber cubes, assembles cube by cube on a spring.', made: '2026-09', href: auctionKey, link: 'production', ground: 'light' },
	{ id: 'tread-roll', title: 'Tread roll', project: 'Auto Zone', about: 'The wheel mark rolls across the footer\'s edge and presses a tire tread in behind it, hot cyan cooling to asphalt.', made: '2026-09', href: 'https://auto-zone.co', link: 'production', ground: 'dark', caption: 'top' },
	{ id: 'pen-crossing', title: 'Pen crossing', project: 'khaledwaleed.com', about: 'Stepping from the dark museum into the paper studies, a leaning edge sweeps across the screen with a pen stroke riding it.', made: '2026-09', ground: 'dark' },
	{ id: 'shgad-settle-up', title: 'Settle up', project: 'Shgad', about: 'Marking a debt as paid throws a burst of flecks and swaps the balance for a green check that draws itself.', made: '2026-09', ground: 'light' },
	{ id: 'footer-signature', title: 'Signed footer', project: 'khaledwaleed.com', about: 'Every page is signed like a canvas: the drawn kw writes itself stroke by stroke at the end of a fading hairline.', made: '2026-09', ground: 'dark' },
	{ id: 'honeycomb-edge', title: 'Vial lattice', project: 'Almadafaat', about: 'A honeycomb edge of vials spins out from the logo cell and fills, and the pointer floods the cells it passes.', made: '2026-09', ground: 'light', caption: 'top' },
	{ id: 'auction-key-cube-skyline', title: 'Cube skyline', project: 'Auction Key', about: 'The footer rises into the page as a skyline of cubes that drop onto the base row as it scrolls into view.', made: '2026-09', href: auctionKey, link: 'production', ground: 'light', caption: 'top' },
	{ id: 'exposure-plates', title: 'Exposure plates', project: 'khaledwaleed.com', about: 'Four near-identical black plates under an exposure slider: the pure blacks stay black while the ones hiding blue give it up.', made: '2026-09', href: '/studies/monochrome', link: 'study', ground: 'light', caption: 'top' },
	{ id: 'diamond-ledger', title: 'Diamond ledger', project: 'Al-Obaidi General Trading', about: 'The logo\'s diamonds stack onto the footer rule column by column, then ripple as the pointer runs along them.', made: '2026-09', ground: 'light', caption: 'top' },
	{ id: 'scribble-underline', title: 'Scribble underline', project: 'khaledwaleed.com', about: 'Hovering a title draws one wobbling pen stroke under it from left to right.', made: '2026-09', ground: 'light', caption: 'top' },

	// August 2026
	{ id: 'curtain-overture', title: 'Curtain overture', project: 'khaledwaleed.com', about: 'Every first visit opens on a velvet curtain cut from the room\'s own colour, which parts on a room that is already hung.', made: '2026-08', ground: 'dark' },
	{ id: 'vitex-wet-ink-masthead', title: 'Wet ink', project: 'Vitex', about: 'The word Vitex as wet ink in a fluid simulation: the pointer smears it into swirls and the letters heal back.', made: '2026-08', ground: 'light' },
	{ id: 'after-hours-screensaver', title: 'After hours', project: 'khaledwaleed.com', about: 'Leave a page still and the lights go down while the signature writes itself onto the dark wall.', made: '2026-08', ground: 'dark' },
	{ id: 'vitex-ink-swarm', title: 'Ink swarm', project: 'Vitex', about: 'A quarter of a million grains of ink condense into the word Vitex, blow apart in the scroll and re-form as the next word.', made: '2026-08', ground: 'light', caption: 'top' },
	{ id: 'ease-race', title: 'Ease race', project: 'khaledwaleed.com', about: 'Three dots race on one clock, the same elastic ease built three ways, with tracers riding their curves.', made: '2026-08', href: '/studies/easing', link: 'study', ground: 'light' },
	{ id: 'service-corridor', title: 'Command palette', project: 'khaledwaleed.com', about: 'The palette searches the pages, and a typed fragment surfaces a hidden encore that lowers the curtain again.', made: '2026-08', ground: 'dark' },
	{ id: 'vitex-the-pour', title: 'The pour', project: 'Vitex', about: 'A loader where each letter fills from hairline to heavy ink while a readout pours past 100 percent.', made: '2026-08', ground: 'light', caption: 'top' },
	{ id: 'dipper-overture', title: 'Big Dipper loader', project: 'Morshed', about: 'A loader traces the Big Dipper logo star by star, then dissolves into a galaxy as the title rises.', made: '2026-08', ground: 'dark', caption: 'top' },

	// Earlier
	{ id: 'grinders-bean-field', title: 'Bean field', project: 'The Grinders', about: 'A hero of modelled coffee beans tumbling through warm fog, leaning toward the pointer as the camera moves in.', made: '2026-06', href: 'https://grindersiq.com', link: 'production', ground: 'dark', caption: 'top' },
	{ id: 'solace-palette-swap', title: 'Solace', project: 'Pixel art', about: 'A pixel scene of a torii gate, a samurai and a dragon crossing the moon, cycling through its three palettes.', made: '2021-11', ground: 'dark', caption: 'top' },
	{ id: 'campfire-glade', title: 'Campfire', project: 'Pixel art', about: 'A looping pixel forest clearing with a flickering campfire, fireflies and a shimmering river.', made: '2020-04', ground: 'dark', caption: 'top' },
]
