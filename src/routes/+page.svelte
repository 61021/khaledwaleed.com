<script lang='ts'>
	import { Button, Container, Fleuron, PageHeader, SchemaOrg, Seo, site } from '$lib'
	import sizes from '$lib/painting-sizes.json'
	import { paintings } from '$lib/site'

	// The entrance hall: one card per room, each behind its own painting,
	// hung salon-style. `span` is a card's width in sixths of the wall:
	// two wide frames, then three upright.
	const rooms = [
		{
			href: '/story',
			key: 'story',
			name: 'Story',
			span: 3,
			note: 'The full story, from a supermarket checkout at fourteen, and the CV.',
		},
		{
			href: '/projects',
			key: 'projects',
			name: 'Projects',
			span: 3,
			note: 'Seven government platforms, two products of my own, and the client work, with the numbers.',
		},
		{
			href: '/writing',
			key: 'writing',
			name: 'Writing',
			span: 2,
			note: 'Essays on people, ideas, art, and software.',
		},
		{
			href: '/likes',
			key: 'likes',
			name: 'Likes',
			span: 2,
			note: 'Cinema, music, art, style, food, and the rest of my obsessions.',
		},
		{
			href: '/films',
			key: 'films',
			name: 'Films',
			span: 2,
			note: 'Everything I’ve watched, scored 1 to 10.',
		},
	] as const

	// Small framed reproductions: honest srcsets from the size manifest,
	// like Painting.svelte, but sized for a card instead of a hero.
	const cardSrcset = (key: string, ext: 'avif' | 'webp') => {
		const entry = sizes[key as keyof typeof sizes]
		const src = `/paintings/${key}`
		return entry
			? entry.widths
				.map(w => `${w === entry.width ? src : `${src}-${w}`}.${ext} ${w}w`)
				.join(', ')
			: `${src}.${ext}`
	}
	// Wide frames take half the wall, upright ones a third; phones show a
	// fixed 6.75rem thumbnail.
	const cardSizes = (span: number) =>
		span === 3
			? '(min-width: 1088px) 470px, (min-width: 640px) 46vw, 108px'
			: '(min-width: 1088px) 300px, (min-width: 640px) 30vw, 108px'

	// The homepage is the canonical profile page for the person entity.
	// This tells Google that "/", not "/story", is the primary page for
	// the "Khaled Waleed" query.
	const profilePageSchema = {
		'@context': 'https://schema.org',
		'@type': 'ProfilePage',
		'@id': `${site.url}/#profilepage`,
		'url': site.url,
		'name': `${site.name}, ${site.role}`,
		'isPartOf': { '@id': `${site.url}/#website` },
		'dateModified': '2026-08-07',
		'primaryImageOfPage': `${site.url}/khaled-waleed.jpg`,
		'mainEntity': { '@id': `${site.url}/#person` },
	}
</script>

<Seo
	description='Khaled Waleed is a design engineer in Baghdad, Iraq, building production web apps in SvelteKit, Nuxt, and Go.'
	type='profile'
/>

<SchemaOrg schema={profilePageSchema} />

