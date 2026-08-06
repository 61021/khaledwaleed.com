<script lang="ts">
	import '../app.css';
	import '@fontsource/lato/400.css';
	import '@fontsource/lato/400-italic.css';
	import '@fontsource/lato/700.css';
	import '@fontsource/playfair-display/400.css';
	import '@fontsource/playfair-display/400-italic.css';

	import { page } from '$app/stores';
	import { onNavigate } from '$app/navigation';
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { JsonLd, Container, CommandPalette, Lamp, site } from '$lib';
	import { roomBg, roomForPath } from '$lib/site';
	import { paletteSignal } from '$lib/palette.svelte';
	import { isPaintingWarm, paintingKeyForPath, warmPainting } from '$lib/painting-warm';

	let { children } = $props();

	// A calling card for the curious.
	onMount(() => {
		isMac = /Mac|iP(hone|ad|od)/.test(navigator.platform);
		console.log(
			'%c☾ khaledwaleed.com',
			'font-family: Georgia, serif; font-style: italic; font-size: 16px;',
			'\n\nThe paintings are public domain; the rest is mine.\n\n' +
				'Source: https://github.com/61021/khaledwaleed.com\n' +
				'Hello: contact@khaledwaleed.com'
		);
	});

	// Carry the next room's painting to the door: any intent toward an
	// internal link (hover, focus, first touch) starts fetching + decoding
	// that room's hero, the way data-sveltekit-preload-data already warms
	// its data. By the click, the canvas is usually ready to hang.
	onMount(() => {
		const warmFromIntent = (e: Event) => {
			const a = (e.target as Element | null)?.closest?.('a[href^="/"]');
			if (!a) return;
			const href = a.getAttribute('href');
			if (href) warmPainting(paintingKeyForPath(new URL(href, location.origin).pathname));
		};
		document.addEventListener('pointerover', warmFromIntent, { passive: true });
		document.addEventListener('focusin', warmFromIntent, { passive: true });
		document.addEventListener('touchstart', warmFromIntent, { passive: true });
		return () => {
			document.removeEventListener('pointerover', warmFromIntent);
			document.removeEventListener('focusin', warmFromIntent);
			document.removeEventListener('touchstart', warmFromIntent);
		};
	});

	// Mobile nav menu (collapsible on phones).
	let mobileOpen = $state(false);

	// The search chip shows the visitor's own keys.
	let isMac = $state(false);

	// Set the per-page palette on <html data-room="..."> and keep the
	// browser-chrome tint in step. SSR stamps the same values via
	// hooks.server.ts; this covers client-side navigations.
	$effect(() => {
		if (typeof document === 'undefined') return;
		const room = $page.status >= 400 ? '404' : roomForPath($page.url.pathname);
		document.documentElement.setAttribute('data-room', room);
		const themeColor = roomBg[room];
		if (themeColor) {
			document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
		}
	});

	onNavigate((navigation) => {
		mobileOpen = false;
		if (typeof document === 'undefined') return;
		// After the first arrival, the entry rises sit out (see app.css):
		// navigations animate as one view transition, and text fading up
		// AFTER it made every room seem to straggle in behind its painting.
		document.documentElement.setAttribute('data-navigated', '');
		// Route changes must land at the top as an instant jump hidden inside
		// the transition — html's smooth scrolling turned the router's scroll
		// reset into an eased scroll still running when the new room appeared.
		// Same-page hash jumps keep the smoothness.
		if (navigation.from?.url.pathname !== navigation.to?.url.pathname) {
			const html = document.documentElement;
			html.style.scrollBehavior = 'auto';
			const restore = () => setTimeout(() => html.style.removeProperty('scroll-behavior'), 150);
			// `complete` rejects when a navigation is aborted — restore either way.
			navigation.complete.then(restore, restore);
		}
		if (!document.startViewTransition) return;
		if (
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		)
			return;

		return new Promise((resolve) => {
			const html = document.documentElement;
			const begin = () => {
				// While the transition runs, the room's 600ms palette eases
				// (html background/color, the damask wallpaper) go quiet: the
				// crossfade IS the palette change. Left on, they straggle past
				// the fade and repaint the whole viewport under it.
				html.setAttribute('data-vt', '');
				const transition = document.startViewTransition(async () => {
					resolve();
					await navigation.complete;
				});
				transition.finished.finally(() => html.removeAttribute('data-vt'));
			};

			// Hold the door a beat for the incoming painting so the crossfade
			// is canvas to canvas, never canvas to blank wall. Intent warming
			// usually makes this instant; a cold room gets at most 300ms and
			// then develops in late (see .frontispiece img in app.css).
			const key = navigation.to ? paintingKeyForPath(navigation.to.url.pathname) : null;
			if (!key || isPaintingWarm(key)) {
				begin();
				return;
			}
			let started = false;
			const go = () => {
				if (started) return;
				started = true;
				begin();
			};
			warmPainting(key).then(go, go);
			setTimeout(go, 300);
		});
	});

	const nav = [
		{ name: 'About', href: '/about' },
		{ name: 'Projects', href: '/projects' },
		{ name: 'Writing', href: '/writing' },
		{ name: 'Likes', href: '/likes' },
		{ name: 'Library', href: '/library' },
		{ name: 'Films', href: '/films' },
		{ name: 'Music', href: '/music' },
		{ name: 'Contact', href: '/contact' }
	];

	function isActive(href: string, path: string) {
		if (href === '/') return path === '/';
		return path === href || path.startsWith(href + '/');
	}
