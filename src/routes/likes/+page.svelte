<script lang="ts">
	import { Seo, Container, PageHeader, Fleuron, site } from '$lib';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	const lastUpdated = '2026-07-26';

	type Section = {
		name: string;
		kicker: string;
		items: string[];
		link?: { href: string; label: string };
	};

	const sections: Section[] = [
		{
			name: 'Mind',
			kicker: 'Philosophy I keep returning to',
			items: [
				'Why people suffer',
				'Whether meaning is discovered or invented',
				'The line between good and evil',
				'What makes a life worthwhile',
				"Why some relationships survive and others don't",
				'How much of personality is choice',
				'Why we tell stories',
				'What attention is',
				'Where taste comes from',
				'What curiosity itself is'
			]
		},
		{
			name: 'Cinema',
			kicker: 'Directors I rewatch on principle',
			items: [
				'Stanley Kubrick',
				'David Lynch',
				'Studio Ghibli',
				'Beautiful failures',
				'Films that trust the audience'
			],
			link: { href: '/films', label: 'Every film and show I have rated →' }
		},
		{
			name: 'Art',
			kicker: 'Paintings & prose I live inside',
			items: [
				'Northern Romantic painting',
				'Caspar David Friedrich',
				'Johan Christian Dahl',
				'John Atkinson Grimshaw',
				'Ivan Aivazovsky',
				'Moonlit landscapes',
				'Shakespearean tragedy',
				'Ballet, especially Swan Lake',
				'Ruins reclaimed by nature',
				'Lonely figures in vast landscapes',
				'Storms at sea',
				'Melancholy without despair'
			],
			link: { href: '/library', label: "What's on the shelf →" }
		},
		{
			name: 'Music',
			kicker: 'Listening rooms in my head',
			items: [
				'Classical, all of it',
				'Tchaikovsky, for Swan Lake',
				"Chopin's nocturnes",
				'Progressive metal',
				'Britpop',
				'Garage rock revival',
				'Moody Americana',
				'The tuning note before the first note'
			],
			link: { href: '/music', label: 'What I am listening to lately →' }
		},
		{
			name: 'Style',
			kicker: 'A dark, tailored world',
			items: [
				'Oversized English trousers',
				'Crisp dress shirts',
				'Waistcoats',
				'Tall coats & capes',
				'Eyes Wide Shut masks',
				'Glasses, always',
				'Artistic rings shaped like animals',
				'Silver necklaces',
				'Silver lapel pins & cufflinks',
				'Pocket watches',
				'Victorian-patterned ties',
				'Fedora hats',
				'Textured leather belts',
				'Wooden-soled leather shoes',
				'Long boots',
				'Raincoats',
				'A proper black umbrella'
			]
		},
		{
			name: 'Space',
			kicker: 'How a room should feel',
			items: [
				'Cozy, small, lived-in rooms',
				'Patterned wallpaper',
				'Warm yellow light',
				'Victorian & Greek detailing',
				'A real fireplace',
				'Dark wooden doors',
				'Archways instead of corners',
				'Dark wood interiors',
				'Worn leather',
				'Indoor plants, everywhere',
				'Paintings on every wall',
				'Dead flowers in a vase',
				'Patterned carpets',
				'A big TV, sofa pulled close',
				'A bed too big for the room',
				'Candles & lanterns',
				'Detailed spoons & utensils',
				'A coffee corner',
				'A shoe-shine corner',
				'Windows onto trees & train tracks',
				'Fallen leaves indoors',
				'Easter eggs scattered through the room',
				'Hand-painted appliances — fridge, TV, the lot',
				'Floor-to-ceiling bookshelves',
				'Wall-sized mirrors in the dressing room',
				'A big mirrored bathroom',
				'An oversized shower head',
				'Rain against windows'
			]
		},
		{
			name: 'Places',
			kicker: "Rooms I don't own",
			items: [
				'Libraries',
				'Bookshops with ladders',
				'Museum halls near closing',
				'Grand old cinemas',
				'Old train stations',
				'Hotel bars at midnight'
			]
		},
		{
			name: 'Food',
			kicker: 'Foods that are worth the effort',
			items: [
				'Pancakes, flawless and faintly divine',
				'Quzi, slow-cooked',
				'Yalanji',
				'Steak, rested',
				'Risotto, done right',
				'Penne arrabiata',
				'Rocket (arugula) salad',
				'Sushi',
				'Sunflower seeds, by the bag'
			]
		},
		{
			name: 'Drink',
			kicker: 'What ends up in the glass',
			items: [
				'Cocktails, more or less all of them',
				'Sex on the Beach, ordered without irony',
				'Jägermeister, very cold',
				'Beer, very cold',
				'Iced V60',
				'Peach iced tea',
				'Black tea'
			]
		},
		{
			name: 'Road',
			kicker: 'Engines worth the silence after',
			items: [
				'Porsche 911 Turbo S',
				'Aston Martin DB11',
				'Ferrari 488 Pista',
				'Manual gearboxes',
				'Night drives, windows down',
				'Empty highways at 3am'
			]
		},
		{
			name: 'Wander',
			kicker: 'Travel, weather, slight danger',
			items: [
				'Rain & thunderstorms',
				'Solo travel, big cities',
				'Nocturnal urban exploration',
				'Secret European alleys',
				'Arboreal retreats, off-map',
				'Deep mountain hikes where no one has been'
			]
		},
		{
			name: 'Body',
			kicker: 'A Greek-god frame, and tolerance for pain',
			items: [
				'Inhuman training volumes',
				'Endurance past the point of reason',
				'Strength as a default state',
				'Sitting in discomfort, on purpose',
				'Cold water, on purpose',
				'Breathing exercises',
				'Stretching & mobility',
				'Balance',
				'Long walks as thinking',
				'Meditation',
				'Sleep, defended'
			]
		},
		{
			name: 'Craft',
			kicker: 'The software taste behind the day job',
			items: [
				'Total control over my stack',
				'Linux, always',
				'Suckless philosophy',
				'Software you can leave alone',
				'Programs that start instantly',
				'Plain text, forever',
				'Go, Rust, Svelte',
				'Self-hosted everything',
				'IBM Plex, everywhere',
				'Sorting files and data like a maniac'
			]
		}
	];

	const description = `A scattered, evolving catalogue of Khaled Waleed's obsessions — cinema, music, art, style, food, philosophy, and everything in between. Updated ${lastUpdated}.`;

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': `${site.url}/likes#page`,
		url: `${site.url}/likes`,
		name: `${site.name}'s Likes`,
		description,
		dateModified: lastUpdated,
		isPartOf: { '@id': `${site.url}/#website` },
		about: { '@id': `${site.url}/#person` },
		breadcrumb: {
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
				{ '@type': 'ListItem', position: 2, name: 'Likes', item: `${site.url}/likes` }
			]
		}
	};
