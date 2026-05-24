<script lang="ts">
	import { Container, Seo, PageHeader, Fleuron, ReadingProgress, site, paintings } from '$lib';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();
	const post = $derived(data.post);

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
		{#if post.slug === 'in-defense-of-melancholy'}
			<p class="dropcap">
				The mood I am about to defend has been out of fashion for so long that we have
				forgotten it is a mood at all. We treat sadness like a software bug: identify,
				reproduce, patch, ship. There is an industry that lives off this metaphor, and
				it is doing very well.
			</p>
			<p>I think we have lost something.</p>

			<h2>The figure with its back turned</h2>
			<p>
				The Northern Romantics painted figures with their backs turned, looking out at
				fog, at moonlit sea, at the ruins of an abbey through bare trees. The figures
				are not in crisis. They are not posting about it. They are doing the older
				thing, the harder thing, which is sitting with a feeling long enough to know
				what it is. Friedrich does not ask his monks to cheer up. Dahl does not edit
				out the broken ship. The painting is the sustained attention itself.
			</p>
			<p>
				Tragedy used to do the same work. We watched Lear, or Hamlet, or <em
					>Swan Lake</em
				>, not because we wanted to feel worse, but because the form held a kind of
				feeling we could not produce on our own. Catharsis is not a word that gets
				used much now. The closest contemporary equivalent is "doomscrolling," which
				is the same impulse stripped of the structure that once made it useful.
			</p>

			<h2>Not depression</h2>
			<p>
				Melancholy, properly handled, is not depression. It is the long, slow
				recognition that the world is finite, that the people you love are finite,
				that the afternoon light will leave the room and not come back in quite that
				arrangement again. It is what makes the afternoon light worth noticing in the
				first place.
			</p>
			<p>
				A culture that flinches from this feeling ends up unable to depict it. Look
				at what mass cinema has done to grief in the last fifteen years. The
				character cries, the score swells, the next scene resolves. The audience is
				given no time to sit. The form has been optimised, in the same way the page
				is optimised, and what has been removed is the part that was doing the work.
			</p>

			<h2>The room</h2>
			<p>
				I am not arguing for sadness. I am arguing for the room in which sadness
				becomes something else — older, quieter, almost beautiful. The Romantics knew
				the way into that room. So did Shakespeare. So, for that matter, does any
				good piece of music played at the right hour.
			</p>
			<p>We could stand to remember the address.</p>
		{:else if post.slug === 'sitting-in-discomfort-on-purpose'}
			<p class="dropcap">
				The most useful habit I picked up in my twenties was the habit of being
				slightly uncomfortable on purpose, every day, with no audience.
			</p>
			<p>
				Cold water in the morning. Walking when I could drive. Skipping the meal when
				I was not actually hungry. Sitting through a difficult conversation instead
				of leaving the room. Reading a book that was harder than the one I wanted to
				read. None of these are dramatic. None of them make for a satisfying post.
				They cost almost nothing, which is the entire point.
			</p>

			<h2>Headroom</h2>
			<p>
				What they buy you is a kind of headroom. The involuntary discomforts — the
				deadline that slips, the loss, the long night in the hospital corridor —
				arrive without warning and ask for a strength you did not know you needed. If
				your nervous system has spent the previous decade in a climate-controlled
				twenty-three degrees, you have not built it. If you have practised, even
				badly, even inconsistently, you have a little more to draw from than you
				would have otherwise.
			</p>

			<h2>The performed version</h2>
			<p>
				The mistake people make with this idea is to dress it up. They turn it into a
				regimen, post the regimen, sell the regimen. The regimen then becomes its
				own form of comfort — performed difficulty, applauded, optimised, mild.
				Whatever was useful about the original act is gone.
			</p>
			<p>
				The version I trust is unglamorous and private. You feel the cold. You do
				not film it. You do the lift you do not feel like doing. You let yourself be
				bored for an hour without reaching for the screen. You sit through the
				meditation when the meditation is bad, which is most of the time, which is
				the meditation.
			</p>

			<h2>The reward</h2>
			<p>
				The reward, if there is one, is that the world stops feeling so brittle. The
				day stops feeling like something you have to survive. Small things — a hot
				meal, a warm room, a friend on the phone — return to being small pleasures
				rather than required infrastructure.
			</p>
			<p>
				There is nothing mystical about any of it. It is the body, asked to do a
				little of what it was built to do, and answering, gratefully, that it
				remembers how.
			</p>
		{:else if post.slug === 'absurdism-without-nihilism'}
			<p class="dropcap">
				Camus is read badly more often than he is read well. The bad reading goes:
				the universe is meaningless, therefore nothing matters, therefore do as you
				please. The good reading is almost the opposite.
			</p>
			<p>
				The universe, Camus says, does not arrive pre-loaded with meaning. Fine.
				This is not a discovery; this is the starting condition for every life that
				has ever been lived. What he does with it is the interesting part. He looks
				at the man pushing the rock up the hill, condemned to push it forever, and
				he refuses both available exits. He will not pretend the rock has a reason.
				He will not stop pushing.
			</p>
			<p>The refusal is the whole thing.</p>

			<h2>The easy move</h2>
			<p>
				Nihilism is the easy move from the same premise. If nothing matters, you
				owe nothing, to yourself or anyone else. It feels like freedom for about a
				week. After that, it reveals itself as what it always was — a slow
				turning-away from the work of being a person.
			</p>

			<h2>The harder one</h2>
			<p>
				Absurdism asks for something harder. It asks you to keep showing up to a
				life that will not, at any point, justify itself to you. You build the
				company. You raise the child. You learn the language. You write the thing.
				You do these without the consolation that they were always going to mean
				something. You do them because the doing is the meaning, and the doing is
				enough.
			</p>
			<p>
				The Buddhists arrive at a related place by a different road. The Stoics,
				too. What all three traditions seem to know, and what the contemporary mood
				seems to have forgotten, is that meaning is a verb. It is not given to you.
				It is what you make when you push the rock one more time, knowing exactly
				what the rock is.
			</p>

			<h2>Sisyphus, properly read</h2>
			<p>
				Camus ends the essay with a line that gets quoted to death and rarely
				understood. <em>One must imagine Sisyphus happy.</em> It is not an instruction
				to fake cheer. It is the observation that happiness, of the only kind
				available to us, lives inside the pushing.
			</p>
			<p>
				The rock is not the problem. The pretending the rock should not be there —
				that is the problem.
			</p>
			<p>You put your shoulder to it. You walk it up. You walk down for it. You begin again.</p>
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
