<script lang="ts">
	import { Seo, Container, Button, PageHeader, Fleuron, SchemaOrg, site } from '$lib';

	type Experience = {
		company: string;
		url?: string;
		meta: string;
		title: string;
		start: string;
		/** absent = ongoing, rendered as "since {start}" */
		end?: string;
		highlights: string[];
	};

	const experiences: Experience[] = [
		{
			company: 'QiCard',
			url: 'https://qi.iq',
			meta: 'Full-time, Baghdad, on-site',
			title: 'Lead Frontend Engineer',
			start: 'Jan 2025',
			highlights: [
				'Youngest employee among Qi’s 3,000+ staff.',
				'Hired as the sole frontend engineer for seven government platforms; rebuilt and redesigned every app to modern Vue/Nuxt standards within a year.',
				'Built the frontend team: scouted, interviewed, and trial-task-vetted all three hires, then trained and onboarded them; now lead the four, owning code review, standards, and release quality.',
				'Portfolio serves 4+ million users, including Oil Coupon, Super Qi’s most-used miniapp (3+ million families), and the systems managing the state OPDC’s oil-product distribution to gas stations, bakeries, generators, and farms nationwide.',
				'Designed and built the corporate website of Enjaz, Qi’s e-government arm.'
			]
		},
		{
			company: 'Ishtar Center for Democracy Support',
			url: 'https://ishtarcenter.com',
			meta: 'Part-time, Baghdad, hybrid',
			title: 'Director of AI & Technology',
			start: 'Feb 2024',
			highlights: [
				'Center member of an Iraqi NGO advancing democracy and human rights; own all of its technology.',
				'Work with Iraq’s top researchers, applying advanced AI models to conduct and enhance the center’s research.',
				'Built and operate ishtarcenter.com, a bilingual Nuxt site with a self-hosted backend, and the center’s conference website.'
			]
		},
		{
			company: 'Vitex',
			url: 'https://vitex.dev',
			meta: 'Self-employed, Baghdad, remote',
			title: 'Founder & Lead Engineer',
			start: 'Oct 2021',
			highlights: [
				'Run a four-person design-engineering studio (“Software, pretty and perfect”) building web platforms and mobile apps for Iraqi enterprises and NGOs.',
				'Built Risha end to end (mobile app, dashboard, website): e-learning connecting Iraq’s sixth-preparatory students with elite private tutors. 25K+ downloads, custom cross-device DRM; led all design and frontend.',
				'Built and operate Auction Key, a car-auction brokerage platform with built-in ERP and white-label apps, powering Al-Nejoum Al-Zahera’s operations: 1,000+ cars and $3M+ in transactions monthly.',
				'Built and operate Rocca Menu, a multi-tenant QR-menu SaaS for restaurants, live in 20+ venues.',
				'Shipped platforms for the Afaq Al-Obaidi subsidiaries (Smartic for employment, National Foodstuff, Auto Zone, Golden Lube) and an archiving system for the Al-Amal Association.',
				'Operate 20+ production client deployments (Cloudflare Pages + self-hosted VPS backends).'
			]
		},
		{
			company: 'Morshed',
			meta: 'Part-time, Baghdad, hybrid',
			title: 'Senior Software Engineer',
			start: 'Feb 2024',
			end: 'Dec 2024',
			highlights: [
				'Built Morshed’s website, accounting ERP, and internal workflow systems, and shipped websites and ERP systems for Morshed’s clients.',
				'Owned the digital transformation of the business-development & PR firm end to end.'
			]
		},
		{
			company: 'Digital Logic',
			meta: 'Full-time, Baghdad, on-site',
			title: 'Frontend Engineer',
			start: 'Oct 2022',
			end: 'Dec 2024',
			highlights: [
				'Built the Iraqi Electronic Passport platform’s public website and appointment-booking flow, plus Vue.js frontends for the General Company for Ports of Iraq and the Shipping Agencies systems.',
				'Led a team of nine developing The Garage System, an ERP managing the intercity-taxi garages of every Iraqi governorate; set code conventions and reviewed all frontend work.',
				'Mentored three interns through their first production features.'
			]
		},
		{
			company: 'Speetu',
			meta: 'Part-time, Amsterdam, remote',
			title: 'Design Engineer',
			start: 'Oct 2021',
			end: 'Oct 2022',
			highlights: [
				'Designed and built websites for Dutch brands, Inflexio among them, plus Speetu’s own site, logo, and brand identity.',
				'Collaborated remotely with a distributed team across time zones.'
			]
		},
		{
			company: 'The Town Studio',
			meta: 'Full-time, Baghdad, on-site',
			title: 'Graphic Designer',
			start: 'Jun 2021',
			end: 'Oct 2021',
			highlights: [
				'Produced print and digital brand assets (brochures, posters, social-media sets, web graphics), mostly for beauty and organic brands, doctors, and surgeons.',
				'Worked with marketing teams to keep design aligned with brand strategy and campaign goals.'
			]
		},
		{
			company: 'Nakhlat Baghdad',
			meta: 'Full-time, Baghdad, on-site',
			title: 'Cashier & Store Assistant',
			start: 'Apr 2019',
			end: 'Jun 2021',
			highlights: [
				'First job ever, in a mid-sized Al-Harithiya supermarket: checkout, inventory, and restocking, learning to handle impatient adults before having a high-school ID.'
			]
		}
	];

	const period = (exp: Experience) =>
		exp.end ? `${exp.start} to ${exp.end}` : `since ${exp.start}`;

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
		{ label: 'Working on', value: 'Qi & Vitex' },
		{ label: 'Reading next', value: 'Distributed systems, Rust' },
		{ label: 'Open to', value: 'Senior roles, contracts' }
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
		dateModified: '2026-08-06',
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
	description="Khaled Waleed is a lead design engineer in Baghdad, Iraq: five years building web apps across government, payments, democracy, and private-sector projects in SvelteKit, Nuxt, and Go."
