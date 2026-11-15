<script lang='ts'>
	import type { FlowItem } from '$lib/types'
	import { Container, Fleuron, FlowList, PageHeader, SchemaOrg, Seo, site } from '$lib'
	import { formatDate } from '$lib/posts'
	import { reveal } from '$lib/reveal'

	const lastUpdated = '2026-11-15'

	type Section = {
		name: string
		items: FlowItem[]
		link?: { href: string, label: string }
	}

	const sections: Section[] = [
		{
			name: 'Mind',
			items: [
				'Why people suffer',
				'Whether meaning is discovered or invented',
				'The line between good and evil',
				'What makes a life worthwhile',
				'Why some relationships survive and others don\'t',
				'How much of personality is choice',
				'Why we tell stories',
				'What attention is',
				'Where taste comes from',
				'What curiosity itself is',
			],
		},
		{
			name: 'Cinema',
			items: [
				'Stanley Kubrick',
				'David Lynch',
				'Studio Ghibli',
				'Beautiful failures',
				'Films that trust the audience',
				'Every episode of Tom and Jerry',
			],
			link: { href: '/films', label: 'Every film and show I have rated →' },
		},
		{
			name: 'Art',
			items: [
				'Northern Romantic painting',
				'Caspar David Friedrich',
				'Johan Christian Dahl',
				'John Atkinson Grimshaw',
				'Ivan Aivazovsky',
				'Moonlit landscapes',
				'Shakespearean tragedy',
				'Ballet',
				'Ruins reclaimed by nature',
				'Lonely figures in vast landscapes',
				'Storms at sea',
				'Melancholy without despair',
				'Old camera shots printed on Instax',
			],
		},
		{
			name: 'Music',
			items: [
				'Classical music of every era',
				'Tchaikovsky\'s Swan Lake',
				{
					label: 'Chopin\'s nocturnes',
					note: 'The one that plays on this site is Op. 72 No. 1.',
				},
				'Progressive metal',
				'Tool',
				'Opeth',
				'Jeff Buckley',
				'Kadhim Alsaher',
				'Britpop',
				'Garage rock revival',
				'Moody Americana',
				'The tuning note before the first note',
				'Old Disney-style scores',
			],
		},
		{
			name: 'Style',
			items: [
				'Oversized English trousers',
				'Crisp dress shirts',
				'Waistcoats',
				'Tall coats & capes',
				'Eyes Wide Shut masks',
				'Glasses with every outfit',
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
				'A proper black umbrella',
			],
		},
		{
			name: 'Space',
			items: [
				'Cozy, small, lived-in rooms',
				'Patterned wallpaper',
				'Warm yellow light',
				{
					label: 'Orange filament bulbs',
					note: 'Orange, not yellow. Below 3000 Kelvin.',
				},
				'Victorian & Greek detailing',
				'A real fireplace',
				'Archways instead of corners',
				'Dark wood interiors and doors',
				'Dark oak furniture',
				'Worn leather',
				'Indoor plants in every room',
				'Big plants in very big pots',
				{
					label: 'Cuttings rooting in a glass of water',
					note: 'I cut a stem, leave it in water until it roots, then plant it somewhere else.',
				},
				'A wardrobe filled with plants',
				'Empty bottles holding flowers',
				'Paintings on every wall',
				'Dead flowers in a vase',
				'Patterned carpets',
				'Persian carpets in many colours',
				'A big TV, sofa pulled close',
				'A big sofa you sink into',
				'A bed too big for the room',
				'Candles & lanterns',
				'Detailed spoons & utensils',
				'A coffee corner',
				'A shoe-shine corner',
				'Windows onto trees & train tracks',
				'Fallen leaves indoors',
				{
					label: 'Easter eggs scattered through the room',
					note: 'This site has a few too.',
				},
				'Hand-painted appliances: fridge, TV, the lot',
				'Floor-to-ceiling bookshelves',
				'Wall-sized mirrors in the dressing room and bathroom',
				'An oversized shower head',
				'Rain against windows',
				{
					label: 'A floor clean enough to sleep on',
					note: 'The vacuum runs five times a day.',
				},
			],
		},
		{
			name: 'Comfort',
			items: [
				'A dark purple cotton bathrobe',
				{
					label: 'Fifteen minutes by the heater doing nothing',
					note: 'After a shower, before work. Sometimes thirty.',
				},
				'Cotton-lined slippers built like shoes',
				{
					label: 'Pyjamas and slippers to the office',
					note: 'On the days I go in late.',
				},
			],
		},
		{
			name: 'Places',
			items: [
				'Libraries',
				'Bookshops with ladders',
				'Museum halls near closing',
				'Grand old cinemas',
				'Old train stations',
				'Hotel bars at midnight',
			],
		},
		{
			name: 'Food',
			items: [
				'Pancakes',
				{
					label: 'Slow-cooked quzi',
					note: 'Iraqi lamb, slow-cooked and served on spiced rice with nuts and raisins.',
				},
				{
					label: 'Yalanji',
					note: 'Vine leaves and vegetables stuffed with rice, the meatless kind of dolma.',
				},
				'Steak, rested',
				'Well-made risotto',
				'Penne arrabbiata',
				'Rocket (arugula) salad',
				'Sushi',
				'Jarred pickles',
				'Sunflower seeds, by the bag',
			],
		},
		{
			name: 'Drink',
			items: [
				'Almost any cocktail',
				'Sex on the Beach, ordered without irony',
				'Ice-cold Jägermeister',
				'Ice-cold beer',
				{
					label: 'Good red table wine',
					note: 'Red only.',
				},
				'Iced V60',
				'Peach iced tea',
				'Black tea',
			],
		},
		{
			name: 'Road',
			items: [
				'Porsche 911 Turbo S',
				'Aston Martin DB11',
				'Ferrari 488 Pista',
				'Manual gearboxes',
				'Empty highways at 3am with the windows down',
			],
		},
		{
			name: 'Travel',
			items: [
				'Rain & thunderstorms',
				'Solo trips to big cities',
				'Nocturnal urban exploration',
				'Secret European alleys',
				'Forest retreats off the map',
				'Deep mountain hikes where no one has been',
			],
		},
		{
			name: 'Body',
			items: [
				'Inhuman training volumes',
				'Endurance past the point of reason',
				'Strength as a default state',
				'Choosing discomfort',
				'Cold-water exposure',
				'Breathing exercises',
				'Stretching & mobility',
				'Balance',
				'Long walks as thinking',
				'Meditation',
				'Sleep, defended',
			],
		},
		{
			name: 'Craft',
			items: [
				'Total control over my stack',
				{
					label: 'Linux and nothing else',
					note: 'Arch with Hyprland now, Void with dwm before that.',
				},
				'Suckless philosophy',
				'Software you can leave alone',
				'Programs that start instantly',
				'Keeping things in plain text',
				'Go, Rust, Svelte',
				'Self-hosted everything',
				'IBM Plex across the whole system',
				'Sorting files and data like a maniac',
				{
					label: 'Spaced repetition',
					note: 'Review right before forgetting and the gap can stretch; most of what I still know lives on Anki cards.',
				},
			],
		},
	]

	const description = `A scattered, evolving catalogue of Khaled Waleed's obsessions: cinema, music, art, style, food, philosophy, and everything in between. Updated ${lastUpdated}.`

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': `${site.url}/likes#page`,
		'url': `${site.url}/likes`,
		'name': `${site.name}'s Likes`,
		description,
		'dateModified': lastUpdated,
		'isPartOf': { '@id': `${site.url}/#website` },
		'about': { '@id': `${site.url}/#person` },
		'breadcrumb': {
			'@type': 'BreadcrumbList',
			'itemListElement': [
				{ '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': site.url },
				{ '@type': 'ListItem', 'position': 2, 'name': 'Likes', 'item': `${site.url}/likes` },
			],
		},
	}
