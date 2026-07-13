<script lang="ts">
	import { Seo, Container, Button, PageHeader, Fleuron, site } from '$lib';

	type Role = {
		title: string;
		period: string;
		highlights: string[];
	};

	type Experience = {
		company: string;
		url?: string;
		meta: string;
		lede?: string;
		roles: Role[];
	};

	const experiences: Experience[] = [
		{
			company: 'QiCard',
			url: 'https://qi.iq',
			meta: 'Full-time · Baghdad · on-site',
			roles: [
				{
					title: 'Lead Software Engineer',
					period: 'Aug 2025 — present',
					highlights: [
						'Lead the front-end team behind 6+ large-scale governmental applications serving millions of citizens — owning architecture, code reviews, and engineering standards across the portfolio.',
						'Scaled the Oil Coupon mini-app past 1 million families, one of the most widely used public-sector digital services in Iraq.',
						'Drive modernization of legacy codebases to current Vue and Nuxt standards while keeping mission-critical systems stable in production.'
					]
				},
				{
					title: 'Senior Software Engineer',
					period: 'Jan 2025 — Aug 2025',
					highlights: [
						'Hired as QiCard’s youngest engineer among 3,000+ employees; promoted to Lead Software Engineer within 8 months.',
						'Built and maintained front-ends for public-sector mini-apps inside the Qi ecosystem (Vue, Nuxt), working in cross-functional Agile squads with product, backend, and QA.',
						'Delivered features on mission-critical digital transformation projects for government partners.'
					]
				}
			]
		},
		{
			company: 'Vitex',
			url: 'https://vitex.dev',
			meta: 'Self-employed · Baghdad · remote',
			lede: 'Independent software studio delivering complete products for clients across Iraq — design, front-end, backend, and deployment.',
			roles: [
				{
					title: 'Founder & Software Engineer',
					period: 'Mar 2022 — present',
					highlights: [
						'Risha — Iraq’s leading e-learning platform for baccalaureate students. Designed and built the website, web app, dashboard, mobile app, and backend (Vue, Go).',
						'Rocca Menu — multi-tenant SaaS for bilingual digital restaurant menus with per-tenant theming, live in production (SvelteKit, Nuxt, PocketBase).',
						'Al-Nejoum Al-Zahera — vehicle-shipping management system with real-time tracking for US and Canada car imports to Iraq and Dubai.',
						'Dozens of websites and dashboards for businesses across Iraq.'
					]
				}
			]
		},
		{
			company: 'EGi',
			meta: 'Part-time · Baghdad · hybrid',
			roles: [
				{
					title: 'Software Engineer',
					period: 'Jun 2024 — Jan 2025',
					highlights: [
						'Designed and built the Esports Gaming Iraq platform website with Nuxt.',
						'Integrated QiCard payments end to end for a smooth gaming and checkout experience.'
					]
				}
			]
		},
		{
			company: 'Digital Logic',
			meta: 'Full-time · Baghdad · hybrid',
			roles: [
				{
					title: 'Software Engineer',
					period: 'Oct 2022 — Dec 2024',
					highlights: [
						'Led development of Vue.js applications for Iraqi government agencies — the Iraqi Electronic Passport, the General Company for Ports of Iraq, Scopesky HR, Durrat Al-Muheet ticketing, the Garage System, and Central Connections.',
						'Mentored interns through their first production projects, from code reviews to shipping features.'
					]
				}
			]
		},
		{
			company: 'Morshed',
			meta: 'Part-time · Baghdad · hybrid',
			roles: [
				{
					title: 'Software Engineer',
					period: 'Jun 2021 — Mar 2024',
					highlights: [
						'Designed and implemented digital solutions tailored to streamline operations for a leading PR, business development, and research company in Iraq.',
						'Collaborated with cross-functional teams to analyze, modernize, and integrate data-driven strategies across large-scale enterprise systems.',
						'Leveraged modern technologies to optimize workflows, enhance decision-making, and drive measurable business impact.'
					]
				}
			]
		},
		{
			company: 'Speetu',
			meta: 'Part-time · Amsterdam · remote',
			roles: [
				{
					title: 'Web Designer',
					period: 'Aug 2022 — Jul 2023',
					highlights: [
						'Designed websites for Dutch brands as part of a fully remote team, collaborating across time zones.'
					]
				}
			]
		},
		{
			company: 'The Town Studio',
			meta: 'Full-time · Baghdad · on-site',
			roles: [
				{
					title: 'Graphic Designer',
					period: 'Jun 2021 — Oct 2021',
					highlights: [
						'Designed brand identities and print and digital assets — brochures, posters, social media, and web graphics — in collaboration with marketing teams.'
					]
				}
			]
		},
		{
			company: 'Nakhlat Baghdad',
			meta: 'Full-time · Baghdad · on-site',
			roles: [
				{
					title: 'Cashier / Store Assistant',
					period: 'Apr 2019 — Feb 2021',
					highlights: [
						'My first job ever, in a medium-sized supermarket in Al-Harithiya.',
						'Learned how to deal with impatient adults before I even had a high school ID.',
						'Managed inventory and restocked shelves.',
						'Assisted customers and handled basic checkout operations.'
					]
				}
			]
		}
	];

	const linkedIn = site.socials.find((s) => s.label === 'LinkedIn')?.href;

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
	<section class="rise-3 mt-12 space-y-6">
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
		<h2 class="text-center italic">Where I’ve worked</h2>
		<ol class="mt-12 space-y-14">
			{#each experiences as exp (exp.company)}
				<li class="border-l-2 border-[var(--accent)] pl-6">
					{#if exp.roles.length > 1}
						<div class="smallcaps mb-2">{exp.meta}</div>
						<h3 class="italic text-[var(--ink)]">{@render companyName(exp)}</h3>
						<div class="mt-7 space-y-9">
							{#each exp.roles as role (role.title)}
								<div>
									<div class="smallcaps mb-2">{role.period}</div>
									<h4 class="text-[1.2rem] italic text-[var(--ink)]">{role.title}</h4>
									{@render highlights(role.highlights)}
								</div>
							{/each}
						</div>
					{:else}
						<div class="smallcaps mb-2">{exp.roles[0].period} · {exp.meta}</div>
						<h3 class="italic text-[var(--ink)]">
							{exp.roles[0].title} · {@render companyName(exp)}
						</h3>
						{#if exp.lede}
							<p class="mt-3 italic text-[var(--ink-muted)]">{exp.lede}</p>
						{/if}
						{@render highlights(exp.roles[0].highlights)}
					{/if}
				</li>
			{/each}
		</ol>
		<p class="mt-14 text-center text-sm italic text-[var(--ink-muted)]">
			The same story, in corporate dress, on
			<a href={linkedIn} target="_blank" rel="noopener" class="link">LinkedIn</a>.
		</p>
	</section>

	<Fleuron />

	<section class="rise mt-8 text-left sm:text-center">
		<p class="max-w-md italic text-[var(--ink-muted)] sm:mx-auto">
			A question, an idea, a collaboration — my inbox is open.
		</p>
		<div class="mt-6 flex flex-wrap items-center justify-start gap-4 sm:justify-center">
			<Button href="/contact" size="lg">Get in touch</Button>
			<Button href="/" variant="outline" size="lg">Back to the front</Button>
		</div>
	</section>
</Container>
{#snippet companyName(exp: Experience)}
	{#if exp.url}
		<a href={exp.url} target="_blank" rel="noopener" class="link">{exp.company}</a>
	{:else}{exp.company}{/if}
{/snippet}

{#snippet highlights(items: string[])}
	<ul class="mt-3 space-y-2">
		{#each items as h (h)}
			<li class="flex gap-3 text-[0.95rem] leading-[1.7] text-[var(--ink-muted)]">
				<span aria-hidden="true" class="shrink-0 text-[var(--accent)]">·</span>
				<span>{h}</span>
			</li>
		{/each}
	</ul>
{/snippet}
