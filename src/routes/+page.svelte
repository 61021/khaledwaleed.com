<script lang="ts">
	import { Seo, Container, Button, PageHeader, SchemaOrg, site } from '$lib';
	import { posts, formatDate } from '$lib/posts';

	const latest = posts[0];

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
		dateModified: '2026-08-02',
		primaryImageOfPage: `${site.url}${site.avatar}`,
		mainEntity: { '@id': `${site.url}/#person` }
	};
</script>

<Seo
	description="Khaled Waleed is a lead design engineer in Baghdad, Iraq, building production web apps in SvelteKit, Nuxt, and Go."
	type="profile"
/>

<SchemaOrg schema={profilePageSchema} />

<PageHeader
	room="home"
	eyebrow={`${site.role} ·\u00A0${site.location.city},\u00A0${site.location.country}`}
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
		{#if latest}
			<p class="pt-6 smallcaps">
				latest · <a href={`/writing/${latest.slug}`} class="link-quiet">{latest.title}</a>
				<span class="text-[var(--ink-dim)]">· {formatDate(latest.date)}</span>
			</p>
		{/if}
	</section>
</Container>
