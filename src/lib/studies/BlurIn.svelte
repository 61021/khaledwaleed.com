<script lang='ts'>
	import { onMount } from 'svelte'

	let blur = $state(true)
	let shown = $state(true)
	let raf = 0

	// Drop the lines to their served start state for one frame, then
	// let the transition carry them back.
	function replay() {
		cancelAnimationFrame(raf)
		shown = false
		raf = requestAnimationFrame(() => {
			raf = requestAnimationFrame(() => {
				shown = true
			})
		})
	}

	onMount(() => () => cancelAnimationFrame(raf))
</script>

<figure class='blur-in'>
	<div class='specimen'>
		<p class={['h1', blur && 'blurred', shown && 'shown']}>
			<span class='l' style:--i={0}>The heading resolves</span>
			<span class='l' style:--i={1}>out of its own blur</span>
		</p>
	</div>

	<div class='controls'>
		<fieldset class='seg'>
			<legend class='sr-only'>start state</legend>
			<label class={['seg-option', blur && 'on']}>
				<input class='sr-only' type='radio' name='blur-start' value={true} bind:group={blur} />
				with blur(10px)
			</label>
			<label class={['seg-option', !blur && 'on']}>
				<input class='sr-only' type='radio' name='blur-start' value={false} bind:group={blur} />
				without
			</label>
		</fieldset>
		<button type='button' class='chip' onclick={replay}>replay</button>
	</div>

	<p class='fig-cap'>
		start state as linear serves it:
		<code translate='no'>opacity: 0; filter: blur(10px); transform: translateY(20%)</code>.
		the curve is their most used token, <code translate='no'>cubic-bezier(.25,.46,.45,.94)</code>;
		the 700ms and the 90ms between lines are mine.
	</p>
</figure>

<style>
	.blur-in {
		margin: 2rem 0;
	}

	.specimen {
		background: #08090a;
		padding: 3rem 1.75rem;
	}

	.h1 {
		margin: 0;
		color: #f7f8f8;
		font-size: clamp(1.7rem, 4.6vw, 2.8rem);
		font-weight: 510;
		letter-spacing: -0.022em;
		line-height: 1.05;
	}

	.l {
		display: block;
		opacity: 0;
		transform: translateY(20%);
	}

	.blurred .l {
		filter: blur(10px);
	}

	.shown .l {
		opacity: 1;
		transform: none;
		filter: blur(0);
		transition:
			opacity 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
			transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
			filter 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
		transition-delay: calc(var(--i) * 90ms);
	}

	@media (prefers-reduced-motion: reduce) {
		.shown .l {
			transition: none;
		}
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 1.1rem;
	}
</style>
