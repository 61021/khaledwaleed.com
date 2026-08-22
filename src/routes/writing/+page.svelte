<script lang='ts'>
	import { Container, Fleuron, PageHeader, SchemaOrg, Seo, site } from '$lib'
	import { formatDate, posts } from '$lib/posts'
	import { reveal } from '$lib/reveal'

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

	<ol class='space-y-12'>
		{#each posts as post (post.slug)}
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
					<div class='smallcaps mt-3'>
						{post.tags.join(', ')}
					</div>
				</a>
			</li>
		{/each}
	</ol>

	<Fleuron />

	<div class='text-center' {@attach reveal}>
		<a href='/rss.xml' class='smallcaps link-quiet'> subscribe via rss </a>
	</div>
</Container>
