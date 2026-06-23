<script lang="ts">
	import '../app.css';
	import '@fontsource/inter/400.css';
	import '@fontsource/inter/400-italic.css';
	import '@fontsource/inter/600.css';
	import '@fontsource/fraunces/400.css';
	import '@fontsource/fraunces/400-italic.css';

	import { page } from '$app/stores';
	import { onNavigate } from '$app/navigation';
	import { JsonLd, Container, CommandPalette, site } from '$lib';
	import { roomForPath } from '$lib/site';

	let { children } = $props();

	// Set the per-page palette on <html data-room="...">.
	$effect(() => {
		if (typeof document === 'undefined') return;
		const room = roomForPath($page.url.pathname);
		document.documentElement.setAttribute('data-room', room);
	});

	onNavigate((navigation) => {
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
		{ name: 'Now', href: '/now' },
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

<a href="#main" class="skip-link">Skip to content</a>

<div class="flex min-h-[100dvh] flex-col">
	<!-- Quiet classical header: not sticky, no chrome -->
	<header class="py-4">
		<div
			class="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between"
		>
			<a
				href="/"
				class="font-[var(--font-display)] text-2xl italic text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
				aria-label="Khaled Waleed — home"
			>
				KW<span class="sr-only">Khaled Waleed</span>
			</a>

			<nav aria-label="Primary" class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
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
		</div>
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
