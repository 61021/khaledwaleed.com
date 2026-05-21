<script lang="ts">
	import '../app.css';
	import '@fontsource/inter/400.css';
	import '@fontsource/inter/500.css';
	import '@fontsource/inter/600.css';
	import '@fontsource/inter/700.css';
	import '@fontsource/inter/800.css';
	import '@fontsource/jetbrains-mono/400.css';
	import '@fontsource/jetbrains-mono/500.css';
	import '@fontsource/jetbrains-mono/600.css';
	import { page } from '$app/stores';
	import { onNavigate } from '$app/navigation';
	import { JsonLd, Container, CommandPalette, site } from '$lib';

	let { children } = $props();

	function openPalette() {
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
	}

	onNavigate((navigation) => {
		if (typeof document === 'undefined') return;
		// @ts-expect-error - View Transitions API not yet in lib.dom
		if (!document.startViewTransition) return;
		if (
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		)
			return;

		return new Promise((resolve) => {
			// @ts-expect-error - View Transitions API not yet in lib.dom
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	const nav = [
		{ name: 'Home', href: '/' },
		{ name: 'About', href: '/about' },
		{ name: 'Writing', href: '/writing' },
		{ name: 'Now', href: '/now' },
		{ name: 'Likes', href: '/likes' },
		{ name: 'Contact', href: '/contact' }
	];

	function isActive(href: string, path: string) {
		if (href === '/') return path === '/';
		return path === href || path.startsWith(href + '/');
	}
</script>

<JsonLd />
<CommandPalette />

<a href="#main" class="skip-link">Skip to content</a>

<div class="flex min-h-[100dvh] flex-col">
	<!-- Nav -->
	<header
		class="sticky top-0 z-40 border-b border-[var(--border)]/60 bg-[var(--bg)]/80 backdrop-blur-xl"
	>
		<Container size="wide">
			<div class="flex h-16 items-center justify-between">
				<a
					href="/"
					class="group flex items-center gap-2 font-mono text-sm font-semibold tracking-tight"
				>
					<span
						class="grid h-7 w-7 place-items-center rounded-md bg-[var(--brand)] font-bold text-[#04140d]"
						>k</span
					>
					<span class="text-[var(--fg)]">khaled</span>
				</a>

				<div class="flex items-center gap-1">
					<nav aria-label="Primary" class="flex items-center gap-1">
						{#each nav as item, i (item.name)}
							{@const active = isActive(item.href, $page.url.pathname)}
							<a
								href={item.href}
								class="relative rounded-lg px-3 py-1.5 text-sm transition-colors duration-200 {active
									? 'text-[var(--fg)]'
									: 'text-[var(--fg-dim)] hover:text-[var(--fg)]'}"
								aria-current={active ? 'page' : undefined}
							>
								{item.name}
								{#if active}
									<span class="absolute inset-x-3 -bottom-0.5 h-px bg-[var(--brand)]"></span>
								{/if}
							</a>
						{/each}
					</nav>
					<button
						type="button"
						onclick={openPalette}
						aria-label="Open command palette"
						class="ml-2 hidden items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)]/60 px-2 py-1 font-mono text-[11px] text-[var(--fg-dim)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--fg-muted)] sm:inline-flex"
					>
						<span aria-hidden="true">⌘</span>
						<span>K</span>
					</button>
				</div>
			</div>
		</Container>
	</header>

	<main id="main" class="flex-1 py-12 sm:py-16 lg:py-20">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="border-t border-[var(--border)]/60 py-10">
		<Container size="wide">
			<div class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
				<div class="space-y-1">
					<div class="font-mono text-sm text-[var(--fg)]">
						© {new Date().getFullYear()}
						{site.name}
					</div>
					<div class="text-xs text-[var(--fg-dim)]">
						Built with SvelteKit & Tailwind · {site.location.city}, {site.location.country}
					</div>
				</div>
				<div class="flex flex-wrap items-center gap-x-5 gap-y-2">
					{#each site.socials as s}
						<a
							href={s.href}
							target="_blank"
							rel="noopener noreferrer"
							class="text-xs text-[var(--fg-muted)] transition-colors hover:text-[var(--brand)]"
						>
							{s.label}
						</a>
					{/each}
				</div>
			</div>
		</Container>
	</footer>
</div>
