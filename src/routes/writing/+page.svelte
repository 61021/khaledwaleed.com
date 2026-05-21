<script lang="ts">
	import { Container, Seo, PageHeader, Fleuron, site } from '$lib';
	import { posts } from '$lib/posts';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
</script>

<Seo
	title="Writing — Khaled Waleed"
	description="Short essays on software engineering, performance, and building from Baghdad."
/>

<PageHeader
	room="writing"
	eyebrow="essays · notes"
	title="Writing"
>
	{#snippet lede()}
		<p>
			Short, opinionated pieces on shipping software — performance, architecture, and the
			realities of building remotely from Baghdad.
		</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	<div class="rise-3 mt-10">
		<Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Writing', href: '/writing' }]} />
	</div>

	<Fleuron />

	<ol class="rise space-y-12">
		{#each posts as post (post.slug)}
			<li>
				<a href={`/writing/${post.slug}`} class="group block">
					<div class="smallcaps">
						<time datetime={post.date}>{post.date}</time>
						<span class="mx-2 text-[var(--rule)]">·</span>
						<span>{post.readingTime}</span>
					</div>
					<h2
						class="mt-3 italic text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]"
						style="font-family: var(--font-display); font-size: clamp(1.6rem, 3vw + 0.5rem, 2.25rem); line-height: 1.15;"
					>
						{post.title}
					</h2>
					<p class="mt-3 leading-relaxed text-[var(--ink-muted)]">{post.description}</p>
					<div class="mt-3 smallcaps">
						{post.tags.join(' · ')}
					</div>
				</a>
			</li>
		{/each}
	</ol>

	<Fleuron />

	<div class="rise text-center">
		<a href="/rss.xml" class="smallcaps link-quiet">
			subscribe via rss
		</a>
	</div>
</Container>
