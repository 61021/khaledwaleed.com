<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { page } from '$app/stores';
	import { afterNavigate, replaceState } from '$app/navigation';
	import { Container, Seo, PageHeader, Fleuron, SchemaOrg, site } from '$lib';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Poster from '$lib/components/Poster.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	type Personal = PageData['films'][number];

	// --- The one ---------------------------------------------------------
	// Avatar: The Last Airbender (TMDB tv/246).
	const FAVOURITE = { tmdbId: 246, type: 'tv' as const };
	const isFavourite = (f: Personal): boolean =>
		f.tmdbId === FAVOURITE.tmdbId && f.type === FAVOURITE.type;

	// Everything — your data AND the TMDB snapshot (title, year, directors,
	// poster) — arrives server-rendered from PocketBase in one request. No
	// client fetching, no skeletons, no reshuffling.
	const personal = $derived(data.films);
	const favourite = $derived(personal.find(isFavourite));

	// Keyed by "type/tmdbId" — a tmdb id can repeat across a movie and a show.
	const key = (f: Personal): string => `${f.type}/${f.tmdbId}`;
	const title = (f: Personal): string => f.title || `#${f.tmdbId}`;

	// --- Type classification (authoritative, from your data) -------------
	const isShow = (f: Personal): boolean => f.type === 'tv';

	// --- Summary numbers -------------------------------------------------
	const total = $derived(personal.length);
	const avg = $derived(
		total ? (personal.reduce((s, f) => s + f.rating, 0) / total).toFixed(1) : '—'
	);
	const lastUpdated = $derived(
		personal.reduce((a, f) => (f.watchedOn > a ? f.watchedOn : a), personal[0]?.watchedOn ?? '')
	);

	const movieCount = $derived(personal.filter((f) => f.type === 'movie').length);
	const showCount = $derived(personal.filter((f) => f.type === 'tv').length);

	// Hours of cinema: movie runtimes × times watched. TV runtimes are per
	// episode, so counting them would be dishonest — movies only, clearly
	// labelled.
	const filmHours = $derived(
		Math.round(
			personal
				.filter((f) => f.type === 'movie' && f.runtime > 0)
				.reduce((s, f) => s + f.runtime * Math.max(1, f.watched), 0) / 60
		)
	);

	// The genres that keep showing up.
	const topGenres = $derived.by(() => {
		const counts: Record<string, number> = {};
		for (const f of personal) {
			for (const g of f.genres) counts[g] = (counts[g] ?? 0) + 1;
		}
		return Object.entries(counts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 6);
	});

	const facts = $derived([
		{ value: String(total), label: 'titles' },
		{ value: `${avg} / 10`, label: 'average' },
		{ value: String(movieCount), label: 'movies' },
		{ value: String(showCount), label: 'shows' },
		...(filmHours > 0 ? [{ value: `~${filmHours}`, label: 'hours of film' }] : [])
	]);

	// --- Type filter -----------------------------------------------------
	type Filter = 'all' | 'movies' | 'shows';
	let filter = $state<Filter>('all');

	const filterOptions = $derived<{ value: Filter; label: string; count: number }[]>([
		{ value: 'all', label: 'All', count: total },
		{ value: 'movies', label: 'Movies', count: movieCount },
		{ value: 'shows', label: 'Shows', count: showCount }
	]);

	const matchesFilter = (f: Personal): boolean => {
		if (filter === 'all') return true;
		return filter === 'shows' ? isShow(f) : !isShow(f);
	};

	// --- Wall search -------------------------------------------------------
	let query = $state('');
	const matchesQuery = (f: Personal): boolean => {
		const q = query.trim().toLowerCase();
		if (!q) return true;
		const hay = `${f.title} ${f.directors.join(' ')} ${f.genres.join(' ')}`.toLowerCase();
		return q.split(/\s+/).every((part) => hay.includes(part));
	};

	const visible = (f: Personal): boolean => matchesFilter(f) && matchesQuery(f);

	// --- Sort ------------------------------------------------------------
	type Sort = 'rating' | 'year' | 'recent';
	let sort = $state<Sort>('rating');

	const sortOptions: { value: Sort; label: string }[] = [
		{ value: 'rating', label: 'Rating' },
		{ value: 'year', label: 'Year' },
		{ value: 'recent', label: 'Recent' }
	];

	// --- URL persistence (?type=&sort=) ----------------------------------
	let ready = $state(false);

	onMount(() => {
		const sp = new URLSearchParams(location.search);
		const t = sp.get('type');
		if (t === 'movies' || t === 'shows') filter = t;
		const s = sp.get('sort');
		if (s === 'year' || s === 'recent') sort = s;
	});

	// replaceState may only run once the router is initialized; afterNavigate
	// fires after the initial navigation, which is exactly that point.
	afterNavigate(() => {
		ready = true;
	});

	$effect(() => {
		const f = filter;
		const s = sort;
		if (!ready) return;
		const url = new URL($page.url);
		if (f === 'all') url.searchParams.delete('type');
		else url.searchParams.set('type', f);
		if (s === 'rating') url.searchParams.delete('sort');
		else url.searchParams.set('sort', s);
		replaceState(`${url.pathname}${url.search}`, {});
	});

	// --- Rating tiers ----------------------------------------------------
	const tierLabel: Record<number, string> = {
		10: 'Perfect',
		9: 'Loved it',
		8: 'Liked it',
		7: 'Fun to watch',
		6: 'Mixed Feelings',
		5: 'Meh',
		4: 'Poor',
		3: 'Bad',
		2: 'Terrible',
		1: 'Absolute Garbage'
	};
	const ratings = $derived([...new Set(personal.map((f) => f.rating))].sort((a, b) => b - a));

	// --- Shelves -----------------------------------------------------------
	// The wall hangs in shelves. Rating sort groups by tier (10 → 1), year
	// sort by decade, recent sort by the year a thing was watched — one
	// consistent shape, three readings of the same collection.
	type Shelf = { id: string; main: string; dim: string; aside: string; items: Personal[] };

	const shelves = $derived.by<Shelf[]>(() => {
		const vis = personal.filter(visible);

		if (sort === 'rating') {
			return ratings
				.map((rating) => ({ rating, items: vis.filter((f) => f.rating === rating) }))
				.filter((t) => t.items.length > 0)
				.map(({ rating, items }) => ({
					id: `r${rating}`,
					main: String(rating),
					dim: ' / 10',
					aside: [tierLabel[rating], String(items.length)].filter(Boolean).join(' · '),
					items
				}));
		}

		if (sort === 'year') {
			const groups: Record<string, Personal[]> = {};
			for (const f of vis) {
				const k = f.year ? String(Math.floor(f.year / 10) * 10) : 'undated';
				(groups[k] ??= []).push(f);
			}
			return Object.entries(groups)
				.sort(([a], [b]) => {
					if (a === 'undated') return 1;
					if (b === 'undated') return -1;
					return Number(b) - Number(a);
				})
				.map(([decade, items]) => {
					items.sort(
						(a, b) => b.year - a.year || b.rating - a.rating || a.title.localeCompare(b.title)
					);
					return {
						id: `d${decade}`,
						main: decade === 'undated' ? 'Undated' : `${decade}s`,
						dim: '',
						aside: `${items.length} ${items.length === 1 ? 'title' : 'titles'}`,
						items
					};
				});
		}

		// recent: grouped by the year it was watched
		const groups: Record<string, Personal[]> = {};
		for (const f of vis) {
			const k = f.watchedOn ? f.watchedOn.slice(0, 4) : 'earlier';
			(groups[k] ??= []).push(f);
		}
		return Object.entries(groups)
			.sort(([a], [b]) => {
				if (a === 'earlier') return 1;
				if (b === 'earlier') return -1;
				return Number(b) - Number(a);
			})
			.map(([year, items]) => {
				items.sort((a, b) => b.watchedOn.localeCompare(a.watchedOn) || b.rating - a.rating);
				return {
					id: `w${year}`,
					main: year === 'earlier' ? 'Earlier' : year,
					dim: '',
					aside: `${items.length} watched`,
					items
				};
			});
	});

	// The little line under each poster: what changes with the reading.
	function subline(f: Personal): string {
		if (sort === 'rating') return f.year ? String(f.year) : '';
		if (sort === 'year') return [f.year || '', f.rating].filter(Boolean).join(' · ');
		return [fmtMonth(f.watchedOn), f.rating].filter(Boolean).join(' · ');
	}

	// --- The plate (per-title detail dialog) -------------------------------
	let selected = $state<Personal | null>(null);
	let plateEl = $state<HTMLDialogElement | null>(null);

	async function openPlate(f: Personal): Promise<void> {
		selected = f;
		await tick();
		plateEl?.showModal();
	}

	// A click that lands on the dialog element itself is a backdrop click.
	function onPlateClick(e: MouseEvent): void {
		if (e.target === plateEl) plateEl?.close();
	}

	// Credits line under each title: the director (films) or creator(s) (TV).
	// Falls back to the format label only when no creator/director is known.
	function meta(f: Personal): string {
		if (f.directors.length) return f.directors.join(', ');
		if (f.format && f.format !== 'Movie') return f.format;
		return '';
	}

	function runtimeLabel(f: Personal): string {
		if (!f.runtime) return '';
		if (isShow(f)) return `${f.runtime} min episodes`;
		const h = Math.floor(f.runtime / 60);
		const m = f.runtime % 60;
		if (!h) return `${m} min`;
		return m ? `${h} h ${m} min` : `${h} h`;
	}

	const plateMeta = (f: Personal): string =>
		[f.year || '', f.format, runtimeLabel(f)].filter(Boolean).join(' · ');

	// A compact "watched on" date (e.g. 24 Oct 2021) for the plates.
	const fmtWatched = (iso: string): string =>
		iso
			? new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
					day: 'numeric',
					month: 'short',
					year: 'numeric',
					timeZone: 'UTC'
				})
			: '';

	// Just month + year, small enough for a wall label.
	const fmtMonth = (iso: string): string =>
		iso
			? new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
					month: 'short',
					year: 'numeric',
					timeZone: 'UTC'
				})
			: '';

	const schema = $derived({
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': `${site.url}/films#page`,
		url: `${site.url}/films`,
		name: `${site.name}'s Films`,
		description: `Every film and series Khaled Waleed has rated — ${total} titles, scored 1–10. Updated ${lastUpdated}.`,
		dateModified: lastUpdated,
		isPartOf: { '@id': `${site.url}/#website` },
		about: { '@id': `${site.url}/#person` },
		breadcrumb: {
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
				{ '@type': 'ListItem', position: 2, name: 'Films', item: `${site.url}/films` }
			]
		},
		// The full ledger — titles are server-rendered now, so crawlers can see
		// the same list this describes.
		mainEntity: {
			'@type': 'ItemList',
			numberOfItems: total,
			itemListElement: personal.map((f, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				item: { '@type': f.type === 'tv' ? 'TVSeries' : 'Movie', name: title(f) }
			}))
		}
	});
