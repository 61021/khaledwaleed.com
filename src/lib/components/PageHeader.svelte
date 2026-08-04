<script lang="ts">
	import type { Snippet } from 'svelte';
	import Painting from './Painting.svelte';
	import { paintings } from '$lib/site';

	type Props = {
		room: keyof typeof paintings | string;
		eyebrow?: string;
		title: string;
		lede?: Snippet;
		children?: Snippet;
	};

	let { room, eyebrow, title, lede, children }: Props = $props();

	const p = $derived(paintings[room as keyof typeof paintings]);
</script>

<header class="page-header">
	<div class="hero-wrap">
		<div class="hero" style:--focal={p?.focal ?? 'center'}>
			<!-- Named so the small framed reproductions on the home page can
			     morph into this hero during view transitions. -->
			<div class="hero-art" style:view-transition-name={`painting-${p?.key ?? room}`}>
				<Painting {room} priority bare />
			</div>
			<div class="hero-veil" aria-hidden="true"></div>

			<div class="hero-content px-6">
				{#if eyebrow}
					<div class="smallcaps hero-eyebrow rise-2">{eyebrow}</div>
				{/if}
				<h1 class="rise-2 page-title">{title}</h1>
				{#if lede}
					<div class="lede rise-3">
						{@render lede()}
					</div>
				{/if}
			</div>
		</div>

		{#if p}
			<p class="hero-plate plate rise-3">
				<em>{p.title}</em><span class="plate-item"><span class="plate-sep">·</span>{p.artist}</span
				><span class="plate-item"><span class="plate-sep">·</span>{p.year}</span><span
					class="plate-museum plate-item"
					><span class="plate-sep">·</span><a
						href={p.museumUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="link-quiet">{p.museum}</a
					></span
				>
			</p>
		{/if}
	</div>
</header>

{#if children}
	<div class="rise-3">{@render children()}</div>
{/if}

<style>
	.page-header {
		padding-bottom: 2rem;
	}

	.hero-wrap {
		position: relative;
	}

	/* Mobile-first: a shorter banner with the title card resting on the
	   veiled bottom edge, left-aligned like a frontispiece caption. */
	.hero {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		min-height: clamp(340px, 52svh, 560px);
		width: 100%;
		overflow: hidden;
		isolation: isolate;
	}

	.hero-art {
		position: absolute;
		inset: 0;
		z-index: 0;
	}

	.hero :global(.frontispiece) {
		position: absolute;
		inset: 0;
		z-index: 0;
	}

	.hero :global(.frontispiece picture),
	.hero :global(.frontispiece img) {
		height: 100%;
		width: 100%;
		object-fit: cover;
		object-position: var(--focal, center);
	}

	/* The hero veil handles all fading; drop the frontispiece's own gradient. */
	.hero :global(.frontispiece::after) {
		display: none;
	}

	/* Phones: keep the painting's upper half clear, ground the text zone. */
	.hero-veil {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		background: linear-gradient(
			to bottom,
			color-mix(in oklab, var(--bg) 55%, transparent) 0%,
			color-mix(in oklab, var(--bg) 10%, transparent) 32%,
			color-mix(in oklab, var(--bg) 52%, transparent) 64%,
			color-mix(in oklab, var(--bg) 88%, transparent) 88%,
			var(--bg) 100%
		);
	}

	.hero-content {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: 48rem;
		padding-block: 1.5rem 1.75rem;
		text-align: left;
		text-shadow: 0 1px 24px color-mix(in oklab, var(--bg) 80%, transparent);
	}

	.hero-eyebrow {
		margin-bottom: 0.75rem;
	}

	.page-title {
		font-family: var(--font-display);
		font-style: italic;
		font-weight: 400;
		font-size: clamp(2.1rem, 8.5vw, 2.6rem);
		line-height: 1.08;
		text-wrap: balance;
		color: var(--ink);
		margin: 0;
	}

	.lede {
		margin-top: 0.9rem;
		max-width: 34rem;
	}

	.lede :global(p) {
		font-family: var(--font-body);
		font-size: 1.02rem;
		font-style: normal;
		color: var(--ink);
		line-height: 1.6;
	}

	/* Phones: the plate becomes a small museum label under the frame. */
	.hero-plate {
		margin-top: 0.8rem;
		padding-inline: 1.5rem;
		font-size: 0.7rem;
		color: var(--ink-dim);
		text-align: left;
	}

	.hero-plate em {
		color: var(--ink-dim);
	}

	/* Keep each "· segment" glued together so separators never dangle at line ends. */
	.plate-item {
		white-space: nowrap;
	}

	.plate-museum {
		display: none;
	}

	/* Larger screens: the original centred title card over the painting,
	   plate resting inside the bottom fade. */
	@media (min-width: 640px) {
		.hero {
			justify-content: center;
			align-items: center;
			min-height: clamp(440px, 72vh, 760px);
		}

		.hero-veil {
			background: linear-gradient(
				to bottom,
				color-mix(in oklab, var(--bg) 60%, transparent) 0%,
				color-mix(in oklab, var(--bg) 20%, transparent) 30%,
				color-mix(in oklab, var(--bg) 34%, transparent) 62%,
				var(--bg) 100%
			);
		}

		.hero-content {
			padding-block: 3.5rem;
			text-align: center;
		}

		.hero-eyebrow {
			margin-bottom: 1.25rem;
		}

		.page-title {
			font-size: clamp(2.5rem, 6vw + 0.5rem, 5rem);
			line-height: 1.05;
		}

		.lede {
			margin-top: 1.75rem;
			margin-inline: auto;
			max-width: 36rem;
		}

		.lede :global(p) {
			font-size: 1.2rem;
			line-height: 1.7;
		}

		.hero-plate {
			position: absolute;
			inset: auto 0 1.1rem 0;
			margin: 0 auto;
			font-size: 0.875rem;
			color: var(--ink-muted);
			text-align: center;
		}

		.hero-plate em {
			color: var(--ink-muted);
		}

		.plate-museum {
			display: inline;
		}
	}
</style>
