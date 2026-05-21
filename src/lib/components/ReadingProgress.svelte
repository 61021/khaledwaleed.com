<script lang="ts">
	import { onMount } from 'svelte';

	let progress = $state(0);

	onMount(() => {
		if (typeof window === 'undefined') return;
		const article = document.querySelector('article');
		if (!article) return;

		function update() {
			const el = article as HTMLElement;
			const top = el.getBoundingClientRect().top + window.scrollY;
			const height = el.offsetHeight - window.innerHeight;
			const scrolled = window.scrollY - top;
			progress = Math.max(0, Math.min(1, scrolled / Math.max(height, 1)));
		}

		update();
		window.addEventListener('scroll', update, { passive: true });
		window.addEventListener('resize', update);
		return () => {
			window.removeEventListener('scroll', update);
			window.removeEventListener('resize', update);
		};
	});
</script>

<div
	class="pointer-events-none fixed inset-x-0 top-0 z-50 h-px"
	aria-hidden="true"
>
	<div
		class="h-full origin-left bg-[var(--accent)]"
		style="transform: scaleX({progress});"
	></div>
</div>
