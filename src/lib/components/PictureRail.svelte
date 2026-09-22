<!-- The colophon's picture rail: a gallery moulding with one cord per
     room hanging a gilt gem, the room you stand in lit. The cords drop
     once when the rail comes into view. -->
<script lang='ts'>
	interface Props {
		count: number
		lit: number
	}

	const { count, lit }: Props = $props()

	function hang(node: HTMLElement): (() => void) | undefined {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches)
			return
		node.classList.add('waiting')
		const io = new IntersectionObserver((entries) => {
			if (!entries.some(e => e.isIntersecting))
				return
			node.classList.add('hung')
			io.disconnect()
		}, { rootMargin: '0px 0px -10% 0px' })
		io.observe(node)
		return () => io.disconnect()
	}
</script>

<div class='rail' aria-hidden='true' {@attach hang}>
	<div class='hooks'>
		{#each { length: count }, i}
			<span class={['hook', i === lit && 'lit']} style:--i={i} style:--drop={i % 3}>
				<span class='cord'></span>
				<span class='gem'></span>
			</span>
		{/each}
	</div>
</div>

<style>
	.rail {
		position: relative;
		padding-top: 4px;
		color: color-mix(in oklab, var(--accent) 45%, var(--ink-dim));
	}

	/* The moulding: a hairline and a fainter lip under it, both fading
	   out at the ends like the engraved rule. */
	.rail::before,
	.rail::after {
		content: '';
		position: absolute;
		inset-inline: 0;
		height: 1px;
		-webkit-mask-image: linear-gradient(to right, transparent, black 18%, black 82%, transparent);
		mask-image: linear-gradient(to right, transparent, black 18%, black 82%, transparent);
	}

	.rail::before {
		top: 0;
		background: var(--rule);
	}

	.rail::after {
		top: 3px;
		background: color-mix(in oklab, var(--rule) 45%, transparent);
	}

	.hooks {
		display: flex;
		justify-content: space-between;
		width: min(100%, 34rem);
		margin-inline: auto;
		padding-inline: 1rem;
	}

	.hook {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.cord {
		width: 1px;
		height: calc(0.9rem + var(--drop) * 0.35rem);
		background: linear-gradient(to bottom, var(--rule), currentColor);
		transform-origin: top;
	}

	.gem {
		width: 0.3rem;
		height: 0.3rem;
		margin-top: -1px;
		background: currentColor;
		transform: rotate(45deg);
	}

	.lit {
		color: var(--accent);
	}

	.lit .gem {
		width: 0.42rem;
		height: 0.42rem;
		box-shadow: 0 0 0 2px color-mix(in oklab, var(--accent) 18%, transparent);
	}

	.rail:global(.waiting) .cord {
		transform: scaleY(0);
	}

	.rail:global(.waiting) .gem {
		opacity: 0;
		transform: translateY(-0.6rem) rotate(45deg);
	}

	.rail:global(.hung) .cord,
	.rail:global(.hung) .gem {
		transition:
			transform 520ms var(--ease-out),
			opacity 320ms var(--ease-out);
		transition-delay: calc(var(--i) * 45ms);
	}

	.rail:global(.hung) .cord {
		transform: scaleY(1);
	}

	.rail:global(.hung) .gem {
		opacity: 1;
		transform: translateY(0) rotate(45deg);
		transition-delay: calc(var(--i) * 45ms + 160ms);
	}
</style>
