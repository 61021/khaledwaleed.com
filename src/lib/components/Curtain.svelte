<script lang='ts'>
	import { curtain } from '$lib/curtain'
	import { onMount } from 'svelte'

	// One performance per full arrival: the layout survives client-side
	// navigation, so this component never remounts (and never replays)
	// mid-visit. The timeline itself is pure CSS and runs from the first
	// SSR paint, before hydration; this timer only strikes the set once
	// the show is over.
	let struck = $state(false)

	// Unless the house calls for an encore (the Konami code, the palette's
	// hidden entry): the same cloth comes back for one close-and-part.
	let encore = $state(false)
	let encoreTimer: ReturnType<typeof setTimeout>

	onMount(() => {
		const timer = setTimeout(() => (struck = true), 2400)
		const unregister = curtain.register(() => {
			// The overture, or a running encore, finishes uninterrupted.
			if (!struck || encore)
				return
			encore = true
			encoreTimer = setTimeout(() => (encore = false), 2900)
		})
		return () => {
			clearTimeout(timer)
			clearTimeout(encoreTimer)
			unregister()
		}
	})
</script>

{#if !struck || encore}
	<div class={['curtain', encore && 'encore']} aria-hidden='true'>
		<div class='veil'></div>
		<div class='panel left'></div>
		<div class='panel right'></div>
	</div>
{/if}

<style>
	/* The overture: a short hold, part the velvet, bring the house
	   lights up. Timings come from the --curtain-* score in app.css.
	   Nothing waits behind the cloth: the room is already hung when
	   the panels part. The cloth is cut from the room's own --bg
	   (home's deep navy at the front door); no pelmet (a CSS scallop
	   row always read as cut paper) and no monogram, just two full
	   drops and the seam. */
	.curtain {
		position: fixed;
		inset: 0;
		z-index: 110;
		overflow: hidden;
		pointer-events: none;
		--velvet: var(--bg);
	}

	/* House lights: the parting reveals a darkened stage that brightens
	   through the sweep rather than cutting straight to the page. */
	.veil {
		position: absolute;
		inset: 0;
		background: color-mix(in oklab, black 55%, var(--bg));
		opacity: 0.92;
		animation: house-lights var(--curtain-sweep) ease-in-out var(--curtain-hold) both;
	}

	/* The cloth is a flat sheet of --bg, so the closed curtain is
	   exactly the room's color; every fold, crease, catch-light, and
	   fall of room light lives on the blurred layer below, where the
	   blur melts the gradient ramps into continuous shading instead of
	   facets. Dark cloth reads by highlight as much as shadow, so the
	   main fold's crowns carry a dim sheen. Rasterised once, then the
	   whole panel rides the sweep as one composited layer. */
	.panel {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 50%;
		background-color: var(--velvet);
		animation: part var(--curtain-sweep) cubic-bezier(0.72, 0, 0.22, 1) var(--curtain-hold) both;
	}

	.panel::before {
		content: '';
		position: absolute;
		inset: -16px 0;
		filter: blur(7px);
		background-image:
			radial-gradient(
				130% 90% at var(--seam) 38%,
				rgb(255 255 255 / 0.04),
				transparent 64%
			),
			linear-gradient(
				rgb(0 0 0 / 0.38) 0,
				rgb(0 0 0 / 0.12) 18%,
				rgb(0 0 0 / 0.04) 42%,
				rgb(0 0 0 / 0.14) 72%,
				rgb(0 0 0 / 0.44) 100%
			),
			repeating-linear-gradient(
				90deg,
				transparent 0,
				transparent 42px,
				rgb(255 255 255 / 0.03) 52px,
				transparent 62px,
				transparent 110px
			),
			repeating-linear-gradient(
				90deg,
				rgb(0 0 0 / 0.1) 0,
				transparent 9px,
				transparent 25px,
				rgb(0 0 0 / 0.1) 34px
			),
			repeating-linear-gradient(
				90deg,
				rgb(0 0 0 / 0.36) 0,
				rgb(0 0 0 / 0.2) 16px,
				rgb(255 255 255 / 0.045) 36px,
				rgb(255 255 255 / 0.065) 52px,
				rgb(255 255 255 / 0.04) 68px,
				rgb(0 0 0 / 0.22) 92px,
				rgb(0 0 0 / 0.36) 110px
			),
			repeating-linear-gradient(
				90deg,
				rgb(0 0 0 / 0.22) 0,
				transparent 74px,
				transparent 156px,
				rgb(0 0 0 / 0.22) 230px
			);
	}

	.left {
		left: 0;
		--seam: 100%;
		--dir: -1;
	}

	.right {
		right: 0;
		--seam: 0%;
		--dir: 1;
	}

	/* A quiet moonlit hem on each leading edge, a shade above the
	   cloth; the pair also hides the subpixel join between the closed
	   panels. */
	.panel::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		width: 2px;
		background: color-mix(in oklab, white 10%, var(--velvet));
	}

	.left::after {
		right: -1px;
	}

	.right::after {
		left: -1px;
	}

	@keyframes part {
		to {
			transform: translateX(calc(var(--dir) * 104%));
		}
	}

	@keyframes house-lights {
		to {
			opacity: 0;
		}
	}

	/* The encore: same cloth, opposite choreography. The panels enter
	   from the wings, hold the house dark a beat, then part again; the
	   veil dims and lifts under them. One keyframe ride per panel (close
	   at 0-38%, hold to 57%, part to 100% of 2800ms), segment curves set
	   inside the keyframes, so the whole figure stays one composited
	   pass; the strike timer in the script runs 100ms past it. */
	.encore .veil {
		animation: encore-lights 2800ms linear both;
	}

	.encore .panel {
		animation: encore-part 2800ms both;
	}

	@keyframes encore-part {
		0% {
			transform: translateX(calc(var(--dir) * 104%));
			animation-timing-function: cubic-bezier(0.55, 0, 0.3, 1);
		}

		38% {
			transform: translateX(0);
			animation-timing-function: linear;
		}

		57% {
			transform: translateX(0);
			animation-timing-function: cubic-bezier(0.72, 0, 0.22, 1);
		}

		100% {
			transform: translateX(calc(var(--dir) * 104%));
		}
	}

	@keyframes encore-lights {
		0% {
			opacity: 0;
		}

		38% {
			opacity: 0.92;
		}

		57% {
			opacity: 0.92;
		}

		100% {
			opacity: 0;
		}
	}

	/* No overture for reduced motion or print. */
	@media (prefers-reduced-motion: reduce), print {
		.curtain {
			display: none;
		}
	}

	/* Nor for a reload or a back/forward return (app.html stamps
	   data-navigated before first paint); the encore still answers. */
	:global(html[data-navigated]) .curtain:not(.encore) {
		display: none;
	}
</style>
