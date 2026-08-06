<script lang="ts">
	import type { Snippet } from 'svelte';
	import Painting from './Painting.svelte';
	import { paintings } from '$lib/site';

	type Props = {
		room: keyof typeof paintings | string;
		eyebrow?: string;
		title: string;
		/* Entrance-hall scale: the home page name, larger than a room label. */
		grand?: boolean;
		lede?: Snippet;
		children?: Snippet;
	};

	let { room, eyebrow, title, grand = false, lede, children }: Props = $props();

	const p = $derived(paintings[room as keyof typeof paintings]);

	// The entrance hall painting alone is alive: drifting cloudlight, a
	// breathing moon, and a slow parallax behind the frame.
	const living = $derived(p?.key === 'home');

	// Scroll parallax: the painting lags the page just enough to sit behind
	// the frame. The .live class bakes the zoom at SSR time, so no-JS
	// visitors simply keep a still, slightly tighter crop.
	function parallax(node: HTMLElement, enabled: boolean) {
		if (!enabled) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		let raf = 0;
		const place = () => {
			raf = 0;
			// The 1.16 zoom leaves (0.16 / 2) / 1.16 ≈ 6.9% of the frame in
			// slack above the crop; stay just inside it.
			const slack = node.offsetHeight * 0.065;
			const y = Math.min(Math.max(scrollY, 0) * 0.09, slack);
			node.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(1.16)`;
		};
		const onScroll = () => {
			if (!raf) raf = requestAnimationFrame(place);
		};
		addEventListener('scroll', onScroll, { passive: true });
		addEventListener('resize', onScroll, { passive: true });
		place();
		return {
			destroy() {
				removeEventListener('scroll', onScroll);
				removeEventListener('resize', onScroll);
				if (raf) cancelAnimationFrame(raf);
			}
		};
	}
</script>

<header class="page-header">
	<div class="hero-wrap">
		<div class="hero" style:--focal={p?.focal ?? 'center'}>
			<!-- Every page names its one hero `hero-painting` (see the style
			     block), so navigations swap the canvas inside the frame. -->
			<div class="hero-art lamp-lit">
				<div class="hero-parallax" class:live={living} use:parallax={living}>
					<Painting {room} priority bare />
				</div>
			</div>
			{#if living}
				<!-- Atmosphere over the Dahl: two cloud layers drifting at
				     different speeds, moonlight glinting off the Elbe, and the
				     moon's halo slowly breathing. All compositor work; reduced
				     motion stills every layer. -->
				<div class="atmo" aria-hidden="true">
					<div class="atmo-clouds atmo-a"></div>
					<div class="atmo-clouds atmo-b"></div>
					<div class="atmo-water"></div>
					<div class="atmo-moon"></div>
				</div>
			{/if}
			<div class="hero-veil" aria-hidden="true"></div>

			<div class="hero-content px-6">
				{#if eyebrow}
					<div class="smallcaps hero-eyebrow rise-2">{eyebrow}</div>
				{/if}
				<h1 class="rise-2 page-title" class:page-title-grand={grand}>{title}</h1>
				{#if lede}
					<div class="lede rise-3">
						{@render lede()}
					</div>
				{/if}
			</div>
		</div>

		{#if p}
			<!-- A wall label, set like one: artist, title, year, then the house. -->
			<p class="hero-plate plate rise-3">
				{p.artist}, <em>{p.title}</em>, {p.year}<span class="plate-museum"
					>.
					<a href={p.museumUrl} target="_blank" rel="noopener noreferrer" class="link-quiet"
						>{p.museum}</a
					></span
				>
			</p>
		{/if}
	</div>
</header>

{#if children}
	<div class="rise-3">{@render children()}</div>
{/if}

<style>
	.page-header {
		padding-bottom: 2rem;
	}

	.hero-wrap {
		position: relative;
	}

	/* Mobile-first: a shorter banner with the title card resting on the
	   veiled bottom edge, left-aligned like a frontispiece caption. */
	.hero {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		min-height: clamp(340px, 52svh, 560px);
		width: 100%;
		overflow: hidden;
		isolation: isolate;
	}

	.hero-art {
		position: absolute;
		inset: 0;
		z-index: 0;
		/* One name shared by every page's hero: the old and new frames sit on
		   the same rect, so the transition is a crossfade of the two canvases
		   in place. Per-painting names turned each navigation into flying
		   full-bleed snapshots stacked over the page. */
		view-transition-name: hero-painting;
	}

	.hero-parallax {
		position: absolute;
		inset: 0;
	}

	/* The zoom leaves 8% slack each side for the scroll lag to spend. */
	.hero-parallax.live {
		transform: scale(1.16);
	}

	/* ---------- The living painting (home only) ---------- */
	.atmo {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}

	/* Cloudlight: soft luminance blobs over the painting's own sky,
	   faded out well before the title zone. Slow cinema, not weather. */
	.atmo-clouds {
		position: absolute;
		inset: -25% -35% 30% -35%;
		mix-blend-mode: soft-light;
		opacity: 0.8;
		-webkit-mask-image: linear-gradient(to bottom, black 45%, transparent 92%);
		mask-image: linear-gradient(to bottom, black 45%, transparent 92%);
	}

	.atmo-a {
		background:
			radial-gradient(36% 44% at 24% 32%, rgb(228 222 200 / 0.26), transparent 70%),
			radial-gradient(28% 36% at 58% 20%, rgb(212 208 192 / 0.2), transparent 72%),
			radial-gradient(42% 38% at 84% 42%, rgb(222 216 196 / 0.18), transparent 70%);
		animation: cloud-drift 70s ease-in-out infinite alternate;
	}

	.atmo-b {
		background:
			radial-gradient(30% 36% at 38% 24%, rgb(220 214 194 / 0.19), transparent 72%),
			radial-gradient(40% 42% at 72% 34%, rgb(230 224 204 / 0.16), transparent 70%),
			radial-gradient(26% 30% at 10% 22%, rgb(214 210 192 / 0.16), transparent 74%);
		animation: cloud-drift 110s ease-in-out infinite alternate-reverse;
	}

	@keyframes cloud-drift {
		from {
			transform: translate3d(-5%, 0, 0);
		}
		to {
			transform: translate3d(5%, 1%, 0);
		}
	}

	/* Moonlight on the Elbe: low, squashed glints sliding along the
	   river band, against the clouds' direction. */
	.atmo-water {
		position: absolute;
		inset: 0 -12%;
		mix-blend-mode: screen;
		opacity: 0.75;
		background:
			radial-gradient(34% 5% at 34% 66%, rgb(240 230 200 / 0.16), transparent 70%),
			radial-gradient(26% 4% at 58% 72%, rgb(238 228 198 / 0.13), transparent 72%),
			radial-gradient(40% 6% at 76% 62%, rgb(236 226 196 / 0.1), transparent 70%);
		-webkit-mask-image: linear-gradient(
			to bottom,
			transparent 52%,
			black 62%,
			black 84%,
			transparent 96%
		);
		mask-image: linear-gradient(to bottom, transparent 52%, black 62%, black 84%, transparent 96%);
		animation: water-drift 46s ease-in-out infinite alternate;
	}

	@keyframes water-drift {
		from {
			transform: translate3d(-2.5%, 0, 0);
		}
		to {
			transform: translate3d(2.5%, 0, 0);
		}
	}

	/* The moon's halo, breathing. Rest state equals the keyframe start,
	   so a stilled animation looks intended. */
	.atmo-moon {
		position: absolute;
		inset: 0;
		mix-blend-mode: screen;
		opacity: 0.4;
		background: radial-gradient(
			26% 34% at 58% 30%,
			rgb(238 226 188 / 0.26),
			rgb(238 226 188 / 0.1) 55%,
			transparent 78%
		);
		animation: moon-breathe 7s ease-in-out infinite alternate;
	}

	@keyframes moon-breathe {
		from {
			opacity: 0.4;
		}
		to {
			opacity: 1;
		}
	}

	.hero :global(.frontispiece) {
		position: absolute;
		inset: 0;
		z-index: 0;
	}

	.hero :global(.frontispiece picture),
	.hero :global(.frontispiece img) {
		height: 100%;
		width: 100%;
		object-fit: cover;
		object-position: var(--focal, center);
	}

	/* The hero veil handles all fading; drop the frontispiece's own gradient. */
	.hero :global(.frontispiece::after) {
		display: none;
	}

	/* Phones: keep the painting's upper half clear, ground the text zone. */
	.hero-veil {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		background: linear-gradient(
			to bottom,
			color-mix(in oklab, var(--bg) 55%, transparent) 0%,
			color-mix(in oklab, var(--bg) 10%, transparent) 32%,
			color-mix(in oklab, var(--bg) 52%, transparent) 64%,
			color-mix(in oklab, var(--bg) 88%, transparent) 88%,
			var(--bg) 100%
		);
	}

	.hero-content {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: 48rem;
		padding-block: 1.5rem 1.75rem;
		text-align: left;
		text-shadow: 0 1px 24px color-mix(in oklab, var(--bg) 80%, transparent);
	}

	.hero-eyebrow {
		margin-bottom: 0.75rem;
	}

	.page-title {
		font-family: var(--font-display);
		font-weight: 400;
		font-size: clamp(2.1rem, 8.5vw, 2.6rem);
		line-height: 1.08;
		text-wrap: balance;
		color: var(--ink);
		margin: 0;
	}

	.page-title-grand {
		font-size: clamp(2.7rem, 12vw, 3.5rem);
	}

	.lede {
		margin-top: 0.9rem;
		max-width: 34rem;
	}

	.lede :global(p) {
		font-family: var(--font-body);
		font-size: 1.02rem;
		font-style: normal;
		color: var(--ink);
		line-height: 1.6;
	}

	/* Phones: the plate becomes a small museum label under the frame. */
	.hero-plate {
		margin-top: 0.8rem;
		padding-inline: 1.5rem;
		font-size: 0.7rem;
		color: var(--ink-dim);
		text-align: left;
	}

	.hero-plate em {
		color: var(--ink-dim);
	}

	/* Keep the collection off the smallest labels. */
	.plate-museum {
		display: none;
	}

	/* Larger screens: the original centred title card over the painting,
	   plate resting inside the bottom fade. */
	@media (min-width: 640px) {
		.hero {
			justify-content: center;
			align-items: center;
			min-height: clamp(440px, 72vh, 760px);
		}

		.hero-veil {
			background: linear-gradient(
				to bottom,
				color-mix(in oklab, var(--bg) 60%, transparent) 0%,
				color-mix(in oklab, var(--bg) 20%, transparent) 30%,
				color-mix(in oklab, var(--bg) 34%, transparent) 62%,
				var(--bg) 100%
			);
		}

		.hero-content {
			padding-block: 3.5rem;
			text-align: center;
		}

		.hero-eyebrow {
			margin-bottom: 1.25rem;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.8rem;
		}

		/* Two tiny gilt diamonds flank the eyebrow, echoing the room's
		   ornamented section labels. */
		.hero-eyebrow::before,
		.hero-eyebrow::after {
			content: '';
			width: 0.28rem;
			height: 0.28rem;
			flex: none;
			background: color-mix(in oklab, var(--accent) 65%, transparent);
			transform: rotate(45deg);
		}

		.page-title {
			font-size: clamp(2.5rem, 6vw + 0.5rem, 5rem);
			line-height: 1.05;
		}

		.page-title-grand {
			font-size: clamp(3.4rem, 8.5vw + 0.5rem, 7rem);
			line-height: 1.02;
		}

		.lede {
			margin-top: 1.75rem;
			margin-inline: auto;
			max-width: 36rem;
		}

		.lede :global(p) {
			font-size: 1.2rem;
			line-height: 1.7;
		}

		.hero-plate {
			position: absolute;
			inset: auto 0 1.1rem 0;
			margin: 0 auto;
			font-size: 0.875rem;
			color: var(--ink-muted);
			text-align: center;
		}

		.hero-plate em {
			color: var(--ink-muted);
		}

		.plate-museum {
			display: inline;
		}
	}
</style>
