<script lang="ts">
	import { Container, Seo, PageHeader, Fleuron, ReadingProgress, site, paintings } from '$lib';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();
	const post = $derived(data.post);

	const url = $derived(`${site.url}/writing/${post.slug}`);
	const room = $derived(
		post.slug === 'building-for-the-web-from-baghdad'
			? 'post-baghdad'
			: post.slug === 'the-cost-of-a-slow-page'
				? 'post-slow'
				: post.slug === 'hiring-senior-engineers-in-iraq'
					? 'post-hiring'
					: 'writing'
	);
	const painting = $derived(paintings[room as keyof typeof paintings]);

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

<Seo title={`${post.title} — Khaled Waleed`} description={post.description} />

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
			<time datetime={post.date}>{post.date}</time>
		</div>
	</div>

	<Fleuron />

	<article class="rise prose-romantic mx-auto">
		{#if post.slug === 'building-for-the-web-from-baghdad'}
			<p class="dropcap">
				You learn to plan around the connection. That, more than anything else, is what
				building for the web from Baghdad teaches you. The fibre is good when it is good
				and absent when it is not, and so the day arranges itself in the spaces between
				outages — work that needs the network, work that does not, the careful queueing
				of long downloads against the early light.
			</p>
			<p>
				The romantic version of this is wrong. There is nothing picturesque about a
				broken deploy. But what I have come to like about working from here is that the
				friction strips away cleverness. You cannot afford an architecture that depends
				on twenty cloud services responding in concert. You build things that hold up
				offline, retry well, fail without drama. Boring things. The web is, on its better
				days, exactly the medium for them.
			</p>

			<h2>The stack stays small</h2>
			<p>
				My tooling has not changed in any meaningful way for three years. SvelteKit on
				the surface or Nuxt where the team already speaks Vue. Go beneath, Postgres in
				the middle, a Linux box wherever a Linux box belongs. The newest dependency I
				take is whatever shipped in last month's stable release — never last week's.
			</p>
			<p>
				A boring stack means I spend my hours on the parts that move the business: the
				domain, the data model, the page that loads in under a second on the phone the
				customer actually owns. Not chasing the framework du jour, which is anyway being
				deprecated by the time you have learned its conventions.
			</p>

			<h2>What clients actually want</h2>
			<p>
				No one outside engineering has ever cared that I wrote a clever abstraction.
				They care that the feature shipped, that the page loads, that the invoice is
				predictable, and that I replied when I said I would. Everything else is
				decoration. I have come to think the senior part of the job is mostly knowing
				which decorations to refuse.
			</p>

			<h2>Asynchronous, by necessity</h2>
			<p>
				The single greatest unlock for anyone working outside the dominant timezones is
				ruthless async discipline. Write more than you speak. Leave a paper trail.
				Make every handoff complete enough to survive your absence. Treat the pull
				request description as a small essay; treat the commit message as a small
				poem.
			</p>
			<p>
				The clients who like working this way tend to be the clients worth working with.
				The ones who do not want to write things down, who insist on real-time meetings
				as the default medium of thought — they are usually not the future. Let them
				go.
			</p>

			<h2>Coda</h2>
			<p>
				The web does not care where you sit. That has been true for a long time, but
				it took until quite recently to feel true from this part of the world. There is
				more of us here now than people expect, doing serious work for serious teams,
				quietly. I think that is the most encouraging thing I could write about working
				from Baghdad — that there is nothing remarkable left to say about it.
			</p>
		{:else if post.slug === 'the-cost-of-a-slow-page'}
			<p class="dropcap">
				A slow page is a tax. You pay it on every user, every session, every retry. The
				bill arrives quietly — as a slightly lower conversion, a slightly higher bounce,
				a slightly less patient customer — and most teams never trace the loss back to
				the cause. They redesign the funnel and hire another marketer instead.
			</p>

			<h2>What "slow" actually means</h2>
			<p>
				The number worth caring about is not your local lab score. It is the
				seventy-fifth-percentile Largest Contentful Paint on a mid-range Android over a
				flaky connection. If you are building for the public web — and most of us are
				— that is your user. They are not on a MacBook Pro on fibre.
			</p>
			<p>
				A reasonable target is LCP under two and a half seconds at the seventy-fifth
				percentile. Interaction-to-next-paint under two hundred milliseconds. Cumulative
				layout shift under a tenth. Anything worse and you are leaving real money on
				the table, every day, in a way nobody is measuring.
			</p>

			<h2>Where the time really goes</h2>
			<p>
				In ninety percent of real-world applications the bottleneck is one of four
				things: too much JavaScript, render-blocking fonts, oversized images, or a slow
				server. Fix those four in order and you have already beaten most of the
				internet. There is no exotic technique required. Most teams simply have not
				done the dull work.
			</p>

			<h2>It is a discipline, not a clean-up</h2>
			<p>
				Performance is not a one-time effort. It is a budget you defend on every pull
				request. Once a page is fast, the only way it stays fast is if someone owns the
				number. Track it the way you track errors. Regress and revert. Eventually
				speed becomes the team's instinct — they reach for the small library, the
				lighter image, the simpler query without being asked.
			</p>

			<h2>The shipwreck</h2>
			<p>
				The reason I keep writing about this is that almost every team I have joined
				had a fast site once, briefly, and then drifted. New requirements arrived. New
				engineers arrived. The site got heavier by a few hundred kilobytes here, a few
				render-blocking scripts there. Nobody made any individual mistake, and so the
				site became slow the way ships used to wreck: not on one rock, but on the slow
				accumulation of small ones.
			</p>
		{:else if post.slug === 'hiring-senior-engineers-in-iraq'}
			<p class="dropcap">
				The Iraqi tech market is younger than the engineers building inside it. There
				are excellent people here. There are also a great many teams hiring badly and
				wondering, in private, why the seniors they meet do not quite feel senior. I
				have been on both sides of that interview, and these are a few honest notes
				from the middle.
			</p>

			<h2>Title inflation is the default</h2>
			<p>
				"Senior" in Baghdad often means three years of experience and the willingness
				to lead a small team. That is fine for some companies; it is not fine if you
				are hiring against a global standard and paying global rates. Calibrate against
				what the role has to ship, not against what the resume says. The calibration
				will be uncomfortable. Do it anyway.
			</p>

			<h2>The shortlist is smaller than you think</h2>
			<p>
				The pool of engineers in Iraq who have shipped production systems for
				international users at scale is small. Most of them are not on LinkedIn. They
				are working quietly, usually for a foreign company, usually already paid well.
				Finding them requires referrals, patience, and the unglamorous habit of being
				known among other senior engineers — not job boards.
			</p>

			<h2>What actually keeps people</h2>
			<p>
				In order: meaningful work, a manager who can read code, predictable pay in a
				stable currency, async culture, and equipment that does not get in the way.
				Free snacks rank below all of these. Far below. If you are losing your seniors,
				it is almost never the snacks.
			</p>

			<h2>If you are hiring</h2>
			<p>
				Write a clear job description. Pay above the local market and below the San
				Francisco market — the room between is wide and honest. Interview for the work
				the role will actually do, not for whiteboard trivia from a different decade.
				Move fast. The best Iraqi seniors have offers within days of starting to look,
				and most of those offers are not from Iraq.
			</p>

			<h2>If you are an engineer here</h2>
			<p>
				Build in public, even quietly. Keep a portfolio of real systems, not toy
				projects. Write English well — the kind that survives Slack at three in the
				morning. Read more than you write. The opportunities are there; they are
				simply not where most people are still looking.
			</p>

			<h2>Coda</h2>
			<p>
				There is a small, real renaissance happening in Iraqi software, and it is
				being built by engineers most international companies have not heard of yet.
				If you are running a serious team and you have not looked here — look here. If
				you are one of those engineers — keep going. You are not alone, and the work
				is real.
			</p>
		{/if}
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
