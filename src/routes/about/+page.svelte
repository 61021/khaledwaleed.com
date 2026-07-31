<script lang="ts">
	import { Seo, Container, Button, PageHeader, Fleuron, SchemaOrg, site } from '$lib';

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
					title: 'Lead Frontend Engineer',
					period: 'Jan 2025 — present',
					highlights: [
						'Hired as QiCard’s youngest engineer among 3,000+ employees — the sole frontend engineer for the whole portfolio.',
						'Lead the front-end team behind seven large-scale governmental applications serving 4+ million users — owning architecture, code reviews, and engineering standards across the portfolio.',
						'Scaled the Oil Coupon mini-app past 3 million families — Super Qi’s most-used mini-app and one of the most widely used public-sector digital services in Iraq.',
						'Drive modernization of legacy codebases to current Vue and Nuxt standards while keeping mission-critical systems stable in production.'
					]
				}
			]
		},
		{
			company: 'Ishtar Center for Democracy Support',
			url: 'https://ishtarcenter.com',
			meta: 'Part-time · Baghdad · hybrid',
			roles: [
				{
					title: 'Director of AI & Technology',
					period: 'Feb 2024 — present',
					highlights: [
						'Center member and technology lead of an Iraqi NGO advancing democracy, civic engagement, and human rights — I own its infrastructure, tooling, and IT operations.',
						'Work with top Iraqi researchers, applying advanced AI models to conduct and enhance the center’s research.',
						'Built and operate ishtarcenter.com — a bilingual site with a self-hosted backend — and the center’s conference website.'
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
					title: 'Founder & Lead Engineer',
					period: 'Oct 2021 — present',
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
			meta: 'Full-time · Baghdad · on-site',
			roles: [
				{
					title: 'Frontend Engineer',
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
					title: 'Senior Software Engineer',
					period: 'Feb 2024 — Dec 2024',
					highlights: [
						'Built Morshed’s website, an accounting ERP, and internal workflow systems — plus websites and ERP systems for Morshed’s clients.',
						'Owned the digital transformation of the business-development and PR firm end to end.'
					]
				}
			]
		},
		{
			company: 'Speetu',
			meta: 'Part-time · Amsterdam · remote',
			roles: [
				{
					title: 'Design Engineer',
					period: 'Oct 2021 — Oct 2022',
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
						'Produced print and digital brand assets — brochures, posters, social-media sets, and web graphics — mostly for beauty and organic brands, doctors, and surgeons.',
						'Worked with marketing teams to keep design aligned with brand strategy and campaign goals.'
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
					period: 'Apr 2019 — Jun 2021',
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
		dateModified: '2026-07-31',
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
	description="Khaled Waleed is a lead design engineer in Baghdad, Iraq — five years building web apps across government, payments, democracy, and private-sector projects in SvelteKit, Nuxt, and Go."
/>

<SchemaOrg schema={aboutPageSchema} />

<PageHeader room="about" eyebrow="a brief portrait" title="About">
	{#snippet lede()}
		<p>A little bit more about me and where I work</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	<section class="rise-3 mt-12 space-y-6">
		<p class="dropcap text-[1.15rem] leading-[1.78] text-[var(--ink)]">
			I build software for a living, but curiosity is probably the more accurate description. For
			the last five years I have worked as a software engineer here in Baghdad, Iraq — a lead design
			engineer these days — mostly building web applications that have to survive contact with real
			users.
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

	<!-- At a glance -->
	<section class="rise">
		<dl class="grid grid-cols-2 gap-x-6 gap-y-6 text-left sm:gap-x-10 sm:text-center">
			{#each facts as f (f.label)}
				<div>
					<dt class="smallcaps">{f.label}</dt>
					<dd class="mt-1 italic text-[var(--ink)]">{f.value}</dd>
				</div>
			{/each}
		</dl>
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
			<a href={linkedIn} target="_blank" rel="noopener" class="link">LinkedIn</a> — or
			<a href="/cv" class="link">on paper</a>.
		</p>
	</section>

	<Fleuron />

	<!-- The toolkit -->
	<section class="rise mt-8">
		<h2 class="text-center italic">The toolkit</h2>
		<p class="mx-auto mt-4 max-w-md text-center text-sm italic text-[var(--ink-muted)]">
			The instruments I reach for without thinking.
		</p>
		<dl class="mt-10 space-y-7">
			{#each Object.entries(skills) as [group, list] (group)}
				<div class="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
					<dt class="smallcaps sm:w-28 sm:shrink-0 sm:text-right">{group}</dt>
					<dd class="flex flex-wrap gap-x-3 gap-y-1 text-[0.95rem] text-[var(--ink-muted)]">
						{#each list as tool, j (tool)}
							<span
								>{tool}{#if j < list.length - 1}<span class="ml-3 text-[var(--rule)]">·</span
									>{/if}</span
							>
						{/each}
					</dd>
				</div>
			{/each}
		</dl>
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
