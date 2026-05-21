<script lang="ts">
	import { Container, Eyebrow, Seo, site } from '$lib';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();
	const post = $derived(data.post);

	const url = $derived(`${site.url}/writing/${post.slug}`);

	const articleSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.description,
		datePublished: post.date,
		dateModified: post.date,
		url,
		author: { '@id': `${site.url}/#person` },
		publisher: { '@id': `${site.url}/#person` },
		mainEntityOfPage: url,
		keywords: post.tags.join(', '),
		image: `${site.url}/og.png`
	});
</script>

<Seo title={`${post.title} — Khaled Waleed`} description={post.description} canonical={url} />

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>`}
</svelte:head>

<section class="py-8">
	<Container size="prose">
		<Breadcrumb
			items={[
				{ name: 'Home', href: '/' },
				{ name: 'Writing', href: '/writing' },
				{ name: post.title, href: `/writing/${post.slug}` }
			]}
		/>

		<article class="mt-8 animate-fade-up">
			<header class="mb-12 pb-12 border-b border-[var(--border)]">
				<Eyebrow>/writing</Eyebrow>
				<h1 class="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[var(--fg)] leading-tight">
					{post.title}
				</h1>
				<p class="mt-5 text-lg text-[var(--fg-muted)] leading-relaxed">{post.description}</p>
				<div class="mt-6 flex items-baseline gap-4 text-xs font-mono text-[var(--fg-dim)]">
					<time datetime={post.date}>{post.date}</time>
					<span>·</span>
					<span>{post.readingTime}</span>
				</div>
			</header>

			<div class="prose-custom max-w-none">
				{#if post.slug === 'building-for-the-web-from-baghdad'}
					<p>
						Working as a senior software engineer from Baghdad is, more than anything, a study in
						removing friction. The connection to the rest of the world is unreliable, the
						time zones rarely line up, and the local market is still maturing. None of this is a
						problem if you build for it instead of against it.
					</p>
					<h2>The actual stack</h2>
					<p>
						I keep tooling boring. SvelteKit and Nuxt on the frontend, Go on the backend, Postgres
						in the middle, and a Linux box wherever a Linux box fits. The newest piece of
						technology I use is whatever ships in last month's stable release — not last week's.
					</p>
					<p>
						Boring stack means I spend my hours on the parts that actually move the business: the
						domain, the data model, the user interface, the latency budget. Not chasing the
						framework du jour.
					</p>
					<h2>What clients want</h2>
					<p>
						Clients don't care that you wrote a clever abstraction. They care that the feature
						shipped, that the page loads in under a second, that the bill is predictable, and
						that you replied when you said you would. Everything else is decoration.
					</p>
					<h2>Working asynchronously</h2>
					<p>
						The single biggest unlock for engineers anywhere outside the dominant timezones is
						relentless async discipline. Write more than you speak. Leave a paper trail. Make every
						handoff complete enough to survive your absence. Treat every PR description as a small
						essay.
					</p>
					<h2>What's next</h2>
					<p>
						More writing here. Short, opinionated, no fluff. If a topic is worth a paragraph
						instead of a thread, I'd rather put it on my own domain than rent it on someone else's
						platform.
					</p>
				{/if}
			</div>

			<footer class="mt-16 pt-8 border-t border-[var(--border)] flex items-center justify-between">
				<a href="/writing" class="text-sm font-mono text-[var(--fg-muted)] hover:text-[var(--brand)] transition-colors">
					← All writing
				</a>
				<a
					href={`mailto:${site.email}?subject=Re: ${encodeURIComponent(post.title)}`}
					class="text-sm font-mono text-[var(--fg-muted)] hover:text-[var(--brand)] transition-colors"
				>
					Reply by email →
				</a>
			</footer>
		</article>
	</Container>
</section>
