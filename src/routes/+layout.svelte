<script lang='ts'>
	import { dev } from '$app/environment'
	import { onNavigate } from '$app/navigation'
	import { page } from '$app/state'
	import { CommandPalette, Container, Curtain, JsonLd, site } from '$lib'
	import { curtain } from '$lib/curtain'
	import { romanYear } from '$lib/dates'
	import { paintingKeyForPath, warmPainting } from '$lib/painting-warm'
	import { palette } from '$lib/palette'

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
		const hour = new Date().getHours()
		const afterHours = hour >= 23 || hour < 5
		// eslint-disable-next-line no-console
		console.log(
			'%c☾ khaledwaleed.com',
			'font-family: Georgia, serif; font-style: italic; font-size: 16px;',
			`\n\nThe paintings are public domain; the rest is mine.${
				afterHours ? '\nAfter hours. The doors stay open.' : ''
			}\n\nSource: https://github.com/61021/khaledwaleed.com\nHello: contact@khaledwaleed.com`,
		)
	})

	// The sound system: a tick on every control, nocturnes underneath.
	// Delegated via <svelte:document> below so every link and button on
	// every page ticks without touching the components themselves.
	// One whisper per visit under the note glyph (the nocturne's own wall
	// plate), so the house's most distinctive layer stops being a secret.
	let soundHint = $state(false)
	onMount(() => {
		sound.init()
		if (sound.enabled && !sessionStorage.getItem('kw-sound-hint')) {
			sessionStorage.setItem('kw-sound-hint', '1')
			const show = setTimeout(() => (soundHint = true), 3200)
			const hide = setTimeout(() => (soundHint = false), 12200)
			return () => {
				clearTimeout(show)
				clearTimeout(hide)
			}
		}
	})

	function tickOnClick(e: MouseEvent) {
		const el = e.target instanceof Element ? e.target.closest('a, button') : null
		if (el)
			sound.tick('tap')
	}

	// Carry the next room's painting to the door: any intent toward an
	// internal link (hover, focus, first touch) starts fetching + decoding
	// that room's hero, the way data-sveltekit-preload-data already warms
	// its data. By the click, the canvas is usually ready to hang.
	function warmFromIntent(e: Event) {
		const a = (e.target as Element | null)?.closest?.('a[href^="/"]')
		if (!a)
			return
		const href = a.getAttribute('href')
		if (href)
			warmPainting(paintingKeyForPath(new URL(href, location.origin).pathname))
	}

	// Mobile nav menu (collapsible on phones).
	let mobileOpen = $state(false)

	// One global keydown: the menu's escape, the sound switch, and two
	// secrets. The Konami code takes the curtain for an encore; so does
	// a certain phrase, kept here only as a SHA-256 digest so the words
	// themselves never enter a public repo. Typing in a field never counts.
	const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']
	const PHRASE_LEN = 5
	const PHRASE_DIGEST = '760da8335e0a4744e99ec6aee79a1e6fee7519a82cd245b1d8e9f95ed8704eb8'
	let konamiAt = 0
	let typed = ''

	function isTyping(target: EventTarget | null) {
		return (
			target instanceof HTMLElement
			&& (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.isContentEditable)
		)
	}

	async function matchPhrase(candidate: string) {
		if (!crypto?.subtle)
			return
		const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(candidate))
		const hex = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('')
		if (hex !== PHRASE_DIGEST)
			return
		typed = ''
		curtain.encore()
		sound.swell()
		// eslint-disable-next-line no-console
		console.log(
			'%c☾ hello, you.',
			'font-family: Georgia, serif; font-style: italic; font-size: 16px;',
		)
	}

	function onGlobalKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape')
			mobileOpen = false
		if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target))
			return
		const key = e.key.toLowerCase()
		if (key === 'm')
			sound.toggle()
		konamiAt = key === KONAMI[konamiAt] ? konamiAt + 1 : key === KONAMI[0] ? 1 : 0
		if (konamiAt === KONAMI.length) {
			konamiAt = 0
			curtain.encore()
		}
		if (e.key.length === 1) {
			typed = (typed + key).slice(-PHRASE_LEN)
			if (typed.length === PHRASE_LEN)
				void matchPhrase(typed)
		}
	}

	// Set the per-page palette on <html data-room="..."> and keep the
	// browser-chrome tint in step. SSR stamps the same values via
	// hooks.server.ts; this covers client-side navigations.
	$effect(() => {
		const room = page.status >= 400 ? '404' : roomForPath(page.url.pathname)
		document.documentElement.setAttribute('data-room', room)
		const themeColor = roomBg[room]
		if (themeColor) {
			document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor)
		}
	})

	// The velvet walk's band (see .velvet-band in app.css) and a token so
	// a fast second navigation is never cleaned up by the first one's timer.
	let bandEl = $state<HTMLDivElement>()
	let sweepToken = 0

	onNavigate((navigation) => {
		mobileOpen = false
		// After the first arrival, the entrance procession sits out (see
		// app.css): walked-into rooms are simply there behind the band, and
		// content fading up afterwards read as the room straggling in.
		document.documentElement.setAttribute('data-navigated', '')
		// Route changes must land at the top as an instant jump hidden under
		// the band; html's smooth scrolling turned the router's scroll reset
		// into an eased scroll still running when the new room appeared.
		// Same-page hash jumps keep the smoothness.
		const pathChanged = navigation.from?.url.pathname !== navigation.to?.url.pathname
		if (pathChanged) {
			const html = document.documentElement
			html.style.scrollBehavior = 'auto'
			const restore = () => setTimeout(() => html.style.removeProperty('scroll-behavior'), 150)
			// `complete` rejects when a navigation is aborted; restore either way.
			navigation.complete.then(restore, restore)
		}
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
			return
		// The corridor is for room changes only: hash jumps and same-path
		// search changes (the music range switcher) swap in place.
		if (!pathChanged)
			return
		// Start carrying the next painting to the door. No hold: the band's
		// covered beat is the decode window, and a canvas that still misses
		// its cue develops in via .loaded (see .frontispiece img in app.css).
		const key = navigation.to ? paintingKeyForPath(navigation.to.url.pathname) : null
		if (key)
			warmPainting(key)
		// The velvet walk, one corridor for every engine (the view
		// transitions and their Gecko fork are gone): the band gathers over
		// the frame, holds covered while the router swaps the room and the
		// palette underneath, then releases off the far side. data-sweep
		// silences the 600ms palette eases so the change is done before the
		// reveal; onNavigate runs after data loading, so the hold never
		// waits on the network.
		const band = bandEl
		if (!band)
			return
		const token = ++sweepToken
		const html = document.documentElement
		html.setAttribute('data-sweep', '')
		band.classList.remove('sweep')
		void band.offsetWidth
		band.classList.add('sweep')
		setTimeout(() => {
			if (token !== sweepToken)
				return
			html.removeAttribute('data-sweep')
			band.classList.remove('sweep')
		}, 700)
		return new Promise((resolve) => {
			// The band covers the frame from roughly 270ms to 370ms; resolve
			// inside the hold so the swap lands against velvet, never against
			// the old room.
			setTimeout(resolve, 300)
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

<svelte:document
	onclickcapture={tickOnClick}
	onpointerover={warmFromIntent}
	onfocusin={warmFromIntent}
	ontouchstart={warmFromIntent}
/>

<svelte:window onkeydown={onGlobalKeydown} />

<a href='#main' class='skip-link'>Skip to content</a>

<div class='relative flex min-h-[100dvh] flex-col'>
	<!-- Quiet classical header: not sticky, no chrome, and out of the
	     flow: the nav is lettering on the room's canvas from the first
	     frame, never a band of wall above it. -->
	<header class='absolute inset-x-0 top-0 z-40 py-4'>
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
					{@const active = isActive(item.href, page.url.pathname)}
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
			<div class='relative hidden items-center gap-1 justify-self-end sm:flex'>
				<button
					type='button'
					class="relative flex cursor-pointer items-center justify-center p-2 text-[var(--ink-muted)] transition-colors after:absolute after:-inset-1 after:content-[''] hover:text-[var(--ink)]"
					aria-pressed={sound.enabled}
					aria-label={sound.enabled ? 'Turn sound off' : 'Turn sound on'}
					title='Sound (press m)'
					onclick={() => {
						soundHint = false
						sound.toggle()
					}}
				>
					<svg class='sound-glyph' width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden='true'>
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
					onclick={() => palette.request()}
				>
					/
				</button>
				{#if soundHint}
					<span class='sound-hint smallcaps' aria-hidden='true'>chopin, op. 72 no. 1 · press m</span>
				{/if}
			</div>

			<!-- Sound state for screen readers: the m shortcut and both
			     toggles land here, wherever focus happens to be. -->
			<span class='sr-only' role='status'>{sound.enabled ? 'Sound on' : 'Sound off'}</span>

			<!-- Phone: hamburger toggle -->
			<button
				type='button'
				class={[
					'menu-toggle -mr-2.5 inline-flex items-center justify-center p-2.5 text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)] sm:hidden',
					mobileOpen && 'open',
				]}
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
						{@const active = isActive(item.href, page.url.pathname)}
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
								palette.request()
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
					<div class='smallcaps'>
						{colophonYear} · set in playfair &amp; lato ·
						<!-- Plain text on purpose: no cursor, no role, no hint.
						     Whoever clicks it anyway hears the music lean in. -->
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<span onclick={() => sound.swell()}>for r.</span>
					</div>
				</div>
				<!-- Phones keep the colophon alone: the rooms are a tap away in
				     the header menu, and repeating them under a hamburger only
				     lengthened the scroll. -->
				<div class='footer-rooms hidden space-y-2 sm:block'>
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
						<span class='text-[var(--ink-dim)]'>registered domains:</span>
						<span class='whitespace-nowrap'>
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
						</span>
					</div>
				</div>
			</div>
		</Container>
	</footer>
</div>

<!-- The velvet walk's band: parked in the wings until a navigation
     rides it (see .velvet-band in app.css). -->
<div class='velvet-band' bind:this={bandEl} aria-hidden='true'></div>

<style>
	/* The nav letters directly on the room's canvas, so its lettering
	   keeps legible the house way: a halo keyed to the wall color, the
	   same mechanism the title card uses. Never a scrim. */
	header a,
	header button,
	.sound-hint {
		text-shadow:
			0 1px 2px color-mix(in oklab, var(--bg) 70%, transparent),
			0 1px 14px color-mix(in oklab, var(--bg) 85%, transparent);
	}

	/* Glyphs are strokes, not letters; the halo comes as a drop-shadow
	   on their stills (the hamburger's svgs animate their own filter). */
	.sound-glyph,
	.menu-icon {
		filter: drop-shadow(0 1px 3px color-mix(in oklab, var(--bg) 80%, transparent));
	}

	/* The open menu is the one header surface that must read as a panel
	   over art: a still pane of the room's own air, not a card. */
	#mobile-nav {
		padding-bottom: 0.5rem;
		background: color-mix(in oklab, var(--bg) 84%, transparent);
		border-bottom: 1px solid var(--rule);
		-webkit-backdrop-filter: blur(12px);
		backdrop-filter: blur(12px);
	}

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

	/* The nocturne's wall plate: one whisper per visit, then never again. */
	.sound-hint {
		position: absolute;
		top: calc(100% + 0.4rem);
		right: 0.15rem;
		font-size: 0.6rem;
		color: var(--ink-dim);
		white-space: nowrap;
		pointer-events: none;
		animation: hint-whisper 8800ms ease both;
	}

	@keyframes hint-whisper {
		0% {
			opacity: 0;
			transform: translateY(-3px);
		}

		6% {
			opacity: 1;
			transform: translateY(0);
		}

		91% {
			opacity: 1;
		}

		100% {
			opacity: 0;
		}
	}
</style>
