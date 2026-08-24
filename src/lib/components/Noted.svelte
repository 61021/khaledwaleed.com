<script lang='ts'>
	import type { Attachment } from 'svelte/attachments'

	type Props = { label: string, note: string }
	const { label, note }: Props = $props()

	const id = $props.id()

	/** Margin the card keeps from the screen edge: the page's own gutter. */
	const GUTTER = 24

	let trigger = $state<HTMLButtonElement>()
	let card = $state<HTMLSpanElement>()
	let shift = $state(0)
	let dismissed = $state(false)

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

	function open() {
		dismissed = false
		place()
	}

	// WCAG 1.4.13: dismissable without moving the pointer. Hover and focus
	// still own the showing, so the note survives without JavaScript; this
	// only takes it back down.
	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && trigger?.matches(':hover, :focus'))
			dismissed = true
	}

	// The card is in layout from the first paint (opacity 0, not
	// display none), so it must sit inside the margins from the first
	// paint too: unclamped resting cards near the column edge widened
	// the whole page on phones. Hover and focus still re-measure.
	const settle: Attachment = () => place()
</script>

<svelte:window onresize={place} onkeydown={onKeydown} />

<button
	type='button'
	class='noted'
	aria-describedby={id}
	data-dismissed={dismissed || undefined}
	bind:this={trigger}
	onpointerenter={open}
	onpointerleave={() => (dismissed = false)}
	onfocus={open}
	onblur={() => (dismissed = false)}
>{label}<span
	class='note frame-gemmed'
	{id}
	role='tooltip'
	bind:this={card}
	style:--note-shift='{shift}px'
	{@attach settle}
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

	/* Carries the pointer across the 12px gap without dropping the hover. */
	.note::before {
		content: '';
		position: absolute;
		inset-inline: 0;
		top: 100%;
		height: 12px;
	}

	.noted:hover .note,
	.noted:focus .note {
		opacity: 1;
		transform: translate(-50%, 0);
		pointer-events: auto;
	}

	.noted[data-dismissed] .note {
		opacity: 0;
		pointer-events: none;
	}
</style>