/>

<SchemaOrg schema={aboutPageSchema} />

<PageHeader room="about" title="About">
	{#snippet lede()}
		<p>The full story, with the CV at the end.</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	<section class="rise-3 mt-12 space-y-6">
		<p class="dropcap text-[1.15rem] leading-[1.78] text-[var(--ink)]">
			At fourteen I was behind a supermarket checkout in Al-Harithiya, Baghdad, scanning groceries
			and counting change. My father had died in 2014, and I was the eldest son in a family of five,
			so someone had to provide. I have been working ever since, first at the register, then in
			pixels, now on systems that millions of people depend on. And providing ever since, too. This
			page is the long version.
		</p>
		<p>
			Design came before code. At seventeen, still in school, I spent a summer making posters for
			surgeons and beauty brands at a small Baghdad studio, and I wanted the designs to work, not
			just sit there. So I taught myself to build them. By the end of 2021 I was designing and
			building websites for a studio in Amsterdam, under the same title I use today (design
			engineer), and I had founded
			<a href="https://vitex.dev" target="_blank" rel="noopener" class="link">Vitex</a>, my own
			studio, with the motto it still carries: <em>software, pretty and perfect</em>.
		</p>
		<p>
			Then the work turned serious. At eighteen I was building government systems: the Iraqi
			Electronic Passport's public website and booking flow, systems for the ports, an ERP behind
			the intercity-taxi garages of every governorate, and I led a team of nine while doing it.
			Building software in Iraq is an advantage, not a footnote: the constraints are real, the
			stakes are rarely abstract, and you learn early what holds up when the thing simply has to
			work. In those years the Ishtar Center, a democracy NGO, made me its director of AI and
			technology, where I apply AI models to research alongside some of Iraq's top researchers.
		</p>
		<p>
			Today I lead frontend at
			<a href="https://qi.iq" target="_blank" rel="noopener" class="link">Qi</a>, Iraq's largest
			e-payment company, which I joined as the youngest of its 3,000+ employees and the only
			frontend engineer on seven government platforms. Within a year I had rebuilt and redesigned
			all seven; then I recruited and trained the three engineers who now run them with me. The
			portfolio serves more than four million people; one platform alone reaches three million
			families. And still, the part I care about most is the part nobody audits: sounds, motion, the
			small courtesies of an interface, shipped in business dashboards nobody expected to enjoy. I
			have never accepted that “it works” and “it feels right” should be different standards. Vitex,
			meanwhile, grew up with me: four people now, with products of its own out in the world. There
			is a title for all of this, lead design engineer, but it is the same instinct that started
			with the posters.
		</p>
		<p>
			Away from the screen I read, watch films, and walk the older parts of cities. The questions I
			care about never stay answered: why people suffer, where taste comes from, what makes a life
			worthwhile. I <a href="/writing" class="link">write</a> occasionally, mostly because some
			thoughts become annoying if you leave them alone for too long, and I have found that most
			things become more bearable once they become interesting. Software included. If some of that
			overlaps with your world, <a href="/contact" class="link">let's talk</a>.
		</p>
		<p class="text-sm text-[var(--ink-muted)] italic">
			For the record, the name in Arabic is <span lang="ar" class="not-italic">خالد وليد</span>,
			romanized Khaled Waleed, though Khalid Waleed and Khaled Walid also find their way to me.
		</p>
	</section>

	<Fleuron />

	<!-- At a glance -->
	<section class="rise">
		<dl class="grid grid-cols-2 gap-x-6 gap-y-6 text-left sm:gap-x-10 sm:text-center">
			{#each facts as f (f.label)}
				<div>
					<dt class="smallcaps">{f.label}</dt>
					<dd class="mt-1 text-[var(--ink)] italic">{f.value}</dd>
				</div>
			{/each}
		</dl>
	</section>

	<Fleuron />

	<section class="rise mt-8">
		<h2 class="text-center">Where I’ve worked</h2>
		<ol class="mt-12">
			{#each experiences as exp, i (exp.company)}
				<li class="grid grid-cols-1 sm:grid-cols-[8.75rem_1fr]">
					<div class="hidden pt-[0.45rem] pr-7 text-right sm:block">
						{#if exp.end}
							<div class="smallcaps date-ink">{exp.start}</div>
							<div class="smallcaps mt-1"><span class="date-dim">to</span> {exp.end}</div>
						{:else}
							<div class="smallcaps date-dim">since</div>
							<div class="smallcaps date-ink mt-1">{exp.start}</div>
						{/if}
						<p class="mt-2.5 text-[0.8rem] leading-[1.6] text-[var(--ink-dim)] italic">
							{exp.meta}
						</p>
					</div>
					<div
						class="entry relative pl-6 sm:pl-7 {i < experiences.length - 1
							? 'pb-12 sm:pb-14'
							: 'pb-0'}"
					>
						<span class="entry-gem" aria-hidden="true"></span>
						<div class="smallcaps mb-2 sm:hidden">{period(exp)} · {exp.meta}</div>
						<h3 class="text-[var(--ink)]">{@render companyName(exp)}</h3>
						<p class="mt-1 font-display text-[1.05rem] text-[var(--ink-muted)]">{exp.title}</p>
						{@render highlights(exp.highlights)}
					</div>
				</li>
			{/each}
		</ol>
		<p class="mt-14 text-center text-sm text-[var(--ink-muted)] italic">
			The same history on
			<a href={linkedIn} target="_blank" rel="noopener" class="link">LinkedIn</a>, or as a two-page
			PDF.
		</p>
		<div class="mt-6 flex flex-wrap items-center justify-center gap-4">
			<Button href={cvUrl} external>View the CV</Button>
			<Button href={cvUrl} download="Khaled-Waleed-Resume.pdf" variant="outline">Download</Button>
		</div>
	</section>

	<Fleuron />

	<!-- The toolkit -->
	<section class="rise mt-8">
		<h2 class="text-center">The toolkit</h2>
		<p class="mx-auto mt-4 max-w-md text-center text-sm text-[var(--ink-muted)] italic">
			The tools I reach for without thinking.
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
		<p class="max-w-md text-[var(--ink-muted)] italic sm:mx-auto">
			If you want to talk, about work or anything else, I am easy to reach.
		</p>
		<div class="mt-6 flex flex-wrap items-center justify-start gap-4 sm:justify-center">
			<Button href="/contact" size="lg">Get in touch</Button>
			<Button href="/" variant="outline" size="lg">Home</Button>
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

<style>
	/* One continuous rail for the whole history, mixed faintly gilt so it
	   reads as hanging wire rather than wallpaper seam; a gem (the .orn /
	   Fleuron diamond) seats each entry on it. Consecutive entries touch
	   (spacing is padding, not margin), which is what keeps the wire unbroken. */
	.entry {
		border-left: 1px solid color-mix(in oklab, var(--accent) 22%, var(--rule));
	}

	.entry-gem {
		position: absolute;
		top: 0.52rem;
		left: -0.5px;
		width: 0.34rem;
		height: 0.34rem;
		background: color-mix(in oklab, var(--accent) 55%, transparent);
		transform: translateX(-50%) rotate(45deg);
		transition: background-color 400ms ease;
	}

	li:hover .entry-gem {
		background: var(--accent);
	}

	/* The company link is the only control in an entry; widen its touch
	   target without moving the underline. */
	.entry h3 a {
		position: relative;
	}

	.entry h3 a::after {
		content: '';
		position: absolute;
		inset: -8px 0;
	}

	/* .smallcaps sets its own color outside Tailwind's layers, so utility
	   classes cannot re-tint it; these carry the marginalia's two tones. */
	.date-ink {
		color: var(--ink);
	}

	.date-dim {
		color: var(--ink-dim);
	}
</style>
