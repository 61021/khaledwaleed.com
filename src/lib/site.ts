// Central site configuration. Edit values here; everything else (SEO, schema,
// nav, footer, contact, paintings) reads from this file.

export const site = {
	name: 'Khaled Waleed',
	// The name in its own script, rendered in visible text (footer, /story) so
	// Arabic-script name queries have a literal string to match, not just schema.
	nameArabic: 'خالد وليد',
	role: 'Design Engineer',
	tagline:
		'Khaled Waleed is a design engineer in Baghdad, Iraq, building well-made software for the web in SvelteKit and Go.',
	shortBio:
		'I design and ship modern web apps end to end: SvelteKit and Nuxt on the frontend, Go on the backend.',
	location: {
		city: 'Baghdad',
		country: 'Iraq',
		countryCode: 'IQ',
		locale: 'en_US',
	},
	url: 'https://khaledwaleed.com',
	email: 'contact@khaledwaleed.com',
	phone: '+9647838577553',
	/** The same number, spaced for human eyes (tel: links use `phone`). */
	phoneDisplay: '+964 783 857 7553',
	avatar: '/avatar.svg',
	ogImage: '/og.png',
	twitter: undefined as string | undefined,

	/**
	 * Cloudflare Web Analytics beacon token: cookieless, no fingerprinting,
	 * free. Grab it from dash.cloudflare.com → Analytics & Logs → Web Analytics
	 * → add khaledwaleed.com → copy the token from the JS snippet. Leave empty
	 * to ship no analytics at all.
	 */
	cloudflareAnalyticsToken: '',

	keywords: [
		'Khaled Waleed',
		'Khalid Waleed',
		'خالد وليد',
		'Khaled Waleed software engineer',
		'Design Engineer',
		'design engineer Iraq',
		'design engineer Baghdad',
		'software engineer Iraq',
		'senior frontend engineer Iraq',
		'SvelteKit developer Iraq',
		'Nuxt developer Iraq',
		'Go developer Iraq',
	],

	companies: [
		{ name: 'Enjaz', url: 'https://enjaz.tech', role: 'Lead Frontend Engineer' },
		{ name: 'Vitex', url: 'https://vitex.dev', role: 'Founder & Lead Engineer' },
		{
			name: 'Ishtar Center for Democracy Support',
			url: 'https://ishtarcenter.com',
			role: 'Director of AI & Technology',
		},
	],

	socials: [
		{ label: 'GitHub', href: 'https://github.com/61021', handle: '@61021' },
		{
			label: 'LinkedIn',
			href: 'https://www.linkedin.com/in/kwaleedkhalid/',
			handle: 'kwaleedkhalid',
		},
		{ label: 'Telegram', href: 'https://t.me/x61021', handle: '@x61021' },
		{ label: 'Instagram', href: 'https://www.instagram.com/khaled.jsx/', handle: '@khaled.jsx' },
		{ label: 'WhatsApp', href: 'https://wa.me/message/6N52L7STPCUJO1', handle: 'Message' },
	],

	// Profile pages elsewhere that are also me, fed to the Person schema's
	// sameAs and the rel=me links, but not rendered in the visible socials
	// list. Each of these pages links back here (reciprocal identity).
	profiles: ['https://ishtarcenter.com/team/khaled-waleed'],
} as const

export type SiteConfig = typeof site

/* -----------------------------------------------------------------------
   Paintings: one per page. Each entry is a public-domain Northern
   Romantic work hosted in /static/paintings/<key>.{avif,webp}.
   ----------------------------------------------------------------------- */

export interface Painting {
	key: string
	title: string
	artist: string
	year: string
	museum: string
	museumUrl: string
	/** Wikipedia article URL for credit / further reading */
	source: string
	/** Alt text for accessibility */
	alt: string
	/** CSS object-position for hero cover-crops (defaults to center) */
	focal?: string
}

