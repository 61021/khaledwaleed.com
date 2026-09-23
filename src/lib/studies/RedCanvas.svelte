<script lang='ts'>
	let gray = $state(false)
</script>

<figure class='red'>
	<fieldset class='seg'>
		<legend class='sr-only'>filter on the canvas</legend>
		<label class={['seg-option', !gray && 'on']}>
			<input class='sr-only' type='radio' name='red-filter' value={false} bind:group={gray} />
			as raycast ships it
		</label>
		<label class={['seg-option', gray && 'on']}>
			<input class='sr-only' type='radio' name='red-filter' value={true} bind:group={gray} />
			through resend's grayscale(1)
		</label>
	</fieldset>

	<div class='specimen'>
		<div class={['field', gray && 'gray']}></div>
		<p class='over'>one canvas</p>
	</div>

	<p class='fig-cap'>
		a css stand-in, painted from the four colors in raycast's shader
		(<code translate='no'>#f4feff</code>, <code translate='no'>#ff7a98</code>,
		<code translate='no'>#b80232</code>, <code translate='no'>#ff162a</code>).
		the real one is webgl, the red field seen through 16 glass rods at 42 degrees.
	</p>
</figure>

<style>
	.red {
		margin: 2rem 0;
	}

	.seg {
		margin-bottom: 1.25rem;
	}

	.specimen {
		height: 18rem;
		background: #07080a;
		display: grid;
		place-items: center;
	}

	.field {
		position: absolute;
		inset: -3rem;
		background:
			radial-gradient(40% 55% at 50% 50%, #ff7a98 0%, transparent 70%),
			repeating-linear-gradient(135deg, #ff162a 0 1.4rem, #b80232 2.4rem, #07080a 3.6rem 5.6rem, #f4feff 5.75rem, #07080a 5.9rem 6.4rem);
		mask-image: radial-gradient(60% 70% at 50% 50%, #000 30%, transparent 75%);
		filter: blur(10px) grayscale(0);
		transition: filter 320ms cubic-bezier(0.22, 0.7, 0.25, 1);
	}

	.field.gray {
		filter: blur(10px) grayscale(1);
	}

	.over {
		position: relative;
		margin: 0;
		color: #fff;
		font-size: clamp(1.6rem, 4vw, 2.4rem);
		font-weight: 600;
		letter-spacing: -0.01em;
		text-shadow: 0 4px 4px #00000026;
	}

	@media (prefers-reduced-motion: reduce) {
		.field {
			transition: none;
		}
	}
</style>
