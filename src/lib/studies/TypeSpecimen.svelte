<script lang='ts'>
	import type { SiteKey } from './types'
	import { palette } from './monochrome'

	interface Setting {
		key: SiteKey
		face: string
		weight: number
		/** letter-spacing in em for a given font size in px */
		track: (px: number) => number
	}

	// Tracking rules as each site's CSS writes them. Vercel's comes from
	// its token table (20px -2%, 24px -4%, 48px and up -6%); a size
	// between two tokens takes the step below it.
	const settings: Setting[] = [
		{ key: 'resend', face: 'var(--font-display)', weight: 400, track: () => -0.01 },
		{ key: 'vercel', face: 'var(--font-body)', weight: 400, track: px => px >= 48 ? -0.06 : px >= 24 ? -0.04 : px >= 20 ? -0.02 : 0 },
		{ key: 'linear', face: 'var(--font-body)', weight: 510, track: px => px >= 32 ? -0.022 : -0.012 },
		{ key: 'raycast', face: 'var(--font-body)', weight: 600, track: () => 0 },
	]

	let size = $state(64)
	let gradient = $state(true)
</script>

<figure class='type'>
	<div class='specimen'>
		{#each settings as s (s.key)}
			{@const p = palette(s.key)}
			<div class='row' style:background={p.canvas}>
				<p
					class={['sample', s.key === 'resend' && gradient && 'gradient']}
					style:color={p.text}
					style:font-family={s.face}
					style:font-weight={s.weight}
					style:font-size={`${size}px`}
					style:letter-spacing={`${s.track(size)}em`}
				>
					Gray on black
				</p>
				<p class='spec' style:color={p.secondary}>{p.name}</p>
			</div>
		{/each}
	</div>

	<div class='controls'>
		<label class='dial'>
			<span class='dial-name'>size</span>
			<input type='range' min='16' max='96' step='1' bind:value={size} />
			<code translate='no' class='dial-value'>{size}px</code>
		</label>
		<label class='check'>
			<input type='checkbox' bind:checked={gradient} />
			gradient text
		</label>
	</div>
</figure>

<style>
	.type {
		margin: 2rem 0;
	}

	.row {
		padding: 1.1rem 1.4rem 0.9rem;
		overflow: hidden;
	}

	.sample {
		margin: 0;
		line-height: 1.05;
	}

	/* resend's H1, as served: white fading to half-white, clipped to
	   the glyphs. */
	.sample.gradient {
		background: linear-gradient(to bottom right, #fff 30%, #ffffff80);
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.spec {
		margin: 0.5rem 0 0;
	}

	.spec {
		font-size: 0.75rem;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem 2rem;
		margin-top: 1.25rem;
	}

	.dial {
		flex: 1 1 18rem;
		max-width: 26rem;
	}

	.check {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.82rem;
		color: var(--ink-muted);
		cursor: pointer;
	}

	.check input {
		accent-color: var(--accent);
	}
</style>
