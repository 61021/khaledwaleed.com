<script lang='ts'>
	import { onMount } from 'svelte'

	let progress = $state(0)
	let article: HTMLElement | null = null
	let frame = 0

	function update() {
		frame = 0
		if (!article)
			return
		const top = article.getBoundingClientRect().top + window.scrollY
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

<div class='pointer-events-none fixed inset-x-0 top-0 z-50 h-px' aria-hidden='true'>
	<div class='h-full origin-left bg-[var(--accent)]' style='transform: scaleX({progress});'></div>
</div>