</script>

<Seo title="Likes" {description} />

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>

<PageHeader room="likes" eyebrow="a catalogue of obsessions" title="Likes">
	{#snippet lede()}
		<p>
			A scattered, unfinished sketch, not a manifesto, certainly not a polished self-portrait.
			Random by design, immature on purpose. Updated whenever something earns its place or quietly
			loses it.
		</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	<div class="rise-3 mt-10">
		<Breadcrumb
			items={[
				{ name: 'Home', href: '/' },
				{ name: 'Likes', href: '/likes' }
			]}
		/>
		<div class="mt-4 smallcaps">
			updated <time datetime={lastUpdated}>{lastUpdated}</time>
		</div>
	</div>

	<!-- Section index -->
	<nav aria-label="Sections" class="rise-3 mt-8">
		<ul class="flex flex-wrap justify-center gap-x-6 gap-y-2 smallcaps">
			{#each sections as s (s.name)}
				<li>
					<a href={`#${s.name.toLowerCase()}`} class="link-quiet">{s.name}</a>
				</li>
			{/each}
		</ul>
	</nav>

	<Fleuron />

	<div class="rise space-y-16">
		{#each sections as s, i (s.name)}
			<section id={s.name.toLowerCase()} class="scroll-mt-20">
				<div class="smallcaps">{String(i + 1).padStart(2, '0')} · {s.kicker}</div>
				<h2
					class="mt-2 italic text-[var(--ink)]"
					style="font-family: var(--font-display); font-size: clamp(2rem, 4vw + 0.5rem, 2.75rem); line-height: 1.05;"
				>
					{s.name}.
				</h2>
				<!-- The separator leads each item (except the first) so it wraps with it
				     and never dangles at the end of a line. -->
				<ul class="mt-5 flex flex-wrap gap-x-3 gap-y-1 leading-relaxed text-[var(--ink-muted)]">
					{#each s.items as it, j (it)}
						<li>
							{#if j > 0}<span class="mr-3 text-[var(--rule)]" aria-hidden="true">·</span>{/if}{it}
						</li>
					{/each}
				</ul>
				{#if s.link}
					<p class="mt-5">
						<a href={s.link.href} class="link">{s.link.label}</a>
					</p>
				{/if}
				{#if i < sections.length - 1}
					<div class="mt-12 rule-fine"></div>
				{/if}
			</section>
		{/each}
	</div>

	<Fleuron />

	<figure class="rise mx-auto max-w-md text-center">
		<blockquote class="italic text-[var(--ink)]" style="font-size: 1.35rem; line-height: 1.5;">
			I am worthy because I am curious, not because I am clever.
		</blockquote>
		<figcaption class="mt-4 smallcaps">a note to self</figcaption>
	</figure>
</Container>
