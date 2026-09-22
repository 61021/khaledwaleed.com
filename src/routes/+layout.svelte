<script lang='ts'>
	import type { OnNavigate } from '@sveltejs/kit'
	import { dev } from '$app/environment'
	import { beforeNavigate, onNavigate, preloadData } from '$app/navigation'
	import { page, updated } from '$app/state'
	import { CommandPalette, Container, Curtain, FooterSignature, JsonLd, Monogram, Screensaver, site } from '$lib'
	import { curtain } from '$lib/curtain'
	import { romanYear } from '$lib/dates'
	// The display face is served pinned to its one weight (see
	// scripts/generate-fonts.ts); Libre Franklin stays variable, it works
	// at 400, 600 and 700.
	import frauncesWoff2 from '$lib/fonts/fraunces-latin-opsz-normal-w400.woff2?url'
	import { markHydrated } from '$lib/hydration'
	import { paintingKeyForPath, warmPainting } from '$lib/painting-warm'

	import { palette } from '$lib/palette'
	import { roomBg, roomForPath } from '$lib/site'
	import { mountSmoother, snapSmoother } from '$lib/smoother'
	import { sound } from '$lib/sound.svelte'
	// The two workhorse faces, preloaded so the first paint doesn't run
	// in fallback type while the CSS is still being parsed for their URLs
	// (?url resolves to the same hashed asset the @font-face rules name).
	import franklinWoff2 from '@fontsource-variable/libre-franklin/files/libre-franklin-latin-wght-normal.woff2?url'
	import { onMount } from 'svelte'
	import '../app.css'
	import '$lib/fonts/fraunces.css'
	import '@fontsource-variable/libre-franklin/wght.css'
	import '@fontsource-variable/libre-franklin/wght-italic.css'

	const { children } = $props()

	// The creative space (/space) is a separate world on the same domain:
	// no header, footer, curtain, palette, screensaver, or sound. Only the
	// room-token plumbing is shared.
	function isSpacePath(pathname: string) {
		return pathname === '/space' || pathname.startsWith('/space/')
	}
	const inSpace = $derived(isSpacePath(page.url.pathname))

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
	// The space keeps its own silence: a visit that starts there arms
	// nothing until the first step into the museum (see onNavigate).
	let soundHint = $state(false)
	let soundReady = false
	let hintShow: ReturnType<typeof setTimeout>
	let hintHide: ReturnType<typeof setTimeout>

	function initSound() {
		if (soundReady)
			return
		soundReady = true
		sound.init()
		if (sound.enabled && !sessionStorage.getItem('kw-sound-hint')) {
			sessionStorage.setItem('kw-sound-hint', '1')
			hintShow = setTimeout(() => (soundHint = true), 3200)
			hintHide = setTimeout(() => (soundHint = false), 12200)
		}
	}

	onMount(() => {
		markHydrated()
		if (!inSpace)
			initSound()
		return () => {
			clearTimeout(hintShow)
			clearTimeout(hintHide)
		}
	})

	function tickOnClick(e: MouseEvent) {
		if (inSpace)
			return
		const el = e.target instanceof Element ? e.target.closest('a, button') : null
		if (el)
			sound.tick('tap')
	}

	// Carry the next room to the door: any intent toward an internal link
	// (hover, focus, first touch) starts fetching + decoding that room's
	// hero AND loading its data. The house setting
	// (data-sveltekit-preload-data="hover") waits for the pointer to come
	// to REST, so a decisive click, a tap, or a tab outruns it: /films
	// traced 756ms of frozen page between the click and the first frame
	// of the walk, because onNavigate only runs once the data is in.
	// Firing on the raw intent event closes that gap; preloadData
	// deduplicates, so the router's own attempt costs nothing.
	function warmFromIntent(e: Event) {
		const a = (e.target as Element | null)?.closest?.('a[href^="/"]')
		if (!a)
			return
		const href = a.getAttribute('href')
		if (!href)
			return
		const { pathname } = new URL(href, location.origin)
		warmPainting(paintingKeyForPath(pathname))
		if (pathname !== page.url.pathname)
			void preloadData(href).catch(() => {})
	}

	// The phone menu closes the curtain over the room. While it hangs,
	// the room behind is inert and holds its scroll, and growing past
	// the phone breakpoint takes the cloth down.
	let mobileOpen = $state(false)

	$effect(() => {
		if (!mobileOpen)
			return
		const root = document.documentElement
		root.setAttribute('data-menu-open', '')
		const wide = window.matchMedia('(min-width: 40rem)')
		const onWide = () => {
			if (wide.matches)
				mobileOpen = false
		}
		wide.addEventListener('change', onWide)
		return () => {
			root.removeAttribute('data-menu-open')
			wide.removeEventListener('change', onWide)
		}
	})

	// A tap on bare cloth parts the curtain, as Escape does.
	function partOnCloth(e: MouseEvent) {
		if (!(e.target as Element).closest('a, button'))
			mobileOpen = false
	}

	// The rail's latch: the fixed header takes its scrolled dress past
	// 64px and only sheds it back under 16, so the boundary never
	// flutters mid-wheel.
	let scrolled = $state(false)

	function onScroll() {
		const y = window.scrollY
		scrolled = scrolled ? y > 16 : y > 64
	}

	// A reload restores its old seat before any wheel moves.
	onMount(onScroll)

	// The glide (src/lib/smoother.ts) mounts with the museum and leaves
	// with it: /space keeps native paper scrolling under its own GSAP.
	let smoothWrapper = $state<HTMLElement>()
	let smoothContent = $state<HTMLElement>()

	$effect(() => {
		if (inSpace || !smoothWrapper || !smoothContent)
			return
		return mountSmoother(smoothWrapper, smoothContent)
	})

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
		// The space has no menu, no sound switch, and no secrets.
		if (inSpace)
			return
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

	// The rooms hang along one wall in nav order. A page outside the nav
	// takes the seat of the room it belongs to, or none.
	function wallIndex(pathname: string) {
		return nav.findIndex(item => isActive(item.href, pathname))
	}

	// The gilt thread under the nav runs to the room a click is heading
	// for on the click itself, while the room's code and data are still
	// on their way (the first /films visit spends ~500ms there). Once the
	// router lands or gives up, the thread follows the page again.
	let heading = $state.raw<{ href: string | null }>()
	const threadHref = $derived(heading ? heading.href : (nav[wallIndex(page.url.pathname)]?.href ?? null))

	// Measured rather than derived: webfonts load after the first render
	// and move the links. The first seat and every resize land in place;
	// only a change of room runs.
	function threadRuns(primaryNav: HTMLElement) {
		const thread = primaryNav.querySelector<HTMLElement>('.thread')
		if (!thread)
			return
		const seat = (run: boolean) => {
			const link = threadHref ? primaryNav.querySelector<HTMLElement>(`a[href='${threadHref}']`) : null
			if (!link)
				return
			if (!run)
				thread.style.transition = 'none'
			thread.style.transform = `translate3d(${link.offsetLeft}px, 0, 0) scaleX(${link.offsetWidth})`
			if (!run) {
				void thread.offsetWidth
				thread.style.removeProperty('transition')
			}
		}
		let seated = false
		$effect(() => {
			void threadHref
			seat(seated)
			seated = true
		})
		const observer = new ResizeObserver(() => seat(false))
		observer.observe(primaryNav)
		return () => observer.disconnect()
	}

	beforeNavigate((navigation) => {
		// Once the version poll (svelte.config.js) spots a new build, the
		// next room change walks through the front door instead of the
		// client router, so a long-lived tab stops hanging retired canvases.
		// cancel() first, or the router keeps going and the walk runs under
		// the reload: a double transition tearing mid-beat.
		if (updated.current && !navigation.willUnload && navigation.to?.url) {
			navigation.cancel()
			location.href = navigation.to.url.href
			return
		}
		const to = navigation.to?.url
		if (!to || navigation.willUnload || to.pathname === navigation.from?.url.pathname)
			return
		const mark = { href: nav[wallIndex(to.pathname)]?.href ?? null }
		heading = mark
		const settle = () => {
			if (heading === mark)
				heading = undefined
		}
		navigation.complete.then(settle, settle)
	})

	// The walk's clock, mirroring --walk-in in app.css. The cleanup waits
	// out the arrival so the attribute never leaves mid-animation.
	const WALK_IN = 320

	// A fast second click must never be cleaned up by the first one's timer.
	let walkToken = 0

	// The old room keeps its own palette while it walks off: <html> has
	// turned to the next room's by then.
	const ROOM_TOKENS = ['--bg', '--bg-soft', '--ink', '--ink-muted', '--ink-dim', '--rule', '--accent']

	let held: HTMLElement[] = []

	function release() {
		for (const el of held)
			el.remove()
		held = []
	}

	// What stays on the wall while the room changes: a still copy of the
	// stage exactly where the eye left it, and a sheet of the old wall
	// color under everything. Both hang on <body>, outside the glide's
	// transform. The copy drops the .stage class so the live stage's
	// swap rules never reach it.
	function hold(stage: HTMLElement) {
		release()
		const root = getComputedStyle(document.documentElement)
		const wall = document.createElement('div')
		wall.className = 'wall-held'
		wall.style.backgroundColor = root.backgroundColor

		const room = document.createElement('div')
		room.className = 'room-held'
		room.setAttribute('aria-hidden', 'true')
		room.inert = true
		for (const token of ROOM_TOKENS)
			room.style.setProperty(token, root.getPropertyValue(token))

		const copy = stage.cloneNode(true) as HTMLElement
		copy.removeAttribute('id')
		copy.removeAttribute('style')
		copy.classList.remove('stage')
		copy.style.transform = `translate3d(0, ${stage.getBoundingClientRect().top}px, 0)`
		for (const el of copy.querySelectorAll('[id]'))
			el.removeAttribute('id')
		for (const img of copy.querySelectorAll('img'))
			img.decoding = 'sync'

		room.append(copy)
		document.body.append(wall, room)
		held = [wall, room]
	}

	// Forward walks right and back walks left, by the rooms' order on the
	// wall. Inside one room (an essay and its index) the deeper page is
	// forward, and history's own direction settles the rest.
	function walkDirection(navigation: OnNavigate): 'forward' | 'back' {
		const from = navigation.from?.url.pathname ?? '/'
		const to = navigation.to?.url.pathname ?? '/'
		const a = wallIndex(from)
		const b = wallIndex(to)
		if (a !== -1 && b !== -1 && a !== b)
			return b > a ? 'forward' : 'back'
		if (navigation.type === 'popstate')
			return navigation.delta < 0 ? 'back' : 'forward'
		return to.split('/').length >= from.split('/').length ? 'forward' : 'back'
	}

	onNavigate((navigation) => {
		mobileOpen = false
		// The first walk out of the space arms the house sound system.
		if (navigation.to && !isSpacePath(navigation.to.url.pathname))
			initSound()
		// The overture plays once per visit: after the first arrival the
		// curtain sits out and paintings develop in place (see Curtain.svelte
		// and app.css).
		document.documentElement.setAttribute('data-navigated', '')
		// Route changes must land at the top as an instant jump hidden under
		// the cleared stage; html's smooth scrolling turned the router's
		// scroll reset into an eased scroll still running when the new room
		// appeared. Same-page hash jumps keep the smoothness.
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
		// The walk is for room changes only: hash jumps and same-path
		// search changes (the music range switcher) swap in place.
		if (!pathChanged)
			return
		// Start the next painting's decode if intent didn't get there first.
		// Nothing waits on it: a canvas that isn't ready develops in on its
		// own (Painting.svelte, .loaded).
		void warmPainting(navigation.to ? paintingKeyForPath(navigation.to.url.pathname) : null)
		// The walk (see app.css): the copy of the old room covers the wall,
		// the router swaps the room under it at once, then both rooms travel
		// on one clock.
		const html = document.documentElement
		const stage = smoothContent
		const token = ++walkToken
		if (stage)
			hold(stage)
		html.setAttribute('data-walk', walkDirection(navigation))
		html.setAttribute('data-swap', 'out')
		const arrive = () => {
			if (token !== walkToken)
				return
			// One held frame: the new room's first paint is the navigation's
			// dearest raster, and it lands while the copy still covers it.
			requestAnimationFrame(() => {
				if (token !== walkToken)
					return
				// The glide squares its transform with the router's scroll
				// reset while the copy still covers it (smoother.ts).
				snapSmoother()
				html.setAttribute('data-swap', 'in')
				setTimeout(() => {
					if (token !== walkToken)
						return
					release()
					html.removeAttribute('data-swap')
					html.removeAttribute('data-walk')
				}, WALK_IN)
			})
		}
		// `complete` settles right after the swap: walk onto the new room,
		// or back onto the old one when the navigation aborts.
		navigation.complete.then(arrive, arrive)
	})
