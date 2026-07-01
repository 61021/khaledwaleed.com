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
		dateModified: '2026-06-23',
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

<PageHeader room="home" eyebrow="Entrance" title="Khaled Waleed">
	{#snippet lede()}
		<p>
			I build software, write occasionally, and spend an unreasonable amount of time thinking about
			things.
		</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	<section class="rise mt-10 space-y-6 text-center">
		<p class="mx-auto max-w-md italic text-[var(--ink-muted)]">
			This website is a record of some of that.
		</p>
		<div class="flex flex-wrap items-center justify-center gap-4 pt-2">
			<Button href="/writing" size="lg">Read the essays</Button>
			<Button href="/contact" variant="outline" size="lg">Write to me</Button>
		</div>
	</section>
</Container>
