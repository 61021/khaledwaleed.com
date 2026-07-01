<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { replaceState } from '$app/navigation';
	import { Container, Seo, PageHeader, Fleuron, site } from '$lib';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Poster from '$lib/components/Poster.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	type Personal = PageData['films'][number];

	type FilmMeta = {
		title: string;
		year: number;
		type: 'Movie' | 'TV Series' | 'TV Mini Series' | (string & {});
		runtime: number | null;
		genres: string[];
		directors: string[];
		posterPath: string | null;
	};

	// --- The one ---------------------------------------------------------
	// Avatar: The Last Airbender (TMDB tv/246).
	const FAVOURITE = { tmdbId: 246, type: 'tv' as const };
	const isFavourite = (f: Personal): boolean =>
		f.tmdbId === FAVOURITE.tmdbId && f.type === FAVOURITE.type;

	// Your data (rating, watched, dates, type) is here at first paint; the
	// descriptive bits are fetched live from TMDB via /api/tmdb/[type]/[id].
	const personal = $derived(data.films);
	const favourite = $derived(personal.find(isFavourite));

	// Keyed by "type/tmdbId" — a tmdb id can repeat across a movie and a show.
	const key = (f: Personal): string => `${f.type}/${f.tmdbId}`;
	let metadata = $state<Record<string, FilmMeta>>({});
	const md = (f: Personal): FilmMeta | undefined => metadata[key(f)];

	onMount(() => {
		let cancelled = false;
		// Favourite first, then the rest — a small pool keeps it quick.
		const queue = [...personal].sort(
			(a, b) => (isFavourite(a) ? -1 : 0) - (isFavourite(b) ? -1 : 0)
		);
		let next = 0;
		async function worker() {
			while (next < queue.length && !cancelled) {
				const f = queue[next++];
				try {
					const r = await fetch(`/api/tmdb/${f.type}/${f.tmdbId}`);
					if (r.ok && !cancelled) {
						metadata[key(f)] = (await r.json()) as FilmMeta;
					}
				} catch {
					/* leave this title unresolved */
				}
			}
		}
		for (let i = 0; i < 8; i++) worker();
		return () => (cancelled = true);
	});

	// --- Type classification (authoritative, from your data) -------------
	const isShow = (f: Personal): boolean => f.type === 'tv';

	// --- Summary numbers -------------------------------------------------
	const total = $derived(personal.length);
	const avg = $derived((personal.reduce((s, f) => s + f.rating, 0) / total).toFixed(1));
	const lastUpdated = $derived(
		personal.reduce((a, f) => (f.watchedOn > a ? f.watchedOn : a), personal[0]?.watchedOn ?? '')
	);

	const movieCount = $derived(personal.filter((f) => f.type === 'movie').length);
	const showCount = $derived(personal.filter((f) => f.type === 'tv').length);

	const facts = $derived([
		{ label: 'Titles rated', value: String(total) },
		{ label: 'Average rating', value: `${avg} / 10` }
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

	// --- Sort ------------------------------------------------------------
	type Sort = 'rating' | 'year' | 'recent';
	let sort = $state<Sort>('rating');

	const sortOptions: { value: Sort; label: string }[] = [
		{ value: 'rating', label: 'Rating' },
		{ value: 'year', label: 'Year' },
		{ value: 'recent', label: 'Recent' }
	];

	// Flat, sorted list used when sort ≠ 'rating' (year / recently watched).
	const sortedFlat = $derived.by(() => {
		const arr = personal.filter(matchesFilter);
		if (sort === 'year') {
			arr.sort(
				(a, b) =>
					(md(b)?.year ?? 0) - (md(a)?.year ?? 0) ||
					b.rating - a.rating ||
					(md(a)?.title ?? '').localeCompare(md(b)?.title ?? '')
			);
		} else if (sort === 'recent') {
			arr.sort((a, b) => b.watchedOn.localeCompare(a.watchedOn) || b.rating - a.rating);
		}
		return arr;
	});

	// --- URL persistence (?type=&sort=) ----------------------------------
	let ready = $state(false);

	onMount(() => {
		const sp = new URLSearchParams(location.search);
		const t = sp.get('type');
		if (t === 'movies' || t === 'shows') filter = t;
		const s = sp.get('sort');
		if (s === 'year' || s === 'recent') sort = s;
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
	const tiers = $derived(
		ratings
			.map((rating) => ({
				rating,
				label: tierLabel[rating] ?? '',
				items: personal.filter((f) => f.rating === rating && matchesFilter(f))
			}))
			.filter((t) => t.items.length > 0)
	);

	// Credits line under each title: the director (films) or creator(s) (TV).
	// Falls back to the format label only when no creator/director is known.
	function meta(f: Personal): string {
		const m = md(f);
		if (!m) return '';
		if (m.directors.length) return m.directors.join(', ');
		if (m.type !== 'Movie') return m.type;
		return '';
	}

	// A compact "watched on" date (e.g. 24 Oct 2021) for the log.
	const fmtWatched = (iso: string): string =>
		iso
			? new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
					day: 'numeric',
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
		}
	});
</script>

<Seo
	title="Films"
	description={`Every film and series Khaled Waleed has rated — ${total} titles, scored 1–10. A lifelong cinema obsession, logged honestly.`}
/>

<svelte:head>
	<link rel="preconnect" href="https://image.tmdb.org" />
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
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
		{n}</span
	>
{/snippet}

{#snippet filmRow(f: Personal, showRating: boolean)}
	{@const m = md(f)}
	<li class="group py-3">
		<div class="flex gap-4">
			<div class="shrink-0">
				<Poster posterPath={m?.posterPath ?? null} alt={m ? `${m.title} poster` : ''} width={52} />
			</div>
			<div class="min-w-0 flex-1">
				<div class="flex items-baseline justify-between gap-6">
					<span
						class="italic text-[var(--ink)] [font-family:var(--font-display)] text-[1.25rem] leading-[1.2]"
					>
						{#if m}{m.title}{#if isFavourite(f)}<span
									class="text-[var(--accent)]"
									title="My favourite">&nbsp;★</span
								>{/if}{:else}<span
								class="inline-block h-[0.8em] w-36 max-w-[58vw] animate-pulse rounded bg-[color-mix(in_oklab,var(--ink-dim)_22%,var(--bg-soft))] align-middle motion-reduce:animate-none"
							></span>{/if}
					</span>
					<span class="flex shrink-0 items-baseline gap-2">
						{#if showRating}<span
								class="inline-grid h-6 min-w-6 place-items-center rounded-full border border-[color-mix(in_oklab,var(--accent)_38%,transparent)] bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] px-[0.4rem] text-[0.78rem] font-semibold leading-none text-[var(--accent)] tabular-nums"
								title="My rating">{f.rating}</span
							>{/if}
						{#if m}<span class="smallcaps">{m.year}</span>{/if}
					</span>
				</div>
				{#if meta(f)}
					<p class="mt-1 text-sm text-[var(--ink-muted)]">{meta(f)}</p>
				{/if}
				{#if f.watchedOn || f.watched > 1}
					<div class="mt-1 text-[0.72rem] leading-[1.4] text-[var(--ink-dim)]">
						{#if f.watchedOn}<time
								class="whitespace-nowrap text-[0.75rem] leading-none tracking-[0.04em] text-[var(--ink-dim)] tabular-nums [font-family:var(--font-body)]"
								datetime={f.watchedOn}
								title={`Watched ${fmtWatched(f.watchedOn)}`}>{fmtWatched(f.watchedOn)}</time
							>{/if}{#if f.watchedOn && f.watched > 1}<span class="text-[var(--ink-dim)]"
								>&nbsp;·&nbsp;</span
							>{/if}{#if f.watched > 1}{@render rewatch(f.watched)}{/if}
					</div>
				{/if}
				{#if f.notes}
					<div
						class="mt-1.5 border-l-2 border-[color-mix(in_oklab,var(--accent)_50%,var(--rule))] pl-[0.7rem] text-[0.95rem] italic leading-[1.55] text-[var(--ink)] [font-family:var(--font-display)]"
					>
						{f.notes}
					</div>
				{/if}
			</div>
		</div>
	</li>
{/snippet}

<Container size="prose">
	<div class="rise-3 mt-10">
		<Breadcrumb
			items={[
				{ name: 'Home', href: '/' },
				{ name: 'Films', href: '/films' }
			]}
		/>
		<div class="mt-4 smallcaps">
			updated <time datetime={lastUpdated}>{lastUpdated}</time>
		</div>
	</div>

	<!-- Favourite spotlight: the one thing above the ratings -->
	{#if favourite}
		{@const m = md(favourite)}
		<section class="rise-2 mt-8">
			<div
				class="flex flex-col items-center gap-5 rounded-2xl border border-[color-mix(in_oklab,var(--accent)_38%,var(--rule))] p-6 text-center shadow-[0_10px_34px_rgba(0,0,0,0.34)] [background:radial-gradient(130%_130%_at_0%_0%,color-mix(in_oklab,var(--accent)_13%,transparent),transparent_58%),var(--bg-soft)] sm:flex-row sm:gap-7 sm:text-left"
			>
				<div class="min-w-0">
					<div
						class="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[var(--accent)] [font-family:var(--font-body)]"
					>
						★ The best thing I have ever watched.
					</div>
					<div class="flex items-center gap-2">
						<Poster
							posterPath={m?.posterPath ?? null}
							alt={m ? `${m.title} poster` : ''}
							width={40}
							vivid
						/>
						<h2 class="mt-3 italic">
							{#if m}{m.title}{:else}<span
									class="inline-block h-[0.8em] w-48 max-w-[58vw] animate-pulse rounded bg-[color-mix(in_oklab,var(--ink-dim)_22%,var(--bg-soft))] align-middle motion-reduce:animate-none"
								></span>{/if}
						</h2>
					</div>
					{#if meta(favourite)}
						<p class="mt-2 text-sm text-[var(--ink-muted)]">{meta(favourite)}</p>
					{/if}
					{#if favourite.watched > 1}
						<p class="mt-3">{@render rewatch(favourite.watched)}</p>
					{/if}
					{#if favourite.notes}
						<div
							class="mt-3 border-l-2 border-[color-mix(in_oklab,var(--accent)_50%,var(--rule))] pl-[0.7rem] text-left text-[0.95rem] italic leading-[1.55] text-[var(--ink)] [font-family:var(--font-display)]"
						>
							{favourite.notes}
						</div>
					{/if}
				</div>
			</div>
		</section>
	{/if}

	<Fleuron />

	<!-- By the numbers -->
	<section class="rise">
		<dl class="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 text-center">
			{#each facts as f (f.label)}
				<div>
					<dt class="smallcaps">{f.label}</dt>
					<dd class="mt-1 italic text-[var(--ink)]">{f.value}</dd>
				</div>
			{/each}
		</dl>
	</section>

	<Fleuron />

	<!-- Controls: filter + sort -->
	<div class="rise flex flex-col items-center gap-4">
		<div
			class="inline-flex gap-1 rounded-full border border-[var(--rule)] bg-[var(--bg-soft)] p-[0.3rem]"
			role="group"
			aria-label="Filter titles by type"
		>
			{#each filterOptions as opt (opt.value)}
				<button
					type="button"
					class="inline-flex cursor-pointer items-baseline gap-[0.45rem] rounded-full px-[1.3rem] py-[0.6rem] text-[0.78rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-[250ms] [font-family:var(--font-body)] {filter ===
					opt.value
						? 'bg-[var(--accent)] text-[var(--bg)]'
						: 'text-[var(--ink-muted)] hover:text-[var(--ink)]'}"
					aria-pressed={filter === opt.value}
					onclick={() => (filter = opt.value)}
				>
					{opt.label}
					{#if opt.count != null}<span class="text-[0.72rem] tabular-nums">{opt.count}</span>{/if}
				</button>
			{/each}
		</div>
		<div
			class="inline-flex gap-1 rounded-full border border-[var(--rule)] bg-[var(--bg-soft)] p-[0.3rem]"
			role="group"
			aria-label="Sort titles"
		>
			{#each sortOptions as opt (opt.value)}
				<button
					type="button"
					class="inline-flex cursor-pointer items-baseline gap-[0.45rem] rounded-full px-[1.3rem] py-[0.6rem] text-[0.78rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-[250ms] [font-family:var(--font-body)] {sort ===
					opt.value
						? 'bg-[var(--accent)] text-[var(--bg)]'
						: 'text-[var(--ink-muted)] hover:text-[var(--ink)]'}"
					aria-pressed={sort === opt.value}
					onclick={() => (sort = opt.value)}
				>
					{opt.label}
				</button>
			{/each}
		</div>
	</div>

	{#if sort === 'rating'}
		<!-- Tier index -->
		<nav aria-label="Ratings" class="rise mt-10">
			<ul class="flex flex-wrap justify-center gap-x-6 gap-y-2 smallcaps">
				{#each tiers as t (t.rating)}
					<li>
						<a href={`#r${t.rating}`} class="link-quiet">{t.rating} · {t.items.length}</a>
					</li>
				{/each}
			</ul>
		</nav>

		<!-- The ledger, by rating -->
		{#each tiers as t (t.rating)}
			<section id={`r${t.rating}`} class="rise mt-16 scroll-mt-8">
				<div class="flex items-baseline justify-between gap-6 border-b border-[var(--rule)] pb-3">
					<h2 class="italic">
						{t.rating} <span class="text-[var(--ink-dim)]">/ 10</span>
					</h2>
					<span class="smallcaps shrink-0">{t.label} · {t.items.length}</span>
				</div>

				<ul class="mt-2 divide-y divide-[var(--rule)]">
					{#each t.items as f (key(f))}
						{@render filmRow(f, false)}
					{/each}
				</ul>
			</section>
		{/each}
	{:else}
		<!-- The ledger, flat (by year / recently rated) -->
		<section class="rise mt-12">
			<div class="flex items-baseline justify-between gap-6 border-b border-[var(--rule)] pb-3">
				<h2 class="italic">
					{sort === 'year' ? 'By year' : 'Recently watched'}
				</h2>
				<span class="smallcaps shrink-0">{sortedFlat.length} titles</span>
			</div>

			<ul class="mt-2 divide-y divide-[var(--rule)]">
				{#each sortedFlat as f (key(f))}
					{@render filmRow(f, true)}
				{/each}
			</ul>
		</section>
	{/if}

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
</Container>
