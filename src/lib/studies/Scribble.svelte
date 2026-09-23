<script lang='ts'>
	// A pen underline: one wobbling stroke, left to right, no doubling
	// back. pathLength='1' lets the draw run on unitless dash values, so
	// the same animation works at any width, and the stroke keeps its
	// weight while the box stretches to the word.
	const { class: className = '' }: { class?: string } = $props()
</script>

<svg
	class={className}
	viewBox='0 0 200 14'
	preserveAspectRatio='none'
	fill='none'
	xmlns='http://www.w3.org/2000/svg'
	aria-hidden='true'
>
	<path
		pathLength='1'
		stroke='currentColor'
		stroke-width='1.6'
		stroke-linecap='round'
		stroke-linejoin='round'
		vector-effect='non-scaling-stroke'
		d='M2.5 9.4c12.4-3.6 24.8 2.2 38.2-.9 13.1-3.1 22.6 3.4 35.8.2 11.7-3.9 25.3 1.4 37.1-1.6 12.9-2.4 23.7 3.8 36.4.6 12.1-3.3 24.6 1.9 45.6-2.4'
	/>
</svg>
