<script lang='ts'>
	import type { SiteKey } from './types'
	import { palettes } from './monochrome'

	const recipes: Record<SiteKey, string> = {
		vercel: 'box-shadow: 0 0 0 1px #ffffff25, 0 0 0 1px #000',
		linear: 'border: 1px solid #ffffff0d; ::after { border: 1px solid #ffffff14; mask: radial-gradient(ellipse 200px 200px at var(--mask-x) var(--mask-y), #000, #0009 30%, #0003 50%, #0000 70%) }',
		resend: 'border: 1px solid transparent; background: linear-gradient(42deg, #141517, #191b1e) padding-box, linear-gradient(42deg, rgba(24,25,28,.88) 45%, rgba(215,239,248,.28)) border-box',
		raycast: '::before { padding: 1px; background: linear-gradient(135deg, #ffffff1a, #ffffff0f 38% 62%, #ffffff1a); mask-composite: exclude }',
	}

	let loupe = $state(false)

	// The pointer only moves a custom property on the one card that
	// uses it; nothing reactive runs per frame.
	function aim(e: PointerEvent) {
		const el = e.currentTarget as HTMLElement
		const r = el.getBoundingClientRect()
		el.style.setProperty('--mask-x', `${((e.clientX - r.left) / r.width) * 100}%`)
		el.style.setProperty('--mask-y', `${((e.clientY - r.top) / r.height) * 100}%`)
	}

	function rest(e: PointerEvent) {
		const el = e.currentTarget as HTMLElement
		el.style.removeProperty('--mask-x')
		el.style.removeProperty('--mask-y')
	}
</script>

<figure class='hairlines'>
	<fieldset class='seg'>
		<legend class='sr-only'>magnification</legend>
		<label class={['seg-option', !loupe && 'on']}>
			<input class='sr-only' type='radio' name='loupe' value={false} bind:group={loupe} />
			actual size
		</label>
		<label class={['seg-option', loupe && 'on']}>
			<input class='sr-only' type='radio' name='loupe' value={true} bind:group={loupe} />
			the corner at 4×
		</label>
	</fieldset>

	<div class='grid'>
		{#each palettes as p (p.key)}
			<div>
				<div class='specimen' style:background={p.canvas}>
					<div class={['frame', loupe && 'loupe']}>
						{#if p.key === 'linear'}
							<div class='card linear' role='presentation' onpointermove={aim} onpointerleave={rest}></div>
						{:else}
							<div class={['card', p.key]}></div>
						{/if}
					</div>
				</div>
				<p class='fig-cap'>
					{p.name}<br />
					<code translate='no'>{recipes[p.key]}</code>
				</p>
			</div>
		{/each}
	</div>
	<p class='fig-cap'>
		every card here takes the same 12px radius so that only the line changes. linear pins its light at 8% 0; on this card it follows your pointer.
	</p>
</figure>

<style>
	.hairlines {
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

	.specimen {
		height: 11rem;
		padding: 1.5rem;
	}

	.frame {
		height: 100%;
	}

	/* zoom re-lays the card out at four times the size, so a 1px line
	   draws as 4 real pixels instead of a blurred bitmap. A fixed box
	   keeps it from shrinking back into the plate; the plate crops it
	   to the top-left corner. */
	.frame.loupe {
		zoom: 4;
		width: 14rem;
		height: 8rem;
	}

	.card {
		position: relative;
		height: 100%;
		border-radius: 12px;
	}

	.card.vercel {
		background: #0a0a0a;
		box-shadow: 0 0 0 1px #ffffff25, 0 0 0 1px #000;
	}

	.card.linear {
		--mask-x: 8%;
		--mask-y: 0%;
		background: #0f1011;
		border: 1px solid #ffffff0d;
	}

	.card.linear::after {
		content: '';
		position: absolute;
		inset: -1px;
		border-radius: inherit;
		border: 1px solid #ffffff14;
		mask-image: radial-gradient(ellipse 200px 200px at var(--mask-x) var(--mask-y), #000 0%, #0009 30%, #0003 50%, #0000 70%);
		pointer-events: none;
	}

	.card.resend {
		border: 1px solid transparent;
		background:
			linear-gradient(42deg, #141517, #191b1e) padding-box,
			linear-gradient(42deg, rgba(24, 25, 28, 0.88) 45%, rgba(215, 239, 248, 0.28)) border-box;
	}

	.card.raycast {
		background: linear-gradient(45deg, #0c0d0f, #07080a);
	}

	.card.raycast::before {
		content: '';
		position: absolute;
		inset: 0;
		padding: 1px;
		border-radius: inherit;
		background: linear-gradient(135deg, #ffffff1a, #ffffff0f 38% 62%, #ffffff1a);
		mask:
			linear-gradient(#000, #000) content-box,
			linear-gradient(#000, #000);
		mask-composite: exclude;
		pointer-events: none;
	}

	.fig-cap code {
		overflow-wrap: anywhere;
	}
</style>
