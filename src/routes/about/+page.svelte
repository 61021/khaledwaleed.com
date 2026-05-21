<script lang="ts">
	import { Seo, Container, Badge, Eyebrow, Button, site } from '$lib';

	const experiences = [
		{
			title: 'Senior Software Engineer',
			company: 'Qi',
			period: '2024 — Present',
			url: 'https://qi.iq',
			points: [
				'Leading frontend architecture across multiple consumer-facing products.',
				'Building a shared design system used by every product team.',
				'Tightening performance budgets and the design ↔ engineering feedback loop.'
			]
		},
		{
			title: 'Senior Software Engineer',
			company: 'Vitex',
			period: '2023 — Present',
			url: 'https://vitex.dev',
			points: [
				'Shipping Nuxt.js interfaces backed by Go microservices.',
				'Owning features end-to-end: schema, API, UI, deploy.',
				'Profiling and tuning Go services under real production load.'
			]
		}
	];

	const skills = {
		Frontend: ['TypeScript', 'SvelteKit', 'Nuxt.js', 'Vue', 'React', 'Tailwind CSS', 'Vite'],
		Backend: ['Go', 'Node.js', 'PostgreSQL', 'Redis', 'REST APIs', 'gRPC'],
		Platform: ['Docker', 'Kubernetes', 'CI/CD', 'Nginx', 'AWS', 'Linux'],
		Tooling: ['Git', 'Fish', 'Arch Linux']
	};

	const facts = [
		{ label: 'Based in', value: `${site.location.city}, ${site.location.country}` },
		{ label: 'OS', value: 'Arch Linux (Hyprland)' },
		{ label: 'Currently learning', value: 'Distributed systems · Rust' },
		{ label: 'Open to', value: 'Senior roles · consulting · contracts' }
	];

	const profilePageSchema = {
		'@context': 'https://schema.org',
		'@type': 'ProfilePage',
		'@id': `${site.url}/about#profile`,
		url: `${site.url}/about`,
		name: `About ${site.name}`,
		dateModified: '2026-05-21',
		mainEntity: { '@id': `${site.url}/#person` },
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
	description="About Khaled Waleed — a senior software engineer based in Baghdad, Iraq. Five years building production web apps with SvelteKit, Nuxt and Go."
	type="profile"
/>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(profilePageSchema)}</script>`}
</svelte:head>

<Container>
	<!-- Header -->
	<section class="animate-fade-up space-y-6">
		<Eyebrow label="~/about" />
		<h1 class="text-4xl font-bold tracking-tight text-[var(--fg)] sm:text-5xl">Hey</h1>
		<div class="max-w-2xl space-y-5 text-lg leading-relaxed text-[var(--fg-muted)]">
			<p>
				I'm a senior software engineer based in <span class="text-[var(--fg)]"
					>{site.location.city}, {site.location.country}</span
				>. I've spent the last five years shipping production web apps — the kind that real people
				use every day — with a soft spot for fast, restrained interfaces and backends that don't
				fall over at 3am.
			</p>
			<p>
				Most of my work lives at the intersection of <span class="text-[var(--fg)]"
					>SvelteKit / Nuxt</span
				>
				on the frontend and <span class="text-[var(--fg)]">Go</span> on the backend. Right now I'm
				building things I'm proud of at
				<a
					href="https://qi.iq"
					target="_blank"
					rel="noopener"
					class="text-[var(--brand)] underline decoration-[var(--brand)]/40 underline-offset-4 hover:decoration-[var(--brand)]"
					>Qi</a
				>
				and
				<a
					href="https://vitex.dev"
					target="_blank"
					rel="noopener"
					class="text-[var(--brand)] underline decoration-[var(--brand)]/40 underline-offset-4 hover:decoration-[var(--brand)]"
					>Vitex</a
				>.
			</p>
			<p>
				Outside of work I'm usually deep in a book, chasing a side project, or somewhere I haven't
				been before. If any of this sounds like your kind of person —
				<a
					href="/contact"
					class="text-[var(--brand)] underline decoration-[var(--brand)]/40 underline-offset-4 hover:decoration-[var(--brand)]"
					>let's talk</a
				>.
			</p>
		</div>
	</section>

	<!-- Quick facts -->
	<section class="mt-20">
		<div
			class="surface divide-y divide-[var(--border)] sm:grid sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3"
		>
			{#each facts as f, i}
				<div
					class="p-6 {i % 2 === 0 ? 'sm:border-r sm:border-[var(--border)]' : ''} {i <
					facts.length - (facts.length % 3 || 3)
						? 'lg:border-b lg:border-[var(--border)]'
						: ''}"
				>
					<div class="font-mono text-[11px] tracking-wider text-[var(--brand)] uppercase">
						{f.label}
					</div>
					<div class="mt-1.5 text-sm text-[var(--fg)]">{f.value}</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Experience -->
	<section class="mt-24 space-y-8">
		<div class="space-y-3">
			<Eyebrow label="Experience" />
			<h2 class="text-2xl font-semibold tracking-tight text-[var(--fg)] sm:text-3xl">
				Where I'm building.
			</h2>
		</div>

		<ol class="relative space-y-6 border-l border-[var(--border)] pl-6">
			{#each experiences as exp}
				<li class="relative">
					<span
						class="absolute top-2 -left-[33px] grid h-3.5 w-3.5 place-items-center rounded-full border-2 border-[var(--brand)] bg-[var(--bg)]"
					></span>
					<article class="surface p-6 sm:p-7">
						<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
							<h3 class="text-lg font-semibold text-[var(--fg)]">
								{exp.title} ·
								<a
									href={exp.url}
									target="_blank"
									rel="noopener"
									class="text-[var(--brand)] hover:underline"
								>
									{exp.company}
								</a>
							</h3>
							<span class="font-mono text-xs text-[var(--fg-dim)]">{exp.period}</span>
						</div>
						<ul class="mt-4 space-y-2 text-sm text-[var(--fg-muted)]">
							{#each exp.points as p}
								<li class="flex gap-2">
									<span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--brand)]"></span>
									<span>{p}</span>
								</li>
							{/each}
						</ul>
					</article>
				</li>
			{/each}
		</ol>
	</section>

	<!-- Skills -->
	<section class="mt-24 space-y-8">
		<div class="space-y-3">
			<Eyebrow label="Toolkit" />
			<h2 class="text-2xl font-semibold tracking-tight text-[var(--fg)] sm:text-3xl">
				Things I reach for.
			</h2>
		</div>

		<div class="grid gap-5 sm:grid-cols-2">
			{#each Object.entries(skills) as [category, items]}
				<div class="surface p-6">
					<div class="mb-4 font-mono text-xs tracking-wider text-[var(--brand)] uppercase">
						{category}
					</div>
					<div class="flex flex-wrap gap-1.5">
						{#each items as s}<Badge>{s}</Badge>{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- CTA -->
	<section class="mt-24">
		<div
			class="flex flex-col items-start justify-between gap-6 border-t border-[var(--border)] pt-12 sm:flex-row sm:items-center"
		>
			<p class="max-w-md text-[var(--fg-muted)]">
				Want to work together, ask a question, or just say hi? My inbox is open.
			</p>
			<div class="flex gap-3">
				<Button href="/contact" size="lg">Get in touch</Button>
				<Button href="/" variant="outline" size="lg">Back home</Button>
			</div>
		</div>
	</section>
</Container>
