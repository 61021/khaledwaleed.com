<script lang="ts">
	import { Seo, Container, Eyebrow } from '$lib';

	type Section = {
		num: string;
		name: string;
		kicker: string;
		intro: string;
		spotlights?: { title: string; note?: string }[];
		tags?: string[];
	};

	const sections: Section[] = [
		{
			num: '01',
			name: 'Mind',
			kicker: 'Philosophy & quiet obsessions',
			intro:
				'I keep returning to writers who refuse to make existence comfortable — the absurdists, the postmodernists, the ones who treat meaning like a question rather than a possession.',
			spotlights: [
				{ title: 'Absurdist philosophy', note: 'Camus, the Myth of Sisyphus crowd' },
				{ title: 'Postmodern anthologies', note: 'essays that dissect modern existence' },
				{ title: 'Nihilism & meaning', note: 'symposiums, not slogans' }
			]
		},
		{
			num: '02',
			name: 'Cinema',
			kicker: 'Directors I rewatch on principle',
			intro:
				'Films where the frame does half the talking. I want texture, silence, dread, and a slow camera. The medium is wasted on plot.',
			spotlights: [
				{ title: 'Stanley Kubrick', note: '2001 · A Clockwork Orange' },
				{ title: 'David Lynch', note: 'Mulholland Drive · Twin Peaks · the music too' },
				{ title: 'Alfred Hitchcock', note: 'Vertigo · Rear Window' },
				{ title: 'Studio Ghibli', note: 'Spirited Away · Princess Mononoke' },
				{ title: 'Blade Runner 2049', note: 'futuristic noir as religion' },
				{ title: 'Antonioni', note: 'alienation, framed' },
				{ title: 'Fellini', note: 'Italian dreams' }
			]
		},
		{
			num: '03',
			name: 'Lens',
			kicker: 'Photography I stop scrolling for',
			intro:
				'Anything with chiaroscuro, weight, and a sense that no one is watching. Portraits that catch a thought, places that feel paused.',
			tags: [
				'Close-up portraiture',
				'Chiaroscuro landscapes',
				'Liminal spaces',
				'Urban decay (HDR)',
				'Abandoned-space street scenes'
			]
		},
		{
			num: '04',
			name: 'Sound',
			kicker: 'Listening rooms in my head',
			intro:
				'Music that holds a room — modular synths breathing, a horn section thinking out loud, a piano alone in a hall.',
			spotlights: [
				{ title: 'Ambient electronic', note: 'live modular synth sets' },
				{ title: 'Neo-bop jazz', note: 'horn arrangements, sophisticated and unhurried' },
				{ title: 'Piano & violin chamber', note: 'intimate, solo, no rush' },
				{ title: 'Improv ensembles', note: 'jazz × classical counterpoint' },
				{ title: 'Melancholy ambient', note: 'for staring out of trains' }
			]
		},
		{
			num: '05',
			name: 'Style',
			kicker: 'A dark, tailored world',
			intro:
				'A small, repeating wardrobe in dark grey, dark leather, and silk. The goal is to look like you took it seriously without looking like you tried.',
			spotlights: [
				{ title: 'Savile Row tailoring', note: 'bespoke or nothing' },
				{ title: 'Linen pants & dress shirts', note: 'modern cuts' },
				{ title: 'Hermès silk scarves' },
				{ title: 'Midnight velvet couture' }
			],
			tags: [
				'Pixel-perfect suits',
				'Fedora hats',
				'Big black umbrellas',
				'Dark grey, always',
				'Silk — clothes, sheets, everything',
				'Soft dark leather'
			]
		},
		{
			num: '06',
			name: 'Space',
			kicker: 'How a room should feel',
			intro:
				'Clean lines, low light, big glass, real trees inside. Scandinavian restraint dropped into an industrial shell, fully automated, quietly alive.',
			spotlights: [
				{ title: 'Scandinavian × industrial loft' },
				{ title: 'Floor-to-ceiling glass walls', note: 'with integrated trees' },
				{ title: 'Full home automation', note: 'state-of-the-art, invisible' },
				{ title: 'Living green walls' }
			],
			tags: ['Minimalist decor', 'Ambient lighting', 'Eco-friendly systems', 'Curated home projects']
		},
		{
			num: '07',
			name: 'Plate',
			kicker: 'What I order without reading the menu',
			intro:
				'Iraqi food at home, Michelin tasting menus when I travel, a glass of something amber afterwards.',
			spotlights: [
				{ title: 'Quzi', note: 'the answer to most questions' },
				{ title: 'Wrapped grape leaves (dolma)' },
				{ title: 'Steak — properly rested' },
				{ title: 'Risotto, done right' },
				{ title: 'Truffle-infused foie gras' },
				{ title: 'Decanter-aged single-malt scotch' }
			],
			tags: [
				'Michelin tasting menus',
				'Molecular fusion',
				'Seasonal chef menus',
				'Caesar salad',
				'Broccoli (yes, broccoli)',
				'Brandy whiskey',
				'Jägermeister'
			]
		},
		{
			num: '08',
			name: 'Road',
			kicker: 'Engines worth the silence after',
			intro:
				'Sports cars with restraint, luxury cars with engineering. And the cabin at full-blast AC, regardless of season.',
			spotlights: [
				{ title: 'Porsche 911 Turbo S' },
				{ title: 'Aston Martin DB11' },
				{ title: 'Ferrari 488 Pista' },
				{ title: 'Toyota Crown', note: 'the dark horse' }
			],
			tags: ['Sport cars', 'Luxury cars', 'AC at full blast', 'Cabin as cathedral']
		},
		{
			num: '09',
			name: 'Wild',
			kicker: 'Travel, weather, slight danger',
			intro:
				'Thunderstorms, foreign alleys at 2am, forests with no service. I like trips that are not quite safe and not quite planned.',
			spotlights: [
				{ title: 'Rain & thunderstorms', note: 'the louder the better' },
				{ title: 'Solo travel in big cities' },
				{ title: 'Nocturnal urban exploration' },
				{ title: 'Secret European alleys' },
				{ title: 'Arboreal retreats', note: 'hidden, off-map' }
			],
			tags: ['Liminal-space travel', 'Permaculture gardens', 'Arboreal biodiversity']
		},
		{
			num: '10',
			name: 'Body',
			kicker: 'Discipline as a form of love',
			intro:
				'Shredded, mobile, calm. High-intensity work for the body, slow work for the nervous system. Both required.',
			tags: [
				'Olympian-grade functional training',
				'Strength · agility · endurance',
				'Yoga',
				'Meditation',
				'Recovery protocols'
			]
		},
		{
			num: '11',
			name: 'Craft',
			kicker: 'The software taste behind the day job',
			intro:
				'Open, owned, and obsessive about the details. Pixel-perfect interfaces sitting on top of small, fast services in Rust and Go.',
			spotlights: [
				{ title: 'Open source', note: 'as default' },
				{ title: 'Self-hosted everything' },
				{ title: 'Rust & Go microservices', note: 'small, sharp, boring' },
				{ title: 'Scandinavian-minimal UI frameworks' }
			],
			tags: ['Pixel-perfect design', 'Responsive, user-centric', 'Simplicity as a feature']
		}
	];