export const paintings: Record<string, Painting> = {
	home: {
		key: 'home',
		title: 'View of Dresden by Moonlight',
		artist: 'Johan Christian Dahl',
		year: '1839',
		museum: 'Galerie Neue Meister, Dresden',
		museumUrl: 'https://gemaeldegalerie.skd.museum/',
		source: 'https://en.wikipedia.org/wiki/View_of_Dresden_by_Moonlight',
		alt: 'A river city under a clouded moon; lamps and the silhouette of the Frauenkirche reflected on dark water.',
	},
	story: {
		// File key is content-derived, not room-derived: /paintings/* is cached
		// immutable, so every re-hang MUST ship a new filename (046baf6 swapped
		// bytes in place and served cross-hung art for two days).
		key: 'frederiksborg',
		title: 'Frederiksborg Castle by Moonlight',
		artist: 'Johan Christian Dahl',
		year: '1817',
		museum: 'Statens Museum for Kunst, Copenhagen',
		museumUrl: 'https://www.smk.dk/en/',
		source: 'https://en.wikipedia.org/wiki/Johan_Christian_Dahl',
		alt: 'A Danish renaissance castle mirrored in still water under a high white moon and quiet clouds.',
	},
	writing: {
		key: 'apostle',
		title: 'The Apostle Paul',
		artist: 'Rembrandt van Rijn',
		year: 'c. 1657',
		museum: 'National Gallery of Art, Washington',
		museumUrl: 'https://www.nga.gov/',
		source: 'https://commons.wikimedia.org/wiki/File:Saint_Paul,_Rembrandt_van_Rijn_(and_Workshop%3F),_c._1657.jpg',
		alt: 'An aged apostle at his desk, hand pressed to his brow in thought, an open manuscript before him and his sword hanging on the wall beside him.',
		// keep the bowed head and the thinking hand in the wide desktop crop
		focal: '50% 30%',
	},
	likes: {
		key: 'likes',
		title: 'Moonrise over the Sea',
		artist: 'Caspar David Friedrich',
		year: '1822',
		museum: 'Alte Nationalgalerie, Berlin',
		museumUrl: 'https://www.smb.museum/en/museums-institutions/alte-nationalgalerie/home/',
		source: 'https://en.wikipedia.org/wiki/Moonrise_by_the_Sea',
		alt: 'Three figures on a rocky shore at dusk watch two ships return under a violet-blue sky tinged with the warm glow of the rising moon.',
		// keep the moonlit sky and the watchers in the wide desktop crop
		focal: '50% 30%',
	},
	contact: {
		// Content-derived key per the immutable-cache law; the Two Men's
		// room-era key retired with the canvas 2026-08-15.
		key: 'man-writing',
		title: 'Man Writing a Letter',
		artist: 'Gabriël Metsu',
		year: 'c. 1664-66',
		museum: 'National Gallery of Ireland, Dublin',
		museumUrl: 'https://www.nationalgallery.ie/',
		source: 'https://en.wikipedia.org/wiki/Man_Writing_a_Letter',
		alt: 'A young man in black sits at a carpeted table by a bright window, writing a letter, a globe on the ledge behind him.',
		// keep his head and the letter in the wide desktop crop
		focal: '48% 32%',
	},
	404: {
		key: '404',
		title: 'The Monk by the Sea',
		artist: 'Caspar David Friedrich',
		year: '1808-10',
		museum: 'Alte Nationalgalerie, Berlin',
		museumUrl: 'https://www.smb.museum/en/museums-institutions/alte-nationalgalerie/',
		source: 'https://en.wikipedia.org/wiki/The_Monk_by_the_Sea',
		alt: 'A single small figure on a pale dune facing an enormous, empty grey sea under a vast quiet sky.',
	},
	library: {
		key: 'library',
		title: 'Philosopher in Meditation',
		artist: 'Rembrandt van Rijn',
		year: '1632',
		museum: 'Musée du Louvre, Paris',
		museumUrl: 'https://www.louvre.fr/en/',
		source: 'https://en.wikipedia.org/wiki/Philosopher_in_Meditation',
		alt: 'An old scholar seated by a tall arched window in a vaulted chamber, head bowed, a spiral wooden staircase winding up into shadow behind him.',
	},
	films: {
		key: 'films',
		title: 'The Ruins of Holyrood Chapel',
		artist: 'Louis Daguerre',
		year: '1824',
		museum: 'Walker Art Gallery, Liverpool',
		museumUrl: 'https://www.liverpoolmuseums.org.uk/walker-art-gallery',
		source: 'https://en.wikipedia.org/wiki/The_Ruins_of_Holyrood_Chapel',
		alt: 'Moonlight pours through the bare gothic east window of a roofless chapel, silvering the broken columns and gravestones inside the ruin.',
		// keep the moonlit window and the lit nave in the wide desktop crop
		focal: '50% 35%',
	},
	music: {
		key: 'music',
		title: 'The Guitar Player',
		artist: 'Johannes Vermeer',
		year: 'c. 1672',
		museum: 'Kenwood House, London',
		museumUrl: 'https://www.english-heritage.org.uk/visit/places/kenwood/',
		source: 'https://en.wikipedia.org/wiki/The_Guitar_Player_(Vermeer)',
		alt: 'A young woman in a yellow ermine-trimmed jacket plays a guitar, glancing aside with a half-smile, in a sunlit Dutch interior.',
		// keep her face and the guitar in the wide entrance-hall crop
		focal: '50% 30%',
	},
	projects: {
		// Content-derived key per the immutable-cache law; the Alchemist's
		// room-era key retired with the canvas 2026-08-20.
		key: 'geographer',
		title: 'The Geographer',
		artist: 'Johannes Vermeer',
		year: '1669',
		museum: 'Städel Museum, Frankfurt',
		museumUrl: 'https://www.staedelmuseum.de/en',
		source: 'https://en.wikipedia.org/wiki/The_Geographer',
		alt: 'A geographer in a blue gown pauses over his charts with dividers in hand, looking up into the window light, a globe on the cabinet behind him.',
		// keep his lifted face and the dividers in the wide desktop crop
		focal: '46% 28%',
	},
	tools: {
		// Kersting painting his friend's famously bare studio: easel, chair,
		// palette, one half-shuttered window. A room holding only the tools
		// it needs, which is the whole thesis of the page it hangs in.
		key: 'atelier',
		title: 'Caspar David Friedrich in his Studio',
		artist: 'Georg Friedrich Kersting',
		year: '1812',
		museum: 'Alte Nationalgalerie, Berlin',
		museumUrl: 'https://www.smb.museum/en/museums-institutions/alte-nationalgalerie/',
		source: 'https://en.wikipedia.org/wiki/Caspar_David_Friedrich_in_his_Studio',
		alt: 'The painter alone at his easel in an almost empty studio, seen from behind, lit by one tall half-shuttered window.',
		// keep the painter and the easel in the wide desktop crop
		focal: '50% 55%',
	},
}

