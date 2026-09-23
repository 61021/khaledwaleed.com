<script lang='ts'>
	import { palettes } from './monochrome'

	let exposure = $state(1)
</script>

<figure class='blacks'>
	<div class='row' style:--exposure={exposure}>
		{#each palettes as p (p.key)}
			<div class='swatch'>
				<div class='specimen' style:background={p.canvas}>
					<span class='aa' style:color={p.text}>Aa</span>
				</div>
				<p class='fig-cap'>{p.name}</p>
			</div>
		{/each}
	</div>

	<label class='dial'>
		<span class='dial-name'>exposure</span>
		<input type='range' min='1' max='16' step='0.5' bind:value={exposure} />
		<code translate='no' class='dial-value'>×{exposure}</code>
	</label>
</figure>

<style>
	.blacks {
		margin: 2rem 0;
	}

	.row {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	@media (max-width: 34rem) {
		.row {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	/* brightness() multiplies every channel, so a true #000 stays black
	   at any exposure and a black with blue in it gives the blue up. */
	.specimen {
		aspect-ratio: 3 / 4;
		display: grid;
		place-items: end start;
		padding: 0.9rem;
		filter: brightness(var(--exposure));
	}

	.aa {
		font-size: 1.6rem;
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1;
	}

	.dial {
		max-width: 26rem;
	}
</style>