</script>

<Seo
	title="Likes"
	description="An evolving, opinionated catalogue of things Khaled Waleed loves — cinema, music, style, food, travel, design, and everything in between."
/>

<Container>
	<!-- ============ Hero ============ -->
	<section class="animate-fade-up max-w-3xl space-y-6">
		<Eyebrow label="~/likes" />
		<h1 class="text-4xl font-bold tracking-tight text-[var(--fg)] sm:text-5xl lg:text-6xl">
			A short catalogue of <em class="font-bold not-italic text-[var(--brand)]">obsessions</em>.
		</h1>
		<p class="text-lg leading-relaxed text-[var(--fg-muted)]">
			Not a list — a map. The films I rewatch, the music I think in, the cars I'd own if I were
			unreasonable, the food I'd order anywhere. Updated whenever something earns its place.
		</p>
	</section>

	<!-- ============ Section index ============ -->
	<nav aria-label="Sections" class="mt-14">
		<ul class="flex flex-wrap gap-x-5 gap-y-2 border-y border-[var(--border)] py-4">
			{#each sections as s}
				<li>
					<a
						href="#{s.name.toLowerCase()}"
						class="group flex items-baseline gap-1.5 text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--brand)]"
					>
						<span class="font-mono text-[10px] text-[var(--fg-dim)] group-hover:text-[var(--brand)]"
							>{s.num}</span
						>
						<span>{s.name}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<!-- ============ Sections ============ -->
	<div class="mt-20 space-y-24 sm:space-y-28">
		{#each sections as s, i}
			<section id={s.name.toLowerCase()} class="scroll-mt-24">
				<!-- header row -->
				<div class="grid gap-8 lg:grid-cols-12">
					<div class="space-y-5 lg:col-span-5">
						<div class="flex items-baseline gap-4">
							<span class="font-mono text-sm text-[var(--brand)]">{s.num}</span>
							<span class="h-px flex-1 bg-[var(--border)]"></span>
							<span class="font-mono text-[11px] uppercase tracking-widest text-[var(--fg-dim)]"
								>{s.kicker}</span
							>
						</div>
						<h2 class="text-4xl font-bold tracking-tight text-[var(--fg)] sm:text-5xl">
							{s.name}.
						</h2>
						<p class="text-[var(--fg-muted)]">{s.intro}</p>
					</div>

					<!-- content -->
					<div class="space-y-5 lg:col-span-7">
						{#if s.spotlights}
							<div class="grid gap-3 sm:grid-cols-2">
								{#each s.spotlights as item, j}
									<div
										class="surface surface-hover group relative overflow-hidden p-5"
										style="animation-delay: {j * 40}ms"
									>
										<div class="flex items-start gap-3">
											<span
												class="mt-0.5 font-mono text-[10px] text-[var(--fg-dim)] transition-colors group-hover:text-[var(--brand)]"
											>
												{String(j + 1).padStart(2, '0')}
											</span>
											<div class="min-w-0">
												<div class="font-medium text-[var(--fg)]">{item.title}</div>
												{#if item.note}
													<div class="mt-1 text-sm text-[var(--fg-muted)]">{item.note}</div>
												{/if}
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}

						{#if s.tags}
							<div class="flex flex-wrap gap-1.5">
								{#each s.tags as t}
									<span
										class="rounded-full border border-[var(--border)] bg-white/[0.02] px-3 py-1 text-xs text-[var(--fg-muted)] transition-colors hover:border-[var(--brand)]/40 hover:text-[var(--fg)]"
									>
										{t}
									</span>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</section>
		{/each}
	</div>

	<!-- ============ Sign-off ============ -->
	<section class="mt-28 border-t border-[var(--border)] pt-12">
		<figure class="mx-auto max-w-2xl text-center">
			<blockquote class="text-xl leading-relaxed text-[var(--fg)] sm:text-2xl">
				<span class="text-[var(--brand)]">“</span>I'm worthy because I'm curious, not because I'm smart.<span
					class="text-[var(--brand)]">”</span
				>
			</blockquote>
			<figcaption class="mt-4 font-mono text-xs uppercase tracking-widest text-[var(--fg-dim)]">
				— a note to self
			</figcaption>
		</figure>
	</section>
</Container>
