<script lang="ts">
	import { Seo, Container, PageHeader, Fleuron, SchemaOrg, site } from '$lib';
	import { formatDate } from '$lib/posts';

	const lastUpdated = '2026-08-05';

	type Project = {
		name: string;
		url?: string;
		/** short right-hand catalogue label — a number where one exists */
		measure: string;
		note: string;
	};

	type Section = {
		id: string;
		name: string;
		/** one plain attribution line under the heading, where the items alone don't say it */
		intro?: string;
		items: Project[];
		/** trailing miscellany line for the works that need no plate of their own */
		outro?: string;
	};

	const sections: Section[] = [
		{
			id: 'products',
			name: 'Products',
			items: [
				{
					name: 'Auction Key',
					url: 'https://auctionkey.app',
					measure: '$3M+ monthly',
					note: 'Car-auction brokerage: controlled live-auction access, an ERP for cars, fees, and client ledgers, and white-label apps. Al-Nejoum Al-Zahera runs its operations on it, 1,000+ cars a month.'
				},
				{
					name: 'Rocca Menu',
					url: 'https://roccamenu.com',
					measure: '20+ venues',
					note: 'A multi-tenant QR-menu SaaS for restaurants and cafés, bilingual and themed to each venue.'
				}
			]
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
					note: 'E-learning for Iraq’s sixth-preparatory year: students pick from elite private tutors. The whole product: mobile app, dashboard, website, and a custom DRM that holds across devices; every screen of it designed and built by me.'
				},
				{
					name: 'Ishtar Center',
					url: 'https://ishtarcenter.com',
					measure: 'since 2024',
					note: 'The democracy NGO’s bilingual site and its conference site: designed, built, and operated, self-hosted backend included, for the center where I direct technology.'
				}
			],
			outro:
				'Around these: platforms for Afaq Al-Obaidi’s subsidiaries (Smartic, National Foodstuff, Auto Zone, Golden Lube), a document-archiving system for the Al-Amal Association, and 20+ client deployments kept running in production.'
		},
		{
			id: 'government',
			name: 'Government platforms',
			intro: 'From the QiCard and Digital Logic years.',
			items: [
				{
					name: 'The seven oil platforms',
					measure: '4M+ users',
					note: 'Distribution of the state’s oil products to gas stations, generators, bakeries, and farms across Iraq. Inherited as Qi’s only frontend engineer; rebuilt and redesigned within a year, all seven.'
				},
				{
					name: 'Oil Coupon',
					measure: '3M+ families',
					note: 'The national fuel-coupons miniapp, the most used in Super Qi, and one of the seven.'
				},
				{
					name: 'Enjaz',
					measure: 'solo build',
					note: 'The corporate website of Qi’s e-government arm.'
				},
				{
					name: 'Iraqi Electronic Passport',
					measure: 'national',
					note: 'The platform’s public website and its appointment-booking flow, from my Digital Logic years.'
				},
				{
					name: 'The Garage System',
					measure: 'team of nine',
					note: 'An ERP running the garages that intercity taxis operate from, in every Iraqi governorate. I led the team of nine building it and reviewed all of its frontend.'
				}
			],
			outro:
				'From the same years: frontends for the General Company for Ports of Iraq and the Shipping Agencies systems.'
		},
		{
			id: 'earlier',
			name: 'Earlier & elsewhere',
			items: [
				{
					name: 'Morshed',
					url: 'https://morshed-bdc.com',
					measure: '2024',
					note: 'The business-development firm’s website, accounting ERP, and internal workflow systems, plus websites and ERPs for its clients.'
				},
				{
					name: 'Speetu',
					url: 'https://speetu.com',
					measure: 'Amsterdam',
					note: 'Websites for Dutch brands, Inflexio among them, and Speetu’s own site, logo, and brand identity.'
				}
			]
		},
		{
			id: 'open-source',
			name: 'Open source',
			items: [
				{
					name: 'Reka UI',
					url: 'https://reka-ui.com',
					measure: 'merged',
					note: 'Contributions to the Vue UI-primitives library.'
				},
				{
					name: 'Hyprland website',
					url: 'https://hyprland.org',
					measure: 'merged',
					note: 'Work on the Wayland compositor’s website.'
				},
				{
					name: 'khaledwaleed.com',
					url: 'https://github.com/61021/khaledwaleed.com',
					measure: 'this site',
					note: 'Hand-built, one painting to a page. The paintings are public domain; the rest is mine.'
				}
			]
		}
	];

	const description = `Everything Khaled Waleed has built and shipped: Auction Key, Rocca Menu, Risha, seven government oil platforms serving 4+ million users, open-source work, and this site. Updated ${lastUpdated}.`;

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': `${site.url}/projects#page`,
		url: `${site.url}/projects`,
		name: `${site.name}'s Projects`,
		description,
		dateModified: lastUpdated,
		isPartOf: { '@id': `${site.url}/#website` },
		about: { '@id': `${site.url}/#person` },
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: sections
				.flatMap((s) => s.items)
				.map((p, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					item: {
						'@type': 'CreativeWork',
						name: p.name,
						...(p.url ? { url: p.url } : {}),
						author: { '@id': `${site.url}/#person` }
					}
				}))
		},
		breadcrumb: {
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
				{ '@type': 'ListItem', position: 2, name: 'Projects', item: `${site.url}/projects` }
			]
		}
	};
</script>

<Seo title="Projects" {description} />

<SchemaOrg {schema} />

{#snippet projectRow(p: Project)}
	<li class="py-4">
		<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
			{#if p.url}
				<a href={p.url} target="_blank" rel="noopener" class="link italic">{p.name}</a>
			{:else}
				<span class="italic text-[var(--ink)]">{p.name}</span>
			{/if}
			<span class="leader hidden sm:block" aria-hidden="true"></span>
			<span class="smallcaps shrink-0">{p.measure}</span>
		</div>
		<p class="mt-1.5 text-sm leading-relaxed text-[var(--ink-muted)]">{p.note}</p>
	</li>
{/snippet}

<PageHeader room="projects" title="Projects">
	{#snippet lede()}
		<p>What I have shipped, with the numbers.</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	<div class="rise-3 mt-10 smallcaps">
		updated <time datetime={lastUpdated}>{formatDate(lastUpdated)}</time>
	</div>

	<Fleuron />

	<div class="rise space-y-16">
		{#each sections as s, i (s.id)}
			<section id={s.id} class="scroll-mt-20">
				<h2 class="italic">{s.name}</h2>
				{#if s.intro}
					<p class="mt-2 text-sm italic text-[var(--ink-muted)]">{s.intro}</p>
				{/if}
				<ul class="mt-4 divide-y divide-[var(--rule)]">
					{#each s.items as p (p.name)}
						{@render projectRow(p)}
					{/each}
				</ul>
				{#if s.outro}
					<p class="mt-4 text-sm italic leading-relaxed text-[var(--ink-muted)]">{s.outro}</p>
				{/if}
				{#if i < sections.length - 1}
					<div class="mt-12 rule-fine"></div>
				{/if}
			</section>
		{/each}
	</div>

	<Fleuron />

	<p class="rise text-center">
		<a href="/about" class="link">All of this as a work history: About →</a>
	</p>

	<Fleuron />

	<figure class="rise mx-auto max-w-md text-center">
		<blockquote class="italic text-[var(--ink)]" style="font-size: 1.35rem; line-height: 1.5;">
			Software, pretty and perfect.
		</blockquote>
		<figcaption class="mt-4 smallcaps">Vitex’s motto, since 2021</figcaption>
	</figure>
</Container>
