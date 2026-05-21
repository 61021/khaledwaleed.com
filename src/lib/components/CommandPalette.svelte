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
		{ id: 'home', title: 'Home', subtitle: 'Overview', href: '/', kind: 'page' },
		{ id: 'about', title: 'About', subtitle: 'Background & experience', href: '/about', kind: 'page' },
		{ id: 'writing', title: 'Writing', subtitle: 'Essays & notes', href: '/writing', kind: 'page' },
		{ id: 'now', title: 'Now', subtitle: 'What I’m working on right now', href: '/now', kind: 'page', keywords: 'current today recent' },
		{ id: 'likes', title: 'Likes', subtitle: 'Tools & recommendations', href: '/likes', kind: 'page' },
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
			title: 'Email Khaled',
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
		// reset highlight on filter change
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
		// Global open
		const isMod = e.metaKey || e.ctrlKey;
		if (isMod && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			open ? closePalette() : openPalette();
			return;
		}
		if (!open) {
			// Slash to open (when not typing in an input)
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

	function kindLabel(kind: Item['kind']) {
		return kind === 'page' ? 'Page' : kind === 'post' ? 'Post' : 'Link';
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[15vh] sm:pt-[18vh]"
		role="presentation"
	>
		<!-- Backdrop -->
		<button
			type="button"
			aria-label="Close command palette"
			class="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in"
			onclick={closePalette}
		></button>

		<!-- Panel -->
		<div
			class="palette-panel relative w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] shadow-2xl shadow-black/50"
			role="dialog"
			aria-modal="true"
			aria-label="Command palette"
		>
			<!-- Search row -->
			<div class="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
				<span class="font-mono text-sm text-[var(--brand)]" aria-hidden="true">›</span>
				<input
					bind:this={inputEl}
					bind:value={query}
					type="text"
					placeholder="Jump to anything…"
					class="flex-1 bg-transparent text-[15px] text-[var(--fg)] placeholder:text-[var(--fg-dim)] focus:outline-none"
					autocomplete="off"
					spellcheck="false"
				/>
				<kbd
					class="rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--fg-dim)]"
					>ESC</kbd
				>
			</div>

			<!-- Results -->
			{#if filtered.length === 0}
				<div class="px-4 py-10 text-center text-sm text-[var(--fg-dim)]">
					No matches for <span class="font-mono text-[var(--fg-muted)]">{query}</span>
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
								class="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors {i ===
								activeIndex
									? 'bg-[var(--brand-soft)]'
									: 'hover:bg-white/5'}"
								role="option"
								aria-selected={i === activeIndex}
							>
								<span
									class="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] font-mono text-[11px] text-[var(--fg-dim)]"
									aria-hidden="true"
								>
									{item.kind === 'page' ? '/' : item.kind === 'post' ? '¶' : '↗'}
								</span>
								<span class="min-w-0 flex-1">
									<span class="block truncate text-sm font-medium text-[var(--fg)]"
										>{item.title}</span
									>
									{#if item.subtitle}
										<span class="block truncate text-xs text-[var(--fg-dim)]"
											>{item.subtitle}</span
										>
									{/if}
								</span>
								<span
									class="shrink-0 font-mono text-[10px] uppercase tracking-wider text-[var(--fg-dim)]"
								>
									{kindLabel(item.kind)}
								</span>
							</button>
						</li>
					{/each}
				</ul>
			{/if}

			<!-- Footer hints -->
			<div
				class="flex items-center justify-between border-t border-[var(--border)] bg-[var(--bg-subtle)]/40 px-4 py-2 font-mono text-[10px] text-[var(--fg-dim)]"
			>
				<div class="flex items-center gap-3">
					<span class="flex items-center gap-1">
						<kbd
							class="rounded border border-[var(--border)] bg-[var(--bg)] px-1 py-px text-[var(--fg-muted)]"
							>↑</kbd
						>
						<kbd
							class="rounded border border-[var(--border)] bg-[var(--bg)] px-1 py-px text-[var(--fg-muted)]"
							>↓</kbd
						>
						navigate
					</span>
					<span class="flex items-center gap-1">
						<kbd
							class="rounded border border-[var(--border)] bg-[var(--bg)] px-1 py-px text-[var(--fg-muted)]"
							>↵</kbd
						>
						open
					</span>
				</div>
				<span>{filtered.length} {filtered.length === 1 ? 'result' : 'results'}</span>
			</div>
		</div>
	</div>
{/if}

<style>
	.palette-panel {
		animation: palette-in 180ms cubic-bezier(0.16, 1, 0.3, 1) both;
	}
	@keyframes palette-in {
		from {
			opacity: 0;
			transform: translateY(-6px) scale(0.985);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
	:global(.animate-fade-in) {
		animation: pal-fade 150ms ease-out both;
	}
	@keyframes pal-fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
