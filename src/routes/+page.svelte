<script lang="ts">
	import { Seo, Container, Button, PageHeader, site } from '$lib';

	// The homepage is the canonical profile page for the person entity.
	// This tells Google that "/" — not "/about" — is the primary page for
	// the "Khaled Waleed" query.
	const profilePageSchema = {
		'@context': 'https://schema.org',
		'@type': 'ProfilePage',
		'@id': `${site.url}/#profilepage`,
		url: site.url,
		name: `${site.name} — ${site.role}`,
		isPartOf: { '@id': `${site.url}/#website` },
		dateModified: '2026-07-23',
		primaryImageOfPage: `${site.url}${site.avatar}`,
		mainEntity: { '@id': `${site.url}/#person` }
	};
</script>

<Seo
	description="Khaled Waleed is a senior software engineer in Baghdad, Iraq, building production web apps in SvelteKit, Nuxt, and Go."
	type="profile"
/>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(profilePageSchema)}</script>`}
</svelte:head>

<PageHeader
	room="home"
	eyebrow={`${site.role} · ${site.location.city}, ${site.location.country}`}
	title="Khaled Waleed"
>
	{#snippet lede()}
		<p>
			I build software, write occasionally, and spend an unreasonable amount of time thinking about
			things.
		</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	<section class="rise mt-4 text-left sm:mt-10 sm:text-center">
		<div
			class="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4"
		>
			<Button href="/writing" size="lg" class="w-full sm:w-auto">Read the essays</Button>
			<Button href="/contact" variant="outline" size="lg" class="w-full sm:w-auto"
				>Write to me</Button
			>
		</div>
	</section>
</Container>
