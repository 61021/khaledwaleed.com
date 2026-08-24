<script lang='ts'>
	import { goto } from '$app/navigation'
	import { curtain } from '$lib/curtain'
	import { palette } from '$lib/palette'
	import { posts } from '$lib/posts'
	import { sound } from '$lib/sound.svelte'
	import { onMount } from 'svelte'
	import { quintOut } from 'svelte/easing'
	import { fade, fly } from 'svelte/transition'

	type Item = {
		id: string
		title: string
		subtitle?: string
		href: string
		kind: 'page' | 'post' | 'external' | 'action'
		keywords?: string
		/**
		 * Service-corridor entries: never in the default list, they step
		 * out only when a query token of three letters or more starts one
		 * of these words. The regular haystack is not searched for them.
		 */
		secret?: string[]
		/** Runs instead of navigating. */
		run?: () => void
	}

	const items: Item[] = [
		{ id: 'home', title: 'Home', subtitle: 'The front page', href: '/', kind: 'page' },
		{
			id: 'story',
			title: 'Story',
			subtitle: 'The life story & work history',
			href: '/story',
			kind: 'page',
			keywords: 'about background experience cv resume history',
		},
		{
			id: 'cv',
			title: 'CV',
			subtitle: 'The two-page PDF',
			href: '/Khaled-Waleed-Resume.pdf',
			kind: 'external',
			keywords: 'resume pdf download',
		},
		{
			id: 'projects',
			title: 'Projects',
			subtitle: 'Products, client work, government platforms',
			href: '/projects',
			kind: 'page',
			keywords:
				'work portfolio products auction key rocca menu risha amanat baghdad enjaz oil coupon vitex open source nuxt ui hyprland',
		},
		{ id: 'writing', title: 'Writing', subtitle: 'Essays & notes', href: '/writing', kind: 'page' },
		{
			id: 'likes',
			title: 'Likes',
			subtitle: 'A catalogue of obsessions',
			href: '/likes',
			kind: 'page',
		},
		{
			id: 'films',
			title: 'Films',
			subtitle: 'Everything I have rated, by score',
			href: '/films',
			kind: 'page',
			keywords: 'movies cinema imdb ratings tv shows watch',
		},
		{
			id: 'tools',
			title: 'Tools',
			subtitle: 'The hardware, the software, the services',
			href: '/tools',
			kind: 'page',
			keywords: 'uses setup gear hardware software desk stack tools system',
		},
		{ id: 'contact', title: 'Contact', subtitle: 'Talk to me', href: '/contact', kind: 'page' },
		...posts.map((p): Item => ({
			id: `post-${p.slug}`,
			title: p.title,
			subtitle: p.description,
			href: `/writing/${p.slug}`,
			kind: 'post',
			keywords: p.tags.join(' '),
		})),
		{
			id: 'email',
			title: 'Email Khaled',
			subtitle: 'contact@khaledwaleed.com',
			href: 'mailto:contact@khaledwaleed.com',
			kind: 'external',
		},
		{
			id: 'rss',
			title: 'Subscribe via RSS',
			subtitle: '/rss.xml',
			href: '/rss.xml',
			kind: 'external',
		},
		{
			id: 'github',
			title: 'GitHub',
			subtitle: 'github.com/61021',
			href: 'https://github.com/61021',
			kind: 'external',
			keywords: 'github source code repositories 61021',
		},
		// The service corridor.
		{
			id: 'encore',
			title: 'Encore',
			subtitle: 'Lower the curtain and raise it again',
			href: '',
			kind: 'action',
			secret: ['encore', 'curtain', 'overture', 'velvet', 'konami'],
			run: () => curtain.encore(),
		},
		{
			id: 'now-playing',
			title: 'Now playing',
			subtitle: 'Chopin, Nocturne in E minor, Op. 72 No. 1 · Musopen, public domain',
			href: '',
			kind: 'action',
			secret: ['chopin', 'nocturne', 'now playing', 'playing', 'music', 'sound', 'piano'],
			run: () => sound.toggle(),
		},
		{
			id: 'storeroom',
			title: 'Storeroom',
			subtitle: 'Paintings that used to hang here',
			href: '/storeroom',
			kind: 'page',
			secret: ['storeroom', 'storage', 'vault', 'archive', 'basement', 'paintings', 'retired'],
		},
	]

	let open = $state(false)
	let query = $state('')
	let activeIndex = $state(0)
	let inputEl = $state<HTMLInputElement | null>(null)
	let listEl = $state<HTMLUListElement | null>(null)
	let dialogEl = $state<HTMLDivElement | null>(null)
	let lastFocused: HTMLElement | null = null
	let scrollLock: (() => void) | null = null

	// The header search button (or anything else) can ask us to open.
	onMount(() => {
		const unregister = palette.register(openPalette)
		return () => {
			scrollLock?.()
			unregister()
		}
	})

	// The backdrop covers the page but the page keeps scrolling under it.
	// Freezing the root also takes the scrollbar away, so its width goes
	// back as padding or the whole layout jumps sideways.
	function lockScroll() {
		const root = document.documentElement
		const gutter = window.innerWidth - root.clientWidth
		const overflow = root.style.overflow
		const padding = root.style.paddingRight
		root.style.overflow = 'hidden'
		if (gutter > 0)
			root.style.paddingRight = `${gutter}px`
		return () => {
			root.style.overflow = overflow
			root.style.paddingRight = padding
		}
	}

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase()
		if (!q)
			return items.filter(it => !it.secret)
		const parts = q.split(/\s+/)
		return items.filter((it) => {
			const secret = it.secret
			if (secret)
				return parts.some(part => part.length >= 3 && secret.some(word => word.startsWith(part)))
			const hay = `${it.title} ${it.subtitle ?? ''} ${it.keywords ?? ''}`.toLowerCase()
			return parts.every(part => hay.includes(part))
		})
	})

	function openPalette() {
		if (open)
			return
		lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
		open = true
		query = ''
		activeIndex = 0
		scrollLock = lockScroll()
		sound.tick('open')
		queueMicrotask(() => inputEl?.focus())
	}

	function closePalette() {
		open = false
		scrollLock?.()
		scrollLock = null
		sound.tick('close')
		lastFocused?.focus()
		lastFocused = null
	}

	function select(item: Item) {
		closePalette()
		if (item.run) {
			item.run()
		}
		else if (item.kind === 'external' || item.href.startsWith('mailto:')) {
			window.location.href = item.href
		}
		else {
			goto(item.href)
		}
	}

	function onKeydown(e: KeyboardEvent) {
		if (!open) {
			// Shift stays allowed: some layouts type / with it.
			if (
				e.key === '/'
				&& !e.metaKey
				&& !e.ctrlKey
				&& !e.altKey
				&& !(e.target instanceof HTMLInputElement)
				&& !(e.target instanceof HTMLTextAreaElement)
			) {
				e.preventDefault()
				openPalette()
			}
			return
		}
		if (e.key === 'Escape') {
			e.preventDefault()
			closePalette()
		}
		else if (e.key === 'Tab') {
			// Trap focus inside the dialog while it is open. Options are
			// tabindex=-1 (arrow keys drive them), so the only tab stops are
			// the input and any real buttons.
			const focusables = [
				...(dialogEl?.querySelectorAll<HTMLElement>('input, button:not([tabindex="-1"])') ?? []),
			]
			if (!focusables.length)
				return
			const first = focusables[0]
			const last = focusables[focusables.length - 1]
			if (focusables.length === 1 || (e.shiftKey && document.activeElement === first)) {
				e.preventDefault();
				(e.shiftKey ? last : first).focus()
			}
			else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault()
				first.focus()
			}
		}
		else if (e.key === 'ArrowDown') {
			e.preventDefault()
			activeIndex = Math.min(activeIndex + 1, filtered.length - 1)
			scrollActiveIntoView()
		}
		else if (e.key === 'ArrowUp') {
			e.preventDefault()
			activeIndex = Math.max(activeIndex - 1, 0)
			scrollActiveIntoView()
		}
		else if (e.key === 'Enter') {
			e.preventDefault()
			const item = filtered[activeIndex]
			if (item)
				select(item)
		}
	}

	function scrollActiveIntoView() {
		queueMicrotask(() => {
			const el = listEl?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
			el?.scrollIntoView({ block: 'nearest' })
		})
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if open}
	<div
		class='fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[15vh] sm:pt-[18vh]'
		role='presentation'
	>
		<button
			type='button'
			aria-label='Close'
			class='absolute inset-0 bg-black/55 backdrop-blur-sm'
			onclick={closePalette}
			transition:fade={{ duration: 120 }}
		></button>

		<!-- Surfaces with a small rise, leaves with a smaller one: exits
		     stay softer than enters. -->
		<div
			bind:this={dialogEl}
			class='frame-engraved relative w-full max-w-xl border border-[var(--rule)] bg-[var(--bg-soft)] shadow-2xl'
			role='dialog'
			aria-modal='true'
			aria-label='Find a page'
			in:fly={{ y: 8, duration: 160, easing: quintOut }}
			out:fly={{ y: 4, duration: 120, easing: quintOut }}
		>
			<div class='flex items-center gap-3 border-b border-[var(--rule)] px-5 py-4'>
				<span class='text-[var(--accent)]' aria-hidden='true'>·</span>
				<input
					bind:this={inputEl}
					bind:value={query}
					oninput={() => (activeIndex = 0)}
					type='text'
					placeholder='Search pages and essays…'
					class='flex-1 bg-transparent text-[1.05rem] text-[var(--ink)] placeholder:text-[var(--ink-dim)]'
					autocomplete='off'
					spellcheck='false'
					role='combobox'
					aria-expanded={filtered.length > 0}
					aria-controls='palette-results'
					aria-activedescendant={filtered.length ? `palette-opt-${activeIndex}` : undefined}
					aria-label='Search pages and essays'
				/>
				<span class='smallcaps'>esc</span>
			</div>

			<div class='sr-only' role='status' aria-live='polite'>
				{filtered.length === 0
					? `Nothing matches ${query}`
					: `${filtered.length} result${filtered.length === 1 ? '' : 's'}`}
			</div>

			{#if filtered.length === 0}
				<div class='px-5 py-10 text-center text-[var(--ink-dim)] italic'>
					Nothing matches <em class='text-[var(--ink-muted)]'>{query}</em>.
				</div>
			{:else}
				<ul
					bind:this={listEl}
					id='palette-results'
					class='max-h-[55vh] overscroll-contain overflow-y-auto py-2'
					role='listbox'
					aria-label='Results'
				>
					{#each filtered as item, i (item.id)}
						<li role='presentation'>
							<button
								type='button'
								id={`palette-opt-${i}`}
								data-index={i}
								tabindex={-1}
								onclick={() => select(item)}
								onmousemove={() => (activeIndex = i)}
								class="flex w-full items-baseline justify-between gap-5 px-5 py-2.5 text-left transition-colors {i
									=== activeIndex
									? 'bg-[color-mix(in_oklab,var(--accent)_15%,transparent)] text-[var(--ink)]'
									: 'text-[var(--ink-muted)]'}"
								role='option'
								aria-selected={i === activeIndex}
							>
								<span class='min-w-0'>
									<span class='block text-[1.05rem]'>{item.title}</span>
									{#if item.subtitle}
										<span class='block truncate text-[0.85rem] text-[var(--ink-dim)]'
										>{item.subtitle}</span
										>
									{/if}
								</span>
								<span class='smallcaps shrink-0'>{item.kind}</span>
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
{/if}
