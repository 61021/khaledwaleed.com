<script lang='ts'>
	import { Monogram, SchemaOrg, Seo, site } from '$lib'
	import { craftTiles, deal } from '$lib/craft/craft'
	import CraftCard from '$lib/craft/CraftCard.svelte'
	import CraftViewer from '$lib/craft/CraftViewer.svelte'

	const tiles = craftTiles()
	// Both layouts ship in the markup and CSS picks one, so the wall never
	// reflows after hydration; clips only load inside the one on show.
	const three = deal(tiles, 3)
	const two = deal(tiles, 2)

	// The clip on show in the viewer, by its place on the wall.
	let viewing = $state<number | null>(null)

	function step(delta: number) {
		if (viewing !== null)
			viewing = (viewing + delta + tiles.length) % tiles.length
	}

	const description = 'Interactions, animations and small pieces from the things I build, recorded from the real code.'

	// The house graph (JsonLd) stays in the museum, so the author is named here.
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': `${site.url}/craft#page`,
		'url': `${site.url}/craft`,
		'name': 'Craft',
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
	title='Craft'
	{description}
	image='/og-craft.png'
	imageAlt='Six clips from the craft wall: interactions and animations from my projects.'
	keywords={['craft', 'interaction design', 'motion', 'animation', 'design engineer', 'ui']}
	noindex
/>
<SchemaOrg {schema} />

<div class='craft'>
	<a class='home' href='/' aria-label='Khaled Waleed, home'>
		<Monogram class='mark' />
	</a>
	<h1 class='sr-only'>Craft</h1>

	<div class='wall three'>
		{#each three as column, c (c)}
			<div class='column'>
				{#each column as tile (tile.id)}
					<CraftCard {tile} eager={tile.order < 3} onopen={() => (viewing = tile.order)} />
				{/each}
			</div>
		{/each}
	</div>

	<div class='wall two'>
		{#each two as column, c (c)}
			<div class='column'>
				{#each column as tile (tile.id)}
					<CraftCard {tile} onopen={() => (viewing = tile.order)} />
				{/each}
			</div>
		{/each}
	</div>

	<CraftViewer {tiles} index={viewing} onclose={() => (viewing = null)} onstep={step} />
</div>

<style>
	.craft {
		--gap: 8px;
		--c-bg: #0a0a0a;
		--c-card: #121212;
		--c-edge: #232323;
		--c-ink: #ededed;
		--c-muted: #9a9a9a;
		--c-focus: #707070;
		min-height: 100dvh;
		padding: 0 var(--gap) 4px;
		background: var(--c-bg);
		color: var(--c-ink);
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, Roboto, 'Helvetica Neue', sans-serif;
		-webkit-font-smoothing: antialiased;
	}

	@media (prefers-color-scheme: light) {
		.craft {
			--c-bg: #fafafa;
			--c-card: #fefefe;
			--c-edge: #e6e6e6;
			--c-ink: #171717;
			--c-muted: #6f6f6f;
			--c-focus: #8f8f8f;
		}
	}

	/* Above the wall, whose fade-in lifts it onto its own layer over
	   the mark. */
	.home {
		position: absolute;
		z-index: 1;
		top: 56px;
		left: 50%;
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		transform: translateX(-50%);
		color: var(--c-muted);
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

	.wall {
		gap: var(--gap);
		padding-top: 146px;
		animation: arrive 250ms ease 200ms both;
	}

	.column {
		flex: 1 1 0;
		min-width: 0;
	}

	.three {
		display: flex;
	}

	.two {
		display: none;
	}

	@media (max-width: 960px) {
		.three {
			display: none;
		}

		.two {
			display: flex;
		}
	}

	/* One column: the three-column deal flattens and each tile takes its
	   place in the date order again. */
	@media (max-width: 480px) {
		.two {
			display: none;
		}

		.three {
			display: flex;
			flex-direction: column;
			gap: 0;
		}

		.three .column {
			display: contents;
		}

		.three :global(.tile) {
			order: var(--order);
		}
	}

	@keyframes arrive {
		from {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wall {
			animation: none;
		}
	}
</style>
