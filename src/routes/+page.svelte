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
	eyebrow={`${site.role} · ${site.location.city}, ${site.location.country}`}
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
	<section class="rise mt-6 space-y-6 text-left sm:mt-10 sm:text-center">
		<p class="max-w-md italic text-[var(--ink-muted)] sm:mx-auto">
			This website is a record of some of that.
		</p>
		<div class="flex flex-wrap items-center justify-start gap-4 pt-2 sm:justify-center">
			<Button href="/writing" size="lg">Read the essays</Button>
			<Button href="/contact" variant="outline" size="lg">Write to me</Button>
		</div>
	</section>
</Container>
