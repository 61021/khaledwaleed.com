<script lang='ts'>
	import type { Snippet } from 'svelte'
	import { paintings } from '$lib/site'
	import Painting from './Painting.svelte'

	type Props = {
		room: keyof typeof paintings | string
		eyebrow?: string
		title: string
		lede?: Snippet
		children?: Snippet
	}

	const { room, eyebrow, title, lede, children }: Props = $props()

	const p = $derived(paintings[room as keyof typeof paintings])
</script>

<header class='page-header'>
	<div class='hero-wrap'>
		<div class='hero' style:--focal={p?.focal ?? 'center'}>
			<!-- One hero canvas per page; navigations swap it inside the
			     blur swap's soft beat. -->
			<div class='hero-art'>
				<Painting {room} priority bare />
			</div>

			<div class='hero-content px-6'>
				{#if eyebrow}
					<div class='smallcaps hero-eyebrow rise'>{eyebrow}</div>
				{/if}
				<h1 class='rise-2 page-title'>{title}</h1>
				{#if lede}
					<div class='lede rise-3'>
						{@render lede()}
					</div>
				{/if}
			</div>
		</div>

		{#if p}
			<!-- A wall label, set like one: artist, title, year, then the house. -->
			<p class='hero-plate plate rise' style='--seq: 3'>
				{p.artist}, <em>{p.title}</em>, {p.year}<span class='plate-museum'
				>.
					<a href={p.museumUrl} target='_blank' rel='noopener noreferrer' class='link-quiet'
					>{p.museum}</a
					></span
				>
			</p>
		{/if}
	</div>
</header>

{#if children}
	<div class='rise' style='--seq: 3'>{@render children()}</div>
{/if}

<style>
	.page-header {
		padding-bottom: 2rem;
	}

	.hero-wrap {
		position: relative;
	}

	/* Mobile-first: a shorter banner with the title card resting on the
	   dissolving bottom edge, left-aligned like a frontispiece caption.
	   The top padding clears the site nav, which floats on the canvas. */
	.hero {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		min-height: clamp(420px, 66svh, 660px);
		width: 100%;
		padding-top: 5rem;
		overflow: hidden;
		isolation: isolate;
	}

	.hero-art {
		position: absolute;
		inset: 0;
		z-index: 0;
		/* No transition clock of its own: room changes swap this canvas
		   inside the blur swap (see .stage in app.css). Layers carrying
		   their own clocks kept meeting the rest at a seam. */
	}

	.hero :global(.frontispiece) {
		position: absolute;
		inset: 0;
		z-index: 0;
		/* The canvas hangs unshaded and dissolves into the wall itself:
		   an alpha mask eased along a smootherstep ramp, so the fade has
		   no visible start line and no banding, and the wallpaper shows
		   through where the paint thins instead of a solid wash covering
		   it. The top edge stays clear; the nav letters on the canvas. */
		-webkit-mask-image: linear-gradient(
			to bottom,
			black 58%,
			rgb(0 0 0 / 0.983) 63.25%,
			rgb(0 0 0 / 0.896) 68.5%,
			rgb(0 0 0 / 0.716) 73.75%,
			rgb(0 0 0 / 0.5) 79%,
			rgb(0 0 0 / 0.284) 84.25%,
			rgb(0 0 0 / 0.104) 89.5%,
			rgb(0 0 0 / 0.017) 94.75%,
			transparent 100%
		);
		mask-image: linear-gradient(
			to bottom,
			black 58%,
			rgb(0 0 0 / 0.983) 63.25%,
			rgb(0 0 0 / 0.896) 68.5%,
			rgb(0 0 0 / 0.716) 73.75%,
			rgb(0 0 0 / 0.5) 79%,
			rgb(0 0 0 / 0.284) 84.25%,
			rgb(0 0 0 / 0.104) 89.5%,
			rgb(0 0 0 / 0.017) 94.75%,
			transparent 100%
		);
	}

	.hero :global(.frontispiece picture),
	.hero :global(.frontispiece img) {
		height: 100%;
		width: 100%;
		object-fit: cover;
		object-position: var(--focal, center);
	}

	/* The mask above handles all fading; drop the frontispiece's own gradient. */
	.hero :global(.frontispiece::after) {
		display: none;
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
		/* Full ink: the eyebrow can land on a painting's brightest band
		   (Moonrise's sky on /likes), where the muted tone washes out. */
		color: var(--ink);
	}

	.page-title {
		font-family: var(--font-display);
		font-weight: 400;
		font-size: clamp(2.4rem, 10vw, 2.9rem);
		line-height: 1.06;
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

	/* Keep the collection off the smallest labels. */
	.plate-museum {
		display: none;
	}

	/* Larger screens: the original centred title card over the painting,
	   plate resting inside the bottom fade. */
	@media (min-width: 640px) {
		.hero {
			justify-content: center;
			align-items: center;
			min-height: clamp(540px, 86vh, 900px);
			padding-top: 5.5rem;
			/* The title card hangs above centre, the way a wall label sits
			   high on the canvas rather than across its middle. */
			padding-bottom: 7rem;
		}

		.hero-content {
			padding-block: 3.5rem;
			text-align: center;
		}

		.hero-eyebrow {
			margin-bottom: 1.25rem;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.8rem;
		}

		/* Two tiny gilt diamonds flank the eyebrow, echoing the room's
		   ornamented section labels. */
		.hero-eyebrow::before,
		.hero-eyebrow::after {
			content: '';
			width: 0.28rem;
			height: 0.28rem;
			flex: none;
			background: color-mix(in oklab, var(--accent) 65%, transparent);
			transform: rotate(45deg);
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
