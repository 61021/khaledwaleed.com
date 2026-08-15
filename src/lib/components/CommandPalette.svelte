<script lang='ts'>
	import { goto } from '$app/navigation'
	import { palette } from '$lib/palette'
	import { posts } from '$lib/posts'
	import { sound } from '$lib/sound.svelte'
	import { onMount } from 'svelte'
	import { fade, fly } from 'svelte/transition'

	type Item = {
		id: string
		title: string
		subtitle?: string
		href: string
		kind: 'page' | 'post' | 'external'
		keywords?: string
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
				'work portfolio products auction key rocca menu risha amanat baghdad enjaz oil coupon vitex open source nuxt reka hyprland',
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
	]

	let open = $state(false)
	let query = $state('')
	let activeIndex = $state(0)
	let inputEl = $state<HTMLInputElement | null>(null)
	let listEl = $state<HTMLUListElement | null>(null)
	let dialogEl = $state<HTMLDivElement | null>(null)
	let lastFocused: HTMLElement | null = null

	// The header search button (or anything else) can ask us to open.
	onMount(() => palette.register(openPalette))

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase()
		if (!q)
			return items
		return items.filter((it) => {
			const hay = `${it.title} ${it.subtitle ?? ''} ${it.keywords ?? ''}`.toLowerCase()
			return q.split(/\s+/).every(part => hay.includes(part))
		})
	})

	function openPalette() {
		if (open)
			return
		lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
		open = true
		query = ''
		activeIndex = 0
		sound.tick('open')
		queueMicrotask(() => inputEl?.focus())
	}

	function closePalette() {
		open = false
		sound.tick('close')
		lastFocused?.focus()
		lastFocused = null
	}

	function select(item: Item) {
		closePalette()
		if (item.kind === 'external' || item.href.startsWith('mailto:')) {
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
			transition:fade={{ duration: 150 }}
		></button>

		<!-- Surfaces with a small rise, leaves with a smaller one: exits
		     stay softer than enters. -->
		<div
			bind:this={dialogEl}
			class='frame-engraved relative w-full max-w-xl border border-[var(--rule)] bg-[var(--bg-soft)] shadow-2xl'
			role='dialog'
			aria-modal='true'
			aria-label='Find a page'
			in:fly={{ y: 8, duration: 200 }}
			out:fly={{ y: 4, duration: 150 }}
		>
			<div class='flex items-center gap-3 border-b border-[var(--rule)] px-5 py-4'>
				<span class='text-[var(--accent)]' aria-hidden='true'>·</span>
				<input
					bind:this={inputEl}
					bind:value={query}
					oninput={() => (activeIndex = 0)}
					type='text'
					placeholder='Search pages and essays…'
					class='flex-1 bg-transparent text-[1.05rem] text-[var(--ink)] placeholder:text-[var(--ink-dim)] focus:outline-none'
					autocomplete='off'
					spellcheck='false'
					role='combobox'
					aria-expanded='true'
					aria-controls='palette-results'
					aria-activedescendant={filtered.length ? `palette-opt-${activeIndex}` : undefined}
					aria-label='Search pages and essays'
				/>
				<span class='smallcaps'>esc</span>
			</div>

			{#if filtered.length === 0}
				<div class='px-5 py-10 text-center text-[var(--ink-dim)] italic'>
					Nothing matches <em class='text-[var(--ink-muted)]'>{query}</em>.
				</div>
			{:else}
				<ul
					bind:this={listEl}
					id='palette-results'
					class='max-h-[55vh] overflow-y-auto py-2'
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
