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
						'Youngest employee among Qi’s 3,000+ staff.',
						'Hired as the sole frontend engineer for seven government platforms; rebuilt and redesigned every app to modern Vue/Nuxt standards within a year.',
						'Built the frontend team — scouted, interviewed, and trial-task-vetted all three hires, then trained and onboarded them; now lead the four, owning code review, standards, and release quality.',
						'Portfolio serves 4+ million users — including Oil Coupon, Super Qi’s most-used miniapp (3+ million families), and the systems managing the state OPDC’s oil-product distribution to gas stations, bakeries, generators, and farms nationwide.',
						'Designed and built the corporate website of Enjaz, Qi’s e-government arm.'
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
						'Center member of an Iraqi NGO advancing democracy and human rights; own all of its technology.',
						'Work with Iraq’s top researchers, applying advanced AI models to conduct and enhance the center’s research.',
						'Built and operate ishtarcenter.com — a bilingual Nuxt site with a self-hosted backend — and the center’s conference website.'
					]
				}
			]
		},
		{
			company: 'Vitex',
			url: 'https://vitex.dev',
			meta: 'Self-employed · Baghdad · remote',
			roles: [
				{
					title: 'Founder & Lead Engineer',
					period: 'Oct 2021 — present',
					highlights: [
						'Run a four-person design-engineering studio (“Software, pretty and perfect”) building web platforms and mobile apps for Iraqi enterprises and NGOs.',
						'Built Risha end to end — mobile app, dashboard, website: e-learning connecting Iraq’s sixth-preparatory students with elite private tutors. 25K+ downloads, custom cross-device DRM; led all design and frontend.',
						'Built and operate Auction Key, a car-auction brokerage platform with built-in ERP and white-label apps, powering Al-Nejoum Al-Zahera’s operations — 1,000+ cars and $3M+ in transactions monthly.',
						'Built and operate Rocca Menu, a multi-tenant QR-menu SaaS for restaurants, live in 20+ venues.',
						'Shipped platforms for Afaq Al-Obaidi subsidiaries — Smartic (employment), National Foodstuff, Auto Zone, Golden Lube — and an archiving system for the Al-Amal Association.',
						'Operate 20+ production client deployments (Cloudflare Pages + self-hosted VPS backends).'
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
						'Built Morshed’s website, accounting ERP, and internal workflow systems — and shipped websites and ERP systems for Morshed’s clients.',
						'Owned the digital transformation of the business-development & PR firm end to end.'
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
						'Built the Iraqi Electronic Passport platform’s public website and appointment-booking flow, plus Vue.js frontends for the General Company for Ports of Iraq and the Shipping Agencies systems.',
						'Led a team of nine developing The Garage System — an ERP managing the intercity-taxi garages of every Iraqi governorate; set code conventions and reviewed all frontend work.',
						'Mentored three interns through their first production features.'
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
						'Designed and built websites for Dutch brands — including Inflexio — plus Speetu’s own site, logo, and brand identity.',
						'Collaborated remotely with a distributed team across time zones.'
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
					title: 'Cashier & Store Assistant',
					period: 'Apr 2019 — Jun 2021',
					highlights: [
						'First job ever, in a mid-sized Al-Harithiya supermarket — checkout, inventory, and restocking, learning to handle impatient adults before having a high-school ID.'
					]
				}
			]
		}
	];

	const linkedIn = site.socials.find((s) => s.label === 'LinkedIn')?.href;
	const cvUrl = '/Khaled-Waleed-Resume.pdf';

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
		dateModified: '2026-08-05',
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
		<p>The story at full length — the CV waits at the end.</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	<section class="rise-3 mt-12 space-y-6">
		<p class="dropcap text-[1.15rem] leading-[1.78] text-[var(--ink)]">
			Every telling of a life picks a beginning. Mine is 2014, the year my father died. I was the
			eldest son in a family of five, and the arithmetic was unsentimental: someone had to provide.
			So 2019 finds a fourteen-year-old behind the checkout counter of a supermarket in
			Al-Harithiya, Baghdad, scanning groceries and counting change. I have been working ever since
			— first at the register, then in pixels, now on systems that millions of people depend on —
			and providing ever since, too. Some responsibilities you don’t outgrow; you just learn to
			carry them better. This page is the long version of how that happened.
		</p>
		<p>
			Design came before code. At seventeen, still in school, I spent a summer making posters for
			surgeons and beauty brands at a small Baghdad studio — and somewhere in there the designs
			started wanting to become real, working things. So I taught myself to build them. By the end
			of 2021 I was designing and building websites for a studio in Amsterdam, under a title I would
			only grow into years later — design engineer — and I had founded
			<a href="https://vitex.dev" target="_blank" rel="noopener" class="link">Vitex</a>, my own
			studio, with the sort of motto only a seventeen-year-old would dare:
			<em>software, pretty and perfect</em>.
		</p>
		<p>
			Then the work turned serious. At eighteen I was building pieces of the state's digital face —
			the Iraqi Electronic Passport's public website and booking flow, systems for the ports, an ERP
			behind the intercity-taxi garages of every governorate — and leading a team of nine while
			doing it. Building software in Iraq is something I treat as an advantage rather than a
			footnote: the constraints are real, the stakes are rarely abstract, and you learn early which
			engineering virtues actually hold up when the thing simply has to work. Somewhere in those
			years a democracy NGO made me its director of AI and technology, and I found myself applying
			AI models to research alongside some of Iraq's top researchers — a sentence I could not have
			predicted from behind the register.
		</p>
		<p>
			Today I lead frontend at
			<a href="https://qi.iq" target="_blank" rel="noopener" class="link">Qi</a>, Iraq's largest
			e-payment company, which I joined as the youngest of its 3,000+ employees and the only
			frontend engineer on seven government platforms. Within a year I had rebuilt and redesigned
			all seven; then I recruited and trained the three engineers who now run them with me. The
			portfolio serves more than four million people — one platform alone reaches three million
			families. And still, the part I care about most is the part nobody audits — sounds, motion,
			the small courtesies of an interface — shipped in business dashboards nobody expected to
			enjoy. I have never accepted that “it works” and “it feels right” should be different
			standards. Vitex, meanwhile, grew up with me: four people now, with products of its own out in
			the world. There is a title for all of this — lead design engineer — but it is the same
			instinct that started with the posters.
		</p>
		<p>
			Away from the screen I read, watch films, and walk the older parts of cities, chasing
			questions that never seem to stay answered for very long — meaning, suffering, morality, love,
			failure, beauty, why people do what they do. I
			<a href="/writing" class="link">write</a> occasionally too, mostly because some thoughts
			become annoying if you leave them alone for too long, and I have found that most things become
			more bearable once they become interesting. Software included. If any of that travels well
			with yours, <a href="/contact" class="link">let's talk</a>.
		</p>
		<p class="text-sm italic text-[var(--ink-muted)]">
			For the record, the name in Arabic is <span lang="ar" class="not-italic">خالد وليد</span> — romanized
			Khaled Waleed, though Khalid Waleed and Khaled Walid also find their way to me.
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
			<a href={linkedIn} target="_blank" rel="noopener" class="link">LinkedIn</a> — or on two pages of
			paper.
		</p>
		<div class="mt-6 flex flex-wrap items-center justify-center gap-4">
			<Button href={cvUrl} external>View the CV</Button>
			<Button href={cvUrl} download="Khaled-Waleed-Resume.pdf" variant="outline">Download</Button>
		</div>
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
