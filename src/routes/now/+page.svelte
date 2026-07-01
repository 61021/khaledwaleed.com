<script lang="ts">
	import { Container, Seo, PageHeader, Fleuron, site } from '$lib';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	const lastUpdated = '2026-05-21';

	const building = [
		'This site — small, fast, hand-built, refurnished gently every few months.',
		'A small Go service for personal analytics. Privacy-first, no third parties, structured logs to a quiet Postgres.'
	];

	const reading = [{ title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman' }];

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

<Seo title="Now" description={`What Khaled Waleed is at, right now. Updated ${lastUpdated}.`} />

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>

<PageHeader room="now" eyebrow="a snapshot" title="Now">
	{#snippet lede()}
		<p>
			The answer to <em>“what are you up to lately?”</em> &mdash; part of the
			<a href="https://nownownow.com" target="_blank" rel="noopener" class="link">Now Now Now</a>
			project.
		</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	<div class="rise-3 mt-10">
		<Breadcrumb
			items={[
				{ name: 'Home', href: '/' },
				{ name: 'Now', href: '/now' }
			]}
		/>
		<div class="mt-4 smallcaps">
			updated <time datetime={lastUpdated}>{lastUpdated}</time>
		</div>
	</div>

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
		<p class="mt-4 text-sm italic text-[var(--ink-muted)]">
			The rest of the shelf lives in the <a href="/library" class="link">library</a>.
		</p>
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

	<div class="rise mt-16 text-center italic text-[var(--ink-muted)]">
		Want the longer version? Read <a href="/about" class="link">about</a>, the
		<a href="/writing" class="link">writing</a>, or just
		<a href="/contact" class="link">say hello</a>.
	</div>
</Container>
