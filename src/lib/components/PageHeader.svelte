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
</script>

<header class="page-header">
	<Painting {room} priority />

	<div class="mx-auto mt-12 max-w-2xl px-6 text-center sm:mt-16">
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
</header>

{#if children}
	<div class="rise-3">{@render children()}</div>
{/if}

<style>
	.page-header {
		padding-bottom: 2rem;
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
