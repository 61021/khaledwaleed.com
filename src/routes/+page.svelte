<script lang="ts">
	import { Seo, Container, Button, PageHeader, Fleuron, SchemaOrg, site } from '$lib';
	import { paintings } from '$lib/site';
	import sizes from '$lib/painting-sizes.json';
	import { posts, formatDate } from '$lib/posts';

	const latest = posts.slice(0, 3);

	// The entrance hall: one card per room, each behind its own painting,
	// hung salon-style. `span` is a card's width in sixths of the wall:
	// two wide frames, three upright, two wide. Notes echo each room's lede.
	const rooms = [
		{
			href: '/about',
			key: 'about',
			name: 'About',
			span: 3,
			note: 'The story so far: the work, the toolkit, the CV.'
		},
		{
			href: '/projects',
			key: 'projects',
			name: 'Projects',
			span: 3,
			note: 'Products, client work, government platforms, with their numbers.'
		},
		{
			href: '/writing',
			key: 'writing',
			name: 'Writing',
			span: 2,
			note: 'Essays on art, philosophy, software, and whatever else won’t leave me alone.'
		},
		{
			href: '/likes',
			key: 'likes',
			name: 'Likes',
			span: 2,
			note: 'Cinema, music, art, style, food: the whole drawer.'
		},
		{
			href: '/library',
			key: 'library',
			name: 'Library',
			span: 2,
			note: 'Books on the desk, in the queue, returned to.'
		},
		{
			href: '/films',
			key: 'films',
			name: 'Films',
			span: 3,
			note: 'Everything watched, scored one to ten.'
		},
		{
			href: '/music',
			key: 'music',
			name: 'Music',
			span: 3,
			note: 'What has been playing, live from Spotify.'
		}
	] as const;

	// Small framed reproductions: honest srcsets from the size manifest,
	// like Painting.svelte, but sized for a card instead of a hero.
	const cardSrcset = (key: string, ext: 'avif' | 'webp') => {
		const entry = sizes[key as keyof typeof sizes];
		const src = `/paintings/${key}`;
		return entry
			? entry.widths
					.map((w) => `${w === entry.width ? src : `${src}-${w}`}.${ext} ${w}w`)
					.join(', ')
			: `${src}.${ext}`;
	};
	// Wide frames take half the wall, upright ones a third; phones show a
	// fixed 6.75rem thumbnail.
	const cardSizes = (span: number) =>
		span === 3
			? '(min-width: 1088px) 470px, (min-width: 640px) 46vw, 108px'
			: '(min-width: 1088px) 300px, (min-width: 640px) 30vw, 108px';

	// The homepage is the canonical profile page for the person entity.
	// This tells Google that "/" — not "/about" — is the primary page for
	// the "Khaled Waleed" query.
	const profilePageSchema = {
		'@context': 'https://schema.org',
		'@type': 'ProfilePage',
		'@id': `${site.url}/#profilepage`,
		url: site.url,
		name: `${site.name}, ${site.role}`,
		isPartOf: { '@id': `${site.url}/#website` },
		dateModified: '2026-08-04',
		primaryImageOfPage: `${site.url}${site.avatar}`,
		mainEntity: { '@id': `${site.url}/#person` }
	};
</script>

<Seo
	description="Khaled Waleed is a lead design engineer in Baghdad, Iraq, building production web apps in SvelteKit, Nuxt, and Go."
	type="profile"
/>

<SchemaOrg schema={profilePageSchema} />

<PageHeader
	room="home"
	grand
	eyebrow={`${site.role} ·\u00A0${site.location.city},\u00A0${site.location.country}`}
	title="Khaled Waleed"
