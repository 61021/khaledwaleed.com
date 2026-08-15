<script lang='ts'>
	import type { Snippet } from 'svelte'

	type Props = {
		children: Snippet
		href?: string
		variant?: 'primary' | 'ghost' | 'outline'
		size?: 'md' | 'lg'
		class?: string
		external?: boolean
		/** filename hint for same-origin file links (renders the download attribute) */
		download?: string
		type?: 'button' | 'submit'
		onclick?: (e: MouseEvent) => void
	}
	const {
		children,
		href,
		variant = 'primary',
		size = 'md',
		class: cls = '',
		external = false,
		download,
		type = 'button',
		onclick,
	}: Props = $props()
</script>

{#if href}
	<a
		{href}
		class='btn {cls}'
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
		class='btn {cls}'
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
	/* A ruled label, brackets standing outside it: a plain 1px rim
	   holds the text; four engraved corner brackets attend the rim
	   from without. Primary inks rim and brackets at strength; outline
	   keeps both faint until hover. */
	.btn {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-family: var(--font-display);
		letter-spacing: 0.02em;
		cursor: pointer;
		transition:
			color 300ms ease,
			border-color 300ms ease,
			transform 150ms ease;
	}

	/* A physical press: the label gives by a pixel. */
	.btn:active {
		transform: translateY(1px);
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
	}

	.btn-outline {
		color: var(--ink-muted);
		border: 1px solid var(--rule);
	}

	/* Corner-pieces: the bracketed engraved corner, set a step outside
	   the rim (see the frame masks in app.css). */
	.btn-md {
		--btn-corner: 16px;
		--btn-corner-offset: 5px;
	}

	.btn-lg {
		--btn-corner: 18px;
		--btn-corner-offset: 6px;
	}

	.btn-primary::after,
	.btn-outline::after {
		content: '';
		position: absolute;
		inset: calc(var(--btn-corner-offset) * -1);
		pointer-events: none;
		background: color-mix(in oklab, var(--accent) 80%, transparent);
		-webkit-mask:
			var(--corner-bracket-tl) left top / var(--btn-corner) var(--btn-corner) no-repeat,
			var(--corner-bracket-tr) right top / var(--btn-corner) var(--btn-corner) no-repeat,
			var(--corner-bracket-br) right bottom / var(--btn-corner) var(--btn-corner) no-repeat,
			var(--corner-bracket-bl) left bottom / var(--btn-corner) var(--btn-corner) no-repeat;
		mask:
			var(--corner-bracket-tl) left top / var(--btn-corner) var(--btn-corner) no-repeat,
			var(--corner-bracket-tr) right top / var(--btn-corner) var(--btn-corner) no-repeat,
			var(--corner-bracket-br) right bottom / var(--btn-corner) var(--btn-corner) no-repeat,
			var(--corner-bracket-bl) left bottom / var(--btn-corner) var(--btn-corner) no-repeat;
		transition:
			background-color 300ms ease,
			opacity 300ms ease;
	}

	.btn-outline::after {
		opacity: 0.5;
	}

	.btn-primary:hover {
		color: var(--accent);
		border-color: var(--accent);
	}

	.btn-primary:hover::after {
		background: var(--accent);
	}

	.btn-outline:hover {
		color: var(--ink);
		border-color: color-mix(in oklab, var(--accent) 45%, var(--rule));
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
