<script lang='ts'>
	import { dev } from '$app/environment'
	import { beforeNavigate, onNavigate } from '$app/navigation'
	import { page, updated } from '$app/state'
	import { CommandPalette, Container, Curtain, JsonLd, Monogram, Screensaver, site } from '$lib'
	import { curtain } from '$lib/curtain'
	import { romanYear } from '$lib/dates'
	import { paintingKeyForPath, warmPainting } from '$lib/painting-warm'
	import { palette } from '$lib/palette'

	import { roomBg, roomForPath } from '$lib/site'
	import { sound } from '$lib/sound.svelte'
	import frauncesWoff2 from '@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2?url'
	// The two workhorse faces, preloaded so the first paint doesn't run
	// in fallback type while the CSS is still being parsed for their URLs
	// (?url resolves to the same hashed asset the @font-face rules name).
	import franklinWoff2 from '@fontsource-variable/libre-franklin/files/libre-franklin-latin-wght-normal.woff2?url'
	import { onMount } from 'svelte'
	import '../app.css'
	import '@fontsource-variable/fraunces/opsz.css'
	import '@fontsource-variable/fraunces/opsz-italic.css'
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

	// Once the version poll (svelte.config.js) spots a new build, the next
	// room change walks through the front door instead of the client
	// router, so a long-lived tab stops hanging retired canvases. cancel()
	// first, or the router keeps going and the blur swap runs under the
	// reload: a double transition tearing mid-beat.
	beforeNavigate((navigation) => {
		if (updated.current && !navigation.willUnload && navigation.to?.url) {
			navigation.cancel()
			location.href = navigation.to.url.href
		}
	})

	// The blur swap's token: a fast second navigation must never be
	// cleaned up (or sharpened early) by the first one's timers.
	let swapToken = 0

	onNavigate((navigation) => {
		mobileOpen = false
		// The first walk out of the space arms the house sound system.
		if (navigation.to && !isSpacePath(navigation.to.url.pathname))
			initSound()
		// The overture plays once per visit: after the first arrival the
		// curtain sits out and paintings develop in place (see Curtain.svelte
		// and app.css).
		document.documentElement.setAttribute('data-navigated', '')
		// Route changes must land at the top as an instant jump hidden inside
		// the swap's soft beat; html's smooth scrolling turned the router's
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
		// The swap is for room changes only: hash jumps and same-path
		// search changes (the music range switcher) swap in place.
		if (!pathChanged)
			return
		// Start carrying the next painting to the door. No hold: the swap's
		// soft beat is the decode window, and a canvas that still misses
		// its cue develops in via .loaded (see .frontispiece img in app.css).
		const key = navigation.to ? paintingKeyForPath(navigation.to.url.pathname) : null
		if (key)
			warmPainting(key)
		// The blur swap (see .stage in app.css): the stage (main + footer;
		// the nav lettering floats above it, sharp) softens out of focus
		// for one short beat, the router swaps the room and the palette
		// underneath, then the new room settles back sharp. One layer, one
		// clock; the band's covered corridor is gone. data-swap also
		// shortens the 600ms palette eases to the sharpen's own clock, so
		// the wall crosses with the focus pull instead of straggling after
		// it. onNavigate runs after data loading, so the beat never waits
		// on the network.
		const html = document.documentElement
		const token = ++swapToken
		html.setAttribute('data-swap', 'out')
		const arrive = () => {
			if (token !== swapToken)
				return
			// Two held frames before the sharpen: the new room's first paint
			// is the navigation's dearest raster, and starting the filter
			// animation against it dropped frames on both engines. The paint
			// lands under the standing blur, then the focus pulls on a
			// settled surface.
			requestAnimationFrame(() => requestAnimationFrame(() => {
				if (token !== swapToken)
					return
				html.setAttribute('data-swap', 'in')
				setTimeout(() => {
					if (token !== swapToken)
						return
					html.removeAttribute('data-swap')
				}, 200)
			}))
		}
		// `complete` settles right after the swap: sharpen on the new room,
		// or back onto the old one when the navigation aborts.
		navigation.complete.then(arrive, arrive)
		return new Promise((resolve) => {
			// Swap at the bottom of the dip, never against a half-blurred
			// old room (--swap-out is 90ms).
			setTimeout(resolve, 90)
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

{#if !inSpace}
	<JsonLd />
	<CommandPalette />
	<Curtain />
	<Screensaver />
{/if}

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

<svelte:window onkeydown={onGlobalKeydown} />

<a href='#main' class='skip-link'>Skip to content</a>

{#if inSpace}
	<!-- The space: bare paper. Its world lives in routes/space. -->
	<main id='main'>
		{@render children()}
	</main>
{:else}
	<div class='relative flex min-h-[100dvh] flex-col'>
		<!-- Quiet classical header: not sticky, no chrome, and out of the
	     flow: the nav is lettering on the room's canvas from the first
	     frame, never a band of wall above it. -->
		<header class={['absolute inset-x-0 top-0 z-40 py-4', mobileOpen && 'menu-open']}>
			<div class='mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 sm:grid sm:grid-cols-[1fr_auto_1fr]'>
				<a
					href='/'
					class='justify-self-start text-[var(--ink)] transition-colors hover:text-[var(--accent)]'
					aria-label='Khaled Waleed, home'
				>
					<Monogram class='block h-7 w-auto' />
				</a>

				<!-- Desktop: links inline, centred between the monogram and the search chip -->
				<nav aria-label='Primary' class='hidden flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:flex'>
					{#each nav as item (item.name)}
						{@const active = isActive(item.href, page.url.pathname)}
						<a
							href={item.href}
							class="-my-2 py-2 font-display text-[1.05rem] transition-colors {active
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
					</button>
					<button
						type='button'
						class="relative flex cursor-pointer items-center justify-center p-2 text-[var(--ink-muted)] transition-colors after:absolute after:-inset-1 after:content-[''] hover:text-[var(--ink)]"
						aria-label='Search the site'
						title='Search (press /)'
						onclick={() => palette.request()}
					>
						<!-- phosphor: magnifying-glass -->
						<svg class='glyph' width='16' height='16' viewBox='0 0 256 256' aria-hidden='true'>
							<path
								fill='currentColor'
								d='m229.66 218.34l-50.07-50.06a88.11 88.11 0 1 0-11.31 11.31l50.06 50.07a8 8 0 0 0 11.32-11.32M40 112a72 72 0 1 1 72 72a72.08 72.08 0 0 1-72-72'
							/>
						</svg>
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
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							stroke-width='1.75'
							stroke-linecap='round'
						>
							<path class='bar bar-top' d='M3.5 7h17' />
							<path class='bar bar-mid' d='M3.5 12h17' />
							<path class='bar bar-bot' d='M3.5 17h17' />
						</svg>
					</span>
				</button>
			</div>

			<!-- Phone: collapsible menu -->
			<div class='mobile-menu mx-auto max-w-6xl px-6 sm:hidden'>
				<nav id='mobile-nav' aria-label='Primary' inert={!mobileOpen}>
					<ul class='mt-2 flex flex-col border-t border-[var(--rule)] pt-1 pb-2'>
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
			</div>
		</header>

		<!-- The stage: everything the blur swap softens. The header stays
	     outside it, so the nav lettering holds sharp over the focus
	     pull (a filter blurs its whole subtree; no exemptions). -->
		<div class='stage flex flex-1 flex-col'>
			<main id='main' class='flex-1'>
				{@render children()}
			</main>

			<!-- Footer: colophon at left, the rooms and the letterbox at right.
		     Social platforms live on /contact (and in the Person schema), not here. -->
			<footer class='mt-12 py-6 sm:mt-32 sm:py-10'>
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

	/* Glyphs are strokes, not letters; the halo comes as a drop-shadow
	   on their stills (the hamburger's svgs animate their own filter). */
	.glyph,
	.menu-icon {
		filter: drop-shadow(0 1px 3px color-mix(in oklab, var(--bg) 80%, transparent));
	}

	/* The open menu needs a surface, and it takes the WHOLE header:
	   monogram row included, edge to edge. A pane under the list alone
	   left the row above it floating on bare art, which read as a card
	   hanging off nothing. Closed, the header keeps no chrome at all. */
	@media (width < 40rem) {
		header::before {
			content: '';
			position: absolute;
			inset: 0;
			z-index: -1;
			background: color-mix(in oklab, var(--bg) 84%, transparent);
			border-bottom: 1px solid var(--rule);
			opacity: 0;
			pointer-events: none;
			transition: opacity var(--dur-beat) var(--ease-out);
			-webkit-backdrop-filter: blur(12px);
			backdrop-filter: blur(12px);
		}

		header.menu-open::before {
			opacity: 1;
		}
	}

	/* The drop collapses through 0fr rather than a slide transition, so
	   the list and the pane behind it move on one clock in both
	   directions. Under {#if} the pane popped in and out a whole beat
	   ahead of the list, leaving its border alone on screen for a frame. */
	.mobile-menu {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows var(--dur-beat) var(--ease-out);
	}

	.menu-open .mobile-menu {
		grid-template-rows: 1fr;
	}

	.mobile-menu > nav {
		min-height: 0;
		overflow: hidden;
	}

	/* Hamburger ↔ X: the same three strokes throughout. Opening, the
	   outer two slide to the centre line and start folding into the
	   cross before they land; closing runs the order backwards. The
	   45ms overlap is what keeps it one gesture instead of two. */
	.menu-icon {
		display: inline-grid;
		place-items: center;
	}

	.bar {
		transform-box: view-box;
		/* Closing: unfold first, then spread apart. */
		transition:
			rotate var(--dur-quick) var(--ease-out),
			scale var(--dur-quick) var(--ease-out),
			opacity var(--dur-quick) var(--ease-out),
			translate var(--dur-quick) var(--ease-out) 45ms;
	}

	.bar-top {
		transform-origin: 12px 7px;
	}

	.bar-mid {
		transform-origin: 12px 12px;
	}

	.bar-bot {
		transform-origin: 12px 17px;
	}

	.menu-toggle.open .bar {
		/* Opening: converge first, then fold. */
		transition:
			translate var(--dur-quick) var(--ease-out),
			opacity var(--dur-quick) var(--ease-out),
			rotate var(--dur-quick) var(--ease-out) 45ms,
			scale var(--dur-quick) var(--ease-out) 45ms;
	}

	.menu-toggle.open .bar-top {
		translate: 0 5px;
		rotate: 45deg;
		scale: 0.86 1;
	}

	.menu-toggle.open .bar-bot {
		translate: 0 -5px;
		rotate: -45deg;
		scale: 0.86 1;
	}

	.menu-toggle.open .bar-mid {
		scale: 0 1;
		opacity: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.bar,
		.menu-toggle.open .bar {
			transition-duration: 0.01ms;
			transition-delay: 0ms;
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