<PageHeader room='home' eyebrow={`${site.role} · ${site.location.city}`} title='Khaled Waleed'>
	{#snippet lede()}
		<p>
			I lead frontend at the biggest tech company in Iraq, create memorable digital experiences,
			and sometimes write my thoughts on paper.
		</p>
	{/snippet}
</PageHeader>

<Fleuron />

<!-- The rooms: an entrance hall of small framed paintings -->
<Container>
	<section aria-labelledby='rooms-heading'>
		<h2 id='rooms-heading' class='sr-only'>Pages</h2>

		<!-- The lots take their seats one by one after the hero pieces
		     (seats 0-3 belong to the PageHeader). -->
		<ul class='room-grid' role='list'>
			{#each rooms as r, i (r.key)}
				{@const p = paintings[r.key]}
				{@const entry = sizes[p.key as keyof typeof sizes]}
				<li class={['room-slot rise', r.span === 3 && 'wide']} style='--seq: {4 + i}'>
					<a href={r.href} class='room-card frame-engraved'>
						<span class='room-art'>
							<picture>
								<source
									type='image/avif'
									srcset={cardSrcset(p.key, 'avif')}
									sizes={cardSizes(r.span)}
								/>
								<source
									type='image/webp'
									srcset={cardSrcset(p.key, 'webp')}
									sizes={cardSizes(r.span)}
								/>
								<!-- Decorative here: the visible label names the room; the
								     painting is credited in full inside the room itself. -->
								<img
									src={`/paintings/${p.key}.webp`}
									alt=""
									width={entry?.width}
									height={entry?.height}
									style:object-position={p.focal ?? 'center'}
									loading='lazy'
									decoding='async'
								/>
							</picture>
						</span>
						<span class='room-label'>
							<span class='room-name'>{r.name}</span>
							<span class='room-note'>{r.note}</span>
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>
</Container>

<Fleuron />

<!-- Contact -->
<Container size='prose'>
	<section class='closing rise' style='--seq: {4 + rooms.length}'>
		<p class='closing-line'>I reply to everything.</p>
		<div class='closing-actions'>
			<Button href='/contact' size='lg' class='w-full sm:w-auto'>Talk to me</Button>
		</div>
	</section>
</Container>

<style>
	/* ---------- Room grid ---------- */
	/* Phones: a single-column list of horizontal cards (small framed
	   painting at left, label beside it). Two columns squeeze the notes
	   into one-word lines at 390px. */
	.room-grid {
		display: grid;
		grid-template-columns: 1fr;
		/* Roomier than the frames alone need: the corner-pieces stand
		   6px outside each rule and must not touch their neighbours'. */
		gap: 1.5rem;
	}

	/* ≥640px: a salon hang on a six-column wall (two wide frames, then
	   three upright). Five paintings, no straggler. */
	@media (min-width: 640px) {
		.room-grid {
			grid-template-columns: repeat(6, minmax(0, 1fr));
			gap: 2rem;
		}

		.room-slot {
			grid-column: span 2;
		}

		.room-slot.wide {
			grid-column: span 3;
		}
	}

	/* A ruled plate, corner-pieces standing outside it: thin rule around
	   canvas and label, scrolls nesting the corners from without. The
	   plate is solid, a mounted panel, not a window to the wallpaper. */
	.room-card {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
		height: 100%;
		padding: 0.5rem;
		background: var(--bg-soft);
		border: 1px solid var(--rule);
		transition: border-color var(--dur-quick) var(--ease-out);
	}

	.room-card:hover {
		border-color: color-mix(in oklab, var(--accent) 45%, var(--rule));
		/* The corner-pieces brighten with the rule they attend. */
		--frame-ink: color-mix(in oklab, var(--accent) 70%, var(--rule));
	}

	.room-art {
		display: block;
		position: relative;
		overflow: hidden;
		flex: none;
		width: 6.75rem;
		aspect-ratio: 1;
		background: var(--bg-soft);
		/* A gilt frame: gold fillet, dark mat, outer gilt moulding. */
		margin: 5px;
		box-shadow:
			0 0 0 1px color-mix(in oklab, var(--accent) 45%, transparent),
			0 0 0 4px color-mix(in oklab, var(--bg) 55%, var(--bg-soft)),
			0 0 0 5px color-mix(in oklab, var(--accent) 22%, transparent),
			0 14px 30px -16px rgb(0 0 0 / 0.55);
		transition: box-shadow var(--dur-quick) var(--ease-out);
	}

	.room-card:hover .room-art {
		box-shadow:
			0 0 0 1px color-mix(in oklab, var(--accent) 75%, transparent),
			0 0 0 4px color-mix(in oklab, var(--bg) 55%, var(--bg-soft)),
			0 0 0 5px color-mix(in oklab, var(--accent) 40%, transparent),
			0 18px 34px -16px rgb(0 0 0 / 0.65);
	}

	.room-art img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: brightness(0.9) saturate(0.9);
		transition:
			filter var(--dur-quick) var(--ease-out),
			transform var(--dur-quick) var(--ease-out);
	}

	.room-card:hover .room-art img {
		filter: brightness(1) saturate(1);
	}

	.room-label {
		display: block;
		min-width: 0;
	}

	.room-name {
		display: block;
		font-family: var(--font-display);
		font-size: 1.35rem;
		line-height: 1.2;
		color: var(--ink);
		transition: color var(--dur-quick) var(--ease-out);
	}

	.room-card:hover .room-name {
		color: var(--accent);
	}

	.room-note {
		display: block;
		margin-top: 0.3rem;
		font-size: 0.8rem;
		line-height: 1.55;
		color: var(--ink-muted);
		text-wrap: pretty;
	}

	/* Larger screens: upright cards, painting above the label. */
	@media (min-width: 640px) {
		.room-card {
			flex-direction: column;
			align-items: stretch;
			gap: 0;
			padding: 0.6rem 0.6rem 1rem;
		}

		.room-art {
			width: auto;
			aspect-ratio: 4 / 3;
		}

		/* Wide frames crop to an overmantel landscape, matching row heights. */
		.room-slot.wide .room-art {
			aspect-ratio: 2 / 1;
		}

		.room-label {
			padding: 0.75rem 0.35rem 0;
		}

		.room-name {
			font-size: 1.45rem;
		}

		.room-note {
			font-size: 0.85rem;
		}
	}

	/* ---------- Correspondence ---------- */
	.closing {
		text-align: center;
	}

	.closing-line {
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 2.5vw + 0.5rem, 1.85rem);
		line-height: 1.35;
		color: var(--ink-muted);
		text-wrap: balance;
	}

	.closing-actions {
		margin-top: 2rem;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	@media (min-width: 640px) {
		.closing-actions {
			flex-direction: row;
			justify-content: center;
			gap: 1rem;
		}
	}
</style>
