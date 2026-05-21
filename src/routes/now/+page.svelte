<script lang="ts">
	import { Seo, Container, Eyebrow, site } from '$lib';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	const lastUpdated = '2026-05-21';

	const working = [
		{
			where: 'Qi',
			url: 'https://qi.iq',
			focus:
				'Leading frontend architecture across consumer products and a shared design system. Tightening performance budgets toward sub-second LCP on mid-range Android.'
		},
		{
			where: 'Vitex',
			url: 'https://vitex.dev',
			focus:
				'Shipping Nuxt interfaces backed by Go microservices. Profiling and tuning real production load. Owning features end-to-end.'
		}
	];

	const building = [
		'This site — small, fast, hand-built. Adding writing, refining the command palette, chasing 100s on Lighthouse.',
		'A small Go service for personal analytics — privacy-first, no third parties, just structured logs to Postgres.'
	];

	const reading = [
		{ title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann' },
		{ title: 'A Philosophy of Software Design', author: 'John Ousterhout' },
		{ title: 'The Beginning of Infinity', author: 'David Deutsch' }
	];

	const learning = [
		'Distributed consensus — Raft, then enough Paxos to argue about it.',
		'Rust, slowly and on purpose. Mostly via small CLI tools.',
		'Better writing. Shorter sentences. Fewer adverbs.'
	];

	const place = `${site.location.city}, ${site.location.country}. Working remote-friendly hours that overlap with EU and US East.`;

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

<Seo
	title="Now"
	description={`A snapshot of what Khaled Waleed is working on, building, reading and learning right now. Updated ${lastUpdated}.`}
	canonical={`${site.url}/now`}
/>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>

<Container size="prose">
	<Breadcrumb
		items={[
			{ name: 'Home', href: '/' },
			{ name: 'Now', href: '/now' }
		]}
	/>

	<section class="mt-8 animate-fade-up space-y-6">
		<Eyebrow label="~/now" />
		<h1 class="text-4xl font-bold tracking-tight text-[var(--fg)] sm:text-5xl">Now</h1>
		<p class="max-w-2xl text-lg leading-relaxed text-[var(--fg-muted)]">
			A snapshot of what I'm working on, building, reading and learning — kept honest by a
			timestamp. Inspired by Derek Sivers' <a
				href="https://nownownow.com"
				target="_blank"
				rel="noopener"
				class="text-[var(--brand)] underline decoration-[var(--brand)]/40 underline-offset-4 hover:decoration-[var(--brand)]"
				>/now page</a
			> idea.
		</p>
		<div class="font-mono text-xs text-[var(--fg-dim)]">
			Last updated <time datetime={lastUpdated}>{lastUpdated}</time>
		</div>
	</section>

	<div class="mt-16 space-y-14">
		<!-- Working on -->
		<section class="animate-fade-up" style="animation-delay: 60ms">
			<h2 class="font-mono text-xs uppercase tracking-[0.18em] text-[var(--fg-dim)]">
				Working on
			</h2>
			<ul class="mt-5 space-y-5">
				{#each working as w (w.where)}
					<li
						class="rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)]/40 p-5 transition-colors hover:border-[var(--border-strong)]"
					>
						<a
							href={w.url}
							target="_blank"
							rel="noopener"
							class="inline-flex items-center gap-2 text-base font-semibold text-[var(--fg)] hover:text-[var(--brand)] transition-colors"
						>
							{w.where}
							<span aria-hidden="true" class="text-xs text-[var(--fg-dim)]">↗</span>
						</a>
						<p class="mt-2 text-[15px] leading-relaxed text-[var(--fg-muted)]">{w.focus}</p>
					</li>
				{/each}
			</ul>
		</section>

		<!-- Building -->
		<section class="animate-fade-up" style="animation-delay: 120ms">
			<h2 class="font-mono text-xs uppercase tracking-[0.18em] text-[var(--fg-dim)]">
				Building on the side
			</h2>
			<ul class="mt-5 space-y-3">
				{#each building as item}
					<li class="flex gap-3 text-[15px] leading-relaxed text-[var(--fg-muted)]">
						<span aria-hidden="true" class="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--brand)]"
						></span>
						<span>{item}</span>
					</li>
				{/each}
			</ul>
		</section>

		<!-- Reading -->
		<section class="animate-fade-up" style="animation-delay: 180ms">
			<h2 class="font-mono text-xs uppercase tracking-[0.18em] text-[var(--fg-dim)]">Reading</h2>
			<ul class="mt-5 divide-y divide-[var(--border)]/60">
				{#each reading as b (b.title)}
					<li class="flex items-baseline justify-between gap-6 py-3">
						<span class="text-[15px] text-[var(--fg)]">{b.title}</span>
						<span class="shrink-0 font-mono text-xs text-[var(--fg-dim)]">{b.author}</span>
					</li>
				{/each}
			</ul>
		</section>

		<!-- Learning -->
		<section class="animate-fade-up" style="animation-delay: 240ms">
			<h2 class="font-mono text-xs uppercase tracking-[0.18em] text-[var(--fg-dim)]">Learning</h2>
			<ul class="mt-5 space-y-3">
				{#each learning as item}
					<li class="flex gap-3 text-[15px] leading-relaxed text-[var(--fg-muted)]">
						<span aria-hidden="true" class="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--brand)]"
						></span>
						<span>{item}</span>
					</li>
				{/each}
			</ul>
		</section>

		<!-- Place -->
		<section class="animate-fade-up" style="animation-delay: 300ms">
			<h2 class="font-mono text-xs uppercase tracking-[0.18em] text-[var(--fg-dim)]">Place</h2>
			<p class="mt-5 text-[15px] leading-relaxed text-[var(--fg-muted)]">{place}</p>
		</section>
	</div>

	<!-- Footer note -->
	<div class="mt-20 rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)]/40 p-6">
		<p class="text-sm leading-relaxed text-[var(--fg-muted)]">
			Want the long version? Read <a
				href="/about"
				class="text-[var(--brand)] underline decoration-[var(--brand)]/40 underline-offset-4 hover:decoration-[var(--brand)]"
				>about</a
			>, the <a
				href="/writing"
				class="text-[var(--brand)] underline decoration-[var(--brand)]/40 underline-offset-4 hover:decoration-[var(--brand)]"
				>writing</a
			>, or just <a
				href="/contact"
				class="text-[var(--brand)] underline decoration-[var(--brand)]/40 underline-offset-4 hover:decoration-[var(--brand)]"
				>say hi</a
			>.
		</p>
	</div>
</Container>
