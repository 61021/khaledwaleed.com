<script lang="ts">
	import { goto } from '$app/navigation';
	import { posts } from '$lib/posts';

	type Item = {
		id: string;
		title: string;
		subtitle?: string;
		href: string;
		kind: 'page' | 'post' | 'external';
		keywords?: string;
	};

	const items: Item[] = [
		{ id: 'home', title: 'Home', subtitle: 'Front matter', href: '/', kind: 'page' },
		{ id: 'about', title: 'About', subtitle: 'Background & experience', href: '/about', kind: 'page' },
		{ id: 'writing', title: 'Writing', subtitle: 'Essays & notes', href: '/writing', kind: 'page' },
		{ id: 'now', title: 'Now', subtitle: 'What I am at, right now', href: '/now', kind: 'page', keywords: 'current today recent' },
		{ id: 'likes', title: 'Likes', subtitle: 'A catalogue of obsessions', href: '/likes', kind: 'page' },
		{ id: 'library', title: 'Library', subtitle: 'What I am reading, and what is waiting', href: '/library', kind: 'page', keywords: 'books reading shelf' },
		{ id: 'films', title: 'Films', subtitle: 'Everything I have rated, by score', href: '/films', kind: 'page', keywords: 'movies cinema imdb ratings tv shows watch' },
		{ id: 'contact', title: 'Contact', subtitle: 'Get in touch', href: '/contact', kind: 'page' },
		...posts.map(
			(p): Item => ({
				id: `post-${p.slug}`,
				title: p.title,
				subtitle: p.description,
				href: `/writing/${p.slug}`,
				kind: 'post',
				keywords: p.tags.join(' ')
			})
		),
		{
			id: 'email',
			title: 'Write to Khaled',
			subtitle: 'contact@khaledwaleed.com',
			href: 'mailto:contact@khaledwaleed.com',
			kind: 'external'
		},
		{
			id: 'rss',
			title: 'Subscribe via RSS',
			subtitle: '/rss.xml',
			href: '/rss.xml',
			kind: 'external'
		}
	];

	let open = $state(false);
	let query = $state('');
	let activeIndex = $state(0);
	let inputEl = $state<HTMLInputElement | null>(null);
	let listEl = $state<HTMLUListElement | null>(null);

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return items;
		return items.filter((it) => {
			const hay = `${it.title} ${it.subtitle ?? ''} ${it.keywords ?? ''}`.toLowerCase();
			return q.split(/\s+/).every((part) => hay.includes(part));
		});
	});

	$effect(() => {
		void filtered;
		activeIndex = 0;
	});

	function openPalette() {
		open = true;
		query = '';
		activeIndex = 0;
		queueMicrotask(() => inputEl?.focus());
	}

	function closePalette() {
		open = false;
	}

	function select(item: Item) {
		closePalette();
		if (item.kind === 'external' || item.href.startsWith('mailto:')) {
			window.location.href = item.href;
		} else {
			goto(item.href);
		}
	}

	function onKeydown(e: KeyboardEvent) {
		const isMod = e.metaKey || e.ctrlKey;
		if (isMod && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			open ? closePalette() : openPalette();
			return;
		}
		if (!open) {
			if (
				e.key === '/' &&
				!(e.target instanceof HTMLInputElement) &&
				!(e.target instanceof HTMLTextAreaElement)
			) {
				e.preventDefault();
				openPalette();
			}
			return;
		}
		if (e.key === 'Escape') {
			e.preventDefault();
			closePalette();
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
			scrollActiveIntoView();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			activeIndex = Math.max(activeIndex - 1, 0);
			scrollActiveIntoView();
		} else if (e.key === 'Enter') {
			e.preventDefault();
			const item = filtered[activeIndex];
			if (item) select(item);
		}
	}

	function scrollActiveIntoView() {
		queueMicrotask(() => {
			const el = listEl?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
			el?.scrollIntoView({ block: 'nearest' });
		});
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[15vh] sm:pt-[18vh]"
		role="presentation"
	>
		<button
			type="button"
			aria-label="Close"
			class="absolute inset-0 bg-black/55 backdrop-blur-sm"
			onclick={closePalette}
		></button>

		<div
			class="relative w-full max-w-xl overflow-hidden border border-[var(--rule)] bg-[var(--bg-soft)] shadow-2xl"
			role="dialog"
			aria-modal="true"
			aria-label="Find a page"
		>
			<div class="flex items-center gap-3 border-b border-[var(--rule)] px-5 py-4">
				<span class="italic text-[var(--accent)]" aria-hidden="true">·</span>
				<input
					bind:this={inputEl}
					bind:value={query}
					type="text"
					placeholder="A page, an essay, a thought…"
					class="flex-1 bg-transparent text-[1.05rem] italic text-[var(--ink)] placeholder:text-[var(--ink-dim)] focus:outline-none"
					autocomplete="off"
					spellcheck="false"
				/>
				<span class="smallcaps">esc</span>
			</div>

			{#if filtered.length === 0}
				<div class="px-5 py-10 text-center italic text-[var(--ink-dim)]">
					Nothing matches <em class="text-[var(--ink-muted)]">{query}</em>.
				</div>
			{:else}
				<ul bind:this={listEl} class="max-h-[55vh] overflow-y-auto py-2" role="listbox">
					{#each filtered as item, i (item.id)}
						<li>
							<button
								type="button"
								data-index={i}
								onclick={() => select(item)}
								onmousemove={() => (activeIndex = i)}
								class="flex w-full items-baseline justify-between gap-5 px-5 py-2.5 text-left transition-colors {i ===
								activeIndex
									? 'bg-[color-mix(in_oklab,var(--accent)_15%,transparent)] text-[var(--ink)]'
									: 'text-[var(--ink-muted)]'}"
								role="option"
								aria-selected={i === activeIndex}
							>
								<span class="min-w-0">
									<span class="block text-[1.05rem] italic">{item.title}</span>
									{#if item.subtitle}
										<span class="block truncate text-[0.85rem] text-[var(--ink-dim)]"
											>{item.subtitle}</span
										>
									{/if}
								</span>
								<span class="shrink-0 smallcaps">{item.kind}</span>
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
{/if}
