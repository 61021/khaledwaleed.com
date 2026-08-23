<script lang='ts'>
	import {
		Container,
		Fleuron,
		PageHeader,
		paintings,
		ReadingProgress,
		SchemaOrg,
		Seo,
		site,
	} from '$lib'
	import Breadcrumb from '$lib/components/Breadcrumb.svelte'
	import { formatDate } from '$lib/posts'
	import { reveal } from '$lib/reveal'

	const { data } = $props()
	const post = $derived(data.post)
	const Content = $derived(data.Content)

	const url = $derived(`${site.url}/writing/${post.slug}`)
	const ogImage = $derived(`${site.url}/writing/${post.slug}/og.png`)
	const painting = paintings.writing

	const articleSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `${url}#article`,
		'headline': post.title,
		'description': post.description,
		'datePublished': post.date,
		'dateModified': post.date,
		url,
		'inLanguage': 'en',
		'author': {
			'@type': 'Person',
			'@id': `${site.url}/#person`,
			'name': site.name,
			'url': site.url,
		},
		'publisher': {
			'@type': 'Person',
			'@id': `${site.url}/#person`,
			'name': site.name,
			'url': site.url,
		},
		'mainEntityOfPage': { '@type': 'WebPage', '@id': url },
		'keywords': post.tags.join(', '),
		'articleSection': post.tags[0],
		'timeRequired': `PT${Number.parseInt(post.readingTime, 10) || 3}M`,
		'image': ogImage,
		'isPartOf': { '@id': `${site.url}/#website` },
	})
</script>

<Seo
	title={post.title}
	description={post.description}
	type='article'
	image={ogImage}
	imageAlt={`“${post.title}”, an essay by ${site.name}`}
	keywords={post.tags}
	publishedTime={post.date}
	modifiedTime={post.date}
/>

<SchemaOrg schema={articleSchema} />

<ReadingProgress />

<PageHeader room='writing' eyebrow={post.readingTime} title={post.title}>
	{#snippet lede()}
		<p>{post.description}</p>
	{/snippet}
</PageHeader>

<Container size='prose'>
	<div class='mt-10'>
		<Breadcrumb
			items={[
				{ name: 'Home', href: '/' },
				{ name: 'Writing', href: '/writing' },
				{ name: post.title, href: `/writing/${post.slug}` },
			]}
		/>
	</div>

	<!-- The imprint: byline and date on the same centred axis as the
	     fleuron and the text block, like a title page. -->
	<div class='mt-8 text-center' {@attach reveal}>
		<div class='smallcaps'>
			by <a href='/story' class='link-quiet' rel='author'>Khaled Waleed</a> ·
			<time datetime={post.date}>{formatDate(post.date)}</time>
		</div>
		{#if post.tags.length}
			<div class='smallcaps mt-1 text-[var(--ink-dim)]'>{post.tags.join(', ')}</div>
		{/if}
	</div>

	<Fleuron />

	<article class='prose-romantic mx-auto' {@attach reveal}>
		<Content />
	</article>

	<Fleuron />

	<!-- Neighbouring essays -->
	{#if data.older || data.newer}
		<nav aria-label='More essays' {@attach reveal}>
			<div class='grid gap-6 sm:grid-cols-2'>
				{#if data.older}
					<a href={`/writing/${data.older.slug}`} class='group block text-left'>
						<div class='smallcaps'>← older</div>
						<div
							class='mt-2 [font-family:var(--font-display)] text-[1.2rem] leading-[1.25] text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]'
						>
							{data.older.title}
						</div>
					</a>
				{:else}
					<div aria-hidden='true'></div>
				{/if}
				{#if data.newer}
					<a href={`/writing/${data.newer.slug}`} class='group block text-left sm:text-right'>
						<div class='smallcaps'>newer →</div>
						<div
							class='mt-2 [font-family:var(--font-display)] text-[1.2rem] leading-[1.25] text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]'
						>
							{data.newer.title}
						</div>
					</a>
				{/if}
			</div>
		</nav>

		<div class='rule-fine mt-10'></div>
	{/if}

	<footer class='mt-10 flex items-baseline justify-between' {@attach reveal}>
		<a href='/writing' class='link-quiet'>← All writing</a>
		<a
			href={`mailto:${site.email}?subject=Re: ${encodeURIComponent(post.title)}`}
			class='link-quiet'
		>
			Reply by email →
		</a>
	</footer>
</Container>

<!-- Painting credit at the foot -->
<Container size='prose'>
	<div class='smallcaps mt-16 text-center' {@attach reveal}>
		this page is dedicated to <em>{painting.title}</em> by {painting.artist},
		<span class='whitespace-nowrap'>{painting.year}</span>
	</div>
</Container>
