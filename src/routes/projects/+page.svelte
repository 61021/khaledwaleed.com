<script lang='ts'>
	import { Container, Fleuron, PageHeader, SchemaOrg, Seo, site } from '$lib'
	import { formatDate } from '$lib/posts'
	import { reveal } from '$lib/reveal'

	const lastUpdated = '2026-08-08'

	type Project = {
		name: string
		url?: string
		/** short right-hand catalogue label, a number where one exists */
		measure: string
		note: string
	}

	type Section = {
		id: string
		name: string
		/** one plain attribution line under the heading, where the items alone don't say it */
		intro?: string
		items: Project[]
		/** trailing miscellany line for the works that need no plate of their own */
		outro?: string
	}

	const sections: Section[] = [
		{
			id: 'products',
			name: 'Products',
			items: [
				{
					name: 'Auction Key',
					url: 'https://auctionkey.app',
					measure: '$3M+ monthly',
					note: 'Car-auction brokerage: controlled live-auction access, an ERP for cars, fees, and client ledgers, and white-label apps. Al-Nejoum Al-Zahera runs its operations on it, 1,000+ cars a month.',
				},
				{
					name: 'Rocca Menu',
					url: 'https://roccamenu.com',
					measure: '20+ venues',
					note: 'A multi-tenant QR-menu SaaS for restaurants and cafés, bilingual and themed to each venue.',
				},
			],
		},
		{
			id: 'commissions',
			name: 'Commissions',
			intro: 'Client work through Vitex, my studio.',
			items: [
				{
					name: 'Risha',
					url: 'https://rishaiq.com',
					measure: '25K+ downloads',
					note: 'E-learning for Iraq’s sixth-preparatory year: students pick from elite private tutors. The whole product: mobile app, dashboard, website, and a custom DRM that holds across devices; every screen of it designed and built by me.',
				},
				{
					name: 'Amanat Baghdad',
					url: 'https://www.amanatbaghdad.gov.iq',
					measure: 'gov.iq',
					note: 'The official website of the Mayoralty of Baghdad, the capital’s municipal government. Built in partnership with UoITC-BIC, the business-informatics college of Baghdad’s public IT university.',
				},
				{
					name: 'Ishtar Center',
					url: 'https://ishtarcenter.com',
					measure: 'since 2024',
					note: 'The democracy NGO’s bilingual site and its conference site: designed, built, and operated, self-hosted backend included, for the center where I direct technology.',
				},
			],
			outro:
				'Around these: platforms for Afaq Al-Obaidi’s subsidiaries (Smartic, National Foodstuff, Auto Zone, Golden Lube), a document-archiving system for the Al-Amal Association, and 20+ client deployments kept running in production.',
		},
		{
			id: 'government',
			name: 'Government platforms',
			intro: 'From the Enjaz and Digital Logic years.',
			items: [
				{
					name: 'The seven oil platforms',
					measure: '4M+ users',
					note: 'Distribution of the state’s oil products to gas stations, generators, bakeries, and farms across Iraq. Inherited as Enjaz’s only frontend engineer; rebuilt and redesigned within a year, all seven.',
				},
				{
					name: 'Oil Coupon',
					measure: '3M+ families',
					note: 'The national fuel-coupons miniapp, the most used in Super Qi, and one of the seven.',
				},
				{
					name: 'Enjaz',
					url: 'https://enjaz.tech',
					measure: 'solo build',
					note: 'The corporate website of Qi’s e-government arm.',
				},
				{
					name: 'Iraqi Electronic Passport',
					measure: 'national',
					note: 'The platform’s public website and its appointment-booking flow, from my Digital Logic years.',
				},
				{
					name: 'The Garage System',
					measure: 'team of nine',
					note: 'An ERP running the garages that intercity taxis operate from, in every Iraqi governorate. I led the team of nine building it and reviewed all of its frontend.',
				},
			],
			outro:
				'From the same years: frontends for the General Company for Ports of Iraq and the Shipping Agencies systems.',
		},
		{
			id: 'earlier',
			name: 'Earlier & elsewhere',
			items: [
				{
					name: 'Morshed',
					url: 'https://morshed-bdc.com',
					measure: '2024',
					note: 'The business-development firm’s website, accounting ERP, and internal workflow systems, plus websites and ERPs for its clients.',
				},
				{
					name: 'Speetu',
					url: 'https://speetu.com',
					measure: 'Amsterdam',
					note: 'Websites for Dutch brands, Inflexio among them, and Speetu’s own site, logo, and brand identity.',
				},
			],
		},
		{
			id: 'open-source',
			name: 'Open source',
			items: [
				{
					name: 'Nuxt',
					url: 'https://nuxt.com',
					measure: 'merged',
					note: 'Contributions to the Vue framework’s core.',
				},
				{
					name: 'Nuxt UI',
					url: 'https://ui.nuxt.com',
					measure: 'merged',
					note: 'Contributions to the official Nuxt component library.',
				},
				{
					name: 'Hyprland website',
					url: 'https://hypr.land',
					measure: 'merged',
					note: 'Work on the Wayland compositor’s website.',
				},
				{
					name: 'khaledwaleed.com',
					url: 'https://github.com/61021/khaledwaleed.com',
					measure: 'this site',
					note: 'Hand-built, one painting to a page. The paintings are public domain; the rest is mine.',
				},
			],
		},
	]

	const description = `Everything Khaled Waleed has built and shipped: Auction Key, Rocca Menu, Risha, seven government oil platforms serving 4+ million users, open-source work, and this site. Updated ${lastUpdated}.`

	const [products, commissions, government, earlier, openSource] = sections

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': `${site.url}/projects#page`,
		'url': `${site.url}/projects`,
		'name': `${site.name}'s Projects`,
		description,
		'dateModified': lastUpdated,
		'isPartOf': { '@id': `${site.url}/#website` },
		'about': { '@id': `${site.url}/#person` },
		'mainEntity': {
			'@type': 'ItemList',
			'itemListElement': sections
				.flatMap(s => s.items)
				.map((p, i) => ({
					'@type': 'ListItem',
					'position': i + 1,
					'item': {
						'@type': 'CreativeWork',
						'name': p.name,
						...(p.url ? { url: p.url } : {}),
						'author': { '@id': `${site.url}/#person` },
					},
				})),
		},
		'breadcrumb': {
			'@type': 'BreadcrumbList',
			'itemListElement': [
				{ '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': site.url },
				{ '@type': 'ListItem', 'position': 2, 'name': 'Projects', 'item': `${site.url}/projects` },
			],
		},
	}
