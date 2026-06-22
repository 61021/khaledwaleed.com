<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { replaceState } from '$app/navigation';
	import { Container, Seo, PageHeader, Fleuron, site } from '$lib';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Poster from '$lib/components/Poster.svelte';
	import { films, type Film } from '$lib/films';

	// --- The one ---------------------------------------------------------
	const FAVOURITE_ID = 'tt0417299'; // Avatar: The Last Airbender
	const favourite = films.find((f) => f.id === FAVOURITE_ID);

	// --- Type classification (binary: shows vs everything else) ----------
	const isShow = (f: Film) => f.type === 'TV Series' || f.type === 'TV Mini Series';

	// --- Summary numbers -------------------------------------------------
	const total = films.length;
	const movieCount = films.filter((f) => !isShow(f)).length;
	const showCount = total - movieCount;
	const tens = films.filter((f) => f.rating === 10).length;
	const avg = (films.reduce((s, f) => s + f.rating, 0) / total).toFixed(1);
	const lastUpdated = films.reduce((a, f) => (f.rated > a ? f.rated : a), films[0].rated);

	const facts = [
		{ label: 'Titles rated', value: String(total) },
		{ label: 'Movies · shows', value: `${movieCount} · ${showCount}` },
		{ label: 'Average rating', value: `${avg} / 10` },
		{ label: 'Perfect tens', value: String(tens) }
	];

	// --- Type filter -----------------------------------------------------
	type Filter = 'all' | 'movies' | 'shows';
	let filter = $state<Filter>('all');

	const filterOptions: { value: Filter; label: string; count: number }[] = [
		{ value: 'all', label: 'All', count: total },
		{ value: 'movies', label: 'Movies', count: movieCount },
		{ value: 'shows', label: 'Shows', count: showCount }
	];

	const matchesFilter = (f: Film): boolean =>
		filter === 'all' || (filter === 'shows' ? isShow(f) : !isShow(f));

	// --- Sort ------------------------------------------------------------
	type Sort = 'rating' | 'year' | 'recent';
	let sort = $state<Sort>('rating');

	const sortOptions: { value: Sort; label: string }[] = [
		{ value: 'rating', label: 'Rating' },
		{ value: 'year', label: 'Year' },
		{ value: 'recent', label: 'Recent' }
	];

	// Flat, sorted list used when sort ≠ 'rating' (year / recently rated).
	const sortedFlat = $derived.by(() => {
		const arr = films.filter(matchesFilter);
		if (sort === 'year') {
			arr.sort((a, b) => b.year - a.year || b.rating - a.rating || a.title.localeCompare(b.title));
		} else if (sort === 'recent') {
			arr.sort((a, b) => b.rated.localeCompare(a.rated) || b.rating - a.rating);
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
	const ratings = [...new Set(films.map((f) => f.rating))].sort((a, b) => b - a);
	const tiers = $derived(
		ratings
			.map((rating) => ({
				rating,
				label: tierLabel[rating] ?? '',
				items: films.filter((f) => f.rating === rating && matchesFilter(f))
			}))
			.filter((t) => t.items.length > 0)
	);

	function meta(f: Film): string {
		const parts: string[] = [];
		if (f.directors.length) parts.push(f.directors.join(', '));
		if (f.type !== 'Movie') parts.push(f.type);
		if (f.genres.length) parts.push(f.genres.slice(0, 2).join(', '));
		parts.push(`IMDb ${f.imdbRating.toFixed(1)}`);
		return parts.join('  ·  ');
	}

	// Only surface rewatches — "once" is the unremarkable default.
	const watchedLabel = (f: Film): string | null =>
		f.watched > 1 ? `seen ${f.watched} times` : null;

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': `${site.url}/films#page`,
		url: `${site.url}/films`,
		name: `${site.name}'s Films`,
		description: `Every film and series Khaled Waleed has rated on IMDb — ${total} titles, scored 1–10. Updated ${lastUpdated}.`,
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
	};
</script>

<Seo
	title="Films"
	description={`Every film and series Khaled Waleed has rated on IMDb — ${total} titles, scored 1–10. A lifelong cinema obsession, logged honestly.`}
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

{#snippet filmRow(f: Film, showRating: boolean)}
	<li class="group py-3">
		<div class="flex gap-4">
			<a
				href={f.url}
				target="_blank"
				rel="noopener noreferrer"
				tabindex="-1"
				aria-hidden="true"
				class="shrink-0"
			>
				<Poster id={f.id} alt={`${f.title} poster`} width={52} />
			</a>
			<div class="min-w-0 flex-1">
				<div class="flex items-baseline justify-between gap-6">
					<a
						href={f.url}
						target="_blank"
						rel="noopener noreferrer"
						class="italic text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
						style="font-family: var(--font-display); font-size: 1.25rem; line-height: 1.2;"
					>
						{f.title}{#if f.id === FAVOURITE_ID}<span
								style="color: var(--accent);"
								title="My favourite">&nbsp;★</span
							>{/if}
					</a>
					<span class="flex shrink-0 items-baseline gap-2">
						{#if showRating}<span class="rating-chip" title="My rating">{f.rating}</span>{/if}
						<span class="smallcaps">{f.year}</span>
					</span>
				</div>
				<p class="mt-1 text-sm text-[var(--ink-muted)]">
					{meta(f)}{#if watchedLabel(f)}<span class="watched">&nbsp;· {watchedLabel(f)}</span>{/if}
				</p>
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
		<section class="rise-2 mt-8">
			<a
				href={favourite.url}
				target="_blank"
				rel="noopener noreferrer"
				class="fave group flex flex-col items-center gap-5 text-center sm:flex-row sm:gap-7 sm:text-left"
			>
				<div class="shrink-0">
					<Poster id={favourite.id} alt={`${favourite.title} poster`} width={132} vivid />
				</div>
				<div class="min-w-0">
					<div class="fave-label smallcaps">★ The best thing I have ever watched.</div>
					<h2 class="fave-title mt-2">{favourite.title}</h2>
					<p class="mt-2 text-sm text-[var(--ink-muted)]">{meta(favourite)}</p>
					{#if watchedLabel(favourite)}
						<p class="watched mt-2">{watchedLabel(favourite)}</p>
					{/if}
				</div>
			</a>
		</section>
	{/if}

	<Fleuron />

	<!-- By the numbers -->
	<section class="rise">
		<h2 class="text-center italic">By the numbers</h2>
		<dl class="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
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
					<span class="seg-count">{opt.count}</span>
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
					<h2 class="italic" style="margin:0;">
						{t.rating} <span class="text-[var(--ink-dim)]">/ 10</span>
					</h2>
					<span class="smallcaps shrink-0">{t.label} · {t.items.length}</span>
				</div>

				<ul class="mt-2 divide-y divide-[var(--rule)]">
					{#each t.items as f (f.id)}
						{@render filmRow(f, false)}
					{/each}
				</ul>
			</section>
		{/each}
	{:else}
		<!-- The ledger, flat (by year / recently rated) -->
		<section class="rise mt-12">
			<div class="flex items-baseline justify-between gap-6 border-b border-[var(--rule)] pb-3">
				<h2 class="italic" style="margin:0;">
					{sort === 'year' ? 'By year' : 'Recently rated'}
				</h2>
				<span class="smallcaps shrink-0">{sortedFlat.length} titles</span>
			</div>

			<ul class="mt-2 divide-y divide-[var(--rule)]">
				{#each sortedFlat as f (f.id)}
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
		<p class="smallcaps max-w-sm" style="text-transform: none; letter-spacing: 0.04em;">
			Posters and metadata via The Movie Database. This product uses the TMDB API but is not
			endorsed or certified by TMDB.
		</p>
	</div>
</Container>

<style>
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
		gap: 0.45rem;
		padding: 0.6rem 1.3rem;
		border-radius: 9999px;
		font-family: var(--font-body);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ink-muted);
		cursor: pointer;
		transition:
			color 250ms ease,
			background-color 250ms ease;
	}

	.seg-opt:hover {
		color: var(--ink);
	}

	.seg-opt.is-active {
		color: var(--bg);
		background: var(--accent);
	}

	.seg-count {
		font-size: 0.72rem;
		font-variant-numeric: tabular-nums;
		opacity: 0.65;
	}

	.seg-opt.is-active .seg-count {
		opacity: 0.85;
	}

	.fave {
		padding: 1.5rem;
		border: 1px solid color-mix(in oklab, var(--accent) 38%, var(--rule));
		border-radius: 1rem;
		background:
			radial-gradient(
				130% 130% at 0% 0%,
				color-mix(in oklab, var(--accent) 13%, transparent),
				transparent 58%
			),
			var(--bg-soft);
		box-shadow: 0 10px 34px rgba(0, 0, 0, 0.34);
		transition:
			transform 400ms ease,
			box-shadow 400ms ease,
			border-color 400ms ease;
	}

	.fave:hover {
		transform: translateY(-3px);
		border-color: color-mix(in oklab, var(--accent) 60%, var(--rule));
		box-shadow: 0 16px 44px rgba(0, 0, 0, 0.45);
	}

	.fave-label {
		color: var(--accent);
	}

	.watched {
		font-weight: 600;
		font-style: normal;
		color: var(--accent);
	}

	.rating-chip {
		display: inline-grid;
		place-items: center;
		min-width: 1.5rem;
		height: 1.5rem;
		padding: 0 0.4rem;
		border-radius: 9999px;
		background: color-mix(in oklab, var(--accent) 16%, transparent);
		border: 1px solid color-mix(in oklab, var(--accent) 38%, transparent);
		color: var(--accent);
		font-size: 0.78rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}

	.fave-title {
		margin: 0;
		font-family: var(--font-display);
		font-style: italic;
		font-weight: 400;
		font-size: clamp(1.7rem, 3vw + 1rem, 2.5rem);
		line-height: 1.08;
		color: var(--ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.fave {
			transition: border-color 400ms ease;
		}
		.fave:hover {
			transform: none;
		}
	}
</style>