/* -----------------------------------------------------------------------
   Retired canvases: works that hung in a room and came down when it was
   re-hung. Their files stay in /static/paintings under content-derived
   keys per the immutable-cache law, and they reappear in the storeroom
   (/storeroom), newest to come down first.
   ----------------------------------------------------------------------- */

export interface RetiredPainting extends Painting {
	/** the page it hung on */
	hungOn: string
	/** when it came down, printed on the storeroom label */
	until: string
}

export const retired: RetiredPainting[] = [
	{
		// Room-era file key, retired with the canvas; its files stay
		// byte-identical at their year-cached URLs.
		key: 'projects',
		title: 'The Alchemist Discovering Phosphorus',
		artist: 'Joseph Wright of Derby',
		year: '1771',
		museum: 'Derby Museum and Art Gallery',
		museumUrl: 'https://www.derbymuseums.org/',
		source: 'https://en.wikipedia.org/wiki/The_Alchemist_Discovering_Phosphorus',
		alt: 'An alchemist kneels in his vaulted workshop as the vessel before him erupts in white light, two apprentices at their work in the shadows behind.',
		hungOn: '/projects',
		until: 'August 2026',
	},
	{
		key: 'two-men',
		title: 'Two Men Contemplating the Moon',
		artist: 'Caspar David Friedrich',
		year: 'c. 1820',
		museum: 'Galerie Neue Meister, Dresden',
		museumUrl: 'https://gemaeldegalerie.skd.museum/',
		source: 'https://en.wikipedia.org/wiki/Two_Men_Contemplating_the_Moon',
		alt: 'Two figures in coats stand at the edge of a wood beside a leaning fir, looking up at a low evening moon.',
		hungOn: '/contact',
		until: 'August 2026',
	},
	{
		// Master restored from the writing tasting's archive copy; the
		// canvas originally hung under the room-named key that its
		// replacement retired.
		key: 'abbey',
		title: 'The Abbey in the Oakwood',
		artist: 'Caspar David Friedrich',
		year: '1809-10',
		museum: 'Alte Nationalgalerie, Berlin',
		museumUrl: 'https://www.smb.museum/en/museums-institutions/alte-nationalgalerie/',
		source: 'https://en.wikipedia.org/wiki/The_Abbey_in_the_Oakwood',
		alt: 'The ruined choir of a gothic abbey stands among bare oaks in winter fog, a file of monks carrying a coffin toward its gate.',
		hungOn: '/writing',
		until: 'August 2026',
	},
]

/** Map a URL pathname to a painting key (room). */
export function roomForPath(pathname: string): string {
	if (pathname === '/' || pathname === '')
		return 'home'
	// The creative space and its studies: paper rooms outside the museum
	// (+layout.svelte renders them without the house chrome).
	if (pathname === '/space')
		return 'space'
	if (pathname.startsWith('/space/'))
		return 'study'
	if (pathname === '/story')
		return 'story'
	if (pathname === '/likes')
		return 'likes'
	if (pathname === '/library')
		return 'library'
	if (pathname === '/films')
		return 'films'
	if (pathname === '/music')
		return 'music'
	if (pathname === '/projects')
		return 'projects'
	if (pathname === '/contact')
		return 'contact'
	if (pathname === '/tools')
		return 'tools'
	if (pathname === '/writing')
		return 'writing'
	if (pathname.startsWith('/writing/'))
		return 'writing'
	return 'home'
}

/**
     The --bg of each [data-room] palette; keep in sync with app.css.
    Used for the <meta name="theme-color"> so browser chrome matches the room.
 */
export const roomBg: Record<string, string> = {
	home: '#0a1220',
	story: '#191114',
	writing: '#1b1410',
	library: '#1a1814',
	films: '#121319',
	music: '#141017',
	projects: '#191712',
	likes: '#0a0e1a',
	contact: '#1a1413',
	tools: '#131310',
	404: '#232b30',
	space: '#e9e4de',
	study: '#ffffff',
}
