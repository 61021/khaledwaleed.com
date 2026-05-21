<script lang="ts">
	import { Container, Seo, PageHeader, Fleuron, site } from '$lib';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	const lastUpdated = '2026-05-21';

	const working = [
		{
			where: 'Qi',
			url: 'https://qi.iq',
			focus:
				'Leading frontend architecture across consumer products and a shared design system. Pulling LCP toward the second-mark on mid-range Android.'
		},
		{
			where: 'Vitex',
			url: 'https://vitex.dev',
			focus:
				'Shipping Nuxt interfaces over Go microservices. Profiling and tuning real production load. Owning the surface as well as the metal beneath it.'
		}
	];

	const building = [
		'This site — small, fast, hand-built, refurnished gently every few months.',
		'A small Go service for personal analytics. Privacy-first, no third parties, structured logs to a quiet Postgres.'
	];

	const reading = [
		{ title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann' },
		{ title: 'A Philosophy of Software Design', author: 'John Ousterhout' },
		{ title: 'The Beginning of Infinity', author: 'David Deutsch' }
	];

	const learning = [
		'Distributed consensus — Raft, then enough Paxos to argue about it.',
		'Rust, slowly and on purpose. Mostly via small command-line tools.',
		'Better writing. Shorter sentences. Fewer adverbs.'
	];

	const place = `${site.location.city}, ${site.location.country}. Remote-friendly hours that overlap with Europe and the US East.`;

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${site.url}/now#page`,
		url: `${site.url}/now`,
		name: `What ${site.name} is doing now`,
		description: `A snapshot of what Khaled Waleed is working on, building, reading and learning right now. Updated ${lastUpdated}.`,
		dateModified: lastUpdated,
		isPartOf: { '@id': `${site.url}/#website` },
		about: { '@id': `${site.url}/#person` },
		breadcrumb: {
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
				{ '@type': 'ListItem', position: 2, name: 'Now', item: `${site.url}/now` }
			]
		}
	};
</script>

<Seo
	title="Now"
	description={`What Khaled Waleed is at, right now. Updated ${lastUpdated}.`}
/>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>

<PageHeader
	room="now"
	eyebrow="a snapshot"
	title="Now"
>
	{#snippet lede()}
		<p>
			What I am at, today — in the spirit of Derek Sivers' <a
				href="https://nownownow.com"
				target="_blank"
				rel="noopener"
				class="link">/now</a
			> page, but with less of a hurry about it.
		</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	<div class="rise-3 mt-10">
		<Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Now', href: '/now' }]} />
		<div class="mt-4 smallcaps">
			updated <time datetime={lastUpdated}>{lastUpdated}</time>
		</div>
	</div>

	<Fleuron />

	<section class="rise space-y-8">
		<h2 class="italic">Working at</h2>
		<ul class="space-y-6">
			{#each working as w (w.where)}
				<li class="border-l-2 border-[var(--accent)] pl-5">
					<a href={w.url} target="_blank" rel="noopener" class="link italic">
						{w.where}
					</a>
					<p class="mt-2 leading-relaxed text-[var(--ink-muted)]">{w.focus}</p>
				</li>
			{/each}
		</ul>
	</section>

	<Fleuron />

	<section class="rise space-y-5">
		<h2 class="italic">Building on the side</h2>
		<ul class="space-y-3 italic text-[var(--ink-muted)]">
			{#each building as b}
				<li class="flex gap-3">
					<span aria-hidden="true" class="text-[var(--accent)]">·</span>
					<span>{b}</span>
				</li>
			{/each}
		</ul>
	</section>

	<Fleuron />

	<section class="rise space-y-5">
		<h2 class="italic">Reading</h2>
		<ul class="divide-y divide-[var(--rule)]">
			{#each reading as b (b.title)}
				<li class="flex items-baseline justify-between gap-6 py-3">
					<span class="italic text-[var(--ink)]">{b.title}</span>
					<span class="smallcaps shrink-0">{b.author}</span>
				</li>
			{/each}
		</ul>
	</section>

	<Fleuron />

	<section class="rise space-y-5">
		<h2 class="italic">Learning</h2>
		<ul class="space-y-3 italic text-[var(--ink-muted)]">
			{#each learning as l}
				<li class="flex gap-3">
					<span aria-hidden="true" class="text-[var(--accent)]">·</span>
					<span>{l}</span>
				</li>
			{/each}
		</ul>
	</section>

	<Fleuron />

	<section class="rise space-y-3">
		<h2 class="italic">Place</h2>
		<p class="leading-relaxed text-[var(--ink-muted)]">{place}</p>
	</section>

	<div class="rise mt-16 text-center italic text-[var(--ink-muted)]">
		Want the longer version? Read <a href="/about" class="link">about</a>, the
		<a href="/writing" class="link">writing</a>, or just
		<a href="/contact" class="link">say hello</a>.
	</div>
</Container>
