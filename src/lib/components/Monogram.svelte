<script lang='ts'>
	import { monogram } from '$lib/monogram'

	interface Props {
		/** Host class; the mark takes its size and colour from whatever sets it. */
		class?: string
	}

	const { class: klass }: Props = $props()
</script>

<!-- The house signature. Inline rather than an <img> so it inherits the
     room's ink and the link's hover, and so the screensaver can sweep a
     mask across it. Always decorative: every host already carries the
     name in text. -->
<svg
	class={klass}
	viewBox={monogram.viewBox}
	fill='currentColor'
	xmlns='http://www.w3.org/2000/svg'
	aria-hidden='true'
	focusable='false'
>
	{#each monogram.paths as d (d)}
		<path {d} />
	{/each}
</svg>
