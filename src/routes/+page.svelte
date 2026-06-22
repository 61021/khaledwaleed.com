<script lang="ts">
	import { Seo, Container, Button, PageHeader, Fleuron, site } from '$lib';

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
		dateModified: '2026-05-21',
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

<PageHeader room="home" eyebrow="front matter" title="Khaled Waleed">
	{#snippet lede()}
		<p>
			I build software for a living, but most of what occupies my mind has very little to do with
			software.
		</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	<section class="rise-3 mt-12">
		<p class="dropcap text-[1.15rem] leading-[1.78] text-[var(--ink)]">
			I'm interested in the way people think, the stories they tell themselves, and the decisions
			that separate a good person from a bad one. Not in theory. In real life.
		</p>
		<p>
			Professionally, I work in technology, payments, and public-interest projects. Personally, I
			spend most of my time, reading, writing, arguing about ideas, watching films, drinking coffee,
			abusing my body through exercise, and trying to make sense of a world that rarely makes sense
			of itself.
		</p>
	</section>

	<Fleuron />

	<section class="rise mt-8 space-y-5 text-center">
		<p class="mx-auto max-w-md italic text-[var(--ink-muted)]">
			This website is where I collect some of those thoughts.
		</p>
		<div class="flex flex-wrap items-center justify-center gap-4 pt-2">
			<Button href="/writing" size="lg">Read the essays</Button>
			<Button href="/contact" variant="outline" size="lg">Write to me</Button>
		</div>
	</section>
</Container>
