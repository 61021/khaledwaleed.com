<script lang="ts">
	import { Container, Eyebrow, Seo, site } from '$lib';
	import { posts } from '$lib/posts';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	const url = `${site.url}/writing`;
</script>

<Seo
	title="Writing — Khaled Waleed"
	description="Essays and notes on software engineering, web performance, and building from Iraq."
	canonical={url}
/>

<section class="py-8">
	<Container>
		<Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Writing', href: '/writing' }]} />

		<header class="mt-8 mb-14 max-w-2xl animate-fade-up">
			<Eyebrow>/writing</Eyebrow>
			<h1 class="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[var(--fg)]">
				Notes from the workbench.
			</h1>
			<p class="mt-4 text-lg text-[var(--fg-muted)] leading-relaxed">
				Short, opinionated pieces on shipping software — performance, architecture, and the realities
				of building remotely from Baghdad.
			</p>
			<a
				href="/rss.xml"
				class="mt-5 inline-flex items-center gap-2 text-xs font-mono text-[var(--fg-dim)] hover:text-[var(--brand)] transition-colors"
			>
				<span aria-hidden="true">↯</span> Subscribe via RSS
			</a>
		</header>

		<ol class="border-t border-[var(--border)]">
			{#each posts as post (post.slug)}
				<li class="border-b border-[var(--border)] group">
					<a
						href={`/writing/${post.slug}`}
						class="flex flex-col gap-2 py-8 transition-colors hover:bg-[var(--bg-subtle)]/40 px-2 -mx-2 rounded-lg"
					>
						<div class="flex items-baseline gap-4 text-xs font-mono text-[var(--fg-dim)]">
							<time datetime={post.date}>{post.date}</time>
							<span>·</span>
							<span>{post.readingTime}</span>
						</div>
						<h2
							class="text-2xl md:text-3xl font-semibold text-[var(--fg)] group-hover:text-[var(--brand)] transition-colors"
						>
							{post.title}
						</h2>
						<p class="text-[var(--fg-muted)] leading-relaxed max-w-2xl">{post.description}</p>
						<div class="mt-2 flex flex-wrap gap-2">
							{#each post.tags as tag (tag)}
								<span
									class="text-xs font-mono px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--fg-dim)]"
									>{tag}</span
								>
							{/each}
						</div>
					</a>
				</li>
			{/each}
		</ol>
	</Container>
</section>
