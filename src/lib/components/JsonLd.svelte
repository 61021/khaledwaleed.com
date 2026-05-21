<script lang="ts">
	import { site } from '$lib/site';

	const personSchema = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'@id': `${site.url}/#person`,
		name: site.name,
		alternateName: ['Khaled', 'Khaled W', 'kwaleedkhalid'],
		url: site.url,
		image: `${site.url}${site.avatar}`,
		jobTitle: site.role,
		email: `mailto:${site.email}`,
		telephone: site.phone,
		description: site.tagline,
		address: {
			'@type': 'PostalAddress',
			addressLocality: site.location.city,
			addressCountry: site.location.countryCode
		},
		worksFor: site.companies.map((c) => ({
			'@type': 'Organization',
			name: c.name,
			url: c.url
		})),
		knowsAbout: [
			'Software Engineering',
			'Web Development',
			'SvelteKit',
			'Nuxt.js',
			'TypeScript',
			'Golang',
			'Backend Engineering',
			'Frontend Engineering',
			'DevOps',
			'Linux'
		],
		knowsLanguage: ['en', 'ar'],
		sameAs: site.socials.map((s) => s.href)
	};

	const websiteSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': `${site.url}/#website`,
		url: site.url,
		name: site.name,
		description: site.tagline,
		inLanguage: 'en',
		publisher: { '@id': `${site.url}/#person` },
		potentialAction: {
			'@type': 'SearchAction',
			target: `${site.url}/?q={search_term_string}`,
			'query-input': 'required name=search_term_string'
		}
	};
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(personSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>`}
</svelte:head>
