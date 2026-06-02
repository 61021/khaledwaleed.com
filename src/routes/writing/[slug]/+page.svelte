<script lang="ts">
	import { Container, Seo, PageHeader, Fleuron, ReadingProgress, site, paintings } from '$lib';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();
	const post = $derived(data.post);
	const Content = $derived(data.Content);

	const url = $derived(`${site.url}/writing/${post.slug}`);
	const room = $derived('writing');
	const painting = $derived(paintings[room as keyof typeof paintings]);

	const articleSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `${url}#article`,
		headline: post.title,
		description: post.description,
		datePublished: post.date,
		dateModified: post.date,
		url,
		inLanguage: 'en',
		author: {
			'@type': 'Person',
			'@id': `${site.url}/#person`,
			name: site.name,
			url: site.url
		},
		publisher: {
			'@type': 'Person',
			'@id': `${site.url}/#person`,
			name: site.name,
			url: site.url
		},
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		keywords: post.tags.join(', '),
		image: `${site.url}/og.png`,
		isPartOf: { '@id': `${site.url}/#website` }
	});
</script>

<Seo
	title={post.title}
	description={post.description}
	type="article"
	keywords={post.tags}
	publishedTime={post.date}
	modifiedTime={post.date}
/>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>`}
</svelte:head>

<ReadingProgress />

<PageHeader
	{room}
	eyebrow={post.readingTime}
	title={post.title}
>
	{#snippet lede()}
		<p>{post.description}</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	<div class="rise-3 mt-10">
		<Breadcrumb
			items={[
				{ name: 'Home', href: '/' },
				{ name: 'Writing', href: '/writing' },
				{ name: post.title, href: `/writing/${post.slug}` }
			]}
		/>
		<div class="mt-4 smallcaps">
			by <a href="/about" class="link-quiet" rel="author">Khaled Waleed</a> ·
			<time datetime={post.date}>{post.date}</time>
		</div>
	</div>

	<Fleuron />

	<article class="rise prose-romantic mx-auto">
		<Content />
	</article>

	<Fleuron />

	<footer class="rise flex items-baseline justify-between">
		<a href="/writing" class="link-quiet italic">← All writing</a>
		<a
			href={`mailto:${site.email}?subject=Re: ${encodeURIComponent(post.title)}`}
			class="link-quiet italic"
		>
			Reply by email →
		</a>
	</footer>
</Container>

<!-- Painting credit at the foot -->
<Container size="prose">
	<div class="mt-16 text-center smallcaps">
		this page is dedicated to <em>{painting.title}</em> by {painting.artist}, {painting.year}
	</div>
</Container>
