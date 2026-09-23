<script lang='ts'>
	import type { PlotCurve } from './types'
	import { gsap } from 'gsap'
	import { onMount } from 'svelte'
	import { driveDot, prefersReducedMotion } from './drive'
	import EasePlot from './EasePlot.svelte'
	import { fill } from './fill'

	type Family = 'back' | 'elastic'

	const DOT = 10
	const DURATION = 1.5

	let family = $state<Family>('back')
	let overshoot = $state(1.7)
	let amplitude = $state(1)
	let period = $state(0.3)

	function fmt(v: number): string {
		return String(Number(v.toFixed(2)))
	}

	const easeStr = $derived(family === 'back'
		? `back.out(${fmt(overshoot)})`
		: `elastic.out(${fmt(amplitude)}, ${fmt(period)})`)
	const fn = $derived(gsap.parseEase(easeStr))
	const ghost = $derived<PlotCurve>({
		fn: gsap.parseEase(family === 'back' ? 'back.out(1.7)' : 'elastic.out(1, 0.3)'),
		stroke: 'color-mix(in oklab, var(--ink) 22%, transparent)',
		dash: '4 3',
	})
	// elastic can peak near 1 + amplitude, so its frame gets headroom
	const win = $derived<[number, number]>(family === 'back' ? [-0.1, 1.6] : [-0.12, 2.65])

	let runwayEl = $state<HTMLDivElement>()
	let dotEl = $state<HTMLDivElement>()
	let t = $state<number | null>(null)
	let raf = 0
	let stop: (() => void) | null = null

	function play() {
		if (!dotEl || !runwayEl)
			return
		stop?.()
		cancelAnimationFrame(raf)
		const seconds = prefersReducedMotion() ? 0.01 : DURATION
		stop = driveDot(dotEl, { engine: 'gsap', ease: easeStr }, runwayEl.clientWidth - DOT, seconds)
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

<div class='bench'>
	<div class='stage'>
		<EasePlot
			curves={[ghost, { fn, stroke: 'var(--accent)' }]}
			alt={`plot of ${easeStr} over the family default`}
			window={win}
			width={200}
			{t}
			tracers={[{ fn, fill: 'var(--accent)' }]}
		/>
		<div class='runway' bind:this={runwayEl}>
			<div class='dot' bind:this={dotEl}></div>
		</div>
	</div>

	<div class='controls'>
		<fieldset class='seg code'>
			<legend class='sr-only'>ease family</legend>
			<label class={['seg-option', family === 'back' && 'on']}>
				<input class='sr-only' type='radio' name='pg-family' value='back' bind:group={family} />
				back.out
			</label>
			<label class={['seg-option', family === 'elastic' && 'on']}>
				<input class='sr-only' type='radio' name='pg-family' value='elastic' bind:group={family} />
				elastic.out
			</label>
		</fieldset>

		{#if family === 'back'}
			<label class='param'>
				<span class='param-name'>overshoot</span>
				<input type='range' min='0' max='4' step='0.1' bind:value={overshoot} {@attach fill} />
				<code translate='no' class='param-value'>{fmt(overshoot)}</code>
			</label>
		{:else}
			<label class='param'>
				<span class='param-name'>amplitude</span>
				<input type='range' min='1' max='2' step='0.05' bind:value={amplitude} {@attach fill} />
				<code translate='no' class='param-value'>{fmt(amplitude)}</code>
			</label>
			<label class='param'>
				<span class='param-name'>period</span>
				<input type='range' min='0.1' max='1' step='0.05' bind:value={period} {@attach fill} />
				<code translate='no' class='param-value'>{fmt(period)}</code>
			</label>
		{/if}

		<div class='line'>
			<code translate='no'>ease: "{easeStr}"</code>
			<button type='button' class='chip' onclick={play}>play</button>
		</div>
		<p class='hint'>the dotted curve holds the family default</p>
	</div>
</div>

<style>
	.bench {
		display: grid;
		grid-template-areas: 'stage' 'controls';
		gap: 1.5rem;
		align-items: start;
	}

	@media (min-width: 640px) {
		.bench {
			grid-template-areas: 'controls stage';
			grid-template-columns: 14rem minmax(0, 1fr);
			gap: 2.25rem;
		}
	}

	.stage {
		grid-area: stage;
		min-width: 0;
	}

	.controls {
		grid-area: controls;
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}

	.param {
		display: grid;
		grid-template-columns: 5.2rem minmax(0, 1fr) 2.6rem;
		align-items: center;
		gap: 0.6rem;
	}

	.param-name {
		font-size: 0.82rem;
		color: var(--ink-muted);
	}

	.param input[type='range'] {
		min-width: 0;
	}

	.param-value {
		font-family: var(--font-code);
		font-size: 0.78rem;
		color: var(--ink);
		text-align: right;
	}

	.line {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-top: 0.3rem;
	}

	.line code {
		font-family: var(--font-code);
		font-size: 0.82rem;
		color: var(--ink);
		overflow-wrap: anywhere;
	}

	.hint {
		font-size: 0.75rem;
		color: var(--ink-muted);
		margin: 0;
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
		background: var(--accent);
	}
</style>
