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
	<div class="hero">
		<Painting {room} priority bare />
		<div class="hero-veil" aria-hidden="true"></div>

		<div class="hero-content mx-auto px-6 text-center">
			{#if eyebrow}
				<div class="smallcaps mb-5 rise-2">{eyebrow}</div>
			{/if}
			<h1 class="rise-2 page-title">{title}</h1>
			{#if lede}
				<div class="lede mx-auto mt-7 max-w-xl rise-3">
					{@render lede()}
				</div>
			{/if}
		</div>

		{#if p}
			<p class="hero-plate plate rise-3">
				<em>{p.title}</em>
				<span class="plate-sep">·</span>
				{p.artist}
				<span class="plate-sep">·</span>
				{p.year}
				<span class="plate-sep">·</span>
				<a href={p.museumUrl} target="_blank" rel="noopener noreferrer" class="link-quiet">
					{p.museum}
				</a>
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

	.hero {
		position: relative;
		display: grid;
		place-items: center;
		min-height: clamp(440px, 72vh, 760px);
		width: 100%;
		overflow: hidden;
		isolation: isolate;
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
	}

	/* The hero veil handles all fading; drop the frontispiece's own gradient. */
	.hero :global(.frontispiece::after) {
		display: none;
	}

	.hero-veil {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		background: linear-gradient(
			to bottom,
			color-mix(in oklab, var(--bg) 60%, transparent) 0%,
			color-mix(in oklab, var(--bg) 20%, transparent) 30%,
			color-mix(in oklab, var(--bg) 34%, transparent) 62%,
			var(--bg) 100%
		);
	}

	.hero-content {
		position: relative;
		z-index: 2;
		max-width: 48rem;
		padding-block: 3.5rem;
		text-shadow: 0 1px 24px color-mix(in oklab, var(--bg) 80%, transparent);
	}

	.hero-plate {
		position: absolute;
		inset: auto 0 1.1rem 0;
		z-index: 2;
		margin-inline: auto;
		padding-inline: 1.5rem;
	}

	.page-title {
		font-family: var(--font-display);
		font-style: italic;
		font-weight: 400;
		font-size: clamp(2.5rem, 6vw + 0.5rem, 5rem);
		line-height: 1.05;
		color: var(--ink);
		margin: 0;
	}

	.lede :global(p) {
		font-family: var(--font-body);
		font-size: 1.2rem;
		font-style: normal;
		color: var(--ink-muted);
		line-height: 1.7;
	}
</style>
