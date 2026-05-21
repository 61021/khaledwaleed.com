<script lang="ts">
	import type { Snippet } from 'svelte';
	type Props = { children: Snippet; tone?: 'default' | 'brand' | 'accent'; class?: string };
	let { children, tone = 'default', class: cls = '' }: Props = $props();
	const tones = {
		default: 'border-[var(--border-strong)] bg-white/[0.03] text-[var(--fg-muted)]',
		brand: 'border-[var(--brand)]/30 bg-[var(--brand-soft)] text-[var(--brand)]',
		accent: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-300'
	};
</script>

<span
	class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-tight {tones[
		tone
	]} {cls}"
>
	{@render children()}
</span>
