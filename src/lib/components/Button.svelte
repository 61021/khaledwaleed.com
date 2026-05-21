<script lang="ts">
	import type { Snippet } from 'svelte';
	type Props = {
		children: Snippet;
		href?: string;
		variant?: 'primary' | 'ghost' | 'outline';
		size?: 'md' | 'lg';
		class?: string;
		external?: boolean;
		type?: 'button' | 'submit';
		onclick?: (e: MouseEvent) => void;
	};
	let {
		children,
		href,
		variant = 'primary',
		size = 'md',
		class: cls = '',
		external = false,
		type = 'button',
		onclick
	}: Props = $props();

	const base =
		'group inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] active:scale-[0.98]';
	const sizes = { md: 'px-5 py-2.5 text-sm', lg: 'px-6 py-3 text-[15px]' };
	const variants = {
		primary:
			'bg-[var(--brand)] text-[#04140d] hover:bg-[#6ee7b7] shadow-[0_8px_30px_-12px_rgba(52,211,153,0.6)] hover:shadow-[0_12px_40px_-8px_rgba(52,211,153,0.55)]',
		outline:
			'border border-[var(--border-strong)] text-[var(--fg)] hover:border-[var(--brand)] hover:text-[var(--brand)] bg-white/[0.02] hover:bg-white/[0.04]',
		ghost: 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
	};
	const classes = $derived(`${base} ${sizes[size]} ${variants[variant]} ${cls}`);
</script>

{#if href}
	<a
		{href}
		class={classes}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
	>
		{@render children()}
	</a>
{:else}
	<button {type} class={classes} {onclick}>
		{@render children()}
	</button>
{/if}
