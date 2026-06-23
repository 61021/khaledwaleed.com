<script lang="ts">
	import { Seo, Container, PageHeader, site } from '$lib';

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

	// Every section of the site, listed on the homepage as an index.
	const sections = [
		{ name: 'About', href: '/about', blurb: 'More about me' },
		{ name: 'Writing', href: '/writing', blurb: 'Essays & notes' },
		{ name: 'Likes', href: '/likes', blurb: 'Things I like' },
		{ name: 'Library', href: '/library', blurb: 'Books' },
		{ name: 'Films', href: '/films', blurb: 'Rated films & shows' },
		{ name: 'Music', href: '/music', blurb: "What I'm listening to" },
		{ name: 'Contact', href: '/contact', blurb: 'Get in touch' }
	];
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
	<section class="rise mt-10">
		<p class="mx-auto max-w-md text-center italic text-[var(--ink-muted)]">
			This website is a record of some of that.
		</p>

		<nav aria-label="Sections" class="mt-10">
			<ul class="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
				{#each sections as s (s.href)}
					<li>
						<a href={s.href} class="index-row">
							<span class="index-name">{s.name}</span>
							<span class="index-blurb">{s.blurb}</span>
							<span class="index-arrow" aria-hidden="true">→</span>
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</section>
</Container>

<style>
	.index-row {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		padding: 1.05rem 0.25rem;
		transition: padding-left 250ms ease;
	}

	.index-row:hover {
		padding-left: 0.85rem;
	}

	.index-name {
		font-family: var(--font-display);
		font-style: italic;
		font-size: 1.5rem;
		line-height: 1.1;
		color: var(--ink);
		transition: color 250ms ease;
	}

	.index-row:hover .index-name {
		color: var(--accent);
	}

	.index-blurb {
		flex: 1;
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--ink-muted);
		text-align: right;
	}

	.index-arrow {
		color: var(--accent);
		opacity: 0;
		transform: translateX(-6px);
		transition:
			opacity 250ms ease,
			transform 250ms ease;
	}

	.index-row:hover .index-arrow {
		opacity: 1;
		transform: translateX(0);
	}

	@media (max-width: 460px) {
		.index-blurb {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.index-row,
		.index-arrow {
			transition: none;
		}
	}
</style>
