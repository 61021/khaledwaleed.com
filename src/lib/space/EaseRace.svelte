<script lang='ts'>
	import type { DriveSpec, EaseFn } from './types'
	import { gsap } from 'gsap'
	import { onMount } from 'svelte'
	import { driveDot, prefersReducedMotion } from './drive'
	import EasePlot from './EasePlot.svelte'
	import { cubicBezier, linearStopsFn, sampleStops, toCssLinear } from './easing'

	const DOT = 10
	const DURATION = 1.8

	const elasticFn = gsap.parseEase('elastic.out(1, 0.3)')
	const springFn = cubicBezier(0.34, 1.56, 0.64, 1)
	const stops = sampleStops(elasticFn, 80)
	const approxFn = linearStopsFn(stops)

	interface Lane {
		name: string
		code: string
		spec: DriveSpec
		fn: EaseFn
		pen: string
		dash?: string
	}

	const lanes: Lane[] = [
		{
			name: 'gsap',
			code: 'ease: "elastic.out(1, 0.3)"',
			spec: { engine: 'gsap', ease: 'elastic.out(1, 0.3)' },
			fn: elasticFn,
			pen: 'var(--accent)',
		},
		{
			name: 'css, one cubic',
			code: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
			spec: { engine: 'css', timing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
			fn: springFn,
			pen: 'var(--ink-muted)',
		},
		{
			name: 'css, linear()',
			code: `linear(${stops[0]}, ${stops[1]}, ${stops[2]}, … 77 more)`,
			spec: { engine: 'css', timing: toCssLinear(stops) },
			fn: approxFn,
			pen: 'var(--ink-muted)',
			dash: '5 4',
		},
	]

	const runways = $state<(HTMLDivElement | undefined)[]>([])
	const dots = $state<(HTMLDivElement | undefined)[]>([])
	let t = $state<number | null>(null)
	let ran = $state(false)
	let raf = 0
	let kills: (() => void)[] = []

	function run() {
		const runway = runways[0]
		if (!runway || dots.some(d => !d))
			return
		for (const kill of kills) kill()
		cancelAnimationFrame(raf)
		ran = true
		const seconds = prefersReducedMotion() ? 0.01 : DURATION
		const distance = runway.clientWidth - DOT
		kills = lanes.map((lane, i) => driveDot(dots[i]!, lane.spec, distance, seconds))
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
		for (const kill of kills) kill()
		cancelAnimationFrame(raf)
	})
</script>

<div class='race'>
	<div class='head'>
		<span class='title'>elastic, three ways · one clock</span>
		<button type='button' class='run' onclick={run}>{ran ? 'run again' : 'run'}</button>
	</div>
	<EasePlot
		curves={lanes.map(l => ({ fn: l.fn, stroke: l.pen, dash: l.dash }))}
		alt='the gsap elastic curve, the one-cubic spring fake, and the linear() transplant overlaid'
		window={[-0.1, 1.45]}
		width={200}
		{t}
		tracers={lanes.map(l => ({ fn: l.fn, fill: l.pen }))}
	/>
	<ol class='lanes'>
		{#each lanes as lane, i (lane.name)}
			<li class='lane'>
				<div class='runway' bind:this={runways[i]}>
					<div class='dot' bind:this={dots[i]} style:background={lane.pen}></div>
				</div>
				<div class='cap'>
					<span class='cap-name'>{lane.name}</span>
					<code class='cap-code'>{lane.code}</code>
				</div>
			</li>
		{/each}
	</ol>
</div>

<style>
	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 0.9rem;
	}

	.title {
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.01em;
		color: var(--ink);
	}

	.run {
		font-size: 0.78rem;
		letter-spacing: 0.02em;
		color: var(--ink-muted);
		border: 1px solid var(--rule);
		border-radius: 999px;
		padding: 0.3rem 0.85rem;
		cursor: pointer;
		transition:
			color 200ms cubic-bezier(0.22, 0.7, 0.25, 1),
			border-color 200ms cubic-bezier(0.22, 0.7, 0.25, 1);
	}

	.run:hover {
		color: var(--accent);
		border-color: var(--accent);
	}

	.lanes {
		list-style: none;
		margin: 1.4rem 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1.35rem;
	}

	.lane {
		min-width: 0;
	}

	.runway {
		position: relative;
		height: 5px;
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

	.cap {
		display: flex;
		align-items: baseline;
		gap: 0.8rem;
		margin-top: 0.5rem;
	}

	.cap-name {
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--ink);
		white-space: nowrap;
	}

	.cap-code {
		font-family: var(--font-code);
		font-size: 0.7rem;
		color: var(--ink-muted);
		overflow-wrap: anywhere;
	}
</style>
