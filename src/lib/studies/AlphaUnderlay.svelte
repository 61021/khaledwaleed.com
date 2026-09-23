<script lang='ts'>
	import type { SitePalette } from './types'
	import { contrast, palettes, parseColor } from './monochrome'

	let strip = $state(false)

	function isAlpha(color: string): boolean {
		return parseColor(color)[3] < 1
	}

	function lines(p: SitePalette): { role: string, color: string }[] {
		return [
			{ role: 'title', color: p.text },
			{ role: 'body', color: p.secondary },
			...(p.faint ? [{ role: 'faint', color: p.faint }] : []),
		]
	}
</script>

<figure class='underlay'>
	<fieldset class='seg'>
		<legend class='sr-only'>under the card</legend>
		<label class={['seg-option', !strip && 'on']}>
			<input class='sr-only' type='radio' name='underlay' value={false} bind:group={strip} />
			flat
		</label>
		<label class={['seg-option', strip && 'on']}>
			<input class='sr-only' type='radio' name='underlay' value={true} bind:group={strip} />
			strip underneath
		</label>
	</fieldset>

	<div class='grid'>
		{#each palettes as p (p.key)}
			<div>
				<div class='specimen' style:background={p.canvas}>
					<div class={['strip', strip && 'on']}></div>
					<div
						class='card'
						style:background={p.surface}
						style:border-color={p.ring ? 'transparent' : p.border}
						style:box-shadow={p.ring ? `0 0 0 1px ${p.border}, 0 0 0 1px ${p.canvas}` : 'none'}
					>
						{#each lines(p) as line (line.role)}
							<p class={['line', line.role]} style:color={line.color}>
								{line.role}
								<span class='ratio'>{contrast(line.color, p.canvas).toFixed(2)}</span>
							</p>
						{/each}
					</div>
				</div>
				<p class='fig-cap'>{p.name}, {isAlpha(p.surface) ? 'see-through' : 'solid'}</p>
			</div>
		{/each}
	</div>
	<p class='fig-cap'>the numbers are contrast. under 4.5 is hard to read.</p>
</figure>

<style>
	.underlay {
		margin: 2rem 0;
	}

	.seg {
		margin-bottom: 1.25rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.75rem 1.25rem;
		margin-bottom: 0.5rem;
	}

	@media (max-width: 34rem) {
		.grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	/* rows share a height, so a two-line card sits on as much canvas
	   as a three-line one */
	.grid > div {
		display: flex;
		flex-direction: column;
	}

	.specimen {
		flex: 1;
		padding: 1.75rem 1.25rem;
	}

	.strip {
		position: absolute;
		inset: 42% -1rem auto;
		height: 2.6rem;
		background: #e5484d;
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 320ms cubic-bezier(0.22, 0.7, 0.25, 1);
	}

	.strip.on {
		transform: scaleX(1);
	}

	.card {
		position: relative;
		border: 1px solid;
		border-radius: 12px;
		padding: 1rem 1.1rem;
	}

	.line {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.9;
	}

	.line.title {
		font-weight: 600;
	}

	.ratio {
		font-family: var(--font-code);
		font-size: 0.75rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.strip {
			transition: none;
		}
	}
</style>
