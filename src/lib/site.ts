// Central site configuration. Edit values here; everything else (SEO, schema,
// nav, footer, contact, paintings) reads from this file.

export const site = {
	name: 'Khaled Waleed',
	// The name in its own script — rendered in visible text (footer, /about) so
	// Arabic-script name queries have a literal string to match, not just schema.
	nameArabic: 'خالد وليد',
	role: 'Lead Design Engineer',
	tagline:
		'Khaled Waleed is a lead design engineer in Baghdad, Iraq, building well-made software for the web in SvelteKit and Go.',
	shortBio:
		'I design and ship modern web apps end to end: SvelteKit and Nuxt on the frontend, Go on the backend.',
	location: {
		city: 'Baghdad',
		country: 'Iraq',
		countryCode: 'IQ',
		locale: 'en_US'
	},
	url: 'https://khaledwaleed.com',
	email: 'contact@khaledwaleed.com',
	phone: '+9647838577553',
	avatar: '/avatar.svg',
	ogImage: '/og.png',
	twitter: undefined as string | undefined,

	/**
	 * Cloudflare Web Analytics beacon token — cookieless, no fingerprinting,
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
		'lead design engineer Iraq',
		'design engineer Baghdad',
		'senior developer Iraq',
		'senior dev Iraq',
		'senior frontend engineer Iraq',
		'senior backend engineer Iraq',
		'Iraqi software engineer',
		'Baghdad software engineer',
		'hire senior engineer Iraq',
		'SvelteKit developer Iraq',
		'Nuxt developer Iraq',
		'Go developer Iraq',
		'TypeScript engineer Iraq',
		'freelance senior software engineer Baghdad'
	],

	companies: [
		{ name: 'QiCard', url: 'https://qi.iq', role: 'Lead Frontend Engineer' },
		{ name: 'Vitex', url: 'https://vitex.dev', role: 'Founder & Lead Engineer' },
		{
			name: 'Ishtar Center for Democracy Support',
			url: 'https://ishtarcenter.com',
			role: 'Director of AI & Technology'
		}
	],

	socials: [
		{ label: 'GitHub', href: 'https://github.com/61021', handle: '@61021' },
		{
			label: 'LinkedIn',
			href: 'https://www.linkedin.com/in/kwaleedkhalid/',
			handle: 'kwaleedkhalid'
		},
		{ label: 'Telegram', href: 'https://t.me/x61021', handle: '@x61021' },
		{ label: 'Instagram', href: 'https://www.instagram.com/khaled.jsx/', handle: '@khaled.jsx' },
		{ label: 'WhatsApp', href: 'https://wa.me/message/6N52L7STPCUJO1', handle: 'Message' }
	],

	// Profile pages elsewhere that are also me — fed to the Person schema's
	// sameAs and the rel=me links, but not rendered in the visible socials
	// list. Each of these pages links back here (reciprocal identity).
	profiles: ['https://ishtarcenter.com/team/khaled-waleed']
} as const;

export type SiteConfig = typeof site;

/* -----------------------------------------------------------------------
   Paintings — one per page. Each entry is a public-domain Northern
   Romantic work hosted in /static/paintings/<key>.{avif,webp}.
   ----------------------------------------------------------------------- */

export type Painting = {
	key: string;
	title: string;
	artist: string;
	year: string;
	museum: string;
	museumUrl: string;
	/** Wikipedia article URL for credit / further reading */
	source: string;
	/** Alt text for accessibility */
	alt: string;
	/** CSS object-position for hero cover-crops (defaults to center) */
	focal?: string;
};

export const paintings: Record<string, Painting> = {
	home: {
		key: 'home',
		title: 'View of Dresden by Moonlight',
		artist: 'Johan Christian Dahl',
		year: '1839',
		museum: 'Galerie Neue Meister, Dresden',
		museumUrl: 'https://gemaeldegalerie.skd.museum/',
		source: 'https://en.wikipedia.org/wiki/View_of_Dresden_by_Moonlight',
		alt: 'A river city under a clouded moon; lamps and the silhouette of the Frauenkirche reflected on dark water.'
	},
	about: {
		key: 'about',
		title: 'Frederiksborg Castle by Moonlight',
		artist: 'Johan Christian Dahl',
		year: '1817',
		museum: 'Statens Museum for Kunst, Copenhagen',
		museumUrl: 'https://www.smk.dk/en/',
		source: 'https://en.wikipedia.org/wiki/Johan_Christian_Dahl',
		alt: 'A Danish renaissance castle mirrored in still water under a high white moon and quiet clouds.'
	},
	writing: {
		key: 'writing',
		title: 'The Abbey in the Oakwood',
		artist: 'Caspar David Friedrich',
		year: '1809-10',
		museum: 'Alte Nationalgalerie, Berlin',
		museumUrl: 'https://www.smb.museum/en/museums-institutions/alte-nationalgalerie/',
		source: 'https://en.wikipedia.org/wiki/The_Abbey_in_the_Oakwood',
		alt: 'The ruined gothic facade of an abbey rising out of bare oaks under a pale winter sky; small dark figures process toward it.'
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
		focal: '50% 30%'
	},
	contact: {
		key: 'contact',
		title: 'Two Men Contemplating the Moon',
		artist: 'Caspar David Friedrich',
		year: 'c. 1820',
		museum: 'Galerie Neue Meister, Dresden',
		museumUrl: 'https://gemaeldegalerie.skd.museum/',
		source: 'https://en.wikipedia.org/wiki/Two_Men_Contemplating_the_Moon',
		alt: 'Two figures in coats stand at the edge of a wood beside a leaning fir, looking up at a low evening moon.'
	},
	'404': {
		key: '404',
		title: 'The Monk by the Sea',
		artist: 'Caspar David Friedrich',
		year: '1808-10',
		museum: 'Alte Nationalgalerie, Berlin',
		museumUrl: 'https://www.smb.museum/en/museums-institutions/alte-nationalgalerie/',
		source: 'https://en.wikipedia.org/wiki/The_Monk_by_the_Sea',
		alt: 'A single small figure on a pale dune facing an enormous, empty grey sea under a vast quiet sky.'
	},
	library: {
		key: 'library',
		title: 'Philosopher in Meditation',
		artist: 'Rembrandt van Rijn',
		year: '1632',
		museum: 'Musée du Louvre, Paris',
		museumUrl: 'https://www.louvre.fr/en/',
		source: 'https://en.wikipedia.org/wiki/Philosopher_in_Meditation',
		alt: 'An old scholar seated by a tall arched window in a vaulted chamber, head bowed, a spiral wooden staircase winding up into shadow behind him.'
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
		focal: '50% 35%'
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
		focal: '50% 30%'
	},
	projects: {
		key: 'projects',
		title: 'The Alchemist Discovering Phosphorus',
		artist: 'Joseph Wright of Derby',
		year: '1771',
		museum: 'Derby Museum and Art Gallery',
		museumUrl: 'https://www.derbymuseums.org/',
		source: 'https://en.wikipedia.org/wiki/The_Alchemist_Discovering_Phosphorus',
		alt: 'An alchemist kneels in his vaulted workshop as the vessel before him erupts in white light, two apprentices at their work in the shadows behind.',
		// keep the erupting vessel and the kneeling alchemist in the wide crop
		focal: '50% 68%'
	}
};

/** Map a URL pathname to a painting key (room). */
export function roomForPath(pathname: string): string {
	if (pathname === '/' || pathname === '') return 'home';
	if (pathname === '/about') return 'about';
	if (pathname === '/likes') return 'likes';
	if (pathname === '/library') return 'library';
	if (pathname === '/films') return 'films';
	if (pathname === '/music') return 'music';
	if (pathname === '/projects') return 'projects';
	if (pathname === '/contact') return 'contact';
	if (pathname === '/writing') return 'writing';
	if (pathname.startsWith('/writing/')) return 'writing';
	return 'home';
}

/** The --bg of each [data-room] palette — keep in sync with app.css.
    Used for the <meta name="theme-color"> so browser chrome matches the room. */
export const roomBg: Record<string, string> = {
	home: '#0a1220',
	about: '#0c121e',
	writing: '#1c1a17',
	library: '#1a1814',
	films: '#121319',
	music: '#141017',
	projects: '#131010',
	likes: '#0a0e1a',
	contact: '#1a1612',
	'404': '#232b30'
};
