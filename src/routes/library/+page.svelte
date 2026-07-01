<script lang="ts">
	import { Container, Seo, PageHeader, Fleuron, site } from '$lib';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	const lastUpdated = '2026-05-24';

	type Book = { title: string; author: string; note?: string };

	const reading: Book[] = [
		{
			title: 'Thinking, Fast and Slow',
			author: 'Daniel Kahneman',
			note: 'The slow read, a few pages at a time.'
		}
	];

	const queue: Book[] = [{ title: 'Relationships', author: 'The School of Life' }];

	const loved: Book[] = [];

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': `${site.url}/library#page`,
		url: `${site.url}/library`,
		name: `${site.name}'s Library`,
		description: `Books Khaled Waleed is reading, wants to read, and keeps returning to. Updated ${lastUpdated}.`,
		dateModified: lastUpdated,
		isPartOf: { '@id': `${site.url}/#website` },
		about: { '@id': `${site.url}/#person` },
		breadcrumb: {
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
				{ '@type': 'ListItem', position: 2, name: 'Library', item: `${site.url}/library` }
			]
		}
	};
</script>

<Seo
	title="Library"
	description={`Books Khaled Waleed is reading, wants to read, and keeps returning to. Updated ${lastUpdated}.`}
/>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>

<PageHeader room="library" eyebrow="a quiet shelf" title="Library">
	{#snippet lede()}
		<p>Books on the desk, books on the queue, books I return to. still in progress.</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	<div class="rise-3 mt-10">
		<Breadcrumb
			items={[
				{ name: 'Home', href: '/' },
				{ name: 'Library', href: '/library' }
			]}
		/>
		<div class="mt-4 smallcaps">
			updated <time datetime={lastUpdated}>{lastUpdated}</time>
		</div>
	</div>

	<Fleuron />

	<section class="rise space-y-5">
		<h2 class="italic">Now reading</h2>
		{#if reading.length}
			<ul class="divide-y divide-[var(--rule)]">
				{#each reading as b (b.title)}
					<li class="py-3">
						<div class="flex items-baseline justify-between gap-6">
							<span class="italic text-[var(--ink)]">{b.title}</span>
							<span class="smallcaps shrink-0">{b.author}</span>
						</div>
						{#if b.note}
							<p class="mt-1 text-sm text-[var(--ink-muted)]">{b.note}</p>
						{/if}
					</li>
				{/each}
			</ul>
		{:else}
			<p class="italic text-[var(--ink-muted)]">Between books.</p>
		{/if}
	</section>

	<Fleuron />

	<section class="rise space-y-5">
		<h2 class="italic">Want to read</h2>
		{#if queue.length}
			<ul class="divide-y divide-[var(--rule)]">
				{#each queue as b (b.title)}
					<li class="py-3">
						<div class="flex items-baseline justify-between gap-6">
							<span class="italic text-[var(--ink)]">{b.title}</span>
							<span class="smallcaps shrink-0">{b.author}</span>
						</div>
						{#if b.note}
							<p class="mt-1 text-sm text-[var(--ink-muted)]">{b.note}</p>
						{/if}
					</li>
				{/each}
			</ul>
		{:else}
			<p class="italic text-[var(--ink-muted)]">The queue is empty for once.</p>
		{/if}
	</section>

	{#if loved.length}
		<Fleuron />

		<section class="rise space-y-5">
			<h2 class="italic">Books I keep returning to</h2>
			<ul class="divide-y divide-[var(--rule)]">
				{#each loved as b (b.title)}
					<li class="py-3">
						<div class="flex items-baseline justify-between gap-6">
							<span class="italic text-[var(--ink)]">{b.title}</span>
							<span class="smallcaps shrink-0">{b.author}</span>
						</div>
						{#if b.note}
							<p class="mt-1 text-sm text-[var(--ink-muted)]">{b.note}</p>
						{/if}
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<Fleuron />

	<figure class="rise mx-auto max-w-md text-center">
		<blockquote class="italic text-[var(--ink)]" style="font-size: 1.25rem; line-height: 1.5;">
			“When I am attacked by gloomy thoughts, nothing helps me so much as running to my books.”
		</blockquote>
		<figcaption class="mt-4 smallcaps">— Montaigne</figcaption>
	</figure>
</Container>
