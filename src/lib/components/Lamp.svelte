<script lang="ts">
	// The lamp — a warm pool of light the visitor carries through the house.
	// This component renders the glow itself and, on fine pointers, walks it
	// after the cursor with a little inertia. It also anchors each .lamp-lit
	// painting's reveal disc in that element's own coordinates (--lit-x/y),
	// re-anchoring on scroll, resize, and navigation.
	//
	// Everything moves by transform over layers painted once — nothing here
	// may cause per-frame rasterisation. Phones drift the glow via CSS
	// keyframes instead (see app.css); reduced motion shows no lamp at all.
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';

	let lit: HTMLElement[] = [];
	let wake = () => {};

	const collect = () => {
		lit = Array.from(document.querySelectorAll<HTMLElement>('.lamp-lit'));
	};

	// Rooms come and go with client-side navigation.
	afterNavigate(() => {
		collect();
		wake();
	});

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		if (!window.matchMedia('(pointer: fine)').matches) return;

		const root = document.documentElement.style;

		let x = innerWidth / 2;
		let y = innerHeight * 0.3;
		let tx = x;
		let ty = y;
		let raf = 0;

		collect();

		const render = () => {
			// All reads before all writes — interleaving them forces a
			// style/layout pass per element per frame.
			const rects = lit.map((el) => el.getBoundingClientRect());
			root.setProperty('--lamp-x', `${x.toFixed(1)}px`);
			root.setProperty('--lamp-y', `${y.toFixed(1)}px`);
			for (let i = 0; i < lit.length; i++) {
				lit[i].style.setProperty('--lit-x', `${(x - rects[i].left).toFixed(1)}px`);
				lit[i].style.setProperty('--lit-y', `${(y - rects[i].top).toFixed(1)}px`);
			}
		};

		// Ease toward the pointer and stop once settled — carried, not
		// strapped to the cursor, and no idle frame loop. A wake always
		// renders at least once, so scroll can re-anchor a resting lamp.
		const step = () => {
			x += (tx - x) * 0.1;
			y += (ty - y) * 0.1;
			const settled = Math.abs(tx - x) + Math.abs(ty - y) < 0.5;
			if (settled) {
				x = tx;
				y = ty;
			}
			render();
			raf = settled ? 0 : requestAnimationFrame(step);
		};

		wake = () => {
			if (!raf) raf = requestAnimationFrame(step);
		};

		const move = (e: PointerEvent) => {
			tx = e.clientX;
			ty = e.clientY;
			wake();
		};

		addEventListener('pointermove', move, { passive: true });
		addEventListener('scroll', wake, { passive: true });
		addEventListener('resize', wake, { passive: true });
		render();
		return () => {
			removeEventListener('pointermove', move);
			removeEventListener('scroll', wake);
			removeEventListener('resize', wake);
			if (raf) cancelAnimationFrame(raf);
			wake = () => {};
		};
	});
</script>

<div class="lamp" aria-hidden="true"></div>

<style>
	/* The glow: one pre-painted disc, moved by transform, lifting whatever
	   it crosses. Below the command palette (z-100), above what it lights.
	   Its blend region is the disc, not the viewport. */
	.lamp {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 40;
		width: 40rem;
		height: 40rem;
		pointer-events: none;
		mix-blend-mode: soft-light;
		background: radial-gradient(
			circle closest-side,
			rgb(255 236 200 / 0.9),
			rgb(255 236 200 / 0.35) 50%,
			transparent 100%
		);
		transform: translate3d(calc(var(--lamp-x) - 20rem), calc(var(--lamp-y) - 20rem), 0);
	}

	@media (prefers-reduced-motion: reduce) {
		.lamp {
			display: none;
		}
	}

	@media print {
		.lamp {
			display: none;
		}
	}
</style>
