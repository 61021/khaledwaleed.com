<script lang='ts'>
	import type { PosterRef } from '$lib/posters'
	import { posterSrc, posterSrcset } from '$lib/posters'

	type Props = {
		/** where the image lives (our PB file, or the /manage proxy); null renders a placeholder */
		poster: PosterRef | null
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

	const { poster, alt, width = 52, vivid = false, fluid = false, eager = false }: Props = $props()

	const height = $derived(Math.round((width * 3) / 2))
	// Served from our own PocketBase thumbs; request a small size and a 2× for retina.
	const src = $derived(poster ? posterSrc(poster, vivid ? 342 : 185) : null)
	const srcset = $derived(
		poster
			? vivid
				? posterSrcset(poster, 342, 500)
				: posterSrcset(poster, 185, 342)
			: null,
	)

	// A poster that 404s (or a wedged PocketBase) degrades to the same quiet
	// placeholder as a missing file, never a broken-image glyph.
	let failedSrc = $state<string | null>(null)
	const failed = $derived(src !== null && failedSrc === src)
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
		onerror={() => (failedSrc = src)}
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
