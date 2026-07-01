<script lang="ts">
	import { Seo, Container, Button, PageHeader, Fleuron, site } from '$lib';

	const experiences = [
		{
			title: 'Senior Software Engineer',
			company: 'Qi',
			period: '2024 — present',
			url: 'https://qi.iq',
			summary:
				'Working across several consumer-facing products, design systems, and frontend architecture.'
		},
		{
			title: 'Senior Software Engineer',
			company: 'Vitex',
			period: '2023 — present',
			url: 'https://vitex.dev',
			summary:
				'Building Nuxt interfaces on Go services, owned end to end — schema, API, UI, and deploy.'
		}
	];

	const skills: Record<string, string[]> = {
		Frontend: ['TypeScript', 'SvelteKit', 'Nuxt', 'Vue', 'React', 'Tailwind', 'Vite'],
		Backend: ['Go', 'Node.js', 'PostgreSQL', 'Redis', 'REST', 'gRPC'],
		Platform: ['Docker', 'Kubernetes', 'CI/CD', 'Nginx', 'Linux'],
		Tools: ['Git', 'Fish', 'Arch Linux']
	};

	const facts = [
		{ label: 'Based in', value: `${site.location.city}, ${site.location.country}` },
		{ label: 'Working on', value: 'Qi · Vitex' },
		{ label: 'Reading next', value: 'Distributed systems · Rust' },
		{ label: 'Open to', value: 'Senior roles · contracts' }
	];

	// Supporting page about the person — NOT the canonical ProfilePage
	// (that is the homepage). Using AboutPage + `about` keeps /about from
	// competing with "/" for the person-name query.
	const aboutPageSchema = {
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		'@id': `${site.url}/about#aboutpage`,
		url: `${site.url}/about`,
		name: 'About',
		isPartOf: { '@id': `${site.url}/#website` },
		dateModified: '2026-06-23',
		about: { '@id': `${site.url}/#person` },
		breadcrumb: {
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
				{ '@type': 'ListItem', position: 2, name: 'About', item: `${site.url}/about` }
			]
		}
	};
</script>

<Seo
	title="About"
	description="Khaled Waleed is a software engineer in Baghdad, Iraq — five years building web apps across government, payments, democracy, and private-sector projects in SvelteKit, Nuxt, and Go."
/>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(aboutPageSchema)}</script>`}
</svelte:head>

<PageHeader room="about" eyebrow="a brief portrait" title="About">
	{#snippet lede()}
		<p>A little bit more about me and where I work</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	<section class="rise-3 mt-12">
		<p class="dropcap text-[1.15rem] leading-[1.78] text-[var(--ink)]">
			I build software for a living, but curiosity is probably the more accurate description. For
			the last five years I have worked as a software engineer here in Baghdad, mostly building web
			applications that have to survive contact with real users.
		</p>
		<p>
			Most of that work has been in Iraq, which I have come to treat as an advantage rather than a
			footnote — government platforms, payment systems, work for democracy organisations, private
			companies, startups. The constraints are real and the stakes are rarely abstract, and you
			learn quickly which engineering virtues actually hold up when the thing simply has to work.
		</p>
		<p>
			The work itself is straightforward to describe: <em>TypeScript</em>, <em>Go</em>, databases,
			APIs, production systems. But what keeps me interested is less the technology than the long,
			quiet business of understanding something well enough to make it simple. A page that loads
			fast. A form that doesn't lose its mind. A backend that doesn't wake anyone at three in the
			morning. The unglamorous virtues. I do this now at
			<a href="https://qi.iq" target="_blank" rel="noopener" class="link">Qi</a> and
			<a href="https://vitex.dev" target="_blank" rel="noopener" class="link">Vitex</a>.
		</p>
		<p>
			Away from the screen I spend an unreasonable amount of time reading, watching films, and
			wandering through the older parts of cities, chasing questions that never seem to stay
			answered for very long. Meaning, suffering, morality, love, failure, beauty, why people do
			what they do. Some people collect stamps. I collect questions.
		</p>
		<p>
			I <a href="/writing" class="link">write</a> occasionally too, mostly because some thoughts
			become annoying if you leave them alone for too long. I have found that most things become
			more bearable once they become interesting. Software included. If any of that travels well
			with yours, <a href="/contact" class="link">let's talk</a>.
		</p>
	</section>

	<Fleuron />

	<section class="rise mt-8">
		<h2 class="text-center italic">Where I work</h2>
		<ol class="mt-10 space-y-10">
			{#each experiences as exp}
				<li class="border-l-2 border-[var(--accent)] pl-6">
					<div class="smallcaps mb-2">{exp.period}</div>
					<h3 class="italic text-[var(--ink)]" style="font-family: var(--font-display);">
						{exp.title} ·
						<a href={exp.url} target="_blank" rel="noopener" class="link">
							{exp.company}
						</a>
					</h3>
					<p class="mt-3 italic text-[var(--ink-muted)]">{exp.summary}</p>
				</li>
			{/each}
		</ol>
	</section>

	<Fleuron />

	<section class="rise mt-8 text-center">
		<p class="mx-auto max-w-md italic text-[var(--ink-muted)]">
			A question, an idea, a collaboration — my inbox is open.
		</p>
		<div class="mt-6 flex flex-wrap items-center justify-center gap-4">
			<Button href="/contact" size="lg">Get in touch</Button>
			<Button href="/" variant="outline" size="lg">Back to the front</Button>
		</div>
	</section>
</Container>