>
	{#snippet lede()}
		<p>
			I build software, write occasionally, and spend an unreasonable amount of time thinking about
			things.
		</p>
	{/snippet}
</PageHeader>

<!-- Welcome note -->
<Container size="prose">
	<section class="welcome rise-3">
		<p class="dropcap">
			My corner of the web: part portfolio, part commonplace book. Each room keeps one painting and
			one obsession.
		</p>
		<p class="welcome-aside">
			If you are here about work, start with <a href="/about" class="link">About</a>: seven
			government platforms, four million users, and one studio of my own. If you are just looking
			around, the door marked <a href="/contact" class="link">Contact</a> opens quickly.
		</p>
	</section>
</Container>

<Fleuron />

<!-- The rooms: an entrance hall of small framed paintings -->
<Container>
	<section aria-labelledby="rooms-heading">
		<header class="section-head rise">
			<p class="smallcaps orn">the floor plan</p>
			<h2 id="rooms-heading" class="italic">Wander the rooms</h2>
		</header>

		<ul class="room-grid rise-2" role="list">
			{#each rooms as r (r.key)}
				{@const p = paintings[r.key]}
				{@const entry = sizes[r.key as keyof typeof sizes]}
				<li class="room-slot" class:wide={r.span === 3}>
					<a href={r.href} class="room-card">
						<span class="room-art lamp-lit">
							<picture>
								<source
									type="image/avif"
									srcset={cardSrcset(r.key, 'avif')}
									sizes={cardSizes(r.span)}
								/>
								<source
									type="image/webp"
									srcset={cardSrcset(r.key, 'webp')}
									sizes={cardSizes(r.span)}
								/>
								<!-- Decorative here: the visible label names the room; the
								     painting is credited in full inside the room itself. -->
								<img
									src={`/paintings/${r.key}.webp`}
									alt=""
									width={entry?.width}
									height={entry?.height}
									style:object-position={p.focal ?? 'center'}
									loading="lazy"
									decoding="async"
								/>
							</picture>
						</span>
						<span class="room-label">
							<span class="room-name">{r.name}</span>
							<span class="room-note">{r.note}</span>
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>
</Container>

<Fleuron />

<!-- Latest essays, catalogue style -->
<Container size="prose">
	<section aria-labelledby="desk-heading">
		<header class="section-head">
			<h2 id="desk-heading" class="italic">Latest essays</h2>
		</header>

		{#if latest.length}
			<ol class="desk-list" role="list">
				{#each latest as post (post.slug)}
					<li>
						<a href={`/writing/${post.slug}`} class="desk-row">
							<span class="desk-line">
								<span class="desk-title">{post.title}</span>
								<span class="leader" aria-hidden="true"></span>
								<time class="desk-date smallcaps" datetime={post.date}>{formatDate(post.date)}</time
								>
							</span>
							<span class="desk-desc">{post.description}</span>
						</a>
					</li>
				{/each}
			</ol>
		{/if}

		<p class="desk-more">
			<a href="/writing" class="smallcaps link-quiet">all essays →</a>
			<span class="desk-sep" aria-hidden="true">·</span>
			<a href="/rss.xml" class="smallcaps link-quiet">rss</a>
		</p>
	</section>
</Container>

<Fleuron />

<!-- Correspondence -->
<Container size="prose">
	<section class="closing">
		<p class="closing-line">Every letter gets a reply.</p>
		<div class="closing-actions">
			<Button href="/contact" size="lg" class="w-full sm:w-auto">Write to me</Button>
		</div>
	</section>
</Container>

<style>
	/* ---------- Welcome ---------- */
	.welcome {
		margin-top: 1.25rem;
	}

	.welcome p {
		font-size: 1.08rem;
		line-height: 1.75;
	}

	.welcome-aside {
		margin-top: 1.1rem;
		color: var(--ink-muted);
	}

	/* ---------- Section headers ---------- */
	.section-head {
		text-align: center;
		margin-bottom: 2rem;
	}

	.section-head h2 {
		margin-top: 0.4rem;
	}

	/* ---------- Room grid ---------- */
	/* Phones: a single-column list of horizontal cards — small framed
	   painting at left, label beside it. Two columns squeeze the notes
	   into one-word lines at 390px. */
	.room-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.8rem;
	}

	/* ≥640px: a salon hang on a six-column wall — two wide frames, three
	   upright, two wide. Seven paintings, no straggler. */
	@media (min-width: 640px) {
		.room-grid {
			grid-template-columns: repeat(6, minmax(0, 1fr));
			gap: 1.4rem;
		}

		.room-slot {
			grid-column: span 2;
		}

		.room-slot.wide {
			grid-column: span 3;
		}
	}

	/* A matted frame: thin rule, soft mount, label beside/beneath the canvas. */
	.room-card {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
		height: 100%;
		padding: 0.5rem;
		border: 1px solid var(--rule);
		background: color-mix(in oklab, var(--bg-soft) 65%, transparent);
		transition:
			border-color 400ms ease,
			background-color 400ms ease,
			transform 400ms ease;
	}

	.room-card:hover {
		border-color: color-mix(in oklab, var(--accent) 45%, var(--rule));
		background: var(--bg-soft);
		transform: translateY(-2px);
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
		transition: box-shadow 400ms ease;
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
		filter: brightness(0.9) saturate(0.98);
		transform: scale(1.02);
		transition:
			filter 700ms ease,
			transform 900ms cubic-bezier(0.2, 0.7, 0.2, 1);
	}

	.room-card:hover .room-art img {
		filter: brightness(1.02) saturate(1);
		transform: scale(1.06);
	}

	.room-label {
		display: block;
		min-width: 0;
	}

	.room-name {
		display: block;
		font-family: var(--font-display);
		font-style: italic;
		font-size: 1.35rem;
		line-height: 1.2;
		color: var(--ink);
		transition: color 300ms ease;
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

	/* ---------- Writing desk ---------- */
	.desk-list {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.desk-row {
		display: block;
	}

	/* Phones: date above title, no leader — a squeezed three-part row
	   wraps titles one word per line. ≥640px: the catalogue line. */
	.desk-line {
		display: flex;
		flex-direction: column-reverse;
		align-items: flex-start;
		gap: 0.35rem;
	}

	.desk-line .leader {
		display: none;
	}

	@media (min-width: 640px) {
		.desk-line {
			flex-direction: row;
			align-items: baseline;
			gap: 0.65rem;
		}

		.desk-line .leader {
			display: block;
		}
	}

	.desk-title {
		font-family: var(--font-display);
		font-style: italic;
		font-size: clamp(1.3rem, 2vw + 0.6rem, 1.65rem);
		line-height: 1.25;
		color: var(--ink);
		transition: color 300ms ease;
	}

	/* A small gilt diamond marks each entry, like a catalogue pilcrow. */
	.desk-title::before {
		content: '';
		display: inline-block;
		width: 0.28rem;
		height: 0.28rem;
		margin-right: 0.6rem;
		vertical-align: 0.18em;
		background: color-mix(in oklab, var(--accent) 45%, transparent);
		transform: rotate(45deg);
		transition: background-color 300ms ease;
	}

	.desk-row:hover .desk-title::before {
		background: var(--accent);
	}

	.desk-row:hover .desk-title {
		color: var(--accent);
	}

	.desk-date {
		white-space: nowrap;
		color: var(--ink-dim);
	}

	.desk-desc {
		display: block;
		margin-top: 0.45rem;
		font-size: 0.95rem;
		line-height: 1.65;
		color: var(--ink-muted);
		max-width: 36rem;
		text-wrap: pretty;
	}

	.desk-more {
		margin-top: 2.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.7rem;
	}

	.desk-sep {
		color: var(--ink-dim);
	}

	/* ---------- Correspondence ---------- */
	.closing {
		text-align: center;
	}

	.closing-line {
		font-family: var(--font-display);
		font-style: italic;
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
