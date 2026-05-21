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
				{:else if post.slug === 'the-cost-of-a-slow-page'}
					<p>
						A slow page is a tax. You pay it on every user, every session, every retry. The
						bill arrives quietly — as a slightly lower conversion rate, a slightly higher
						bounce, a slightly less patient customer — and most teams never trace it back to
						the source.
					</p>
					<h2>What "slow" actually means</h2>
					<p>
						The number that matters is not your local lab score. It is the 75th-percentile
						Largest Contentful Paint on a mid-range Android over a flaky 4G connection. If you
						are building for the global web — and most of us are — that is your user. They are
						not on a MacBook Pro on fibre.
					</p>
					<p>
						Aim for LCP under 2.5 seconds at the 75th percentile. Interaction-to-next-paint
						under 200 ms. Cumulative layout shift under 0.1. Anything worse and you are
						leaving money on the table.
					</p>
					<h2>Where the time actually goes</h2>
					<p>
						In ninety percent of real-world apps, the bottleneck is one of four things: too
						much JavaScript, render-blocking fonts, oversized images, or a slow server. Fix
						those four in order and you have already beaten most of the web.
					</p>
					<h2>The discipline part</h2>
					<p>
						Performance is not a one-time clean-up. It is a budget you defend on every pull
						request. Once a page is fast, the only way it stays fast is if someone owns the
						number. Track it like you track errors. Regress and revert.
					</p>
				{:else if post.slug === 'hiring-senior-engineers-in-iraq'}
					<p>
						The Iraqi tech market is younger than the engineers building it. There are
						excellent people here. There are also a lot of teams hiring badly and wondering
						why the seniors they meet do not feel senior. I have been on both sides of that
						interview table. A few notes from inside.
					</p>
					<h2>Title inflation is the default</h2>
					<p>
						"Senior" in Baghdad often means three years of experience and the willingness to
						run a small team. That is fine for some companies. It is not fine if you are
						hiring against a global standard and paying global rates. Calibrate against what
						the role actually has to ship, not what the resume says.
					</p>
					<h2>The shortlist is smaller than you think</h2>
					<p>
						The pool of engineers in Iraq who have shipped production systems for international
						users at scale is small. Most of them are not on LinkedIn. They are working
						quietly, usually for a foreign company, usually already paid well. Finding them
						requires referrals, not job boards.
					</p>
					<h2>What actually retains people</h2>
					<p>
						In order: meaningful work, a manager who can read code, predictable pay in a
						stable currency, async culture, and equipment that does not get in the way.
						Pingpong tables and snacks rank below all of these. Far below.
					</p>
					<h2>If you are hiring</h2>
					<p>
						Write a clear job description. Pay above the local market and below the SF
						market. Interview for the work the role will actually do — not for whiteboard
						trivia. Move fast. The best Iraqi seniors have offers within days of starting to
						look.
					</p>
					<h2>If you are an engineer here</h2>
					<p>
						Build in public, even quietly. Keep a portfolio of real systems, not toy projects.
						Write English well — the kind that travels through Slack at three in the morning.
						The opportunities are there. They are just not where most people are looking.
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
