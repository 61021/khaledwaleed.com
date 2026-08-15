<script lang='ts'>
	import { Container, Fleuron, PageHeader, SchemaOrg, Seo, site } from '$lib'
	import { formatDate } from '$lib/posts'

	const lastUpdated = '2026-07-13'

	type Book = { title: string, author: string, note?: string }

	const reading: Book[] = [
		{
			title: 'Thinking, Fast and Slow',
			author: 'Daniel Kahneman',
			note: 'The slow read, a few pages at a time.',
		},
	]

	const queue: Book[] = [
		{ title: 'Relationships', author: 'The School of Life' },
		{
			title: 'Designing Data-Intensive Applications',
			author: 'Martin Kleppmann',
			note: 'The distributed-systems education I keep promising myself.',
		},
		{
			title: 'The Myth of Sisyphus',
			author: 'Albert Camus',
			note: 'I keep circling the absurd; time to read the source.',
		},
		{
			title: 'Meditations',
			author: 'Marcus Aurelius',
			note: 'Notes to self from an emperor: the original private journal.',
		},
	]

	const loved: Book[] = []

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': `${site.url}/library#page`,
		'url': `${site.url}/library`,
		'name': `${site.name}'s Library`,
		'description': `Books Khaled Waleed is reading, wants to read, and keeps returning to. Updated ${lastUpdated}.`,
		'dateModified': lastUpdated,
		'isPartOf': { '@id': `${site.url}/#website` },
		'about': { '@id': `${site.url}/#person` },
		'breadcrumb': {
			'@type': 'BreadcrumbList',
			'itemListElement': [
				{ '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': site.url },
				{ '@type': 'ListItem', 'position': 2, 'name': 'Library', 'item': `${site.url}/library` },
			],
		},
	}
</script>

<Seo
	title='Library'
	description={`Books Khaled Waleed is reading, wants to read, and keeps returning to. Updated ${lastUpdated}.`}
/>

<SchemaOrg {schema} />

{#snippet bookRow(b: Book)}
	<li class='py-3'>
		<div class='flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4'>
			<span class='text-[var(--ink)] italic'>{b.title}</span>
			<span class='leader hidden sm:block' aria-hidden='true'></span>
			<span class='smallcaps shrink-0'>{b.author}</span>
		</div>
		{#if b.note}
			<p class='mt-1 text-sm text-[var(--ink-muted)]'>{b.note}</p>
		{/if}
	</li>
{/snippet}

<PageHeader room='library' title='Library'>
	{#snippet lede()}
		<p>What I’m reading, what’s queued, and what I return to.</p>
	{/snippet}
</PageHeader>

<Container size='prose'>
	<div class='rise-3 smallcaps mt-10'>
		updated <time datetime={lastUpdated}>{formatDate(lastUpdated)}</time>
	</div>

	<Fleuron />

	<section class='rise space-y-5'>
		<h2>Now reading</h2>
		{#if reading.length}
			<ul class='divide-y divide-[var(--rule)]'>
				{#each reading as b (b.title)}
					{@render bookRow(b)}
				{/each}
			</ul>
		{:else}
			<p class='text-[var(--ink-muted)] italic'>Between books.</p>
		{/if}
	</section>

	<Fleuron />

	<section class='rise space-y-5'>
		<h2>Want to read</h2>
		{#if queue.length}
			<ul class='divide-y divide-[var(--rule)]'>
				{#each queue as b (b.title)}
					{@render bookRow(b)}
				{/each}
			</ul>
		{:else}
			<p class='text-[var(--ink-muted)] italic'>The queue is empty for once.</p>
		{/if}
	</section>

	{#if loved.length}
		<Fleuron />

		<section class='rise space-y-5'>
			<h2>Books I keep returning to</h2>
			<ul class='divide-y divide-[var(--rule)]'>
				{#each loved as b (b.title)}
					{@render bookRow(b)}
				{/each}
			</ul>
		</section>
	{/if}

	<Fleuron />

	<figure class='rise mx-auto max-w-md text-center'>
		<blockquote class='text-[var(--ink)] italic' style='font-size: 1.25rem; line-height: 1.5;'>
			“When I am attacked by gloomy thoughts, nothing helps me so much as running to my books.”
		</blockquote>
		<figcaption class='smallcaps mt-4'>Montaigne</figcaption>
	</figure>
</Container>
