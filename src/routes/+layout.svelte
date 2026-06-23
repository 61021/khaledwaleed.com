<script lang="ts">
	import '../app.css';
	import '@fontsource/inter/400.css';
	import '@fontsource/inter/400-italic.css';
	import '@fontsource/inter/600.css';
	import '@fontsource/fraunces/400.css';
	import '@fontsource/fraunces/400-italic.css';

	import { page } from '$app/stores';
	import { onNavigate } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import { JsonLd, Container, CommandPalette, site } from '$lib';
	import { roomForPath } from '$lib/site';

	let { children } = $props();

	// Mobile nav menu (collapsible on phones).
	let mobileOpen = $state(false);

	// Set the per-page palette on <html data-room="...">.
	$effect(() => {
		if (typeof document === 'undefined') return;
		const room = roomForPath($page.url.pathname);
		document.documentElement.setAttribute('data-room', room);
	});

	onNavigate((navigation) => {
		mobileOpen = false;
		if (typeof document === 'undefined') return;
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
		{ name: 'Writing', href: '/writing' },
		// { name: 'Now', href: '/now' },
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
						class="font-[var(--font-display)] text-[1.05rem] italic transition-colors duration-300 {active
							? 'text-[var(--accent)]'
							: 'text-[var(--ink-muted)] hover:text-[var(--ink)]'}"
						aria-current={active ? 'page' : undefined}
					>
						{item.name}
					</a>
				{/each}
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
								class="block py-3 font-[var(--font-display)] text-lg italic transition-colors {active
									? 'text-[var(--accent)]'
									: 'text-[var(--ink-muted)] hover:text-[var(--ink)]'}"
								aria-current={active ? 'page' : undefined}
								onclick={() => (mobileOpen = false)}
							>
								{item.name}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		{/if}
	</header>

	<main id="main" class="flex-1">
		{@render children()}
	</main>

	<!-- Footer: equally quiet -->
	<footer class="mt-24 border-t border-[var(--rule)] py-10 sm:mt-32">
		<Container size="wide">
			<div
				class="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left"
			>
				<div class="space-y-1">
					<div class="italic text-[var(--ink-muted)]">
						{site.name} · {site.location.city}, {site.location.country}
					</div>
					<div class="smallcaps">mmxxvi · set in inter &amp; fraunces</div>
				</div>
				<nav
					aria-label="Elsewhere"
					class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
				>
					{#each site.socials as s}
						<a
							href={s.href}
							target="_blank"
							rel="noopener noreferrer"
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
