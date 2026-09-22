<!-- The page is signed where a canvas is: bottom right, at the end of a
     hairline. The mark is drawn stroke-first and the ink settles after,
     once, when the footer arrives. -->
<script lang='ts'>
	import { monogram } from '$lib/monogram'

	function sign(node: HTMLElement): (() => void) | undefined {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches)
			return
		node.classList.add('unsigned')
		const io = new IntersectionObserver((entries) => {
			if (!entries.some(e => e.isIntersecting))
				return
			node.classList.add('signing')
			io.disconnect()
		}, { rootMargin: '0px 0px -10% 0px' })
		io.observe(node)
		return () => io.disconnect()
	}
</script>

<div class='sign' {@attach sign}>
	<span class='line'></span>
	<svg
		viewBox='-1 -1 {monogram.width + 2} {monogram.height + 2}'
		xmlns='http://www.w3.org/2000/svg'
		aria-hidden='true'
		focusable='false'
	>
		{#each monogram.paths as d, i (d)}
			<path {d} pathLength='1' style:--i={i} />
		{/each}
	</svg>
</div>

<style>
	.sign {
		display: flex;
		align-items: flex-end;
		gap: 1.25rem;
	}

	.line {
		flex: 1;
		height: 1px;
		margin-bottom: 0.9rem;
		background: linear-gradient(to right, transparent, var(--rule) 30%);
	}

	svg {
		width: clamp(84px, 11vw, 140px);
		height: auto;
		overflow: visible;
		color: var(--accent);
	}

	path {
		fill: currentColor;
		stroke: currentColor;
		stroke-width: 0.35;
	}

	/* Held unlettered until the footer is in view; JS-off and
	   reduced-motion visitors get the finished mark. */
	.sign:global(.unsigned) path {
		fill-opacity: 0;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
	}

	.sign:global(.signing) path {
		stroke-dasharray: 1;
		animation:
			draw 1400ms cubic-bezier(0.45, 0, 0.25, 1) both,
			ink 500ms var(--ease-out) both;
		/* The w is written first; the k follows, then both take ink. */
		animation-delay: calc(var(--i) * 700ms), calc(var(--i) * 700ms + 1100ms);
	}

	@keyframes draw {
		from {
			stroke-dashoffset: 1;
		}
		to {
			stroke-dashoffset: 0;
		}
	}

	@keyframes ink {
		from {
			fill-opacity: 0;
		}
		to {
			fill-opacity: 1;
		}
	}
</style>
