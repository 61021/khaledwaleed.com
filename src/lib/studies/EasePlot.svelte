<script lang='ts'>
	import type { PlotCurve, PlotTracer } from './types'

	interface Props {
		curves: PlotCurve[]
		/** what the figure shows, for screen readers */
		alt: string
		/** vertical value window; the 0..1 square always sits inside it */
		window?: [number, number]
		/** viewBox width in user units; height follows the window */
		width?: number
		/** shared tracer time while a demo runs, or null when parked */
		t?: number | null
		tracers?: PlotTracer[]
	}

	const {
		curves,
		alt,
		window: win = [-0.1, 1.42],
		width = 140,
		t = null,
		tracers = [],
	}: Props = $props()

	const SAMPLES = 140

	const top = $derived((1 - win[1]) * 100)
	const height = $derived((win[1] - win[0]) * 100)

	function sy(v: number): number {
		return (1 - v) * 100
	}

	function pathFor(fn: (u: number) => number): string {
		const pts: string[] = []
		for (let i = 0; i <= SAMPLES; i++) {
			const u = i / SAMPLES
			pts.push(`${(u * width).toFixed(2)} ${sy(fn(u)).toFixed(2)}`)
		}
		return `M ${pts.join(' L ')}`
	}

	const paths = $derived(curves.map(c => ({ ...c, d: pathFor(c.fn) })))
</script>

<svg class='plot' viewBox={`0 ${top} ${width} ${height}`} role='img' aria-label={alt}>
	<g aria-hidden='true'>
		{#each [0.25, 0.5, 0.75] as q (q)}
			<line class='grid' x1={q * width} y1='0' x2={q * width} y2='100' />
			<line class='grid' x1='0' y1={q * 100} x2={width} y2={q * 100} />
		{/each}
		<rect class='frame' x='0' y='0' {width} height='100' />
		{#each paths as p, i (i)}
			<path class='curve' d={p.d} stroke={p.stroke} stroke-dasharray={p.dash ?? null} />
		{/each}
		{#if t !== null}
			{#each tracers as tr, i (i)}
				<circle cx={t * width} cy={sy(tr.fn(t))} r='2.6' fill={tr.fill} />
			{/each}
		{/if}
		<text x='3.5' y='8'>1</text>
		<text x='3.5' y='96.5'>0</text>
	</g>
</svg>

<style>
	.plot {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}

	.grid {
		stroke: var(--rule);
		stroke-width: 1px;
		vector-effect: non-scaling-stroke;
	}

	.frame {
		fill: none;
		stroke: var(--ink-dim);
		stroke-opacity: 0.6;
		stroke-width: 1px;
		vector-effect: non-scaling-stroke;
	}

	.curve {
		fill: none;
		stroke-width: 1.5px;
		stroke-linecap: round;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}

	text {
		font-family: var(--font-code);
		font-size: 5.5px;
		fill: var(--ink-muted);
	}
</style>
