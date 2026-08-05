<script lang="ts">
	import '../app.css';
	import '@fontsource/inter/400.css';
	import '@fontsource/inter/400-italic.css';
	import '@fontsource/inter/600.css';
	import '@fontsource/eb-garamond/400.css';
	import '@fontsource/eb-garamond/400-italic.css';

	import { page } from '$app/stores';
	import { onNavigate } from '$app/navigation';
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { JsonLd, Container, CommandPalette, Lamp, site } from '$lib';
	import { roomBg, roomForPath } from '$lib/site';
	import { paletteSignal } from '$lib/palette.svelte';

	let { children } = $props();

	// A calling card for the curious.
	onMount(() => {
		console.log(
			'%c☾ khaledwaleed.com',
			'font-family: Georgia, serif; font-style: italic; font-size: 16px;',
			'\n\nYou opened the console. I approve.\n' +
				'The paintings are public domain; the rest is mine.\n\n' +
				'Source — https://github.com/61021/khaledwaleed.com\n' +
				'Hello — contact@khaledwaleed.com'
		);
	});

	// Mobile nav menu (collapsible on phones).
	let mobileOpen = $state(false);

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
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
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
				class="font-display text-2xl italic text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
				aria-label="Khaled Waleed — home"
			>
				KW<span class="sr-only">Khaled Waleed</span>
			</a>

			<!-- Desktop: links inline -->
			<nav aria-label="Primary" class="hidden items-center gap-x-6 gap-y-2 sm:flex">
				{#each nav as item (item.name)}
					{@const active = isActive(item.href, $page.url.pathname)}
					<a
						href={item.href}
						class="font-display text-[1.05rem] italic transition-colors duration-300 {active
							? 'text-[var(--accent)]'
							: 'text-[var(--ink-muted)] hover:text-[var(--ink)]'}"
						aria-current={active ? 'page' : undefined}
					>
						{item.name}
					</a>
				{/each}
				<button
					type="button"
					class="smallcaps cursor-pointer rounded border border-[var(--rule)] px-2 py-1 transition-colors hover:border-[var(--ink-dim)] hover:text-[var(--ink)]"
					aria-label="Search the site (Ctrl+K)"
					title="Search — Ctrl+K"
					onclick={() => paletteSignal.request()}
				>
					⌘K
				</button>
			</nav>

			<!-- Phone: hamburger toggle -->
			<button
				type="button"
				class="-mr-2 inline-flex items-center justify-center rounded-lg p-2 text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)] sm:hidden"
				aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={mobileOpen}
				aria-controls="mobile-nav"
				onclick={() => (mobileOpen = !mobileOpen)}
			>
				{#if mobileOpen}
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.75"
						stroke-linecap="round"
						aria-hidden="true"
					>
						<path d="M18 6 6 18M6 6l12 12" />
					</svg>
				{:else}
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.75"
						stroke-linecap="round"
						aria-hidden="true"
					>
						<path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
					</svg>
				{/if}
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
								class="block py-3 font-display text-lg italic transition-colors {active
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
							class="block w-full py-3 text-left font-display text-lg italic text-[var(--ink-dim)] transition-colors hover:text-[var(--ink)]"
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
						{site.name} · <span lang="ar" class="not-italic">{site.nameArabic}</span> · {site.role}
						·&nbsp;{site.location.city},&nbsp;{site.location.country}
					</div>
					<div class="smallcaps">
						mmxxvi · set in inter &amp; eb garamond · <a
							href="https://github.com/61021/khaledwaleed.com"
							target="_blank"
							rel="noopener noreferrer"
							class="link-quiet">source</a
						>
						· <a href="/rss.xml" class="link-quiet">rss</a>
					</div>
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
							class="text-sm italic text-[var(--ink-muted)] transition-colors hover:text-[var(--accent)]"
						>
							{s.label}
						</a>
					{/each}
				</nav>
			</div>
		</Container>
	</footer>
</div>