</script>

<Seo title='Projects' {description} />

<SchemaOrg {schema} />

{#snippet measureLine(p: Project, heading: boolean)}
	<div class='flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4'>
		{#if heading}
			<h3>
				{#if p.url}
					<a href={p.url} target='_blank' rel='noopener' class='link'>{p.name}</a>
				{:else}{p.name}{/if}
			</h3>
		{:else if p.url}
			<a href={p.url} target='_blank' rel='noopener' class='link italic'>{p.name}</a>
		{:else}
			<span class='text-[var(--ink)] italic'>{p.name}</span>
		{/if}
		<span class='leader hidden sm:block' aria-hidden='true'></span>
		<span class='smallcaps measure shrink-0'>{p.measure}</span>
	</div>
{/snippet}

{#snippet plateRow(p: Project)}
	<li>
		{@render measureLine(p, true)}
		<p class='mt-2 text-sm leading-relaxed text-[var(--ink-muted)]'>{p.note}</p>
	</li>
{/snippet}

{#snippet indexRow(p: Project)}
	<li class='py-4'>
		{@render measureLine(p, false)}
		<p class='mt-1.5 text-sm leading-relaxed text-[var(--ink-muted)]'>{p.note}</p>
	</li>
{/snippet}

{#snippet intro(s: Section)}
	{#if s.intro}
		<p class='mt-2 text-sm text-[var(--ink-muted)] italic'>{s.intro}</p>
	{/if}
{/snippet}

{#snippet outro(s: Section)}
	{#if s.outro}
		<p class='mt-4 text-sm leading-relaxed text-[var(--ink-muted)] italic'>{s.outro}</p>
	{/if}
{/snippet}

<PageHeader room='projects' title='Projects'>
	{#snippet lede()}
		<p>What I have shipped, with the numbers.</p>
	{/snippet}
</PageHeader>

<Container size='prose'>
	<div class='smallcaps mt-10'>
		updated <time datetime={lastUpdated}>{formatDate(lastUpdated)}</time>
	</div>

	<Fleuron />

	<div class='space-y-14'>
		<!-- The two product lines hang as full plates -->
		<section id={products.id} class='scroll-mt-20' {@attach reveal}>
			<h2>{products.name}</h2>
			{@render intro(products)}
			<ul class='mt-8 space-y-10'>
				{#each products.items as p (p.name)}
					{@render plateRow(p)}
				{/each}
			</ul>
			{@render outro(products)}
		</section>

		<div class='rule-fine'></div>

		<section id={commissions.id} class='scroll-mt-20' {@attach reveal}>
			<h2>{commissions.name}</h2>
			{@render intro(commissions)}
			<ul class='mt-8 space-y-10'>
				{#each commissions.items as p (p.name)}
					{@render plateRow(p)}
				{/each}
			</ul>
			{@render outro(commissions)}
		</section>

		<div class='rule-fine'></div>

		<!-- The government work reads as a register: dense, ruled -->
		<section id={government.id} class='scroll-mt-20' {@attach reveal}>
			<h2>{government.name}</h2>
			{@render intro(government)}
			<ul class='mt-4 divide-y divide-[var(--rule)]'>
				{#each government.items as p (p.name)}
					{@render indexRow(p)}
				{/each}
			</ul>
			{@render outro(government)}
		</section>

		<div class='rule-fine'></div>

		<!-- Two closing wings share a row on wide screens -->
		<div class='grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-14'>
			{#each [earlier, openSource] as s (s.id)}
				<section id={s.id} class='wing scroll-mt-20' {@attach reveal}>
					<h2>{s.name}</h2>
					{@render intro(s)}
					<ul class='mt-2'>
						{#each s.items as p (p.name)}
							{@render indexRow(p)}
						{/each}
					</ul>
					{@render outro(s)}
				</section>
			{/each}
		</div>
	</div>

	<Fleuron />

	<p class='text-center' {@attach reveal}>
		<a href='/story' class='link'>All of this as a work history: Story →</a>
	</p>

	<Fleuron />

	<figure class='mx-auto max-w-md text-center' {@attach reveal}>
		<blockquote class='text-[var(--ink)] italic' style='font-size: 1.35rem; line-height: 1.5;'>
			Software, pretty and perfect.
		</blockquote>
		<figcaption class='smallcaps mt-4'>Vitex’s motto, since 2021</figcaption>
	</figure>
</Container>

<style>
	/* The numbers are this page's gilding; everything else stays ink.
	   (.smallcaps colors itself outside Tailwind's layers, hence a class.) */
	.measure {
		color: color-mix(in oklab, var(--accent) 72%, var(--ink-muted));
	}

	/* Wing headings step down so Products and the register keep the lead
	   voice (the app.css h2 clamp is un-layered, so no utility can). */
	.wing h2 {
		font-size: 1.4rem;
	}
</style>
