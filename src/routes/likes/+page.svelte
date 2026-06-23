<script lang="ts">
	import { Seo, Container, PageHeader, Fleuron } from '$lib';

	type Section = {
		num: string;
		name: string;
		kicker: string;
		items?: string[];
	};

	const sections: Section[] = [
		{
			num: '01',
			name: 'Mind',
			kicker: 'Philosophy I keep returning to.',
			items: [
				`Why people suffer`,
				`Whether meaning is discovered or invented`,
				`The line between good and evil`,
				`What makes a life worthwhile`,
				`Why some relationships survive and others don't`,
				`How much of personality is choice`,
				`What curiosity itself is`
			]
		},
		{
			num: '02',
			name: 'Cinema',
			kicker: 'Directors I rewatch on principle',
			items: [
				'Stanley Kubrick',
				'David Lynch',
				'Studio Ghibli',
				'Beautiful failures',
				'Films that trust the audience'
			]
		},
		{
			num: '03',
			name: 'Art',
			kicker: 'Paintings & prose I live inside',
			items: [
				'Northern Romantic painting',
				'Caspar David Friedrich',
				'Johan Christian Dahl',
				'Moonlit landscapes',
				'Shakespearean tragedy',
				'Ballet, especially Swan Lake',
				'Ruins reclaimed by nature',
				'Lonely figures in vast landscapes',
				'Storms at sea',
				'Melancholy without despair'
			]
		},
		{
			num: '04',
			name: 'Music',
			kicker: 'Listening rooms in my head',
			items: [
				'Classical, all of it',
				'Progressive metal',
				'Britpop',
				'Garage rock revival',
				'Moody Americana'
			]
		},
		{
			num: '05',
			name: 'Style',
			kicker: 'A dark, tailored world',
			items: [
				'Oversized English trousers',
				'Crisp dress shirts',
				'Tall coats & capes',
				'Eyes Wide Shut masks',
				'Glasses, always',
				'Artistic rings shaped like animals',
				'Silver necklaces',
				'Silver lapel pins & cufflinks',
				'Victorian-patterned ties',
				'Fedora hats',
				'Textured leather belts',
				'Wooden-soled leather shoes',
				'Long boots',
				'Raincoats'
			]
		},
		{
			num: '06',
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
				'Libraries',
				'Old train stations',
				'Hotel bars at midnight',
				'Rain against windows'
			]
		},
		{
			num: '07',
			name: 'Food',
			kicker: 'Foods that are worth the effort.',
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
			num: '08',
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
			num: '09',
			name: 'Road',
			kicker: 'Engines worth the silence after',
			items: ['Porsche 911 Turbo S', 'Aston Martin DB11', 'Ferrari 488 Pista']
		},
		{
			num: '10',
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
			num: '11',
			name: 'Body',
			kicker: 'A Greek-god frame, and tolerance for pain',
			items: [
				'Inhuman training volumes',
				'Endurance past the point of reason',
				'Strength as a default state',
				'Sitting in discomfort, on purpose',
				'Breathing exercises',
				'Streching & mobility',
				'Balance',
				'Meditation'
			]
		},
		{
			num: '12',
			name: 'Craft',
			kicker: 'The software taste behind the day job',
			items: [
				'Total control over my stack',
				'Linux, always',
				'Suckless philosophy',
				'Go, Rust, Svelte',
				'Self-hosted everything',
				'Sorting files and data like a maniac'
			]
		}
	];
</script>

<Seo
	title="Likes"
	description="A scattered, evolving catalogue of Khaled Waleed's obsessions — cinema, music, art, style, food, philosophy, and everything in between."
/>

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
	<!-- Section index -->
	<nav aria-label="Sections" class="rise-3 mt-10">
		<ul class="flex flex-wrap justify-center gap-x-6 gap-y-2 smallcaps">
			{#each sections as s}
				<li>
					<a href={`#${s.name.toLowerCase()}`} class="link-quiet">{s.name}</a>
				</li>
			{/each}
		</ul>
	</nav>

	<Fleuron />

	<div class="rise space-y-16">
		{#each sections as s, i}
			<section id={s.name.toLowerCase()} class="scroll-mt-20">
				<div class="smallcaps">{s.num} · {s.kicker}</div>
				<h2
					class="mt-2 italic text-[var(--ink)]"
					style="font-family: var(--font-display); font-size: clamp(2rem, 4vw + 0.5rem, 2.75rem); line-height: 1.05;"
				>
					{s.name}.
				</h2>
				{#if s.items && s.items.length}
					<ul class="mt-5 flex flex-wrap gap-x-3 gap-y-1 leading-relaxed text-[var(--ink-muted)]">
						{#each s.items as it, j}
							<li>
								{it}{#if j < s.items.length - 1}<span class="ml-3 text-[var(--rule)]">·</span>{/if}
							</li>
						{/each}
					</ul>
				{/if}
				{#if s.name === 'Cinema'}
					<p class="mt-5">
						<a href="/films" class="link">Every film and show I have rated →</a>
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
