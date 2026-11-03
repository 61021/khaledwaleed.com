<script lang='ts'>
	import { goto } from '$app/navigation'
	import { Monogram, SchemaOrg, Seo, site } from '$lib'
	import { Barrel } from '$lib/craft/barrel'
	import { craftTiles, LINK_LABEL } from '$lib/craft/craft'
	import CraftViewer from '$lib/craft/CraftViewer.svelte'

	const tiles = craftTiles()

	// The clip on show in the viewer, by its place in the date order.
	let viewing = $state<number | null>(null)
	// Said aloud when the arrow keys turn a new piece to the front.
	let heard = $state('')
	// A focused line in the screen-reader list rings its tile on the drum.
	let ringing = $state(false)

	// Linked pieces go straight to their site, the rest open large.
	function open(source: number) {
		const tile = tiles[source]
		if (!tile.href)
			viewing = source
		else if (tile.href.startsWith('http'))
			window.open(tile.href, '_blank', 'noopener')
		else
			void goto(tile.href)
	}

	const barrel = new Barrel({
		onopen: open,
		onfront: (source) => {
			heard = `${tiles[source].title}, ${tiles[source].project}`
		},
	})

	function step(delta: number) {
		if (viewing !== null)
			viewing = (viewing + delta + tiles.length) % tiles.length
	}

	// Closing leaves the last clip seen in front of the drum.
	function close() {
		if (viewing !== null)
			barrel.show(viewing)
		viewing = null
	}

	const description = 'Interactions, animations and small pieces from the things I build, recorded from the real code.'

	// The house graph (JsonLd) stays in the museum, so the author is named here.
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': `${site.url}/showcase#page`,
		'url': `${site.url}/showcase`,
		'name': 'Showcase',
		description,
		'author': { '@type': 'Person', '@id': `${site.url}/#person`, 'name': site.name, 'url': site.url },
		'hasPart': tiles.map(t => ({
			'@type': t.media.video ? 'VideoObject' : 'ImageObject',
			'name': `${t.title}, ${t.project}`,
			'description': t.about,
			'thumbnailUrl': `${site.url}/craft-media/${t.media.poster}`,
			'contentUrl': `${site.url}/craft-media/${t.media.video ?? t.media.poster}`,
			'uploadDate': `${t.made}-01`,
			...(t.media.video ? { duration: `PT${Math.max(1, Math.round(t.media.seconds))}S` } : {}),
			'width': t.media.width,
			'height': t.media.height,
		})),
	}
</script>

<Seo
	title='Showcase'
	{description}
	image='/og-showcase.png'
	imageAlt='Six clips from the showcase: interactions and animations from my projects.'
	keywords={['showcase', 'craft', 'interaction design', 'motion', 'animation', 'design engineer', 'ui']}
	noindex
/>
<SchemaOrg {schema} />

