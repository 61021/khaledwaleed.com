<script lang='ts'>
	import { dev } from '$app/environment'
	import { onNavigate } from '$app/navigation'
	import { page } from '$app/stores'
	import { CommandPalette, Container, Curtain, JsonLd, site } from '$lib'
	import { romanYear } from '$lib/dates'
	import { isPaintingWarm, paintingKeyForPath, warmPainting } from '$lib/painting-warm'
	import { paletteSignal } from '$lib/palette.svelte'

	import { roomBg, roomForPath } from '$lib/site'
	import { sound } from '$lib/sound.svelte'
	import { onMount } from 'svelte'
	import { slide } from 'svelte/transition'
	import '../app.css'
	import '@fontsource/lato/400.css'
	import '@fontsource/lato/400-italic.css'
	import '@fontsource/lato/700.css'
	import '@fontsource/playfair-display/400.css'
	import '@fontsource/playfair-display/400-italic.css'

	const { children } = $props()

	// The colophon year, computed so it turns over each New Year.
	const colophonYear = romanYear(new Date().getFullYear())

	// A calling card for the curious.
	onMount(() => {
		// eslint-disable-next-line no-console
		console.log(
			'%c☾ khaledwaleed.com',
			'font-family: Georgia, serif; font-style: italic; font-size: 16px;',
			`\n\nThe paintings are public domain; the rest is mine.\n\nSource: https://github.com/61021/khaledwaleed.com\nHello: contact@khaledwaleed.com`,
		)
	})

	// The sound system: a tick on every control, nocturnes underneath.
	// Delegated so every link and button on every page ticks without
	// touching the components themselves.
	onMount(() => {
		sound.init()
		const tickOnClick = (e: MouseEvent) => {
			const el = e.target instanceof Element ? e.target.closest('a, button') : null
			if (el)
				sound.tick('tap')
		}
		document.addEventListener('click', tickOnClick, { capture: true, passive: true })
		return () => document.removeEventListener('click', tickOnClick, { capture: true })
	})

	// Carry the next room's painting to the door: any intent toward an
	// internal link (hover, focus, first touch) starts fetching + decoding
	// that room's hero, the way data-sveltekit-preload-data already warms
	// its data. By the click, the canvas is usually ready to hang.
	onMount(() => {
		const warmFromIntent = (e: Event) => {
			const a = (e.target as Element | null)?.closest?.('a[href^="/"]')
			if (!a)
				return
			const href = a.getAttribute('href')
			if (href)
				warmPainting(paintingKeyForPath(new URL(href, location.origin).pathname))
		}
		document.addEventListener('pointerover', warmFromIntent, { passive: true })
		document.addEventListener('focusin', warmFromIntent, { passive: true })
		document.addEventListener('touchstart', warmFromIntent, { passive: true })
		return () => {
			document.removeEventListener('pointerover', warmFromIntent)
			document.removeEventListener('focusin', warmFromIntent)
			document.removeEventListener('touchstart', warmFromIntent)
		}
	})

	// Mobile nav menu (collapsible on phones).
	let mobileOpen = $state(false)

	// Set the per-page palette on <html data-room="..."> and keep the
	// browser-chrome tint in step. SSR stamps the same values via
	// hooks.server.ts; this covers client-side navigations.
	$effect(() => {
		if (typeof document === 'undefined')
			return
		const room = $page.status >= 400 ? '404' : roomForPath($page.url.pathname)
		document.documentElement.setAttribute('data-room', room)
		const themeColor = roomBg[room]
		if (themeColor) {
			document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor)
		}
	})

	onNavigate((navigation) => {
		mobileOpen = false
		if (typeof document === 'undefined')
			return
		// After the first arrival, the entry rises sit out (see app.css):
		// navigations animate as one view transition, and text fading up
		// AFTER it made every room seem to straggle in behind its painting.
		document.documentElement.setAttribute('data-navigated', '')
		// Route changes must land at the top as an instant jump hidden inside
		// the transition; html's smooth scrolling turned the router's scroll
		// reset into an eased scroll still running when the new room appeared.
		// Same-page hash jumps keep the smoothness.
		if (navigation.from?.url.pathname !== navigation.to?.url.pathname) {
			const html = document.documentElement
			html.style.scrollBehavior = 'auto'
			const restore = () => setTimeout(() => html.style.removeProperty('scroll-behavior'), 150)
			// `complete` rejects when a navigation is aborted; restore either way.
			navigation.complete.then(restore, restore)
		}
		if (
			typeof window !== 'undefined'
			&& window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			return
		}
		// Browsers sitting out the view transition still get a scene
		// change: once the new room is in the DOM, main rises in as one
		// piece (html[data-nav-in] in app.css). Chrome holds still; the
		// palette ease and the painting's develop-in carry on beneath.
		const sceneIn = () => {
			const html = document.documentElement
			html.removeAttribute('data-nav-in')
			requestAnimationFrame(() => html.setAttribute('data-nav-in', ''))
		}
		if (!document.startViewTransition) {
			navigation.complete.then(sceneIn, () => {})
			return
		}
		// Gecko's first-generation view transitions stutter on full-page
		// snapshot dissolves (his daily Firefox; Chromium is smooth), so
		// Firefox takes the designed no-VT path: instant swap, the 600ms
		// palette ease, paintings developing in. Re-test on major Firefox
		// releases before removing.
		if (CSS.supports('-moz-appearance', 'none')) {
			navigation.complete.then(sceneIn, () => {})
			return
		}

		return new Promise((resolve) => {
			const html = document.documentElement
			const begin = () => {
				// While the transition runs, the room's 600ms palette eases
				// (html background/color, the damask wallpaper) go quiet: the
				// crossfade IS the palette change. Left on, they straggle past
				// the fade and repaint the whole viewport under it.
				html.setAttribute('data-vt', '')
				const transition = document.startViewTransition(async () => {
					resolve()
					await navigation.complete
					// Post-swap flag for the incoming canvas's scale settle:
					// set before the new capture, never on the old one (the
					// outgoing snapshot must not zoom for a frame).
					html.setAttribute('data-vt-in', '')
				})
				transition.finished.finally(() => {
					html.removeAttribute('data-vt')
					html.removeAttribute('data-vt-in')
				})
			}

			// Hold the door a beat for the incoming painting so the crossfade
			// is canvas to canvas, never canvas to blank wall. Intent warming
			// usually makes this instant; a cold room gets at most 100ms. A
			// longer hold read as input lag, and the late canvas develops in
			// via .loaded anyway (see .frontispiece img in app.css).
			const key = navigation.to ? paintingKeyForPath(navigation.to.url.pathname) : null
			if (!key || isPaintingWarm(key)) {
				begin()
				return
			}
			let started = false
			const go = () => {
				if (started)
					return
				started = true
				begin()
			}
			warmPainting(key).then(go, go)
			setTimeout(go, 100)
		})
	})

	const nav = [
		{ name: 'Foyer', href: '/' },
		{ name: 'Story', href: '/story' },
		{ name: 'Projects', href: '/projects' },
		{ name: 'Writing', href: '/writing' },
		{ name: 'Likes', href: '/likes' },
		{ name: 'Films', href: '/films' },
		{ name: 'Tools', href: '/tools' },
		{ name: 'Contact', href: '/contact' },
	]

	function isActive(href: string, path: string) {
		if (href === '/')
			return path === '/'
		return path === href || path.startsWith(`${href}/`)
	}
