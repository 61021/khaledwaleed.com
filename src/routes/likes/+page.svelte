<script lang='ts'>
	import { Container, Fleuron, PageHeader, SchemaOrg, Seo, site } from '$lib'
	import { formatDate } from '$lib/posts'
	import { reveal } from '$lib/reveal'

	const lastUpdated = '2026-08-17'

	/* An item is plain text, or a term wearing a small note that shows
	   itself on hover and focus. */
	type Item = string | { label: string, note: string }

	const noteId = (label: string) => `note-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

	type Section = {
		name: string
		kicker: string
		items: Item[]
		link?: { href: string, label: string }
	}

	const sections: Section[] = [
		{
			name: 'Mind',
			kicker: 'Philosophy I keep returning to',
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
				{
					label: 'Spaced repetition',
					note: 'Review right before forgetting and the gap can stretch; most of what I still know lives on Anki cards.',
				},
			],
		},
		{
			name: 'Cinema',
			kicker: 'Directors I rewatch on principle',
			items: [
				'Stanley Kubrick',
				'David Lynch',
				'Studio Ghibli',
				'Beautiful failures',
				'Films that trust the audience',
			],
			link: { href: '/films', label: 'Every film and show I have rated →' },
		},
		{
			name: 'Art',
			kicker: 'Art I never get tired of',
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
				'Melancholy without despair',
			],
		},
		{
			name: 'Music',
			kicker: 'What I listen to',
			items: [
				'Classical, all of it',
				'Tchaikovsky, for Swan Lake',
				'Chopin\'s nocturnes',
				'Progressive metal',
				'Tool',
				'Opeth',
				'Jeff Buckley',
				'Kadhim Alsaher',
				'Britpop',
				'Garage rock revival',
				'Moody Americana',
				'The tuning note before the first note',
			],
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
				'A proper black umbrella',
			],
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
				'Hand-painted appliances: fridge, TV, the lot',
				'Floor-to-ceiling bookshelves',
				'Wall-sized mirrors in the dressing room',
				'A big mirrored bathroom',
				'An oversized shower head',
				'Rain against windows',
			],
		},
		{
			name: 'Places',
			kicker: 'Rooms I don\'t own',
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
				'Sunflower seeds, by the bag',
			],
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
				'Black tea',
			],
		},
		{
			name: 'Road',
			kicker: 'Fast cars, empty roads',
			items: [
				'Porsche 911 Turbo S',
				'Aston Martin DB11',
				'Ferrari 488 Pista',
				'Manual gearboxes',
				'Night drives, windows down',
				'Empty highways at 3am',
			],
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
				'Deep mountain hikes where no one has been',
			],
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
				'Sleep, defended',
			],
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
				'Sorting files and data like a maniac',
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
	<div class='rise-3 smallcaps mt-10'>
		updated <time datetime={lastUpdated}>{formatDate(lastUpdated)}</time>
	</div>

	<!-- Section index -->
	<nav aria-label='Sections' class='rise-3 mt-8'>
		<ul class='smallcaps flex flex-wrap justify-center gap-x-6 gap-y-2'>
			{#each sections as s (s.name)}
				<li>
					<a href={`#${s.name.toLowerCase()}`} class='link-quiet'>{s.name}</a>
				</li>
			{/each}
		</ul>
	</nav>

	<Fleuron />

	<div class='space-y-16'>
		{#each sections as s, i (s.name)}
			<section id={s.name.toLowerCase()} class='scroll-mt-20' {@attach reveal}>
				<h2
					class='text-[var(--ink)]'
					style='font-family: var(--font-display); font-size: clamp(2rem, 4vw + 0.5rem, 2.75rem); line-height: 1.05;'
				>
					{s.name}
				</h2>
				<!-- The kicker reads as a chapter subtitle, not a filing label. -->
				<p
					class='mt-2 [font-family:var(--font-display)] text-[1.05rem] text-[var(--ink-muted)] italic'
				>
					{s.kicker}
				</p>
				<!-- The separator leads each item (except the first) so it wraps with it
				     and never dangles at the end of a line. -->
				<ul class='mt-5 flex flex-wrap gap-x-3 gap-y-1 leading-relaxed text-[var(--ink-muted)]'>
					{#each s.items as it, j (typeof it === 'string' ? it : it.label)}
						<li>
							{#if j > 0}<span class='mr-3 text-[var(--rule)]' aria-hidden='true'>·</span>{/if}{#if typeof it === 'string'}{it}{:else}<button type='button' class='noted' aria-describedby={noteId(it.label)}>{it.label}<span class='note frame-gemmed' id={noteId(it.label)} role='tooltip'>{it.note}</span></button>{/if}
						</li>
					{/each}
				</ul>
				{#if s.link}
					<p class='mt-5'>
						<a href={s.link.href} class='link'>{s.link.label}</a>
					</p>
				{/if}
				{#if i < sections.length - 1}
					<div class='rule-fine mt-12'></div>
				{/if}
			</section>
		{/each}
	</div>

	<Fleuron />

	<figure class='mx-auto max-w-md text-center' {@attach reveal}>
		<blockquote class='text-[var(--ink)] italic' style='font-size: 1.35rem; line-height: 1.5;'>
			I am worthy because I am curious, not because I am clever.
		</blockquote>
		<figcaption class='smallcaps mt-4'>a note to self</figcaption>
	</figure>
</Container>

<style>
	/* A noted term: dotted underline as the tell, the note itself a
	   small gemmed label floating above on hover or focus. The trigger
	   is a real button so keyboards and screen readers reach it. */
	.noted {
		position: relative;
		padding: 0;
		font: inherit;
		color: inherit;
		background: none;
		cursor: help;
		border-bottom: 1px dotted color-mix(in oklab, var(--ink-dim) 70%, transparent);
	}

	.noted:focus-visible {
		outline: 1px dotted var(--accent);
		outline-offset: 3px;
	}

	.note {
		position: absolute;
		bottom: calc(100% + 12px);
		left: 50%;
		z-index: 10;
		width: max-content;
		max-width: 17rem;
		padding: 0.45rem 0.8rem;
		font-size: 0.82rem;
		line-height: 1.55;
		text-align: left;
		color: var(--ink-muted);
		background: var(--bg-soft);
		border: 1px solid var(--rule);
		box-shadow: 0 16px 34px -20px rgb(0 0 0 / 0.65);
		opacity: 0;
		transform: translate(-50%, 5px);
		pointer-events: none;
		transition:
			opacity 160ms var(--ease-out),
			transform 160ms var(--ease-out);
	}

	.noted:hover .note,
	.noted:focus .note {
		opacity: 1;
		transform: translate(-50%, 0);
	}
</style>
