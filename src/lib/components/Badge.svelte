<script lang="ts">
	import type { Snippet } from 'svelte';
	type Props = { children: Snippet; class?: string };
	let { children, class: cls = '' }: Props = $props();
</script>

<span
	class="inline-block border border-[var(--rule)] px-2.5 py-0.5 text-[0.78rem] italic text-[var(--ink-muted)] {cls}"
>
	{@render children()}
</span>