</script>

<Seo title='Likes' {description} />

<SchemaOrg {schema} />

<PageHeader room='likes' title='Likes'>
	{#snippet lede()}
		<p>In no particular order, and never finished. Things get added and removed as I change.</p>
	{/snippet}
</PageHeader>

<Container size='prose'>
	<div class='smallcaps mt-10'>
		updated <time datetime={lastUpdated}>{formatDate(lastUpdated)}</time>
	</div>

	<!-- Section index -->
	<nav aria-label='Sections' class='mt-8'>
		<ul class='smallcaps flex flex-wrap justify-center gap-x-6 gap-y-2'>
			{#each sections as s (s.name)}
				<li>
					<a href={`#${s.name.toLowerCase()}`} class='link-quiet'>{s.name}</a>
				</li>
			{/each}
		</ul>
	</nav>

	<Fleuron />

	<div>
		{#each sections as s (s.name)}
			<section
				id={s.name.toLowerCase()}
				class='grid scroll-mt-20 gap-x-8 gap-y-1.5 border-t border-[var(--rule)] py-[1.4rem] sm:grid-cols-[9.5rem_minmax(0,1fr)]'
				{@attach reveal}
			>
				<h2 class='self-start text-[1.6rem]! leading-[1.2]!'>{s.name}</h2>
				<div class='[&>ul]:mt-[0.2rem]'>
					<FlowList items={s.items} />
					{#if s.link}
						<p class='mt-5'>
							<a href={s.link.href} class='link'>{s.link.label}</a>
						</p>
					{/if}
				</div>
			</section>
		{/each}

		<p class='mt-16 leading-relaxed text-[var(--ink-muted)]'>R</p>
	</div>

	<Fleuron />

	<figure class='mx-auto max-w-md text-center' {@attach reveal}>
		<blockquote class='text-[var(--ink)] italic' style='font-size: 1.35rem; line-height: 1.5;'>
			I am worthy because I am curious, not because I am clever.
		</blockquote>
		<figcaption class='smallcaps mt-4'>a note to self</figcaption>
	</figure>
</Container>
