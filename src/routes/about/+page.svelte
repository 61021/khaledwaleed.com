<script lang="ts">
	import { Seo, Container, Button, PageHeader, Fleuron, site } from '$lib';

	const experiences = [
		{
			title: 'Senior Software Engineer',
			company: 'Qi',
			period: '2024 — present',
			url: 'https://qi.iq',
			points: [
				'Leading frontend architecture across several consumer-facing products.',
				'Building the shared design system every product team draws from.',
				'Tightening performance budgets and the design ↔ engineering feedback loop.'
			]
		},
		{
			title: 'Senior Software Engineer',
			company: 'Vitex',
			period: '2023 — present',
			url: 'https://vitex.dev',
			points: [
				'Shipping Nuxt interfaces backed by Go microservices.',
				'Owning features end to end — from schema and API to UI and deploy.',
				'Profiling and tuning Go services under real production load.'
			]
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
		dateModified: '2026-05-21',
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
	description="Khaled Waleed is a senior software engineer in Baghdad, Iraq, working in SvelteKit, Nuxt, and Go. Five years shipping production web apps for international and Iraqi teams."
/>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(aboutPageSchema)}</script>`}
</svelte:head>

<PageHeader
	room="about"
	eyebrow="a brief portrait"
	title="About"
>
	{#snippet lede()}
		<p>Five years of shipping production web apps, written down honestly.</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	<section class="rise-3 mt-12">
		<p class="dropcap text-[1.15rem] leading-[1.78] text-[var(--ink)]">
			I have spent the last five years writing production software for real people who do
			not particularly care about the language it is written in. That is the part of the job
			I keep returning to — the long, quiet work of building things that hold up. A page that
			loads fast. A form that doesn't lose its mind. A backend that doesn't wake anyone up at
			three in the morning. The unglamorous virtues.
		</p>
		<p>
			Most of my work is at the seam between
			<em>SvelteKit</em> or <em>Nuxt</em> on the surface and <em>Go</em> beneath. I am at home
			in TypeScript and at home in pointer arithmetic, and I am suspicious of any opinion
			about engineering that does not survive both. Right now I do this at
			<a href="https://qi.iq" target="_blank" rel="noopener" class="link">Qi</a> and
			<a href="https://vitex.dev" target="_blank" rel="noopener" class="link">Vitex</a>.
		</p>
		<p>
			Away from the screen I read mostly fiction and essays, walk around the older quarters
			of Baghdad after dark, and keep a long list of films I plan to rewatch. If any of
			that travels well with yours,
			<a href="/contact" class="link">let's talk</a>.
		</p>
	</section>

	<Fleuron />

	<section class="rise mt-8">
		<h2 class="text-center italic">Quick facts</h2>
		<dl class="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
			{#each facts as f}
				<div>
					<dt class="smallcaps">{f.label}</dt>
					<dd class="mt-1 italic text-[var(--ink)]">{f.value}</dd>
				</div>
			{/each}
		</dl>
	</section>

	<Fleuron />

	<section class="rise mt-8">
		<h2 class="text-center italic">Where I have been</h2>
		<ol class="mt-10 space-y-10">
			{#each experiences as exp}
				<li class="border-l-2 border-[var(--accent)] pl-6">
					<div class="smallcaps mb-2">{exp.period}</div>
					<h3
						class="italic text-[var(--ink)]"
						style="font-family: var(--font-display); font-weight: 500;"
					>
						{exp.title} ·
						<a
							href={exp.url}
							target="_blank"
							rel="noopener"
							class="link"
						>
							{exp.company}
						</a>
					</h3>
					<ul class="mt-3 space-y-2 italic text-[var(--ink-muted)]">
						{#each exp.points as p}
							<li class="flex gap-3">
								<span aria-hidden="true" class="text-[var(--accent)]">·</span>
								<span>{p}</span>
							</li>
						{/each}
					</ul>
				</li>
			{/each}
		</ol>
	</section>

	<Fleuron />

	<section class="rise mt-8">
		<h2 class="text-center italic">The toolkit</h2>
		<dl class="mt-8 grid gap-8 sm:grid-cols-2">
			{#each Object.entries(skills) as [cat, items]}
				<div>
					<dt class="smallcaps">{cat}</dt>
					<dd class="mt-2 italic text-[var(--ink-muted)]">
						{items.join(' · ')}
					</dd>
				</div>
			{/each}
		</dl>
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
