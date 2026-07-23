<script lang="ts">
	import { site } from '$lib/site';

	const personSchema = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'@id': `${site.url}/#person`,
		name: site.name,
		givenName: 'Khaled',
		familyName: 'Waleed',
		alternateName: ['Khaled', 'Khaled W', 'Khaled Waleed Khalid', 'kwaleedkhalid'],
		nationality: { '@type': 'Country', name: 'Iraq' },
		url: site.url,
		mainEntityOfPage: site.url,
		// Raster first — image search and knowledge panels skip SVGs.
		image: [`${site.url}${site.ogImage}`, `${site.url}${site.avatar}`],
		jobTitle: site.role,
		disambiguatingDescription: `${site.role} based in Baghdad, Iraq (QiCard, Vitex)`,
		hasOccupation: {
			'@type': 'Occupation',
			name: site.role,
			occupationLocation: [
				{ '@type': 'City', name: 'Baghdad' },
				{ '@type': 'Country', name: 'Iraq' }
			],
			skills: 'SvelteKit, Nuxt, TypeScript, Go, PostgreSQL, Linux'
		},
		email: `mailto:${site.email}`,
		telephone: site.phone,
		description: site.tagline,
		address: {
			'@type': 'PostalAddress',
			addressLocality: site.location.city,
			addressCountry: site.location.countryCode
		},
		homeLocation: {
			'@type': 'Place',
			address: {
				'@type': 'PostalAddress',
				addressLocality: site.location.city,
				addressCountry: site.location.countryCode
			}
		},
		worksFor: site.companies.map((c) => ({
			'@type': 'Organization',
			'@id': c.url,
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
		alternateName: 'khaledwaleed.com',
		description: site.tagline,
		inLanguage: 'en',
		author: { '@id': `${site.url}/#person` },
		publisher: { '@id': `${site.url}/#person` }
	};
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(personSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>`}
	<!-- rel=me identity links: tie the site to the profiles listed in the
	     Person schema's sameAs (and vice versa where the profile links back). -->
	{#each site.socials as s (s.href)}
		<link rel="me" href={s.href} />
	{/each}
</svelte:head>