<div class='showcase'>
	<a class='home' href='/' aria-label='Khaled Waleed, home'>
		<Monogram class='mark' />
	</a>
	<h1 class='sr-only'>Showcase</h1>

	<!-- The drum takes its keys itself (barrel.ts), so it holds focus. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		{@attach barrel.attach}
		class='barrel'
		role='application'
		aria-roledescription='drum'
		aria-label='Showcase. The arrow keys turn it, Enter opens the piece in front.'
		tabindex='0'
		data-ring={ringing || undefined}
	>
		<!-- What the drum deals onto its tiles; with scripting off, the page. -->
		<div class='sources' data-sources aria-hidden='true'>
			{#each tiles as tile (tile.id)}
				<div class='card'>
					<div class='well'>
						<img
							src='/craft-media/{tile.media.poster}'
							alt=''
							width={tile.media.width}
							height={tile.media.height}
							loading='lazy'
							decoding='async'
							draggable='false'
						/>
						{#if tile.media.video}
							<video data-src='/craft-media/{tile.media.video}' muted loop playsinline disablepictureinpicture preload='none'></video>
						{/if}
					</div>
					<div class='label'>
						<span class='name'>{tile.title}</span>
						<span class='project'>
							{tile.project}
							{#if tile.href}
								<!-- phosphor: arrow-up-right -->
								<svg width='12' height='12' viewBox='0 0 256 256'><path fill='currentColor' d='M200 64v104a8 8 0 0 1-16 0V83.31L69.66 197.66a8 8 0 0 1-11.32-11.32L172.69 72H88a8 8 0 0 1 0-16h104a8 8 0 0 1 8 8' /></svg>
							{/if}
						</span>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<ul class='sr-only' onfocusin={() => (ringing = true)} onfocusout={() => (ringing = false)}>
		{#each tiles as tile (tile.id)}
			<li>
				{#if tile.href}
					<a
						href={tile.href}
						target={tile.href.startsWith('http') ? '_blank' : undefined}
						rel={tile.href.startsWith('http') ? 'noopener' : undefined}
						onfocus={() => barrel.show(tile.order)}
					>
						{tile.title}, {tile.project}. {tile.about} {LINK_LABEL[tile.link ?? 'production']}
					</a>
				{:else}
					<button type='button' aria-haspopup='dialog' onclick={() => (viewing = tile.order)} onfocus={() => barrel.show(tile.order)}>
						{tile.title}, {tile.project}. {tile.about} View larger
					</button>
				{/if}
			</li>
		{/each}
	</ul>
	<p class='sr-only' aria-live='polite'>{heard}</p>

	<p class='hint' aria-hidden='true'>
		<span class='fine'>Drag or scroll to turn, click to open</span>
		<span class='coarse'>Drag to turn, tap to open</span>
	</p>

	<CraftViewer {tiles} index={viewing} onclose={close} onstep={step} />
</div>

<style>
	.showcase {
		--c-bg: #0a0a0a;
		--c-card: #121212;
		--c-edge: #232323;
		--c-ink: #ededed;
		--c-muted: #9a9a9a;
		--c-focus: #707070;
		position: fixed;
		inset: 0;
		overflow: hidden;
		background: var(--c-bg);
		color: var(--c-ink);
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, Roboto, 'Helvetica Neue', sans-serif;
		-webkit-font-smoothing: antialiased;
	}

	@media (prefers-color-scheme: light) {
		.showcase {
			--c-bg: #fafafa;
			--c-card: #fefefe;
			--c-edge: #e6e6e6;
			--c-ink: #171717;
			--c-muted: #6f6f6f;
			--c-focus: #8f8f8f;
		}
	}

	/* Corners are where the drum falls darkest. */
	.home {
		position: absolute;
		z-index: 2;
		top: clamp(12px, 3vmin, 32px);
		left: clamp(12px, 3vmin, 32px);
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		color: var(--c-muted);
		filter: drop-shadow(0 0 6px var(--c-bg));
		transition: color 150ms ease;
	}

	.home:hover {
		color: var(--c-ink);
	}

	.home:focus-visible {
		outline: 2px solid var(--c-focus);
		outline-offset: 2px;
		border-radius: 8px;
	}

	.home :global(.mark) {
		width: auto;
		height: 22px;
	}

	.barrel {
		position: absolute;
		inset: 0;
		touch-action: none;
		cursor: grab;
		outline: none;
		user-select: none;
		-webkit-user-select: none;
		-webkit-tap-highlight-color: transparent;
	}

	.barrel:global([data-dragging]),
	.barrel:global([data-dragging]) * {
		cursor: grabbing;
	}

	/* The drum's falloff is an image, rastered once: as CSS gradients
	   Firefox repainted it over the moving drum every frame. */
	.barrel::after {
		content: '';
		position: absolute;
		z-index: 1;
		inset: 0;
		pointer-events: none;
		background: url('/showcase/vignette.svg') 0 0 / 100% 100%;
	}

	.barrel :global(.barrel-stage) {
		position: absolute;
		inset: 0;
		perspective: 1300px;
		transform-style: preserve-3d;
		animation: arrive 300ms ease-out backwards;
	}

	.barrel :global(.barrel-ring) {
		position: absolute;
		top: 50%;
		left: 50%;
		transform-style: preserve-3d;
		will-change: transform;
	}

	.barrel :global(.barrel-tile) {
		position: absolute;
		top: 0;
		left: 0;
		width: var(--tile-width);
		height: var(--tile-height);
		backface-visibility: hidden;
	}

	.barrel :global(.barrel-tile[data-front]) {
		cursor: pointer;
	}

	/* With scripting on, the cards live only on the drum. */
	.sources {
		display: none;
	}

	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: 12px;
		/* Composited clips slip past a rounded overflow in GPU Firefox. */
		clip-path: inset(0 round 12px);
		background: var(--c-card);
	}

	.card::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		box-shadow: inset 0 0 0 1px var(--c-edge);
		pointer-events: none;
		transition: box-shadow 150ms ease;
	}

	@media (hover: hover) {
		.barrel :global(.barrel-tile:hover .card::after) {
			box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c-ink) 32%, var(--c-card));
		}
	}

	.barrel:focus-visible :global(.barrel-tile[data-front] .card::after),
	.barrel[data-ring] :global(.barrel-tile[data-front] .card::after) {
		box-shadow: inset 0 0 0 2px var(--c-focus);
	}

	.well {
		position: relative;
		flex: 1;
		min-height: 0;
	}

	.well img,
	.well video {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		pointer-events: none;
		-webkit-user-drag: none;
	}

	.well video {
		opacity: 0;
		transition: opacity 200ms ease;
	}

	.card:global([data-playing]) video {
		opacity: 1;
	}

	/* Clip layers can paint over the viewer's backdrop. */
	:global(html[data-viewing]) .well video {
		visibility: hidden;
	}

	.label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		height: 30px;
		padding: 0 10px;
		font-size: 0.6875rem;
		white-space: nowrap;
	}

	.name {
		overflow: hidden;
		font-weight: 500;
		text-overflow: ellipsis;
	}

	.project {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		color: var(--c-muted);
	}

	.hint {
		position: absolute;
		z-index: 2;
		left: 50%;
		bottom: max(24px, env(safe-area-inset-bottom));
		margin: 0;
		transform: translateX(-50%);
		font-size: 0.75rem;
		color: var(--c-muted);
		text-shadow: 0 0 8px var(--c-bg);
		white-space: nowrap;
		pointer-events: none;
		transition: opacity 400ms ease;
	}

	.barrel:global([data-touched]) ~ .hint {
		opacity: 0;
	}

	.coarse {
		display: none;
	}

	@media (hover: none) {
		.fine {
			display: none;
		}

		.coarse {
			display: inline;
		}
	}

	/* Without scripting there is no drum: the cards hang as a plain grid. */
	@media (scripting: none) {
		.showcase {
			position: static;
			min-height: 100dvh;
			padding: 120px 16px 32px;
			overflow: visible;
		}

		.barrel {
			position: static;
			cursor: auto;
		}

		.barrel::after,
		.hint {
			display: none;
		}

		.sources {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
			gap: 12px;
		}

		.card {
			aspect-ratio: 4 / 3;
		}
	}

	@keyframes arrive {
		from {
			opacity: 0;
		}
	}
</style>