</script>

{#if !inSpace}
	<JsonLd />
	<CommandPalette />
	<Curtain />
	<Screensaver />
{/if}

{#snippet soundGlyph()}
	<!-- phosphor: speaker-simple-high / speaker-simple-slash -->
	<svg class='glyph' width='16' height='16' viewBox='0 0 256 256' aria-hidden='true'>
		{#if sound.enabled}
			<path
				fill='currentColor'
				d='M163.51 24.81a8 8 0 0 0-8.42.88L85.25 80H40a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h45.25l69.84 54.31A8 8 0 0 0 168 224V32a8 8 0 0 0-4.49-7.19M152 207.64l-59.09-45.95A7.94 7.94 0 0 0 88 160H40V96h48a7.94 7.94 0 0 0 4.91-1.69L152 48.36ZM208 104v48a8 8 0 0 1-16 0v-48a8 8 0 0 1 16 0m32-16v80a8 8 0 0 1-16 0V88a8 8 0 0 1 16 0'
			/>
		{:else}
			<path
				fill='currentColor'
				d='M192 152v-48a8 8 0 0 1 16 0v48a8 8 0 0 1-16 0m40-72a8 8 0 0 0-8 8v80a8 8 0 0 0 16 0V88a8 8 0 0 0-8-8m-10.08 130.62a8 8 0 1 1-11.84 10.76L168 175.09V224a8 8 0 0 1-12.91 6.31L85.25 176H40a16 16 0 0 1-16-16V96a16 16 0 0 1 16-16h41.55L50.08 45.38a8 8 0 0 1 11.84-10.76ZM152 157.49L96.1 96H40v64h48a7.94 7.94 0 0 1 4.91 1.69L152 207.64Zm-26.94-88.18l26.94-21v58.47a8 8 0 0 0 16 0V32a8 8 0 0 0-12.91-6.31l-39.85 31a8 8 0 0 0 9.82 12.63Z'
			/>
		{/if}
	</svg>
{/snippet}

{#snippet searchGlyph()}
	<!-- phosphor: magnifying-glass -->
	<svg class='glyph' width='16' height='16' viewBox='0 0 256 256' aria-hidden='true'>
		<path
			fill='currentColor'
			d='m229.66 218.34l-50.07-50.06a88.11 88.11 0 1 0-11.31 11.31l50.06 50.07a8 8 0 0 0 11.32-11.32M40 112a72 72 0 1 1 72 72a72.08 72.08 0 0 1-72-72'
		/>
	</svg>
{/snippet}

<svelte:head>
	{#if !inSpace}
		<link rel='preload' as='font' type='font/woff2' href={frauncesWoff2} crossorigin='anonymous' />
		<link rel='preload' as='font' type='font/woff2' href={franklinWoff2} crossorigin='anonymous' />
	{/if}
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

<svelte:window onkeydown={onGlobalKeydown} onscroll={onScroll} />

<a href='#main' class='skip-link'>Skip to content</a>

{#if inSpace}
	<!-- The space: bare paper. Its world lives in routes/space. -->
	<main id='main'>
		{@render children()}
	</main>
{:else}
	<!-- The header: still lettering on the room's canvas from the first
	     frame, no band of wall above it, but it now rides fixed. Past
	     the first steps it takes glass, a hairline, and a slimmer seat
	     (.scrolled, below); at rest it keeps no chrome at all. It
	     stands outside the glide's wrapper, where position: fixed still
	     means the viewport. -->
	<header class={['fixed inset-x-0 top-0 z-40 py-4', mobileOpen && 'menu-open', scrolled && 'scrolled']}>
		<div class='relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 sm:grid sm:grid-cols-[1fr_auto_1fr]'>
			<a
				href='/'
				class='brand justify-self-start text-[var(--ink)] transition-colors hover:text-[var(--accent)]'
				aria-label='Khaled Waleed, home'
			>
				<Monogram class='block h-7 w-auto' />
			</a>

			<!-- Desktop: links inline, centred between the monogram and the
			     search chip. The gilt and the thread follow the click; the
			     current page keeps aria-current. -->
			<nav
				{@attach threadRuns}
				aria-label='Primary'
				class='relative hidden flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:flex'
			>
				{#each nav as item (item.name)}
					<a
						href={item.href}
						class="-my-2 py-2 font-display text-[1.05rem] transition-colors {item.href === threadHref
							? 'text-[var(--accent)]'
							: 'text-[var(--ink-muted)] hover:text-[var(--ink)]'}"
						aria-current={isActive(item.href, page.url.pathname) ? 'page' : undefined}
					>
						{item.name}
					</a>
				{/each}
				<span class={['thread', threadHref && 'lit']} aria-hidden='true'></span>
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
					{@render soundGlyph()}
				</button>
				<button
					type='button'
					class="relative flex cursor-pointer items-center justify-center p-2 text-[var(--ink-muted)] transition-colors after:absolute after:-inset-1 after:content-[''] hover:text-[var(--ink)]"
					aria-label='Search the site'
					title='Search (press /)'
					onclick={() => palette.request()}
				>
					{@render searchGlyph()}
				</button>
				{#if soundHint}
					<span class='sound-hint smallcaps' aria-hidden='true'>chopin, op. 72 no. 1 · press m</span>
				{/if}
			</div>

			<!-- Sound state for screen readers: the m shortcut and both
		     toggles land here, wherever focus happens to be. -->
			<span class='sr-only' role='status'>{sound.enabled ? 'Sound on' : 'Sound off'}</span>

			<!-- Phone: a small proscenium, a rod over two tied-back drapes.
			     Opening, the rod lifts away and the drapes swing in and
			     cross into the close mark. -->
			<button
				type='button'
				class={[
					'menu-toggle -mr-2.5 inline-flex items-center justify-center p-2.5 transition-colors sm:hidden',
					mobileOpen ? 'open text-[var(--ink)]' : 'text-[var(--ink-muted)] hover:text-[var(--ink)]',
				]}
				aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={mobileOpen}
				aria-controls='mobile-nav'
				onclick={() => (mobileOpen = !mobileOpen)}
			>
				<svg
					class='proscenium'
					width='24'
					height='24'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					stroke-width='1.6'
					stroke-linecap='round'
					aria-hidden='true'
				>
					<path class='rod' d='M4.5 5H19.5' />
					<path class='hang hang-l' d='M0 -6Q1.8 0 0 6' />
					<path class='hang hang-r' d='M0 -6Q-1.8 0 0 6' />
				</svg>
			</button>
		</div>

		<!-- Phone: the menu is the curtain drawn shut over the room, the
		     rooms set on the cloth. It hangs under the header row, so
		     the monogram and the toggle stay in reach above it. -->
		<div class={['menu-stage sm:hidden', mobileOpen && 'open']}>
			<div class='menu-veil'></div>
			<div class='menu-drape drape drape-left'></div>
			<div class='menu-drape drape drape-right'></div>
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
			<nav id='mobile-nav' aria-label='Primary' inert={!mobileOpen} class='menu-bill' onclick={partOnCloth}>
				<div class='flex min-h-full flex-col items-center justify-center px-6 pt-24 pb-12'>
					<ul class='flex flex-col items-center'>
						{#each nav as item, i (item.name)}
							{@const active = isActive(item.href, page.url.pathname)}
							<li class='bill-line' style:--i={i}>
								<a
									href={item.href}
									class={['bill-room block px-4 py-1.5 font-display', active && 'current']}
									aria-current={active ? 'page' : undefined}
									onclick={() => (mobileOpen = false)}
								>
									{item.name}
								</a>
							</li>
						{/each}
					</ul>
					<div class='bill-line mt-10 flex items-center gap-8' style:--i={nav.length}>
						<button
							type='button'
							class='bill-aside smallcaps flex items-center gap-2 py-2'
							onclick={() => {
								mobileOpen = false
								palette.request()
							}}
						>
							{@render searchGlyph()}
							Search
						</button>
						<button
							type='button'
							class='bill-aside smallcaps flex items-center gap-2 py-2'
							aria-pressed={sound.enabled}
							onclick={() => sound.toggle()}
						>
							{@render soundGlyph()}
							Sound
						</button>
					</div>
				</div>
			</nav>
		</div>
	</header>

	<!-- The glide's frame (src/lib/smoother.ts): the wrapper pins, the
	     content rides the transform, and the content doubles as the
	     stage: everything the walk carries, main and footer both.
	     The header stays outside, so the nav lettering holds still
	     while the rooms pass under it. -->
	<div id='smooth-wrapper' bind:this={smoothWrapper} inert={mobileOpen}>
		<div id='smooth-content' bind:this={smoothContent} class='stage flex min-h-[100dvh] flex-col'>
			<main id='main' class='flex-1'>
				{@render children()}
			</main>

			<!-- Footer: colophon at left, the rooms and the letterbox at right.
		     Social platforms live on /contact (and in the Person schema), not here. -->
			<footer class='mt-12 py-6 sm:mt-32 sm:py-10'>
				<div class='footer-sign mx-auto mb-8 w-full max-w-6xl px-6 sm:mb-10'>
					<FooterSignature />
				</div>
				<Container size='wide'>
					<div class='flex flex-col gap-6 text-left sm:flex-row sm:items-end sm:justify-between'>
						<div class='space-y-1'>
							<div class='text-[var(--ink-muted)] italic max-sm:text-sm'>
								{site.name} <span lang='ar' class='not-italic'>{site.nameArabic}</span> ·
								{site.role},&nbsp;{site.location.city},&nbsp;{site.location.country}
							</div>
							<div class='smallcaps'>
								{colophonYear} · set in fraunces &amp; franklin ·
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
	</div>
{/if}

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

	/* Glyphs are strokes, not letters; the halo comes as a drop-shadow. */
	.glyph,
	.proscenium {
		filter: drop-shadow(0 1px 3px color-mix(in oklab, var(--bg) 80%, transparent));
	}

	/* The rail's glass: the pane the phone menu always wore, promoted to
	   every size and to the scrolled state. At rest the header keeps no
	   chrome at all; once the visitor walks the
	   wall's own color rises behind the lettering as frosted glass,
	   taking the WHOLE header, monogram row included, edge to edge. The
	   resting canvas still carries no scrim, and the drawn curtain
	   needs no glass. */
	header::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: color-mix(in oklab, var(--bg) 84%, transparent);
		opacity: 0;
		pointer-events: none;
		transition: opacity var(--dur-beat) var(--ease-out);
		-webkit-backdrop-filter: blur(12px);
		backdrop-filter: blur(12px);
	}

	header.scrolled:not(.menu-open)::before {
		opacity: 1;
	}

	/* Under the glass a hairline draws from the centre outward, 45ms
	   behind it; leaving, it retracts with the glass, no delay. */
	header::after {
		content: '';
		position: absolute;
		inset: auto 0 0 0;
		height: 1px;
		background: var(--rule);
		transform: scaleX(0);
		transition: transform var(--dur-beat) var(--ease-out);
	}

	header.scrolled:not(.menu-open)::after {
		transform: scaleX(1);
		transition-delay: 45ms;
	}

	/* The seat condenses on the same beat: the padding halves and the
	   mark steps down with it. */
	header {
		transition: padding-block var(--dur-beat) var(--ease-out);
	}

	header.scrolled {
		padding-block: 0.5rem;
	}

	/* 0.857 ≈ 24px from the resting 28, held to the left edge. */
	.brand {
		transform-origin: left center;
		transition: transform var(--dur-beat) var(--ease-out);
	}

	header.scrolled .brand {
		transform: scale(0.857);
	}

	/* The gilt thread: a 1px hairline stretched to the link's width, so
	   the run between two rooms is one composited transform. */
	.thread {
		position: absolute;
		bottom: -0.2rem;
		left: 0;
		width: 1px;
		height: 1px;
		background: var(--accent);
		box-shadow: 0 1px 3px color-mix(in oklab, var(--bg) 80%, transparent);
		transform-origin: 0 50%;
		opacity: 0;
		pointer-events: none;
		transition:
			transform var(--dur-beat) var(--ease-out),
			opacity var(--dur-quick) var(--ease-out);
	}

	.thread.lit {
		opacity: 1;
	}

	/* The phone menu: the overture's velvet, run backwards. The drapes
	   come in from the wings and meet at the seam while the house
	   lights dim in the closing gap; the rooms rise onto the cloth in
	   wall order once it has nearly met. Parting, the words go first
	   and all at once, then the drapes open onto the room, which by
	   then may already be the next one. */
	.menu-stage {
		--menu-close: 540ms;
		--menu-part: 460ms;
		--menu-cloth: cubic-bezier(0.6, 0, 0.2, 1);
		position: fixed;
		inset: 0;
		overflow: hidden;
		visibility: hidden;
		transition: visibility 0s linear calc(var(--menu-part) + 80ms);
	}

	.menu-stage.open {
		visibility: visible;
		transition-delay: 0s;
	}

	.menu-veil {
		position: absolute;
		inset: 0;
		background: color-mix(in oklab, black 55%, var(--bg));
		opacity: 0;
		transition: opacity var(--menu-part) ease-in-out 80ms;
	}

	.open .menu-veil {
		opacity: 0.8;
		transition: opacity var(--menu-close) ease-in-out;
	}

	.menu-drape {
		transform: translateX(calc(var(--dir) * 104%));
		transition: transform var(--menu-part) var(--menu-cloth) 80ms;
	}

	.open .menu-drape {
		transform: translateX(0);
		transition: transform var(--menu-close) var(--menu-cloth);
	}

	.menu-bill {
		position: absolute;
		inset: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.bill-line {
		opacity: 0;
		transform: translateY(14px);
		transition:
			opacity 140ms var(--ease-out),
			transform 0s linear 140ms;
	}

	.open .bill-line {
		opacity: 1;
		transform: translateY(0);
		transition:
			opacity 450ms var(--ease-out),
			transform 450ms var(--ease-out);
		transition-delay: calc(260ms + var(--i) * 35ms);
	}

	.bill-room {
		position: relative;
		font-size: 2.25rem;
		line-height: 1.15;
		color: var(--ink);
		transition: color var(--dur-quick) var(--ease-out);
	}

	.bill-room:active {
		color: var(--accent);
	}

	.bill-room.current {
		color: var(--accent);
	}

	/* The current room keeps the desktop's gilt thread, drawn from the
	   centre once its name has settled. */
	.bill-room.current::after {
		content: '';
		position: absolute;
		left: 50%;
		bottom: 0.3rem;
		width: 1.5rem;
		height: 1px;
		margin-left: -0.75rem;
		background: var(--accent);
		transform: scaleX(0);
		transition: transform var(--dur-quick) var(--ease-out);
	}

	.open .bill-room.current::after {
		transform: scaleX(1);
		transition: transform 450ms var(--ease-out) calc(560ms + var(--i, 0) * 35ms);
	}

	.bill-aside {
		transition: color var(--dur-quick) var(--ease-out);
	}

	.bill-aside:active,
	.bill-aside[aria-pressed='true'] {
		color: var(--ink);
	}

	/* The proscenium. Every stroke is seated by transforms from its own
	   origin, so hung and crossed are two sets of numbers and the swing
	   between them stays on the compositor (no path morphing, which
	   Safari won't animate). Opening, the rod lifts first and the drapes
	   swing in behind it; closing, the drapes swing back out and the
	   rod settles onto them. */
	.menu-toggle:active .proscenium {
		scale: 0.92;
	}

	.proscenium {
		transition: scale var(--dur-quick) var(--ease-out);
	}

	.rod {
		transition:
			translate 300ms cubic-bezier(0.34, 1.3, 0.64, 1) 80ms,
			opacity var(--dur-quick) var(--ease-out) 80ms;
	}

	.open .rod {
		translate: 0 -4px;
		opacity: 0;
		transition:
			translate var(--dur-quick) var(--ease-out),
			opacity 140ms var(--ease-out);
	}

	.hang {
		transform-box: view-box;
		transform-origin: 0 0;
		transition:
			translate 340ms cubic-bezier(0.34, 1.3, 0.64, 1),
			rotate 340ms cubic-bezier(0.34, 1.3, 0.64, 1);
	}

	.open .hang {
		transition-delay: 50ms;
	}

	.hang-l {
		translate: 6.5px 13.5px;
	}

	.hang-r {
		translate: 17.5px 13.5px;
	}

	.open .hang-l {
		translate: 12px 12px;
		rotate: -45deg;
	}

	.open .hang-r {
		translate: 12px 12px;
		rotate: 45deg;
	}

	/* The global reset zeroes durations but not delays: the stagger and
	   the toggle's beats would otherwise still wait before snapping. */
	@media (prefers-reduced-motion: reduce) {
		.thread,
		.menu-stage,
		.menu-veil,
		.menu-drape,
		.bill-line,
		.bill-room::after,
		.rod,
		.hang {
			transition-delay: 0ms !important;
		}

		/* No travel: the drawn curtain fades in where it hangs. */
		.menu-drape {
			transform: none;
			opacity: 0;
		}

		.open .menu-drape {
			opacity: 1;
		}
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