</script>

<JsonLd />
<CommandPalette />
<Curtain />

<svelte:head>
	{#if !dev && site.cloudflareAnalyticsToken}
		<script
			defer
			src='https://static.cloudflareinsights.com/beacon.min.js'
			data-cf-beacon={JSON.stringify({ token: site.cloudflareAnalyticsToken })}
		></script>
	{/if}
</svelte:head>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape')
			mobileOpen = false
		if (e.key === 'm' && !e.metaKey && !e.ctrlKey && !e.altKey) {
			const t = e.target
			const typing
				= t instanceof HTMLElement
					&& (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t.isContentEditable)
			if (!typing)
				sound.toggle()
		}
	}}
/>

<a href='#main' class='skip-link'>Skip to content</a>

<div class='flex min-h-[100dvh] flex-col'>
	<!-- Quiet classical header: not sticky, no chrome -->
	<header class='py-4'>
		<div class='mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 sm:grid sm:grid-cols-[1fr_auto_1fr]'>
			<a
				href='/'
				class='justify-self-start font-display text-2xl text-[var(--ink)] transition-colors hover:text-[var(--accent)]'
				aria-label='Khaled Waleed, home'
			>
				KW<span class='sr-only'>Khaled Waleed</span>
			</a>

			<!-- Desktop: links inline, centred between the monogram and the search chip -->
			<nav aria-label='Primary' class='hidden flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:flex'>
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
			</nav>

			<!-- Desktop: sound and search balance the monogram, bare glyphs
			     in the nav's own idiom; the header stays chromeless. -->
			<div class='hidden items-center gap-1 justify-self-end sm:flex'>
				<button
					type='button'
					class="relative flex cursor-pointer items-center justify-center p-2 text-[var(--ink-muted)] transition-colors after:absolute after:-inset-1 after:content-[''] hover:text-[var(--ink)]"
					aria-pressed={sound.enabled}
					aria-label={sound.enabled ? 'Turn sound off' : 'Turn sound on'}
					title='Sound (press m)'
					onclick={() => sound.toggle()}
				>
					<svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden='true'>
						<ellipse cx='6' cy='12' rx='2.3' ry='1.8' fill='currentColor' transform='rotate(-16 6 12)' />
						<path d='M8.1 12 V3.2 Q11 4 11.7 6.7' stroke='currentColor' stroke-width='1.2' stroke-linecap='round' />
						{#if !sound.enabled}
							<path d='M2.6 13.6 L13.4 2.6' stroke='currentColor' stroke-width='1.1' stroke-linecap='round' />
						{/if}
					</svg>
				</button>
				<button
					type='button'
					class="relative flex cursor-pointer items-center justify-center p-2 text-[0.95rem] leading-none text-[var(--ink-muted)] transition-colors after:absolute after:-inset-1 after:content-[''] hover:text-[var(--ink)]"
					aria-label='Search the site'
					title='Search (press /)'
					onclick={() => paletteSignal.request()}
				>
					/
				</button>
			</div>

			<!-- Phone: hamburger toggle -->
			<button
				type='button'
				class='menu-toggle -mr-2.5 inline-flex items-center justify-center p-2.5 text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)] sm:hidden'
				class:open={mobileOpen}
				aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={mobileOpen}
				aria-controls='mobile-nav'
				onclick={() => (mobileOpen = !mobileOpen)}
			>
				<span class='menu-icon' aria-hidden='true'>
					<svg
						class='icon-bars'
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						stroke-width='1.75'
						stroke-linecap='round'
					>
						<path d='M3.5 7h17M3.5 12h17M3.5 17h17' />
					</svg>
					<svg
						class='icon-x'
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						stroke-width='1.75'
						stroke-linecap='round'
					>
						<path d='M18 6 6 18M6 6l12 12' />
					</svg>
				</span>
			</button>
		</div>

		<!-- Phone: collapsible menu -->
		{#if mobileOpen}
			<nav
				id='mobile-nav'
				aria-label='Primary'
				class='mx-auto max-w-6xl px-6 sm:hidden'
				transition:slide={{ duration: 220 }}
			>
				<ul class='mt-2 flex flex-col border-t border-[var(--rule)] pt-1'>
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
							type='button'
							class='block w-full py-3 text-left font-display text-lg text-[var(--ink-dim)] transition-colors hover:text-[var(--ink)]'
							onclick={() => {
								mobileOpen = false
								paletteSignal.request()
							}}
						>
							Search…
						</button>
					</li>
					<li>
						<button
							type='button'
							class='block w-full py-3 text-left font-display text-lg text-[var(--ink-dim)] transition-colors hover:text-[var(--ink)]'
							onclick={() => sound.toggle()}
						>
							{sound.enabled ? 'Sound off' : 'Sound on'}
						</button>
					</li>
				</ul>
			</nav>
		{/if}
	</header>

	<main id='main' class='flex-1'>
		{@render children()}
	</main>

	<!-- Footer: colophon at left, the rooms and the letterbox at right.
	     Social platforms live on /contact (and in the Person schema), not here. -->
	<footer class='rise mt-12 py-6 sm:mt-32 sm:py-10' style='--seq: 10'>
		<div class='rule-engraved mx-auto mb-6 w-full max-w-6xl px-6 sm:mb-10' aria-hidden='true'>
			<span class='gem'></span>
		</div>
		<Container size='wide'>
			<div class='flex flex-col gap-6 text-left sm:flex-row sm:items-end sm:justify-between'>
				<div class='space-y-1'>
					<div class='text-[var(--ink-muted)] italic max-sm:text-sm'>
						{site.name} <span lang='ar' class='not-italic'>{site.nameArabic}</span> ·
						{site.role},&nbsp;{site.location.city},&nbsp;{site.location.country}
					</div>
					<div class='smallcaps'>{colophonYear} · set in playfair &amp; lato · for r.</div>
				</div>
				<div class='space-y-2'>
					<nav
						aria-label='Pages'
						class='grid grid-cols-3 gap-x-4 gap-y-2 sm:flex sm:flex-wrap sm:justify-end sm:gap-x-5'
					>
						{#each nav as item (item.name)}
							<a
								href={item.href}
								class='text-sm text-[var(--ink-muted)] transition-colors hover:text-[var(--accent)]'
							>
								{item.name}
							</a>
						{/each}
					</nav>
					<div class='text-sm sm:text-right'>
						<a
							href='https://khalidwaleed.com'
							class='text-[var(--ink-muted)] transition-colors hover:text-[var(--accent)]'
						>
							khalidwaleed.com
						</a>
						<span class='text-[var(--ink-dim)]'>·</span>
						<a
							href='/'
							class='text-[var(--ink-muted)] transition-colors hover:text-[var(--accent)]'
						>
							khaledwaleed.com
						</a>
					</div>
				</div>
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
