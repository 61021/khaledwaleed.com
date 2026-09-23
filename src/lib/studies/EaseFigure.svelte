<script lang='ts'>
	import type { DriveSpec, EaseFn, PlotCurve } from './types'
	import { onMount } from 'svelte'
	import { driveDot, prefersReducedMotion } from './drive'
	import EasePlot from './EasePlot.svelte'

	interface Props {
		label: string
		code: string
		fn: EaseFn
		drive: DriveSpec
		duration?: number
		window?: [number, number]
		width?: number
		/** a reference curve drawn behind the main one */
		ghost?: PlotCurve
	}

	const {
		label,
		code,
		fn,
		drive,
		duration = 1.1,
		window: win = [-0.1, 1.42],
		width = 140,
		ghost,
	}: Props = $props()

	const DOT = 10

	let runwayEl = $state<HTMLDivElement>()
	let dotEl = $state<HTMLDivElement>()
	let t = $state<number | null>(null)
	let raf = 0
	let stop: (() => void) | null = null

	const pen = $derived(drive.engine === 'gsap' ? 'var(--accent)' : 'var(--ink-muted)')
	const curves = $derived<PlotCurve[]>([...(ghost ? [ghost] : []), { fn, stroke: pen }])

	function play() {
		if (!dotEl || !runwayEl)
			return
		stop?.()
		cancelAnimationFrame(raf)
		const seconds = prefersReducedMotion() ? 0.01 : duration
		stop = driveDot(dotEl, drive, runwayEl.clientWidth - DOT, seconds)
		const t0 = performance.now()
		const tick = (now: number) => {
			t = Math.min(1, (now - t0) / (seconds * 1000))
			if (t < 1)
				raf = requestAnimationFrame(tick)
		}
		raf = requestAnimationFrame(tick)
	}

	// onDestroy would also run during prerender, where rAF does not exist
	onMount(() => () => {
		stop?.()
		cancelAnimationFrame(raf)
	})
</script>

<figure class='ease-figure'>
	<div class='head'>
		<span class='name'>{label}</span>
		<button type='button' class='play' aria-label={`play ${label}`} onclick={play}>
			<!-- phosphor: play -->
			<svg width='10' height='10' viewBox='0 0 256 256' aria-hidden='true'>
				<path
					fill='currentColor'
					d='M232.4 114.49L88.32 26.35a16 16 0 0 0-16.2-.3A15.86 15.86 0 0 0 64 39.87v176.26A15.94 15.94 0 0 0 80 232a16.07 16.07 0 0 0 8.36-2.35l144.04-88.14a15.81 15.81 0 0 0 0-27ZM80 215.94V40l143.83 88Z'
				/>
			</svg>
		</button>
	</div>
	<EasePlot {curves} alt={`plot of ${label}`} window={win} {width} {t} tracers={[{ fn, fill: pen }]} />
	<div class='runway' bind:this={runwayEl}>
		<div class='dot' bind:this={dotEl} style:background={pen}></div>
	</div>
	<figcaption><code translate='no'>{code}</code></figcaption>
</figure>

<style>
	.ease-figure {
		min-width: 0;
		margin: 0;
	}

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-bottom: 0.55rem;
	}

	.name {
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.01em;
		color: var(--ink);
	}

	.play {
		display: grid;
		place-items: center;
		width: 1.6rem;
		height: 1.6rem;
		border: 1px solid var(--rule);
		border-radius: 999px;
		color: var(--ink-muted);
		cursor: pointer;
		transition:
			color 200ms cubic-bezier(0.22, 0.7, 0.25, 1),
			border-color 200ms cubic-bezier(0.22, 0.7, 0.25, 1);
	}

	.play:hover {
		color: var(--accent);
		border-color: var(--accent);
	}

	.runway {
		position: relative;
		height: 5px;
		margin-top: 0.7rem;
		border-bottom: 1px solid var(--rule);
	}

	.dot {
		position: absolute;
		bottom: -5px;
		left: 0;
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	figcaption {
		margin-top: 0.6rem;
	}

	figcaption code {
		font-family: var(--font-code);
		font-size: 0.68rem;
		line-height: 1.5;
		color: var(--ink-muted);
		overflow-wrap: anywhere;
	}
</style>
