<script lang='ts'>
	import { browser } from '$app/environment'
	import { replaceState } from '$app/navigation'
	import { page } from '$app/state'
	import { Container, Fleuron, PageHeader, SchemaOrg, Seo, site } from '$lib'
	import { formatDate, posts, topics } from '$lib/posts'
	import { reveal } from '$lib/reveal'
	import { tick } from 'svelte'

	const description
		= 'Essays and short fiction on people, ideas, art, and philosophy.'

	const blogSchema = {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		'@id': `${site.url}/writing#blog`,
		'url': `${site.url}/writing`,
		'name': `${site.name} · Writing`,
		description,
		'inLanguage': 'en',
		'author': { '@id': `${site.url}/#person` },
		'publisher': { '@id': `${site.url}/#person` },
		'isPartOf': { '@id': `${site.url}/#website` },
		'blogPost': posts.map(p => ({
			'@type': 'BlogPosting',
			'@id': `${site.url}/writing/${p.slug}#article`,
			'headline': p.title,
			'description': p.description,
			'datePublished': p.date,
			'url': `${site.url}/writing/${p.slug}`,
			'author': { '@id': `${site.url}/#person` },
		})),
	}

	// ?topic= is read once at init (browser-only: the leaf is prerendered,
	// so the built HTML always carries the full list) and written back from
	// the click handlers with replaceState; an $effect may not call
	// replaceState mid-flush.
	const fromUrl = browser ? page.url.searchParams.get('topic') : null
	let topic = $state<string | null>(
		fromUrl && topics.some(t => t.name === fromUrl) ? fromUrl : null,
	)

	const shown = $derived.by(() => {
		const t = topic
		return t ? posts.filter(p => p.tags.includes(t)) : posts
	})

	let topicsEl: HTMLDivElement | undefined

	// A tag clicked far down a card row leaves the viewport stranded past
	// the shortened list; nearest is a no-op when the index is in view.
	function pickTopic(next: string | null, fromRow = false): void {
		topic = next === topic ? null : next
		const url = new URL(location.href)
		if (topic)
			url.searchParams.set('topic', topic)
		else url.searchParams.delete('topic')
		replaceState(`${url.pathname}${url.search}`, {})
		if (fromRow && topic)
			tick().then(() => topicsEl?.scrollIntoView({ block: 'nearest' }))
	}
</script>

<Seo title='Writing' {description} />

<SchemaOrg schema={blogSchema} />

<PageHeader room='writing' title='Writing'>
	{#snippet lede()}
		<p>Essays and short fiction on people, ideas, art, and philosophy.</p>
	{/snippet}
</PageHeader>

<Container size='prose'>
	<Fleuron />

	<div
		bind:this={topicsEl}
		class='topics'
		role='group'
		aria-label='Filter by topic'
		{@attach reveal}
	>
		<button
			type='button'
			class={['topic', topic === null && 'on']}
			aria-pressed={topic === null}
			onclick={() => pickTopic(null)}
		>
			All <b>{posts.length}</b>
		</button>
		{#each topics as opt (opt.name)}
			<button
				type='button'
				class={['topic', topic === opt.name && 'on']}
				aria-pressed={topic === opt.name}
				onclick={() => pickTopic(opt.name)}
			>
				{opt.name} <b>{opt.count}</b>
			</button>
		{/each}
	</div>

	<p class='sr-only' aria-live='polite'>
		{topic ? `${shown.length} of ${posts.length} pieces tagged ${topic}` : `${posts.length} pieces`}
	</p>

	<ol class='mt-10 space-y-12'>
		{#each shown as post (post.slug)}
			<li {@attach reveal}>
				<a href={`/writing/${post.slug}`} class='group block'>
					<div class='smallcaps'>
						<time datetime={post.date}>{formatDate(post.date)}</time>
						<span class='mx-2 text-[var(--rule)]'>·</span>
						<span>{post.readingTime}</span>
					</div>
					<h2
						class='mt-3 text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]'
						style='font-family: var(--font-display); font-size: clamp(1.6rem, 3vw + 0.5rem, 2.25rem); line-height: 1.15;'
					>
						{post.title}
					</h2>
					<p class='mt-3 leading-relaxed text-[var(--ink-muted)]'>{post.description}</p>
				</a>
				<div class='topics mt-2'>
					{#each post.tags as tag (tag)}
						<button
							type='button'
							class={['topic', topic === tag && 'on']}
							aria-pressed={topic === tag}
							onclick={() => pickTopic(tag, true)}
						>
							{tag}
						</button>
					{/each}
				</div>
			</li>
		{/each}
	</ol>

	<Fleuron />

	<div class='text-center' {@attach reveal}>
		<a href='/rss.xml' class='smallcaps link-quiet'> subscribe via rss </a>
	</div>
</Container>

<style>
	.topics {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0 1.15rem;
	}

	.topic {
		position: relative;
		display: inline-flex;
		align-items: baseline;
		gap: 0.4rem;
		padding: 0.35rem 0;
		border-bottom: 1px solid transparent;
		font-family: var(--font-body);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-muted);
		cursor: pointer;
		transition:
			color var(--dur-quick) var(--ease-out),
			border-color var(--dur-quick) var(--ease-out);
	}

	/* The type is small; the finger target is not. */
	.topic::after {
		content: '';
		position: absolute;
		inset: -4px -0.45rem;
	}

	.topic:hover {
		color: var(--ink);
	}

	.topic.on {
		color: var(--ink);
		border-bottom-color: var(--accent);
	}

	.topic b {
		font-weight: 700;
		font-size: 0.92em;
		color: var(--ink-dim);
		font-variant-numeric: tabular-nums;
		transition: color var(--dur-quick) var(--ease-out);
	}

	.topic.on b {
		color: var(--accent);
	}
</style>
