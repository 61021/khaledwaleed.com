<script lang='ts'>
	import { Monogram } from '$lib'
	import { onMount } from 'svelte'

	// How long the room must stay still before the house closes for the
	// night, and how long the lights take to come back up (the .lifting
	// fade below; the element stays mounted and inert until then).
	const IDLE_MS = 10_000
	const LIFT_MS = 460
	// A moving pointer fires dozens of events a second; one timer reset
	// each is churn nobody sees.
	const STIR_FLOOR_MS = 400

	let phase = $state<'open' | 'closed' | 'lifting'>('open')

	let idle: ReturnType<typeof setTimeout>
	let lift: ReturnType<typeof setTimeout>
	let lastStir = 0

	function stir() {
		if (phase === 'closed') {
			phase = 'lifting'
			clearTimeout(lift)
			lift = setTimeout(() => {
				if (phase === 'lifting')
					phase = 'open'
			}, LIFT_MS)
		}
		else if (performance.now() - lastStir < STIR_FLOOR_MS) {
			return
		}
		lastStir = performance.now()
		clearTimeout(idle)
		idle = setTimeout(() => (phase = 'closed'), IDLE_MS)
	}

	onMount(() => {
		idle = setTimeout(() => (phase = 'closed'), IDLE_MS)
		return () => {
			clearTimeout(idle)
			clearTimeout(lift)
		}
	})
</script>

<svelte:window
	onpointermove={stir}
	onpointerdown={stir}
	onkeydown={stir}
	onwheel={stir}
	onscroll={stir}
	ontouchstart={stir}
	onfocusin={stir}
/>

{#if phase !== 'open'}
	<!-- The closed house takes the first click itself, so waking the room
	     never also follows a link. Nothing here is focusable or announced. -->
	<div class={['screensaver', phase === 'lifting' && 'lifting']} aria-hidden='true'>
		<div class='drift'>
			<div class='bob'>
				<div class='mark'>
					<Monogram class='block h-auto w-full' />
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* After hours: the lights go out over whichever room the visitor
	   stopped in, and the monogram is the one thing left lit on the
	   wall. It wanders the dark the way a nightwatchman's lamp would,
	   and the first sign of anyone in the room brings the house back up.
	   The dark is cut from the room's own --bg, so each room keeps its
	   colour after closing; nothing of the page shows through, because a
	   half-dimmed page is just the page with its titles crossing the
	   mark. */
	.screensaver {
		position: fixed;
		inset: 0;
		z-index: 120;
		display: grid;
		place-items: center;
		cursor: none;
		user-select: none;
		background: radial-gradient(
			120% 90% at 50% 45%,
			color-mix(in oklab, black 40%, var(--bg)),
			color-mix(in oklab, black 52%, var(--bg)) 38%,
			color-mix(in oklab, black 70%, var(--bg)) 68%,
			color-mix(in oklab, black 88%, var(--bg))
		);
		animation: house-down 1200ms ease both;
	}

	.screensaver.lifting {
		pointer-events: none;
		animation: house-up 460ms ease both;
	}

	@keyframes house-down {
		from {
			opacity: 0;
		}
	}

	@keyframes house-up {
		to {
			opacity: 0;
		}
	}

	/* Two slow oscillations at co-prime periods, so the path never quite
	   repeats itself; both start and end at rest in the middle, where the
	   fade above hands the mark over. Transform only, one composited
	   layer each. */
	.drift {
		--drift-x: clamp(24px, 8vw, 150px);
		animation: wander-x 47s cubic-bezier(0.45, 0, 0.55, 1) infinite;
	}

	.bob {
		--drift-y: clamp(18px, 6vh, 100px);
		animation: wander-y 31s cubic-bezier(0.45, 0, 0.55, 1) infinite;
	}

	@keyframes wander-x {
		25% {
			transform: translateX(var(--drift-x));
		}

		75% {
			transform: translateX(calc(var(--drift-x) * -1));
		}
	}

	@keyframes wander-y {
		25% {
			transform: translateY(calc(var(--drift-y) * -1));
		}

		75% {
			transform: translateY(var(--drift-y));
		}
	}

	/* The signature at wall size, and it arrives by writing itself: a
	   soft-edged mask slid across at the script's own slant, so the ink
	   lands left to right the way the hand did. One authored moment,
	   then it just hangs there and wanders. */
	.mark {
		width: min(74vw, 27rem);
		color: var(--accent);
		filter: drop-shadow(0 2px 24px color-mix(in oklab, black 65%, transparent));
		-webkit-mask-image: linear-gradient(95deg, black 50%, transparent 66%);
		mask-image: linear-gradient(95deg, black 50%, transparent 66%);
		-webkit-mask-size: 300% 100%;
		mask-size: 300% 100%;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: 0% 0;
		mask-position: 0% 0;
		animation: sign-on 1700ms cubic-bezier(0.45, 0.05, 0.25, 1) both;
	}

	@keyframes sign-on {
		from {
			-webkit-mask-position: 100% 0;
			mask-position: 100% 0;
		}
	}

	/* Reduced motion: the mark simply hangs there, centred and still. The
	   global reset zeroes durations but would leave the wander parked at
	   whichever keyframe it landed on, and the sweep half-inked. */
	@media (prefers-reduced-motion: reduce) {
		.drift,
		.bob,
		.mark {
			animation: none;
		}

		.mark {
			-webkit-mask-image: none;
			mask-image: none;
		}
	}

	/* Nothing closes on paper. */
	@media print {
		.screensaver {
			display: none;
		}
	}
</style>
