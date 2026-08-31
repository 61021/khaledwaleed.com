<script lang='ts'>
	import { portal } from '$lib/portal'
	import { onMount } from 'svelte'

	let progress = $state(0)
	let article: HTMLElement | null = null
	let frame = 0

	function update() {
		frame = 0
		if (!article)
			return
		// Layout offsets, not getBoundingClientRect: under the glide the
		// rect carries the content transform, which keeps easing after the
		// last native scroll event and froze the bar mid-flight. The sum
		// is pure layout, so the bar rides the native scrollbar.
		let top = 0
		for (let el: HTMLElement | null = article; el; el = el.offsetParent as HTMLElement | null)
			top += el.offsetTop
		const height = article.offsetHeight - window.innerHeight
		const scrolled = window.scrollY - top
		progress = Math.max(0, Math.min(1, scrolled / Math.max(height, 1)))
	}

	// Coalesce scroll and resize events into one update per frame.
	function schedule() {
		if (!frame)
			frame = requestAnimationFrame(update)
	}

	onMount(() => {
		article = document.querySelector('article')
		update()
		return () => cancelAnimationFrame(frame)
	})
</script>

<svelte:window onscroll={schedule} onresize={schedule} />

<!-- Seated on <body> (portal): fixed inside the glide's transformed
     content would pin to the content, not the viewport. -->
<div class='reading-progress pointer-events-none fixed inset-x-0 top-0 z-50 h-px' aria-hidden='true' {@attach portal}>
	<div class='h-full origin-left bg-[var(--accent)]' style='transform: scaleX({progress});'></div>
</div>
