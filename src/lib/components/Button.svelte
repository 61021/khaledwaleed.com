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

	// Variants and sizes map 1:1 onto scoped classes below.
	const classes = $derived(['btn', `btn-${variant}`, `btn-${size}`, cls])
</script>

{#if href}
	<a
		{href}
		class={classes}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
		{download}
	>
		{@render children()}
	</a>
{:else}
	<button {type} class={classes} {onclick}>
		{@render children()}
	</button>
{/if}

<style>
	/* A ruled label, brackets standing outside it: a plain 1px rim
	   holds the text; four engraved corner brackets attend the rim
	   from without. Primary fills the rim solid and reverses the label
	   out of it, a gilt plate; outline keeps rim and brackets faint
	   until hover. */
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
			color var(--dur-quick) var(--ease-out),
			background-color var(--dur-quick) var(--ease-out),
			border-color var(--dur-quick) var(--ease-out),
			transform 120ms var(--ease-out);
	}

	/* A physical press: the label gives by a pixel, quicker than it returns. */
	.btn:active {
		transform: translateY(1px);
		transition-duration: 45ms;
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
		color: var(--bg);
		background: var(--accent);
		border: 1px solid var(--accent);
	}

	.btn-outline {
		color: var(--ink-muted);
		border: 1px solid var(--rule);
	}

	/* Corner-pieces: the bracketed engraved corner, set a step outside
	   the rim (see the frame masks in app.css). Phones take the smaller
	   cut, like the frames. */
	.btn-md {
		--btn-corner: 14px;
		--btn-corner-offset: 4px;
	}

	.btn-lg {
		--btn-corner: 15px;
		--btn-corner-offset: 5px;
	}

	@media (min-width: 640px) {
		.btn-md {
			--btn-corner: 16px;
			--btn-corner-offset: 5px;
		}

		.btn-lg {
			--btn-corner: 18px;
			--btn-corner-offset: 6px;
		}
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
			background-color var(--dur-quick) var(--ease-out),
			opacity var(--dur-quick) var(--ease-out);
	}

	.btn-outline::after {
		opacity: 0.5;
	}

	/* The plate takes more ink: gold brightens in the night rooms, the pen deepens on paper. */
	.btn-primary:hover {
		background: color-mix(in oklab, var(--accent) 70%, var(--ink));
		border-color: color-mix(in oklab, var(--accent) 70%, var(--ink));
	}

	/* The house focus ring is drawn in accent; on a gilt plate it needs the ink instead. */
	.btn-primary:focus-visible {
		outline-color: var(--ink);
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
