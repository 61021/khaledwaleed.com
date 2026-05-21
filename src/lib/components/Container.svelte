<script lang="ts">
	import type { Snippet } from 'svelte';
	type Props = { children: Snippet; class?: string; size?: 'prose' | 'default' | 'wide' };
	let { children, class: cls = '', size = 'default' }: Props = $props();
	const max = $derived(
		size === 'prose' ? 'max-w-2xl' : size === 'wide' ? 'max-w-6xl' : 'max-w-5xl'
	);
</script>

<div class="mx-auto w-full px-6 sm:px-8 {max} {cls}">
	{@render children()}
</div>
