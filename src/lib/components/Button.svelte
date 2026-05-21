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
		'inline-flex items-center justify-center gap-2 font-[var(--font-display)] italic transition-all duration-300 focus-visible:outline-none focus-visible:outline-1 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-4';
	const sizes = { md: 'px-5 py-2 text-[1.05rem]', lg: 'px-7 py-3 text-[1.15rem]' };
	const variants = {
		primary:
			'border border-[var(--accent)] text-[var(--ink)] bg-transparent hover:bg-[color-mix(in_oklab,var(--accent)_18%,transparent)] hover:text-[var(--accent)]',
		outline:
			'border border-[var(--rule)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:border-[var(--ink-muted)]',
		ghost: 'text-[var(--ink-muted)] hover:text-[var(--accent)]'
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
