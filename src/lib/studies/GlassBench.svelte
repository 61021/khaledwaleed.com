<script lang='ts'>
	import type { GlassKey } from './types'
	import { glass, NAV_HEIGHT } from './apple'
	import { fill } from './fill'

	const MAX = 320

	const options: { key: GlassKey, name: string }[] = [
		{ key: 'apple', name: 'apple.com' },
		{ key: 'blur', name: 'blur only' },
		{ key: 'tint', name: 'no blur' },
	]

	const labels = ['Store', 'Mac', 'iPad', 'iPhone', 'Watch', 'Support']

	const tiles = [
		{ name: 'Orange', paint: '#f26b1d', ink: '#fff' },
		{ name: 'Lavender', paint: '#c7b6ec', ink: '#1d1d1f' },
		{ name: 'Sage', paint: '#97b48f', ink: '#1d1d1f' },
	]

	const filters: Record<GlassKey, string> = {
		apple: glass.filter,
		blur: 'blur(20px)',
		tint: 'none',
	}

	let mode = $state<GlassKey>('apple')
	let scroll = $state(0)
</script>

<figure class='bench'>
	<fieldset class='seg'>
		<legend class='sr-only'>how the bar is drawn</legend>
		{#each options as o (o.key)}
			<label class={['seg-option', mode === o.key && 'on']}>
				<input class='sr-only' type='radio' name='glass-mode' value={o.key} bind:group={mode} />
				{o.name}
			</label>
		{/each}
	</fieldset>

	<div class='specimen viewport'>
		<div class='page' style:transform={`translateY(${-scroll}px)`}>
			<p class='lead'>The page underneath.</p>
			<p class='line'>Drag it up under the bar.</p>
			{#each tiles as tile (tile.name)}
				<div class='tile' style:background={tile.paint} style:color={tile.ink}>{tile.name}</div>
			{/each}
		</div>

		<header class='bar' style:height={`${NAV_HEIGHT}px`} style:background={glass.tint} style:backdrop-filter={filters[mode]}>
			{#each labels as label (label)}
				<span>{label}</span>
			{/each}
		</header>
	</div>

	<label class='dial'>
		<span class='dial-name'>scroll</span>
		<input type='range' min='0' max={MAX} step='1' bind:value={scroll} {@attach fill} />
		<code translate='no' class='dial-value'>{scroll}px</code>
	</label>
</figure>

<style>
	.bench {
		margin: 2rem 0;
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}

	.viewport {
		height: 21rem;
		background: #fff;
		color: #1d1d1f;
		color-scheme: light;
		font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, var(--font-body);
	}

	.page {
		padding-top: 4.75rem;
	}

	.page p {
		margin: 0;
		padding: 0 1.25rem;
	}

	.lead {
		font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, var(--font-body);
		font-size: 1.75rem;
		font-weight: 600;
		line-height: 1.15;
	}

	.page .line {
		margin: 0.35rem 0 1.5rem;
		font-size: 1rem;
		color: #6e6e73;
	}

	/* The home page's tiles: edge to edge, 12px apart, the name
	   centred near the top. */
	.tile {
		display: flex;
		justify-content: center;
		height: 9rem;
		margin-bottom: 12px;
		padding-top: 1.6rem;
		font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, var(--font-body);
		font-size: 1.75rem;
		font-weight: 600;
	}

	.bar {
		position: absolute;
		inset: 0 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2.1rem;
		padding: 0 1rem;
		overflow: hidden;
		font-size: 12px;
		letter-spacing: -0.01em;
		color: rgba(0, 0, 0, 0.8);
		z-index: 1;
	}

	.dial {
		max-width: 26rem;
	}

	@media (max-width: 34rem) {
		.bar {
			justify-content: flex-start;
			gap: 1.4rem;
		}
	}
</style>
