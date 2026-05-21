// Central site configuration. Edit values here; everything else (SEO, schema,
// nav, footer, contact) reads from this file.

export const site = {
	name: 'Khaled Waleed',
	role: 'Senior Software Engineer',
	tagline:
		'Senior software engineer from Baghdad, Iraq — building fast SvelteKit & Go systems for Qi and Vitex.',
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
