<script lang="ts">
	// The lamp — a warm pool of light the visitor carries through the house.
	// This component renders the light itself and, on fine pointers, walks
	// it after the cursor with a little inertia. Everything else that reacts
	// to it (the vignette, the painting reveals) reads --lamp-x/--lamp-y off
	// <html>. Phones drift the light slowly via CSS instead (see app.css);
	// reduced motion leaves it at rest where the old vignette pooled.
	import { onMount } from 'svelte';

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		if (!window.matchMedia('(pointer: fine)').matches) return;

		const root = document.documentElement.style;

		let x = innerWidth / 2;
		let y = innerHeight * 0.3;
		let tx = x;
		let ty = y;
		let raf = 0;

		const apply = () => {
			root.setProperty('--lamp-x', `${x.toFixed(1)}px`);
			root.setProperty('--lamp-y', `${y.toFixed(1)}px`);
		};

		// Ease toward the pointer and stop once settled — carried, not
		// strapped to the cursor, and no idle frame loop.
		const step = () => {
			x += (tx - x) * 0.1;
			y += (ty - y) * 0.1;
			if (Math.abs(tx - x) + Math.abs(ty - y) < 0.5) {
				x = tx;
				y = ty;
				raf = 0;
			} else {
				raf = requestAnimationFrame(step);
			}
			apply();
		};

		const move = (e: PointerEvent) => {
			tx = e.clientX;
			ty = e.clientY;
			if (!raf) raf = requestAnimationFrame(step);
		};

		addEventListener('pointermove', move, { passive: true });
		return () => {
			removeEventListener('pointermove', move);
			if (raf) cancelAnimationFrame(raf);
		};
	});
</script>

<div class="lamp" aria-hidden="true"></div>

<style>
	/* The light: lifts whatever it crosses — wallpaper, frames, ink.
	   Below the command palette (z-100), above everything it illuminates. */
	.lamp {
		position: fixed;
		inset: 0;
		z-index: 40;
		pointer-events: none;
		mix-blend-mode: soft-light;
		background: radial-gradient(
			circle 26rem at var(--lamp-x, 50%) var(--lamp-y, 30%),
			rgb(255 236 200 / 0.9),
			rgb(255 236 200 / 0.35) 45%,
			transparent 72%
		);
	}

	@media print {
		.lamp {
			display: none;
		}
	}
</style>
