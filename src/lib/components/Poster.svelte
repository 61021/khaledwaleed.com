<script lang="ts">
	import { posterPaths } from '$lib/posters';

	type Props = {
		/** IMDb const, e.g. tt0166924 */
		id: string;
		alt: string;
		/** rendered width in px; height follows the 2:3 poster ratio */
		width?: number;
		/** render full-colour with a richer shadow (for the spotlight) */
		vivid?: boolean;
	};

	let { id, alt, width = 52, vivid = false }: Props = $props();

	const TMDB = 'https://image.tmdb.org/t/p';
	const posterPath = $derived(posterPaths[id]);
	const height = $derived(Math.round((width * 3) / 2));
	// Hotlinked from TMDB; request a small size and a 2× for retina.
	const src = $derived(posterPath ? `${TMDB}/${vivid ? 'w342' : 'w185'}${posterPath}` : null);
	const srcset = $derived(
		posterPath
			? vivid
				? `${TMDB}/w342${posterPath} 1x, ${TMDB}/w500${posterPath} 2x`
				: `${TMDB}/w185${posterPath} 1x, ${TMDB}/w342${posterPath} 2x`
			: null
	);
</script>

{#if src}
	<img {src} {srcset} {alt} {width} {height} class:vivid loading="lazy" decoding="async" />
{:else}
	<div class="ghost" style={`width:${width}px;height:${height}px;`} aria-hidden="true">✦</div>
{/if}

<style>
	img {
		display: block;
		flex: none;
		height: auto;
		border-radius: 3px;
		object-fit: cover;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
		outline: 1px solid var(--rule);
		outline-offset: -1px;
		/* sit quietly in the Romantic palette until attended to */
		filter: saturate(0.82) brightness(0.92);
		transition:
			filter 500ms ease,
			transform 500ms ease,
			box-shadow 500ms ease;
	}

	/* lift to full colour when the row (a .group ancestor) is hovered */
	:global(.group):hover img {
		filter: none;
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
	}

	/* spotlight: always full colour, richer shadow */
	img.vivid {
		filter: none;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
	}

	.ghost {
		flex: none;
		display: grid;
		place-items: center;
		border-radius: 3px;
		background: var(--bg-soft);
		outline: 1px solid var(--rule);
		outline-offset: -1px;
		color: var(--ink-dim);
		font-family: var(--font-display);
		font-style: italic;
	}

	@media (prefers-reduced-motion: reduce) {
		img {
			transition: filter 500ms ease;
		}
		:global(.group):hover img {
			transform: none;
		}
	}
</style>
