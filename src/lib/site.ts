// Central site configuration. Edit values here; everything else (SEO, schema,
// nav, footer, contact, paintings) reads from this file.

export const site = {
	name: 'Khaled Waleed',
	role: 'Senior Software Engineer',
	tagline:
		'A senior software engineer in Baghdad — building quiet, well-made software for the web in SvelteKit and Go.',
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

	keywords: [
		'Khaled Waleed',
		'Khaled Waleed software engineer',
		'Iraq software engineer',
		'Baghdad software engineer',
		'SvelteKit developer',
		'Nuxt developer',
		'Go developer Iraq',
		'TypeScript engineer',
		'freelance software engineer Baghdad'
	],

	companies: [
		{ name: 'Qi', url: 'https://qi.iq', role: 'Senior Software Engineer' },
		{ name: 'Vitex', url: 'https://vitex.dev', role: 'Senior Software Engineer' }
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
	]
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
		title: 'Two Men Contemplating the Moon',
		artist: 'Caspar David Friedrich',
		year: 'c. 1820',
		museum: 'Galerie Neue Meister, Dresden',
		museumUrl: 'https://gemaeldegalerie.skd.museum/',
		source: 'https://en.wikipedia.org/wiki/Two_Men_Contemplating_the_Moon',
		alt: 'Two figures in coats stand at the edge of a wood beside a leaning fir, looking up at a low evening moon.'
	},
	writing: {
		key: 'writing',
		title: 'The Abbey in the Oakwood',
		artist: 'Caspar David Friedrich',
		year: '1809–10',
		museum: 'Alte Nationalgalerie, Berlin',
		museumUrl: 'https://www.smb.museum/en/museums-institutions/alte-nationalgalerie/',
		source: 'https://en.wikipedia.org/wiki/The_Abbey_in_the_Oakwood',
		alt: 'The ruined gothic facade of an abbey rising out of bare oaks under a pale winter sky; small dark figures process toward it.'
	},
	'post-baghdad': {
		key: 'post-baghdad',
		title: 'Mother and Child by the Sea',
		artist: 'Johan Christian Dahl',
		year: 'c. 1830',
		museum: 'Nasjonalmuseet, Oslo',
		museumUrl: 'https://www.nasjonalmuseet.no/en/',
		source: 'https://en.wikipedia.org/wiki/Johan_Christian_Dahl',
		alt: 'A mother seated on a quiet shore with a small child, low pale sky, sandbar reaching into still water.'
	},
	'post-slow': {
		key: 'post-slow',
		title: 'Shipwreck on the Coast of Norway',
		artist: 'Johan Christian Dahl',
		year: '1832',
		museum: 'Nasjonalmuseet, Oslo',
		museumUrl: 'https://www.nasjonalmuseet.no/en/',
		source: 'https://en.wikipedia.org/wiki/Johan_Christian_Dahl',
		alt: 'A storm-broken ship pitched against dark rock; foam and torn sail under a furious sky.'
	},
	'post-hiring': {
		key: 'post-hiring',
		title: 'Cross in the Mountains (the Tetschen Altar)',
		artist: 'Caspar David Friedrich',
		year: '1808',
		museum: 'Galerie Neue Meister, Dresden',
		museumUrl: 'https://gemaeldegalerie.skd.museum/',
		source: 'https://en.wikipedia.org/wiki/Cross_in_the_Mountains_(Tetschen_Altar)',
		alt: 'A small wooden crucifix on a fir-covered peak, struck by the last gold of the sunset behind it.'
	},
	now: {
		key: 'now',
		title: 'Riesengebirge Landscape with Rising Fog',
		artist: 'Caspar David Friedrich',
		year: 'c. 1820',
		museum: 'Bayerische Staatsgemäldesammlungen, Munich',
		museumUrl: 'https://www.pinakothek.de/en',
		source: 'https://en.wikipedia.org/wiki/Caspar_David_Friedrich',
		alt: 'A succession of mountain ridges fading into pale fog, the valleys still hidden, daylight just arriving.'
	},
	likes: {
		key: 'likes',
		title: 'Moonrise over the Sea',
		artist: 'Caspar David Friedrich',
		year: '1822',
		museum: 'Alte Nationalgalerie, Berlin',
		museumUrl: 'https://www.smb.museum/en/museums-institutions/alte-nationalgalerie/home/',
		source: 'https://en.wikipedia.org/wiki/Moonrise_by_the_Sea',
		alt: 'Three figures on a rocky shore at dusk watch two ships return under a violet-blue sky tinged with the warm glow of the rising moon.'
	},
	contact: {
		key: 'contact',
		title: 'Frederiksborg Castle by Moonlight',
		artist: 'Johan Christian Dahl',
		year: '1817',
		museum: 'Statens Museum for Kunst, Copenhagen',
		museumUrl: 'https://www.smk.dk/en/',
		source: 'https://en.wikipedia.org/wiki/Johan_Christian_Dahl',
		alt: 'A Danish renaissance castle mirrored in still water under a high white moon and quiet clouds.'
	},
	'404': {
		key: '404',
		title: 'The Monk by the Sea',
		artist: 'Caspar David Friedrich',
		year: '1808–10',
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
	}
};

/** Map a URL pathname to a painting key (room). */
export function roomForPath(pathname: string): string {
	if (pathname === '/' || pathname === '') return 'home';
	if (pathname === '/about') return 'about';
	if (pathname === '/now') return 'now';
	if (pathname === '/likes') return 'likes';
	if (pathname === '/library') return 'library';
	if (pathname === '/contact') return 'contact';
	if (pathname === '/writing') return 'writing';
	if (pathname.startsWith('/writing/building-for-the-web-from-baghdad')) return 'post-baghdad';
	if (pathname.startsWith('/writing/the-cost-of-a-slow-page')) return 'post-slow';
	if (pathname.startsWith('/writing/hiring-senior-engineers-in-iraq')) return 'post-hiring';
	if (pathname.startsWith('/writing/')) return 'writing';
	return 'home';
}
