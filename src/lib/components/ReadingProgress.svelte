<script lang="ts">
	import { onMount } from 'svelte';

	type Props = { target?: string };
	let { target = 'article' }: Props = $props();

	let progress = $state(0);

	onMount(() => {
		const el = document.querySelector(target) as HTMLElement | null;
		if (!el) return;

		let ticking = false;
		const compute = () => {
			ticking = false;
			const rect = el.getBoundingClientRect();
			const viewport = window.innerHeight;
			const total = Math.max(rect.height - viewport, 1);
			const scrolled = Math.min(Math.max(-rect.top, 0), total);
			progress = (scrolled / total) * 100;
		};

		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(compute);
		};

		compute();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	});
</script>

<div
	class="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent"
	aria-hidden="true"
>
	<div
		class="h-full bg-[var(--brand)] transition-[width] duration-100 ease-out"
		style="width: {progress}%"
	></div>
</div>