</script>

<Seo
	title="Films"
	description={`Every film and series Khaled Waleed has rated — ${total} titles, scored 1–10. A lifelong cinema obsession, logged honestly.`}
/>

<SchemaOrg {schema} />

<svelte:head>
	<link rel="preconnect" href="https://image.tmdb.org" />
</svelte:head>

<PageHeader room="films" eyebrow="a viewing log" title="Films">
	{#snippet lede()}
		<p>Every film and series I have watched, scored one to ten and left unedited.</p>
	{/snippet}
</PageHeader>

{#snippet rewatch(n: number)}
	<span
		class="inline-flex items-center gap-[0.2rem] text-[0.75rem] leading-none text-[var(--ink-dim)]"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"
			><!-- Icon from Phosphor by Phosphor Icons - https://github.com/phosphor-icons/core/blob/main/LICENSE --><path
				fill="currentColor"
				d="M224 48v48a8 8 0 0 1-8 8h-48a8 8 0 0 1 0-16h28.69l-14.63-14.63a79.56 79.56 0 0 0-56.13-23.43h-.45a79.52 79.52 0 0 0-55.89 22.77a8 8 0 0 1-11.18-11.44a96 96 0 0 1 135 .79L208 76.69V48a8 8 0 0 1 16 0m-37.59 135.29a80 80 0 0 1-112.47-.66L59.31 168H88a8 8 0 0 0 0-16H40a8 8 0 0 0-8 8v48a8 8 0 0 0 16 0v-28.69l14.63 14.63A95.43 95.43 0 0 0 130 222.06h.53a95.36 95.36 0 0 0 67.07-27.33a8 8 0 0 0-11.18-11.44Z"
			/></svg
		>
		{n} viewings</span
	>
{/snippet}

{#snippet cell(f: Personal)}
	<li>
		<button type="button" class="cell" onclick={() => openPlate(f)} title={title(f)}>
			<Poster posterPath={f.posterPath} alt="" width={104} fluid />
			<span class="cell-title"
				>{title(f)}{#if isFavourite(f)}<span class="text-[var(--accent)]"> ★</span>{/if}</span
			>
			{#if subline(f)}<span class="cell-sub">{subline(f)}</span>{/if}
		</button>
	</li>
{/snippet}

<Container>
	<div class="rise-3 mt-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
		<Breadcrumb
			items={[
				{ name: 'Home', href: '/' },
				{ name: 'Films', href: '/films' }
			]}
		/>
		{#if lastUpdated}
			<div class="smallcaps">
				updated <time datetime={lastUpdated}>{lastUpdated}</time>
			</div>
		{/if}
	</div>

	{#if total === 0}
		<!-- PocketBase is unreachable (or the log is empty) — say so honestly. -->
		<section class="rise mt-20 mb-12 text-center">
			<p class="italic text-[1.4rem] text-[var(--ink)] [font-family:var(--font-display)]">
				The projector is dark.
			</p>
			<p class="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[var(--ink-muted)]">
				The viewing log lives on a little server that is not answering right now. Give it a moment,
				then try again.
			</p>
		</section>
	{:else}
		<!-- Frontispiece: the one thing above everything else -->
		{#if favourite}
			<section class="rise-2 mt-10">
				<div class="fave">
					<div class="fave-poster">
						<Poster
							posterPath={favourite.posterPath}
							alt={`${title(favourite)} poster`}
							width={132}
							vivid
						/>
					</div>
					<div class="fave-body">
						<p class="fave-eyebrow smallcaps">★ the best thing I have ever watched</p>
						<h2 class="fave-title italic">{title(favourite)}</h2>
						{#if meta(favourite)}
							<p class="mt-2 text-sm text-[var(--ink-muted)]">{meta(favourite)}</p>
						{/if}
						<p class="fave-meta smallcaps">
							{#if favourite.year}<span>{favourite.year}</span>{/if}
							{#if favourite.format && favourite.format !== 'Movie'}<span class="fave-sep">·</span
								><span>{favourite.format}</span>{/if}
							{#if favourite.watched > 1}<span class="fave-sep">·</span>{@render rewatch(
									favourite.watched
								)}{/if}
						</p>
						{#if favourite.notes}
							<div class="fave-note">{favourite.notes}</div>
						{/if}
					</div>
				</div>
			</section>
		{/if}

		<Fleuron />

		<!-- The catalogue head: numbers, then the levers -->
		<section class="rise">
			<p class="colophon">
				{#each facts as f, i (f.label)}
					<span class="whitespace-nowrap"><span class="colophon-v">{f.value}</span> {f.label}</span
					>{#if i < facts.length - 1}<span class="mx-2 text-[var(--rule)]">·</span>{/if}
				{/each}
			</p>
			{#if topGenres.length}
				<p class="mt-3 text-center smallcaps">
					{#each topGenres as [g, n], i (g)}
						<span class="whitespace-nowrap"
							>{g.toLowerCase()} <span class="text-[var(--ink-dim)] tabular-nums">{n}</span></span
						>{#if i < topGenres.length - 1}<span class="mx-2 text-[var(--rule)]">·</span>{/if}
					{/each}
				</p>
			{/if}

			<div class="controls">
				<div class="seg" role="group" aria-label="Filter titles by type">
					{#each filterOptions as opt (opt.value)}
						<button
							type="button"
							class="seg-opt"
							class:is-active={filter === opt.value}
							aria-pressed={filter === opt.value}
							onclick={() => (filter = opt.value)}
						>
							{opt.label}
							<span class="seg-count tabular-nums">{opt.count}</span>
						</button>
					{/each}
				</div>
				<div class="seg" role="group" aria-label="Sort titles">
					{#each sortOptions as opt (opt.value)}
						<button
							type="button"
							class="seg-opt"
							class:is-active={sort === opt.value}
							aria-pressed={sort === opt.value}
							onclick={() => (sort = opt.value)}
						>
							{opt.label}
						</button>
					{/each}
				</div>
				<label class="search-row">
					<span class="sr-only">Find a title</span>
					<input
						type="search"
						bind:value={query}
						placeholder="Find a title, a director, a genre…"
						autocomplete="off"
						spellcheck="false"
					/>
				</label>
			</div>
		</section>

		{#if query.trim() && shelves.length === 0}
			<p class="rise mt-14 text-center italic text-[var(--ink-muted)]">
				Nothing on the wall matches <em class="text-[var(--ink)]">{query}</em>.
			</p>
		{/if}

		<!-- The wall, hung in shelves -->
		{#each shelves as shelf (shelf.id)}
			<section id={shelf.id} class="rise shelf scroll-mt-8">
				<div class="flex items-baseline justify-between gap-6 border-b border-[var(--rule)] pb-3">
					<h2 class="shelf-title italic">
						{shelf.main}{#if shelf.dim}<span class="text-[var(--ink-dim)]">{shelf.dim}</span>{/if}
					</h2>
					<span class="smallcaps shrink-0">{shelf.aside}</span>
				</div>
				<ul class="wall">
					{#each shelf.items as f (key(f))}
						{@render cell(f)}
					{/each}
				</ul>
			</section>
		{/each}

		<Fleuron />

		<!-- TMDB attribution (required by their API terms) -->
		<div class="rise flex flex-col items-center gap-3 text-center">
			<a
				href="https://www.themoviedb.org/"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="The Movie Database"
				class="opacity-70 transition-opacity hover:opacity-100"
			>
				<img src="/logos/tmdb.svg" alt="The Movie Database (TMDB)" width="80" height="58" />
			</a>
			<p
				class="max-w-sm text-[0.72rem] font-semibold tracking-[0.04em] text-[var(--ink-muted)] [font-family:var(--font-body)]"
			>
				Posters and metadata via The Movie Database. This product uses the TMDB API but is not
				endorsed or certified by TMDB.
			</p>
		</div>
	{/if}
</Container>

<!-- The plate: a museum label for whichever title was taken off the wall -->
<dialog
	bind:this={plateEl}
	class="plate-dialog"
	aria-labelledby="plate-title"
	onclose={() => (selected = null)}
	onclick={onPlateClick}
>
	{#if selected}
		<div class="plate-inner">
			<button type="button" class="plate-close" onclick={() => plateEl?.close()} aria-label="Close">
				×
			</button>
			<div class="plate-poster">
				<Poster
					posterPath={selected.posterPath}
					alt={`${title(selected)} poster`}
					width={120}
					vivid
				/>
			</div>
			<div class="plate-body">
				<p class="plate-eyebrow smallcaps">
					{selected.rating} / 10{tierLabel[selected.rating]
						? ` — ${tierLabel[selected.rating]}`
						: ''}
				</p>
				<h3 class="plate-title italic" id="plate-title">
					{title(selected)}{#if isFavourite(selected)}<span
							class="text-[var(--accent)]"
							title="My favourite"
						>
							★</span
						>{/if}
				</h3>
				{#if meta(selected)}
					<p class="mt-1.5 text-sm text-[var(--ink-muted)]">{meta(selected)}</p>
				{/if}
				{#if plateMeta(selected)}
					<p class="mt-3 smallcaps">{plateMeta(selected)}</p>
				{/if}
				{#if selected.genres.length}
					<p class="plate-genres">{selected.genres.join(' · ').toLowerCase()}</p>
				{/if}
				{#if selected.watchedOn || selected.watched > 1}
					<p class="plate-watched">
						{#if selected.watchedOn}<time datetime={selected.watchedOn}
								>Watched {fmtWatched(selected.watchedOn)}</time
							>{/if}{#if selected.watchedOn && selected.watched > 1}<span
								class="mx-2 text-[var(--rule)]">·</span
							>{/if}{#if selected.watched > 1}{@render rewatch(selected.watched)}{/if}
					</p>
				{/if}
				{#if selected.notes}
					<div class="plate-note">{selected.notes}</div>
				{/if}
			</div>
		</div>
	{/if}
</dialog>

<style>
	/* ---------- Frontispiece ---------- */
	.fave {
		display: flex;
		align-items: center;
		gap: 1.75rem;
		max-width: 40rem;
		margin-inline: auto;
		padding: 1.75rem;
		border: 1px solid color-mix(in oklab, var(--accent) 38%, var(--rule));
		border-radius: 1rem;
		box-shadow: 0 10px 34px rgba(0, 0, 0, 0.34);
		background:
			radial-gradient(
				130% 130% at 0% 0%,
				color-mix(in oklab, var(--accent) 13%, transparent),
				transparent 58%
			),
			var(--bg-soft);
	}

	.fave-poster {
		flex: none;
	}

	.fave-body {
		min-width: 0;
	}

	.fave-eyebrow {
		color: var(--accent);
	}

	.fave-title {
		margin-top: 0.5rem;
		font-size: clamp(1.5rem, 3.5vw, 2.1rem);
		line-height: 1.15;
	}

	.fave-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.15rem 0.5rem;
		margin-top: 0.8rem;
		color: var(--ink-dim);
	}

	.fave-sep {
		color: var(--rule);
	}

	.fave-note,
	.plate-note {
		margin-top: 0.9rem;
		border-left: 2px solid color-mix(in oklab, var(--accent) 50%, var(--rule));
		padding-left: 0.7rem;
		font-family: var(--font-display);
		font-style: italic;
		font-size: 0.95rem;
		line-height: 1.55;
		color: var(--ink);
	}

	@media (max-width: 479px) {
		.fave {
			flex-direction: column;
			text-align: center;
			gap: 1.25rem;
		}

		.fave-meta {
			justify-content: center;
		}

		.fave-note {
			text-align: left;
		}
	}

	/* ---------- Colophon ---------- */
	.colophon {
		margin-top: 0.5rem;
		text-align: center;
		font-family: var(--font-body);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}

	.colophon-v {
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}

	/* ---------- Controls ---------- */
	.controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.75rem 1rem;
		margin-top: 2.25rem;
	}

	.seg {
		display: inline-flex;
		gap: 0.25rem;
		padding: 0.3rem;
		border: 1px solid var(--rule);
		border-radius: 9999px;
		background: var(--bg-soft);
	}

	.seg-opt {
		display: inline-flex;
		align-items: baseline;
		gap: 0.4rem;
		padding: 0.5rem 0.85rem;
		border-radius: 9999px;
		font-family: var(--font-body);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--ink-muted);
		white-space: nowrap;
		cursor: pointer;
		transition:
			color 250ms ease,
			background-color 250ms ease;
	}

	@media (min-width: 640px) {
		.seg-opt {
			padding: 0.5rem 1.05rem;
		}
	}

	.seg-opt:hover {
		color: var(--ink);
	}

	.seg-opt.is-active {
		color: var(--bg);
		background: var(--accent);
	}

	.seg-count {
		font-size: 0.66rem;
	}

	.search-row {
		display: flex;
		flex: 0 1 16rem;
	}

	.search-row input {
		width: 100%;
		background: transparent;
		border: 0;
		border-bottom: 1px solid var(--rule);
		padding: 0.55rem 0.25rem;
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--ink);
		text-align: center;
		transition: border-color 250ms ease;
	}

	.search-row input::placeholder {
		color: var(--ink-dim);
		font-style: italic;
	}

	.search-row input:focus {
		outline: none;
		border-bottom-color: color-mix(in oklab, var(--accent) 65%, transparent);
	}

	/* ---------- Shelves & the wall ---------- */
	.shelf {
		margin-top: 3.5rem;
	}

	.shelf-title {
		font-size: clamp(1.4rem, 2vw + 0.5rem, 1.75rem);
	}

	.wall {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
		gap: 1.5rem 1rem;
		margin-top: 1.5rem;
		padding: 0;
		list-style: none;
	}

	@media (max-width: 400px) {
		.wall {
			grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
		}
	}

	.cell {
		display: block;
		width: 100%;
		padding: 0;
		background: none;
		border: 0;
		color: inherit;
		font: inherit;
		text-align: center;
		cursor: pointer;
	}

	.cell-title {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		margin-top: 0.55rem;
		font-family: var(--font-body);
		font-size: 0.8rem;
		line-height: 1.35;
		color: var(--ink-muted);
		transition: color 300ms ease;
	}

	.cell-sub {
		display: block;
		margin-top: 0.2rem;
		font-size: 0.68rem;
		letter-spacing: 0.03em;
		color: var(--ink-dim);
		font-variant-numeric: tabular-nums;
	}

	.cell:hover .cell-title,
	.cell:focus-visible .cell-title {
		color: var(--ink);
	}

	.cell:hover :global(img),
	.cell:focus-visible :global(img) {
		filter: none;
		transform: translateY(-4px);
		box-shadow: 0 12px 28px rgba(0, 0, 0, 0.55);
	}

	/* ---------- The plate ---------- */
	.plate-dialog {
		width: min(32rem, calc(100vw - 2rem));
		margin: auto;
		border: 1px solid color-mix(in oklab, var(--accent) 30%, var(--rule));
		border-radius: 1rem;
		padding: 0;
		color: var(--ink);
		background:
			radial-gradient(
				130% 130% at 0% 0%,
				color-mix(in oklab, var(--accent) 10%, transparent),
				transparent 58%
			),
			var(--bg-soft);
		box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
	}

	.plate-dialog[open] {
		animation: plate-in 280ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}

	.plate-dialog::backdrop {
		background: rgba(6, 4, 3, 0.66);
		backdrop-filter: blur(5px);
	}

	:global(body:has(.plate-dialog[open])) {
		overflow: hidden;
	}

	@keyframes plate-in {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.plate-inner {
		position: relative;
		display: flex;
		align-items: flex-start;
		gap: 1.5rem;
		padding: 1.75rem;
	}

	.plate-poster {
		flex: none;
	}

	.plate-body {
		min-width: 0;
	}

	.plate-eyebrow {
		color: var(--accent);
	}

	.plate-title {
		margin-top: 0.4rem;
		font-size: clamp(1.35rem, 3vw, 1.7rem);
		line-height: 1.2;
	}

	.plate-genres {
		margin-top: 0.5rem;
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		color: var(--ink-dim);
	}

	.plate-watched {
		margin-top: 0.9rem;
		font-size: 0.78rem;
		color: var(--ink-dim);
		font-variant-numeric: tabular-nums;
	}

	.plate-close {
		position: absolute;
		top: 0.6rem;
		right: 0.85rem;
		padding: 0.25rem 0.45rem;
		background: none;
		border: 0;
		font-family: var(--font-display);
		font-size: 1.5rem;
		line-height: 1;
		color: var(--ink-dim);
		cursor: pointer;
		transition: color 250ms ease;
	}

	.plate-close:hover {
		color: var(--accent);
	}

	@media (max-width: 479px) {
		.plate-inner {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}

		.plate-note {
			text-align: left;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cell:hover :global(img),
		.cell:focus-visible :global(img) {
			transform: none;
		}
	}
</style>
