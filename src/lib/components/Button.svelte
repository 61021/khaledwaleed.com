<script lang="ts">
	import type { Snippet } from 'svelte';
	type Props = {
		children: Snippet;
		href?: string;
		variant?: 'primary' | 'ghost' | 'outline';
		size?: 'md' | 'lg';
		class?: string;
		external?: boolean;
		/** filename hint for same-origin file links (renders the download attribute) */
		download?: string;
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
		download,
		type = 'button',
		onclick
	}: Props = $props();
</script>

{#if href}
	<a
		{href}
		class="btn {cls}"
		class:btn-primary={variant === 'primary'}
		class:btn-outline={variant === 'outline'}
		class:btn-ghost={variant === 'ghost'}
		class:btn-md={size === 'md'}
		class:btn-lg={size === 'lg'}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
		{download}
	>
		{@render children()}
	</a>
{:else}
	<button
		{type}
		class="btn {cls}"
		class:btn-primary={variant === 'primary'}
		class:btn-outline={variant === 'outline'}
		class:btn-ghost={variant === 'ghost'}
		class:btn-md={size === 'md'}
		class:btn-lg={size === 'lg'}
		{onclick}
	>
		{@render children()}
	</button>
{/if}

<style>
	/* A gilded plate: gold rim, inner fillet, beaded corners — after the
	   double gilt rims and beadwork of old porcelain. */
	.btn {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-family: var(--font-display);
		font-style: italic;
		letter-spacing: 0.02em;
		cursor: pointer;
		transition:
			color 300ms ease,
			border-color 300ms ease,
			background-color 300ms ease,
			box-shadow 450ms ease;
	}

	.btn-md {
		padding: 0.5rem 1.5rem;
		font-size: 1.05rem;
	}

	.btn-lg {
		padding: 0.8rem 2.1rem;
		font-size: 1.15rem;
	}

	.btn-primary {
		color: var(--ink);
		border: 1px solid color-mix(in oklab, var(--accent) 60%, transparent);
		background: linear-gradient(
			color-mix(in oklab, var(--accent) 16%, transparent),
			color-mix(in oklab, var(--accent) 8%, transparent)
		);
	}

	.btn-outline {
		color: var(--ink-muted);
		border: 1px solid var(--rule);
		background: transparent;
	}

	/* Inner gilt fillet. */
	.btn-primary::before,
	.btn-outline::before {
		content: '';
		position: absolute;
		inset: 3px;
		pointer-events: none;
		border: 1px solid;
		transition: border-color 300ms ease;
	}

	.btn-primary::before {
		border-color: color-mix(in oklab, var(--accent) 30%, transparent);
	}

	.btn-outline::before {
		border-color: color-mix(in oklab, var(--rule) 60%, transparent);
	}

	/* Beaded corners. */
	.btn-primary::after,
	.btn-outline::after {
		content: '';
		position: absolute;
		inset: 1px;
		pointer-events: none;
		--bead: color-mix(in oklab, var(--accent) 80%, transparent);
		background-image:
			radial-gradient(circle, var(--bead) 1px, transparent 1.5px),
			radial-gradient(circle, var(--bead) 1px, transparent 1.5px),
			radial-gradient(circle, var(--bead) 1px, transparent 1.5px),
			radial-gradient(circle, var(--bead) 1px, transparent 1.5px);
		background-size: 3px 3px;
		background-repeat: no-repeat;
		background-position:
			0 0,
			100% 0,
			0 100%,
			100% 100%;
		transition: opacity 300ms ease;
	}

	.btn-outline::after {
		opacity: 0.5;
	}

	.btn-primary:hover {
		color: var(--accent);
		border-color: var(--accent);
		background: linear-gradient(
			color-mix(in oklab, var(--accent) 22%, transparent),
			color-mix(in oklab, var(--accent) 12%, transparent)
		);
		box-shadow:
			0 0 24px color-mix(in oklab, var(--accent) 16%, transparent),
			inset 0 0 16px color-mix(in oklab, var(--accent) 10%, transparent);
	}

	.btn-primary:hover::before {
		border-color: color-mix(in oklab, var(--accent) 55%, transparent);
	}

	.btn-outline:hover {
		color: var(--ink);
		border-color: color-mix(in oklab, var(--accent) 45%, var(--rule));
		box-shadow: 0 0 18px color-mix(in oklab, var(--accent) 10%, transparent);
	}

	.btn-outline:hover::before {
		border-color: color-mix(in oklab, var(--accent) 30%, var(--rule));
	}

	.btn-outline:hover::after {
		opacity: 0.9;
	}

	.btn-ghost {
		color: var(--ink-muted);
		border: none;
		background: none;
		padding-inline: 0.25rem;
	}

	.btn-ghost:hover {
		color: var(--accent);
	}
</style>
