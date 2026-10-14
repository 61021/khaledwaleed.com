<script lang='ts'>
	import { higEm, higTracking, siteEm, siteSizes } from './apple'
	import { fill } from './fill'

	const H = 200
	const PAD = { l: 52, r: 14, t: 14, b: 30 }
	const X: [number, number] = [6, 96]
	const Y: [number, number] = [-0.032, 0.046]
	const X_TICKS = [6, 12, 17, 24, 40, 80]
	const Y_TICKS = [0.04, 0.02, 0, -0.02]

	let at = $state(siteSizes.findIndex(s => s.px === 17))
	let w = $state(640)

	const size = $derived(siteSizes[at])
	const table = $derived(higEm(size.px))
	const site = $derived(siteEm(size))

	// Sizes run on a log scale so the small end, where the table
	// changes fastest, isn't squeezed into the first fifth.
	function sx(px: number): number {
		const u = Math.log(px / X[0]) / Math.log(X[1] / X[0])
		return PAD.l + u * (w - PAD.l - PAD.r)
	}

	function sy(em: number): number {
		return PAD.t + ((Y[1] - em) / (Y[1] - Y[0])) * (H - PAD.t - PAD.b)
	}

	const line = $derived(
		higTracking.map(([px, pm], i) => `${i ? 'L' : 'M'}${sx(px).toFixed(1)} ${sy(pm / 1000).toFixed(1)}`).join(' '),
	)

	function em(v: number): string {
		if (Math.abs(v) < 0.0005)
			return '0em'
		return `${v > 0 ? '+' : '−'}${Math.abs(v).toFixed(3)}em`
	}

	function face(display: boolean): string {
		return display
			? '"SF Pro Display", -apple-system, BlinkMacSystemFont, var(--font-body)'
			: '"SF Pro Text", -apple-system, BlinkMacSystemFont, var(--font-body)'
	}
</script>

<figure class='tracking'>
	<div class='plot' bind:clientWidth={w}>
		<svg width={w} height={H} role='img' aria-label='tracking by size: apple’s table as a line, apple.com as dots'>
			{#each Y_TICKS as t (t)}
				<line class={['grid', t === 0 && 'zero']} x1={PAD.l} x2={w - PAD.r} y1={sy(t)} y2={sy(t)} />
				<text class='tick' x={PAD.l - 8} y={sy(t) + 3.5} text-anchor='end'>{t === 0 ? '0' : `${t > 0 ? '+' : '−'}${Math.abs(t).toFixed(2)}`}</text>
			{/each}
			{#each X_TICKS as t (t)}
				<text class='tick' x={sx(t)} y={H - 8} text-anchor='middle'>{t}</text>
			{/each}

			<line class='cursor' x1={sx(size.px)} x2={sx(size.px)} y1={PAD.t} y2={H - PAD.b} />
			<path class='table' d={line} />
			{#each siteSizes as s (s.px)}
				<circle class={['dot', s.px === size.px && 'on']} cx={sx(s.px)} cy={sy(siteEm(s))} r={s.px === size.px ? 4.5 : 3.25} />
			{/each}
			<circle class='mark' cx={sx(size.px)} cy={sy(table)} r='4' />
		</svg>
	</div>

	<p class='legend'>
		<span class='key'><span class='swatch line'></span>apple’s table</span>
		<span class='key'><span class='swatch dot-key'></span>apple.com</span>
	</p>

	<div class='specimen'>
		{#each [{ name: 'apple’s table', value: table }, { name: 'apple.com', value: site }] as row (row.name)}
			<div class='row'>
				<p class='spec'>
					<span>{row.name}</span>
					<code translate='no'>{em(row.value)}</code>
				</p>
				<p
					class='sample'
					style:font-family={face(size.face === 'display')}
					style:font-weight={size.face === 'display' ? 600 : 400}
					style:font-size={`${size.px}px`}
					style:letter-spacing={`${row.value}em`}
				>
					Hello, hello.
				</p>
			</div>
		{/each}
	</div>

	<label class='dial'>
		<span class='dial-name'>size</span>
		<input type='range' min='0' max={siteSizes.length - 1} step='1' bind:value={at} {@attach fill} />
		<code translate='no' class='dial-value'>{size.px}px</code>
	</label>
</figure>

<style>
	.tracking {
		margin: 2rem 0;
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}

	.plot {
		width: 100%;
	}

	svg {
		display: block;
		overflow: visible;
	}

	.grid {
		stroke: var(--rule);
		stroke-width: 1;
	}

	.grid.zero {
		stroke: var(--line);
	}

	.tick {
		font-family: var(--font-code);
		font-size: 10px;
		fill: var(--ink-dim);
	}

	.cursor {
		stroke: var(--ink-dim);
		stroke-width: 1;
		stroke-dasharray: 3 3;
	}

	.table {
		fill: none;
		stroke: var(--ink-muted);
		stroke-width: 1.5;
		stroke-linejoin: round;
	}

	.dot {
		fill: var(--ink);
		stroke: #fff;
		stroke-width: 1.5;
	}

	.mark {
		fill: #fff;
		stroke: var(--ink-muted);
		stroke-width: 1.5;
	}

	.legend {
		display: flex;
		gap: 1.5rem;
		margin: -0.4rem 0 0;
		font-size: 0.78rem;
		color: var(--ink-muted);
	}

	.key {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.swatch {
		display: inline-block;
	}

	.swatch.line {
		width: 1.1rem;
		height: 1.5px;
		background: var(--ink-muted);
	}

	.swatch.dot-key {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--ink);
	}

	/* apple.com's own page: its light gray, its near-black ink. */
	.specimen {
		background: #f5f5f7;
		color: #1d1d1f;
		color-scheme: light;
	}

	.row {
		padding: 0.9rem 1.4rem 1.1rem;
	}

	.row + .row {
		border-top: 1px solid #e3e3e8;
	}

	.spec {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin: 0 0 0.4rem;
		font-size: 0.75rem;
		color: #6e6e73;
	}

	.spec code {
		font-size: 0.72rem;
		color: #1d1d1f;
	}

	/* One line at every size, so the two rows end where their spacing
	   puts them; the height fits the largest size and never moves. */
	.sample {
		height: 5.4rem;
		margin: 0;
		display: flex;
		align-items: flex-end;
		line-height: 1.05;
		white-space: nowrap;
		overflow: hidden;
	}

	.dial {
		max-width: 26rem;
	}
</style>
