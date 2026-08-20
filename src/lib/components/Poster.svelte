<script lang='ts'>
	type Props = {
		/** TMDB poster_path, e.g. /abc.jpg; null renders a placeholder */
		posterPath: string | null
		alt: string
		/** rendered width in px; height follows the 2:3 poster ratio */
		width?: number
		/** render full-colour with a richer shadow (for the spotlight) */
		vivid?: boolean
		/** fill the parent's width (keeps the 2:3 ratio); `width` then only sizes the intrinsic attrs */
		fluid?: boolean
		/** fetch immediately: for posters in the first viewport, where lazy only delays them */
		eager?: boolean
	}

	const { posterPath, alt, width = 52, vivid = false, fluid = false, eager = false }: Props = $props()

	const TMDB = 'https://image.tmdb.org/t/p'
	const height = $derived(Math.round((width * 3) / 2))
	// Hotlinked from TMDB; request a small size and a 2× for retina.
	const src = $derived(posterPath ? `${TMDB}/${vivid ? 'w342' : 'w185'}${posterPath}` : null)
	const srcset = $derived(
		posterPath
			? vivid
				? `${TMDB}/w342${posterPath} 1x, ${TMDB}/w500${posterPath} 2x`
				: `${TMDB}/w185${posterPath} 1x, ${TMDB}/w342${posterPath} 2x`
			: null,
	)

	// A poster that 404s (or a blocked CDN) degrades to the same quiet
	// placeholder as a missing path, never a broken-image glyph.
	let failedPath = $state<string | null>(null)
	const failed = $derived(posterPath !== null && failedPath === posterPath)
</script>

{#if src && !failed}
	<img
		{src}
		{srcset}
		{alt}
		{width}
		{height}
		class={[vivid && 'vivid', fluid && 'fluid']}
		loading={eager ? 'eager' : 'lazy'}
		decoding='async'
		onerror={() => (failedPath = posterPath)}
	/>
{:else}
	<div
		class={['ghost', fluid && 'fluid']}
		style={fluid ? undefined : `width:${width}px;height:${height}px;`}
		aria-hidden='true'
	>
		✦
	</div>
{/if}

<style>
	img {
		display: block;
		flex: none;
		height: auto;
		object-fit: cover;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
		/* Neutral white edge, not a tinted one: a tinted outline picks up
		   the wall colour and reads as dirt on the poster's rim. */
		outline: 1px solid oklch(1 0 0 / 0.1);
		outline-offset: -1px;
		/* sit quietly in the Romantic palette until attended to */
		filter: saturate(0.82) brightness(0.92);
		transition:
			filter var(--dur-quick) var(--ease-out),
			transform var(--dur-quick) var(--ease-out),
			box-shadow var(--dur-quick) var(--ease-out);
	}

	/* spotlight: always full colour, richer shadow */
	img.vivid {
		filter: none;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
	}

	img.fluid {
		width: 100%;
		aspect-ratio: 2 / 3;
	}

	.ghost {
		flex: none;
		display: grid;
		place-items: center;
		background: var(--bg-soft);
		outline: 1px solid oklch(1 0 0 / 0.1);
		outline-offset: -1px;
		color: var(--ink-dim);
		font-family: var(--font-display);
	}

	.ghost.fluid {
		width: 100%;
		aspect-ratio: 2 / 3;
	}

	@media (prefers-reduced-motion: reduce) {
		img {
			transition: filter var(--dur-quick) var(--ease-out);
		}
	}
</style>