</script>

<JsonLd />
<CommandPalette />
<Lamp />

<svelte:head>
	{#if !dev && site.cloudflareAnalyticsToken}
		<script
			defer
			src="https://static.cloudflareinsights.com/beacon.min.js"
			data-cf-beacon={JSON.stringify({ token: site.cloudflareAnalyticsToken })}
		></script>
	{/if}
</svelte:head>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') mobileOpen = false;
	}}
/>

<a href="#main" class="skip-link">Skip to content</a>

<div class="flex min-h-[100dvh] flex-col">
	<!-- Quiet classical header: not sticky, no chrome -->
	<header class="py-4">
		<div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6">
			<a
				href="/"
				class="font-display text-2xl text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
				aria-label="Khaled Waleed, home"
			>
				KW<span class="sr-only">Khaled Waleed</span>
			</a>

			<!-- Desktop: links inline -->
			<nav aria-label="Primary" class="hidden items-center gap-x-6 gap-y-2 sm:flex">
				{#each nav as item (item.name)}
					{@const active = isActive(item.href, $page.url.pathname)}
					<a
						href={item.href}
						class="-my-2 py-2 font-display text-[1.05rem] transition-colors duration-300 {active
							? 'text-[var(--accent)]'
							: 'text-[var(--ink-muted)] hover:text-[var(--ink)]'}"
						aria-current={active ? 'page' : undefined}
					>
						{item.name}
					</a>
				{/each}
				<button
					type="button"
					class="smallcaps relative cursor-pointer border border-[var(--rule)] px-2 py-1 transition-colors after:absolute after:-inset-2 after:content-[''] hover:border-[var(--ink-dim)] hover:text-[var(--ink)]"
					aria-label="Search the site"
					title={isMac ? 'Search (⌘K)' : 'Search (Ctrl K)'}
					onclick={() => paletteSignal.request()}
				>
					{isMac ? '⌘K' : 'Ctrl K'}
				</button>
			</nav>

			<!-- Phone: hamburger toggle -->
			<button
				type="button"
				class="menu-toggle -mr-2.5 inline-flex items-center justify-center p-2.5 text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)] sm:hidden"
				class:open={mobileOpen}
				aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={mobileOpen}
				aria-controls="mobile-nav"
				onclick={() => (mobileOpen = !mobileOpen)}
			>
				<span class="menu-icon" aria-hidden="true">
					<svg
						class="icon-bars"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.75"
						stroke-linecap="round"
					>
						<path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
					</svg>
					<svg
						class="icon-x"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.75"
						stroke-linecap="round"
					>
						<path d="M18 6 6 18M6 6l12 12" />
					</svg>
				</span>
			</button>
		</div>

		<!-- Phone: collapsible menu -->
		{#if mobileOpen}
			<nav
				id="mobile-nav"
				aria-label="Primary"
				class="mx-auto max-w-6xl px-6 sm:hidden"
				transition:slide={{ duration: 220 }}
			>
				<ul class="mt-2 flex flex-col border-t border-[var(--rule)] pt-1">
					{#each nav as item (item.name)}
						{@const active = isActive(item.href, $page.url.pathname)}
						<li>
							<a
								href={item.href}
								class="block py-3 font-display text-lg transition-colors {active
									? 'text-[var(--accent)]'
									: 'text-[var(--ink-muted)] hover:text-[var(--ink)]'}"
								aria-current={active ? 'page' : undefined}
								onclick={() => (mobileOpen = false)}
							>
								{item.name}
							</a>
						</li>
					{/each}
					<li>
						<button
							type="button"
							class="block w-full py-3 text-left font-display text-lg text-[var(--ink-dim)] transition-colors hover:text-[var(--ink)]"
							onclick={() => {
								mobileOpen = false;
								paletteSignal.request();
							}}
						>
							Search…
						</button>
					</li>
				</ul>
			</nav>
		{/if}

		<!-- Engraved rule under the masthead -->
		<div class="rule-engraved mx-auto mt-2 w-full max-w-6xl px-6" aria-hidden="true">
			<span class="gem"></span>
		</div>
	</header>

	<main id="main" class="flex-1">
		{@render children()}
	</main>

	<!-- Footer: equally quiet -->
	<footer class="mt-12 py-6 sm:mt-32 sm:py-10">
		<div class="rule-engraved mx-auto mb-6 w-full max-w-6xl px-6 sm:mb-10" aria-hidden="true">
			<span class="moon">☾</span>
		</div>
		<Container size="wide">
			<div
				class="flex flex-col items-start justify-between gap-4 text-left sm:flex-row sm:items-center sm:gap-6"
			>
				<div class="space-y-1">
					<div class="italic text-[var(--ink-muted)] max-sm:text-sm">
						{site.name} <span lang="ar" class="not-italic">{site.nameArabic}</span> ·
						{site.role},&nbsp;{site.location.city},&nbsp;{site.location.country}
					</div>
					<div class="smallcaps">mmxxvi · set in playfair &amp; lato</div>
				</div>
				<nav
					aria-label="Elsewhere"
					class="grid grid-cols-3 gap-x-4 gap-y-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-5"
				>
					{#each site.socials as s (s.label)}
						<a
							href={s.href}
							target="_blank"
							rel="me noopener noreferrer"
							class="text-sm text-[var(--ink-muted)] transition-colors hover:text-[var(--accent)]"
						>
							{s.label}
						</a>
					{/each}
					<a
						href="https://github.com/61021/khaledwaleed.com"
						target="_blank"
						rel="noopener noreferrer"
						class="text-sm text-[var(--ink-muted)] transition-colors hover:text-[var(--accent)]"
					>
						Source
					</a>
					<a
						href="/rss.xml"
						class="text-sm text-[var(--ink-muted)] transition-colors hover:text-[var(--accent)]"
					>
						RSS
					</a>
				</nav>
			</div>
		</Container>
	</footer>
</div>

<style>
	/* Hamburger ↔ X: both glyphs stay in the DOM and cross-fade with
	   opacity/scale/blur instead of swapping instantly. */
	.menu-icon {
		display: inline-grid;
		place-items: center;
	}

	.menu-icon svg {
		grid-area: 1 / 1;
		transition:
			opacity 200ms cubic-bezier(0.2, 0, 0, 1),
			scale 200ms cubic-bezier(0.2, 0, 0, 1),
			filter 200ms cubic-bezier(0.2, 0, 0, 1);
	}

	.icon-x,
	.menu-toggle.open .icon-bars {
		opacity: 0;
		scale: 0.25;
		filter: blur(4px);
	}

	.menu-toggle.open .icon-x {
		opacity: 1;
		scale: 1;
		filter: blur(0px);
	}
</style>
