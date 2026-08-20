<script lang='ts'>
	type Props = { label: string, note: string }
	const { label, note }: Props = $props()

	const id = $props.id()

	/** Margin the card keeps from the screen edge: the page's own gutter. */
	const GUTTER = 24

	let trigger = $state<HTMLButtonElement>()
	let card = $state<HTMLSpanElement>()
	let shift = $state(0)

	// The card is centred on its word, so a word near either edge hung it
	// off the screen and took the whole page sideways with it. Measure as
	// it opens and slide it back inside the margins.
	function place() {
		if (!trigger || !card)
			return
		const half = card.offsetWidth / 2
		const centre = trigger.getBoundingClientRect().left + trigger.offsetWidth / 2
		const past = centre + half - (document.documentElement.clientWidth - GUTTER)
		const short = GUTTER - (centre - half)
		shift = past > 0 ? -past : short > 0 ? short : 0
	}
</script>

<button
	type='button'
	class='noted'
	aria-describedby={id}
	bind:this={trigger}
	onpointerenter={place}
	onfocus={place}
>{label}<span
	class='note frame-gemmed'
	{id}
	role='tooltip'
	bind:this={card}
	style:--note-shift='{shift}px'
>{note}</span></button>

<style>
	/* A noted term: dotted underline as the tell, the note itself a
	   small gemmed label floating above on hover or focus. The trigger
	   is a real button so keyboards and screen readers reach it. */
	.noted {
		position: relative;
		padding: 0;
		font: inherit;
		color: inherit;
		background: none;
		cursor: help;
		border-bottom: 1px dotted color-mix(in oklab, var(--ink-dim) 70%, transparent);
	}

	.noted:focus-visible {
		outline: 1px dotted var(--accent);
		outline-offset: 3px;
	}

	.note {
		position: absolute;
		bottom: calc(100% + 12px);
		left: 50%;
		/* The clamp rides on a margin, outside the transition, so the card
		   fades in already sitting where it belongs. */
		margin-left: var(--note-shift, 0px);
		z-index: 10;
		width: max-content;
		/* Never wider than the column it sits in. */
		max-width: min(17rem, calc(100vw - 3rem));
		padding: 0.45rem 0.8rem;
		font-size: 0.82rem;
		line-height: 1.55;
		text-align: left;
		color: var(--ink-muted);
		background: var(--bg-soft);
		border: 1px solid var(--rule);
		box-shadow: 0 16px 34px -20px rgb(0 0 0 / 0.65);
		opacity: 0;
		transform: translate(-50%, 5px);
		pointer-events: none;
		transition:
			opacity 160ms var(--ease-out),
			transform 160ms var(--ease-out);
	}

	.noted:hover .note,
	.noted:focus .note {
		opacity: 1;
		transform: translate(-50%, 0);
	}
</style>
