<script lang='ts'>
	import type { PageData } from './$types'
	import { replaceState } from '$app/navigation'
	import { page } from '$app/state'
	import { Container, Fleuron, PageHeader, SchemaOrg, Seo, site } from '$lib'
	import Poster from '$lib/components/Poster.svelte'
	import { posterRef } from '$lib/posters'
	import { formatDate } from '$lib/posts'
	import { onMount } from 'svelte'

	const { data }: { data: PageData } = $props()
	type Personal = PageData['films'][number]

	// --- The one ---------------------------------------------------------
	// Avatar: The Last Airbender (TMDB tv/246).
	const FAVOURITE = { tmdbId: 246, type: 'tv' as const }
	const isFavourite = (f: Personal): boolean =>
		f.tmdbId === FAVOURITE.tmdbId && f.type === FAVOURITE.type

	// Everything, your data AND the TMDB snapshot (title, year, directors),
	// arrives server-rendered from PocketBase in one request. Posters are
	// PocketBase files too, so the browser never touches TMDB. No client
	// fetching, no skeletons, no reshuffling.
	const personal = $derived(data.films)

	// Keyed by "type/tmdbId"; a tmdb id can repeat across a movie and a show.
	const key = (f: Personal): string => `${f.type}/${f.tmdbId}`
	const title = (f: Personal): string => f.title || `#${f.tmdbId}`

	// Posters link out to the title's TMDB page; TMDB is where all the
	// metadata comes from, and no IMDb ids are stored.
	const tmdbUrl = (f: Personal): string => `https://www.themoviedb.org/${f.type}/${f.tmdbId}`

	// --- Summary numbers -------------------------------------------------
	const total = $derived(personal.length)
	const movieCount = $derived(personal.filter(f => f.type === 'movie').length)
	const showCount = $derived(personal.filter(f => f.type === 'tv').length)
	const lastUpdated = $derived(
		personal.reduce((a, f) => (f.watchedOn > a ? f.watchedOn : a), personal[0]?.watchedOn ?? ''),
	)
	const firstYear = $derived(
		personal
			.reduce((a, f) => (f.watchedOn && (!a || f.watchedOn < a) ? f.watchedOn : a), '')
			.slice(0, 4),
	)

	// --- Favourite strips --------------------------------------------------
	// The shrine at the top: everything scored a perfect 10, films and series
	// each on their own shelf. The one favourite leads its shelf.
	const favFilms = $derived(personal.filter(f => f.rating === 10 && f.type === 'movie'))
	const favSeries = $derived(
		personal
			.filter(f => f.rating === 10 && f.type === 'tv')
			.sort((a, b) => Number(isFavourite(b)) - Number(isFavourite(a))),
	)

	// --- Type filter -----------------------------------------------------
	// The controls read from the URL (?type=&sort=&dir=&view=) at init, so
	// the server renders the exact view a shared link names; the handlers
	// below write changes back with replaceState. Legacy names keep working.
	const params = page.url.searchParams

	type Filter = 'all' | 'films' | 'series'
	const typeParam = params.get('type')
	let filter = $state<Filter>(
		typeParam === 'films' || typeParam === 'movies'
			? 'films'
			: typeParam === 'series' || typeParam === 'shows' ? 'series' : 'all',
	)

	const filterOptions = $derived<{ value: Filter, label: string, count: number }[]>([
		{ value: 'all', label: 'All', count: total },
		{ value: 'films', label: 'Films', count: movieCount },
		{ value: 'series', label: 'Series', count: showCount },
	])

	const matchesFilter = (f: Personal): boolean => {
		if (filter === 'all')
			return true
		return filter === 'series' ? f.type === 'tv' : f.type === 'movie'
	}

	// --- Search ------------------------------------------------------------
	let query = $state('')
	const matchesQuery = (f: Personal): boolean => {
		const q = query.trim().toLowerCase()
		if (!q)
			return true
		const hay = `${f.title} ${f.directors.join(' ')} ${f.genres.join(' ')}`.toLowerCase()
		return q.split(/\s+/).every(part => hay.includes(part))
	}

	const visible = (f: Personal): boolean => matchesFilter(f) && matchesQuery(f)

	// --- Sort ------------------------------------------------------------
	type Sort = 'watched' | 'release' | 'mine'
	type Dir = 'asc' | 'desc'
	const DEFAULT_DIR: Record<Sort, Dir> = {
		watched: 'desc',
		release: 'desc',
		mine: 'desc',
	}

	// The log opens on my rating; the chronological sorts are a click away.
	// Legacy sort values: year → release, rating → mine, recent → watched.
	const sortParam = params.get('sort')
	const initialSort: Sort
		= sortParam === 'release' || sortParam === 'year'
			? 'release'
			: sortParam === 'watched' || sortParam === 'recent' ? 'watched' : 'mine'
	const dirParam = params.get('dir')

	let sort = $state<Sort>(initialSort)
	let dir = $state<Dir>(
		dirParam === 'asc' || dirParam === 'desc' ? dirParam : DEFAULT_DIR[initialSort],
	)

	const sortOptions: { value: Sort, label: string, star?: boolean, by: string }[] = [
		{ value: 'watched', label: 'Watched', by: 'watch date' },
		{ value: 'release', label: 'Release', by: 'release year' },
		{ value: 'mine', label: 'Mine', star: true, by: 'my rating' },
	]

	// Picking the active sort again flips its direction.
	function setSort(v: Sort): void {
		if (sort === v) {
			dir = dir === 'desc' ? 'asc' : 'desc'
		}
		else {
			sort = v
			dir = DEFAULT_DIR[v]
		}
		syncUrl()
	}

	const collator = new Intl.Collator('en', { sensitivity: 'base' })

	const sorted = $derived.by<Personal[]>(() => {
		const m = dir === 'asc' ? 1 : -1
		const byTitle = (a: Personal, b: Personal): number => collator.compare(title(a), title(b))
		const arr = personal.filter(visible)

		if (sort === 'watched') {
			// Undated titles sink to the end whichever way the arrow points.
			arr.sort((a, b) => {
				if (!a.watchedOn || !b.watchedOn)
					return Number(!a.watchedOn) - Number(!b.watchedOn) || byTitle(a, b)
				return m * a.watchedOn.localeCompare(b.watchedOn) || b.rating - a.rating || byTitle(a, b)
			})
		}
		else if (sort === 'release') {
			arr.sort((a, b) => {
				if (!a.year || !b.year)
					return Number(!a.year) - Number(!b.year) || byTitle(a, b)
				return m * (a.year - b.year) || b.rating - a.rating || byTitle(a, b)
			})
		}
		else if (sort === 'mine') {
			arr.sort(
				(a, b) =>
					m * (a.rating - b.rating) || b.watchedOn.localeCompare(a.watchedOn) || byTitle(a, b),
			)
		}
		return arr
	})

	// --- Sessions ----------------------------------------------------------
	// At 200+ rows the ledger read as one unbroken run; auction catalogues
	// break into sessions, so the chronological sorts get a year rule per
	// watch/release year. The rating sort stays a single sweep.
	const sessionLabel = (f: Personal): string => {
		if (sort === 'mine')
			return ''
		if (sort === 'watched')
			return f.watchedOn ? f.watchedOn.slice(0, 4) : 'undated'
		return f.year ? String(f.year) : 'undated'
	}

	const sessions = $derived.by<{ label: string, items: Personal[] }[]>(() => {
		const out: { label: string, items: Personal[] }[] = []
		for (const f of sorted) {
			const label = sessionLabel(f)
			const prev = out[out.length - 1]
			if (prev && prev.label === label)
				prev.items.push(f)
			else out.push({ label, items: [f] })
		}
		return out
	})

	// --- View (list ↔ grid) -------------------------------------------------
	// Desktop opens on the wall, phones on the list, unless the URL names a
	// view. The pick happens at mount: the edge caches one HTML for every
	// device, so the server can't know the viewport.
	type View = 'list' | 'grid'
	const viewParam = params.get('view')
	let view = $state<View>(viewParam === 'grid' ? 'grid' : 'list')
	const deviceView = (): View =>
		matchMedia('(min-width: 640px)').matches ? 'grid' : 'list'

	onMount(() => {
		if (!viewParam && deviceView() === 'grid')
			view = 'grid'
	})

	// --- Back to the controls ------------------------------------------------
	// The ledger runs tens of thousands of pixels and the filters live only at
	// its head; two screens in, a gemmed plate floats up offering the way back.
	let scrollY = $state(0)
	let innerHeight = $state(0)
	let controlsEl = $state<HTMLDivElement>()
	const showReturn = $derived(total > 0 && innerHeight > 0 && scrollY > innerHeight * 2)

	function returnToControls(): void {
		// Bare scrollIntoView: html's scroll-behavior is smooth, and the
		// reduced-motion reset flips it to auto, so both ride the house rule.
		controlsEl?.scrollIntoView({ block: 'start' })
		controlsEl?.focus({ preventScroll: true })
	}

	function setFilter(v: Filter): void {
		filter = v
		syncUrl()
	}

	function setView(v: View): void {
		view = v
		syncUrl()
	}

	// --- URL persistence (?type=&sort=&dir=&view=) --------------------------
	// Written from the handlers above, never from an $effect: SvelteKit's
	// replaceState mutates the router's page state, which is not allowed
	// mid-flush and would take the whole reactive graph down with it.
	function syncUrl(): void {
		const url = new URL(location.href)
		if (filter === 'all')
			url.searchParams.delete('type')
		else url.searchParams.set('type', filter)
		if (sort === 'mine')
			url.searchParams.delete('sort')
		else url.searchParams.set('sort', sort)
		if (dir === DEFAULT_DIR[sort])
			url.searchParams.delete('dir')
		else url.searchParams.set('dir', dir)
		if (view === deviceView())
			url.searchParams.delete('view')
		else url.searchParams.set('view', view)
		replaceState(`${url.pathname}${url.search}`, {})
	}

	// --- Row copy ----------------------------------------------------------
	const kindLabel = (f: Personal): string =>
		f.type === 'tv' ? (/mini/i.test(f.format) ? 'Mini series' : 'Series') : 'Film'

	// "2h 10m" for films; series carry per-episode runtimes, so "54m".
	function fmtRuntime(f: Personal): string {
		if (!f.runtime)
			return ''
		const h = Math.floor(f.runtime / 60)
		const min = f.runtime % 60
		if (!h)
			return `${min}m`
		return min ? `${h}h ${min}m` : `${h}h`
	}

	// With a type filter on, every row is that type; the label is noise.
	const subline = (f: Personal): string =>
		[f.year || '', fmtRuntime(f), filter === 'all' ? kindLabel(f) : ''].filter(Boolean).join(', ')

	const schema = $derived({
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': `${site.url}/films#page`,
		'url': `${site.url}/films`,
		'name': `${site.name}'s Films`,
		'description': `Every film and series Khaled Waleed has rated: ${total} titles, scored 1 to 10. Updated ${lastUpdated}.`,
		'dateModified': lastUpdated,
		'isPartOf': { '@id': `${site.url}/#website` },
		'about': { '@id': `${site.url}/#person` },
		'breadcrumb': {
			'@type': 'BreadcrumbList',
			'itemListElement': [
				{ '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': site.url },
				{ '@type': 'ListItem', 'position': 2, 'name': 'Films', 'item': `${site.url}/films` },
			],
		},
		// The full ledger: titles are server-rendered, so crawlers see the
		// same list this describes.
		'mainEntity': {
			'@type': 'ItemList',
			'numberOfItems': total,
			'itemListElement': personal.map((f, i) => ({
				'@type': 'ListItem',
				'position': i + 1,
				'item': { '@type': f.type === 'tv' ? 'TVSeries' : 'Movie', 'name': title(f) },
			})),
		},
	})
</script>

<Seo
	title='Films'
	description={`Every film and series Khaled Waleed has rated: ${total} titles, scored 1 to 10. A lifelong cinema obsession in a single log.`}
/>

<SchemaOrg {schema} />

<svelte:window bind:scrollY bind:innerHeight />

<svelte:head>
	<link rel='preconnect' href='https://api.khaledwaleed.com' />
</svelte:head>

<PageHeader room='films' title='Films'>
	{#snippet lede()}
		<p>Every film and series I have watched, scored 1 to 10.</p>
	{/snippet}
</PageHeader>

{#snippet rewatch(n: number)}
	<span
		class='inline-flex items-center gap-[0.2rem] text-[0.75rem] leading-none text-[var(--ink-dim)]'
	>
		<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 256 256'
		><!-- Icon from Phosphor by Phosphor Icons - https://github.com/phosphor-icons/core/blob/main/LICENSE --><path
			fill='currentColor'
			d='M224 48v48a8 8 0 0 1-8 8h-48a8 8 0 0 1 0-16h28.69l-14.63-14.63a79.56 79.56 0 0 0-56.13-23.43h-.45a79.52 79.52 0 0 0-55.89 22.77a8 8 0 0 1-11.18-11.44a96 96 0 0 1 135 .79L208 76.69V48a8 8 0 0 1 16 0m-37.59 135.29a80 80 0 0 1-112.47-.66L59.31 168H88a8 8 0 0 0 0-16H40a8 8 0 0 0-8 8v48a8 8 0 0 0 16 0v-28.69l14.63 14.63A95.43 95.43 0 0 0 130 222.06h.53a95.36 95.36 0 0 0 67.07-27.33a8 8 0 0 0-11.18-11.44Z'
		/></svg
		>
		{n} viewings</span
	>
{/snippet}

{#snippet star(size: number)}
	<svg class='star' xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 256 256' aria-hidden='true'
	><!-- Icon from Phosphor by Phosphor Icons - https://github.com/phosphor-icons/core/blob/main/LICENSE --><path
		fill='currentColor'
		d='m234.29 114.85l-45 38.83L203 211.75a16.4 16.4 0 0 1-24.5 17.82L128 198.49l-50.53 31.08A16.4 16.4 0 0 1 53 211.75l13.76-58.07l-45-38.83A16.46 16.46 0 0 1 31.08 86l59-4.76l22.76-55.08a16.36 16.36 0 0 1 30.27 0l22.75 55.08l59 4.76a16.46 16.46 0 0 1 9.37 28.86Z'
	/></svg
	>
{/snippet}

{#snippet strip(label: string, items: Personal[])}
	<section class='favs' aria-label={label}>
		<div class='favs-head'>
			<h2 class='smallcaps favs-label'>{label}</h2>
			<span class='smallcaps favs-count'>{items.length}</span>
		</div>
		<ul class='favs-strip'>
			{#each items as f, i (key(f))}
				<li>
					<a
						class='fav'
						href={tmdbUrl(f)}
						target='_blank'
						rel='noopener noreferrer'
						title={title(f)}
						aria-label={`${title(f)} on TMDB`}
					>
						<!-- The shrine opens the page; lazy would hold its first
						     posters back behind everything else. -->
						<Poster poster={posterRef(f)} alt="" width={112} fluid vivid eager={i < 8} />
					</a>
				</li>
			{/each}
		</ul>
	</section>
{/snippet}

<Container>
	{#if lastUpdated}
		<div class='smallcaps mt-10'>
			updated <time datetime={lastUpdated}>{formatDate(lastUpdated)}</time>
		</div>
	{/if}

	{#if total === 0}
		<!-- PocketBase is unreachable (or the log is empty); say so honestly. -->
		<section class='mt-20 mb-12 text-center'>
			<p class='[font-family:var(--font-display)] text-[1.4rem] text-[var(--ink)]'>
				The log isn’t loading.
			</p>
			<p class='mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[var(--ink-muted)]'>
				It lives on a server that is not answering right now. Give it a moment, then try again.
			</p>
		</section>
	{:else}
		<!-- The shrine: perfect tens, films then series -->
		{#if favFilms.length}
			{@render strip('Favourite films', favFilms)}
		{/if}
		{#if favSeries.length}
			{@render strip('Favourite series', favSeries)}
		{/if}

		<Fleuron />

		<section aria-label='Viewing log'>
			<!-- The scroll target for the floating return plate; focusable so
			     the jump lands screen readers here too. -->
			<div class='controls' bind:this={controlsEl} tabindex='-1'>
				<div class='line line-fill' role='group' aria-label='Filter titles'>
					{#each filterOptions as opt, i (opt.value)}
						{#if i}<span class='vsep' aria-hidden='true'></span>{/if}
						<button
							type='button'
							class={['line-opt', filter === opt.value && 'on']}
							aria-pressed={filter === opt.value}
							onclick={() => setFilter(opt.value)}
						>
							{opt.label} <b>{opt.count}</b>
						</button>
					{/each}
					<label class='find'>
						<span class='sr-only'>Find a title</span>
						<input
							type='search'
							bind:value={query}
							placeholder='Find a title, a director…'
							autocomplete='off'
							spellcheck='false'
						/>
					</label>
				</div>

				<div class='line line-fill' role='group' aria-label='Sort titles'>
					{#each sortOptions as opt, i (opt.value)}
						{#if i}<span class='vsep' aria-hidden='true'></span>{/if}
						<button
							type='button'
							class={['line-opt', sort === opt.value && 'on']}
							aria-pressed={sort === opt.value}
							aria-label={`Sort by ${opt.by}${
								sort === opt.value ? (dir === 'desc' ? ', descending' : ', ascending') : ''
							}`}
							onclick={() => setSort(opt.value)}
						>
							{#if opt.star}<span class='sort-star'>{@render star(10)}</span
							>{/if}{opt.label}{#if sort === opt.value}<svg
								class='dir'
								xmlns='http://www.w3.org/2000/svg'
								width='10'
								height='10'
								viewBox='0 0 256 256'
								aria-hidden='true'
							><!-- Icon from Phosphor by Phosphor Icons - https://github.com/phosphor-icons/core/blob/main/LICENSE --><path
								fill='currentColor'
								d={dir === 'desc'
									? 'm213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32'
									: 'M213.66 165.66a8 8 0 0 1-11.32 0L128 91.31l-74.34 74.35a8 8 0 0 1-11.32-11.32l80-80a8 8 0 0 1 11.32 0l80 80a8 8 0 0 1 0 11.32'}
							/></svg
							>{/if}
						</button>
					{/each}
					<div class='viewtoggle' role='group' aria-label='Layout'>
						<button
							type='button'
							class={[view === 'list' && 'on']}
							aria-pressed={view === 'list'}
							aria-label='List view'
							title='List view'
							onclick={() => setView('list')}
						>
							<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 256 256'
							><!-- Icon from Phosphor by Phosphor Icons - https://github.com/phosphor-icons/core/blob/main/LICENSE --><path
								fill='currentColor'
								d='M208 136H48a16 16 0 0 0-16 16v40a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16v-40a16 16 0 0 0-16-16m0 56H48v-40h160zm0-144H48a16 16 0 0 0-16 16v40a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16m0 56H48V64h160z'
							/></svg
							>
						</button>
						<button
							type='button'
							class={[view === 'grid' && 'on']}
							aria-pressed={view === 'grid'}
							aria-label='Grid view'
							title='Grid view'
							onclick={() => setView('grid')}
						>
							<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 256 256'
							><!-- Icon from Phosphor by Phosphor Icons - https://github.com/phosphor-icons/core/blob/main/LICENSE --><path
								fill='currentColor'
								d='M104 40H56a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h48a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16m0 64H56V56h48zm96-64h-48a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h48a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16m0 64h-48V56h48zm-96 32H56a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h48a16 16 0 0 0 16-16v-48a16 16 0 0 0-16-16m0 64H56v-48h48zm96-64h-48a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h48a16 16 0 0 0 16-16v-48a16 16 0 0 0-16-16m0 64h-48v-48h48z'
							/></svg
							>
						</button>
					</div>
				</div>

				<p class='sr-only' aria-live='polite'>{sorted.length} of {total} titles</p>
			</div>

			{#if sorted.length === 0}
				<p class='mt-14 text-center text-[var(--ink-muted)] italic'>
					{#if query.trim()}
						Nothing here matches <em class='text-[var(--ink)]'>{query}</em>.
					{:else}
						Nothing in this corner of the log yet.
					{/if}
				</p>
			{:else if view === 'list'}
				{#each sessions as s, si (s.label || 'all')}
					{#if s.label}
						<div class={['session-head', si === 0 && 'first']}>
							<h3 class='smallcaps session-label'>{s.label}</h3>
							<span class='smallcaps session-count'>{s.items.length}</span>
						</div>
					{/if}
					<ul class={['list', s.label && 'grouped']}>
						{#each s.items as f (key(f))}
							<li class='lrow'>
								<a
									class='lrow-thumb'
									href={tmdbUrl(f)}
									target='_blank'
									rel='noopener noreferrer'
									aria-label={`${title(f)} on TMDB`}
								>
									<Poster poster={posterRef(f)} alt="" width={84} fluid />
								</a>
								<div class='lrow-main'>
									<h4 class='lrow-title'>
										{title(f)}{#if isFavourite(f)}<span class='fav-mark' title='My favourite'
										>{@render star(12)}<span class='sr-only'>My favourite</span></span
										>{/if}
									</h4>
									{#if subline(f)}<p class='lrow-sub'>{subline(f)}</p>{/if}
									<p class='lrow-ratings'>
										<span class='r-mine' aria-label={`My rating ${f.rating} out of 10`}>
											{@render star(13)}{f.rating}
										</span>
										{#if f.watched > 1}{@render rewatch(f.watched)}{/if}
									</p>
									{#if f.directors.length}
										<p class='lrow-by'>
											<span class='by-lbl'>{f.type === 'tv' ? 'Created by' : 'Directed by'}</span>
											{f.directors.join(', ')}
										</p>
									{/if}
								</div>
							</li>
						{/each}
					</ul>
				{/each}
			{:else}
				{#each sessions as s, si (s.label || 'all')}
					{#if s.label}
						<div class={['session-head', si === 0 && 'first']}>
							<h3 class='smallcaps session-label'>{s.label}</h3>
							<span class='smallcaps session-count'>{s.items.length}</span>
						</div>
					{/if}
					<ul class={['wall', s.label && 'grouped']}>
						{#each s.items as f (key(f))}
							<li>
								<a
									class='cell'
									href={tmdbUrl(f)}
									target='_blank'
									rel='noopener noreferrer'
									title={title(f)}
								>
									<Poster poster={posterRef(f)} alt="" width={104} fluid />
									<span class='cell-title'
									>{title(f)}{#if isFavourite(f)}<span class='fav-mark'
									>{@render star(11)}<span class='sr-only'>My favourite</span></span
									>{/if}</span
									>
									<span class='cell-sub'
									>{#if f.year}{f.year} ·
									{/if}<span class='cell-rating'
									><span class='sr-only'>rated</span>{@render star(10)}{f.rating}</span
									></span
									>
								</a>
							</li>
						{/each}
					</ul>
				{/each}
			{/if}
		</section>

		<Fleuron />

		{#if firstYear}
			<p class='closing-note'>The log runs back to {firstYear}.</p>
		{/if}

		<!-- TMDB attribution (required by their API terms) -->
		<div class='flex flex-col items-center gap-3 text-center'>
			<a
				href='https://www.themoviedb.org/'
				target='_blank'
				rel='noopener noreferrer'
				aria-label='The Movie Database'
				class='opacity-70 transition-opacity hover:opacity-100'
			>
				<img src='/logos/tmdb.svg' alt='The Movie Database (TMDB)' width='80' height='58' />
			</a>
			<p
				class='max-w-sm [font-family:var(--font-body)] text-[0.72rem] font-semibold tracking-[0.04em] text-[var(--ink-muted)]'
			>
				Posters and metadata via The Movie Database. This product uses the TMDB API but is not
				endorsed or certified by TMDB.
			</p>
		</div>
		{#if showReturn}
			<button
				type='button'
				class='return frame-gemmed'
				aria-label='Back to the filters'
				title='Back to the filters'
				onclick={returnToControls}
			>
				<svg xmlns='http://www.w3.org/2000/svg' width='17' height='17' viewBox='0 0 256 256' aria-hidden='true'
				><!-- Icon from Phosphor by Phosphor Icons - https://github.com/phosphor-icons/core/blob/main/LICENSE --><path
					fill='currentColor'
					d='M205.66 117.66a8 8 0 0 1-11.32 0L136 59.31V216a8 8 0 0 1-16 0V59.31l-58.34 58.35a8 8 0 0 1-11.32-11.32l72-72a8 8 0 0 1 11.32 0l72 72a8 8 0 0 1 0 11.32'
				/></svg
				>
			</button>
		{/if}
	{/if}
</Container>

<style>
	/* ---------- Favourite strips ---------- */
	.favs {
		margin-top: 2.25rem;
	}

	.favs + .favs {
		margin-top: 1.6rem;
	}

	.favs-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		border-bottom: 1px solid var(--rule);
		padding-bottom: 0.55rem;
	}

	.favs-label {
		margin: 0;
		color: var(--ink);
	}

	.favs-count {
		color: var(--ink-dim);
		font-variant-numeric: tabular-nums;
	}

	.favs-strip {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: clamp(6rem, 22vw, 7rem);
		gap: 0.8rem;
		margin: 1rem 0 0;
		padding: 0 0 0.9rem;
		list-style: none;
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scroll-snap-type: x proximity;
		scrollbar-width: none;
	}

	.favs-strip::-webkit-scrollbar {
		display: none;
	}

	.fav {
		display: block;
		scroll-snap-align: start;
	}

	.fav:hover :global(img),
	.fav:focus-visible :global(img) {
		transform: translateY(-4px);
		box-shadow: 0 12px 28px rgba(0, 0, 0, 0.55);
	}

	/* ---------- Filter & sort lines ---------- */
	.line {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 0.9rem;
		margin-top: 0.95rem;
	}

	.line-opt {
		position: relative;
		display: inline-flex;
		align-items: baseline;
		gap: 0.4rem;
		padding: 0.5rem 0;
		border-bottom: 1px solid transparent;
		font-family: var(--font-body);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-muted);
		white-space: nowrap;
		cursor: pointer;
		transition:
			color var(--dur-quick) var(--ease-out),
			border-color var(--dur-quick) var(--ease-out);
	}

	/* Small type, full-size target: extend the hit area past the glyphs
	   without touching the neighbouring row. */
	.line-opt::after {
		content: '';
		position: absolute;
		inset: -5px 0;
	}

	.line-opt:hover {
		color: var(--ink);
	}

	.line-opt.on {
		color: var(--ink);
		border-bottom-color: var(--accent);
	}

	.line-opt b {
		font-weight: 600;
		font-size: 0.92em;
		color: var(--ink-dim);
		font-variant-numeric: tabular-nums;
		transition: color var(--dur-quick) var(--ease-out);
	}

	.line-opt.on b {
		color: var(--accent);
	}

	.vsep {
		flex: none;
		width: 1px;
		height: 0.85em;
		background: var(--rule);
	}

	/* Preflight makes every svg display:block; the star has to flow with
	   the type it marks. */
	.star {
		display: inline-block;
		flex: none;
		vertical-align: -0.13em;
	}

	.fav-mark {
		color: var(--accent);
		margin-left: 0.3em;
	}

	.sort-star {
		display: inline-flex;
		color: var(--accent);
		margin-right: 0.25rem;
	}

	.dir {
		flex: none;
		color: var(--accent);
		margin-left: 0.3rem;
		vertical-align: -0.06em;
	}

	.find {
		display: flex;
		flex: 1 1 11rem;
		max-width: 16rem;
		margin-left: auto;
	}

	.find input {
		width: 100%;
		background: transparent;
		border: 0;
		border-bottom: 1px solid var(--rule);
		padding: 0.5rem 0.1rem;
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--ink);
		transition: border-color var(--dur-quick) var(--ease-out);
	}

	.find input::placeholder {
		color: var(--ink-dim);
	}

	.find input:focus {
		outline: none;
		border-bottom-color: color-mix(in oklab, var(--accent) 65%, transparent);
	}

	@media (max-width: 560px) {
		.find {
			flex-basis: 100%;
			max-width: none;
			margin-left: 0;
		}

		/* Phones spread both control rows edge to edge: the type switcher
		   once the search wraps to its own row, and the sort options once
		   the view toggle drops to its own row below them. */
		.line-fill .line-opt {
			flex: 1 1 0;
			justify-content: center;
		}

		.viewtoggle {
			flex-basis: 100%;
			justify-content: flex-end;
			margin-left: 0;
		}
	}

	.viewtoggle {
		display: flex;
		gap: 0.15rem;
		margin-left: auto;
	}

	/* 40px boxes: the icons are small, the targets are not. */
	.viewtoggle button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		color: var(--ink-dim);
		cursor: pointer;
		transition: color var(--dur-quick) var(--ease-out);
	}

	.viewtoggle button:hover {
		color: var(--ink);
	}

	.viewtoggle button.on {
		color: var(--accent);
	}

	/* ---------- The list ---------- */
	.list {
		margin-top: 1.9rem;
		padding: 0;
		list-style: none;
		border-top: 1px solid var(--rule);
	}

	.lrow {
		display: grid;
		grid-template-columns: 5.25rem 1fr;
		gap: 1.2rem;
		padding: 1.05rem 0.15rem;
		border-bottom: 1px solid color-mix(in oklab, var(--rule) 80%, transparent);
		transition: background-color var(--dur-quick) var(--ease-out);
		/* 225 rows: let offscreen ones skip layout and paint, which is most
		   of what froze navigations INTO this room (the swap runs inside the
		   view transition, on a frozen frame). */
		content-visibility: auto;
		contain-intrinsic-size: auto 140px;
	}

	.lrow:hover {
		background: linear-gradient(
			90deg,
			color-mix(in oklab, var(--accent) 7%, transparent),
			transparent 62%
		);
	}

	.lrow-thumb {
		display: block;
		align-self: start;
		line-height: 0;
	}

	.lrow-thumb:hover :global(img),
	.lrow-thumb:focus-visible :global(img) {
		filter: none;
		transform: translateY(-3px);
		box-shadow: 0 10px 24px rgba(0, 0, 0, 0.5);
	}

	.lrow-main {
		display: flex;
		flex-direction: column;
		gap: 0.32rem;
		min-width: 0;
	}

	.lrow-title {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 400;
		font-size: 1.14rem;
		line-height: 1.3;
		color: var(--ink);
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		transition: color var(--dur-quick) var(--ease-out);
	}

	.lrow:hover .lrow-title {
		color: var(--accent);
	}

	.lrow-sub {
		margin: 0;
		font-family: var(--font-body);
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-dim);
		font-variant-numeric: tabular-nums;
	}

	.lrow-ratings {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem 1.05rem;
		margin: 0.05rem 0 0;
		font-size: 0.8rem;
	}

	.r-mine {
		display: inline-flex;
		align-items: center;
		gap: 0.28rem;
		color: var(--accent);
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.lrow-by {
		margin: 0;
		font-family: var(--font-body);
		font-size: 0.64rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}

	.lrow-by .by-lbl {
		color: var(--ink-dim);
	}

	@media (max-width: 479px) {
		.lrow {
			grid-template-columns: 4rem 1fr;
			gap: 0.9rem;
		}
	}

	/* ---------- The wall (grid view) ---------- */
	.wall {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
		gap: 1.5rem 1rem;
		margin-top: 1.9rem;
		padding: 0;
		list-style: none;
	}

	.wall li {
		content-visibility: auto;
		contain-intrinsic-size: auto 230px;
	}

	@media (max-width: 400px) {
		.wall {
			grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
		}
	}

	.cell {
		display: block;
		width: 100%;
		color: inherit;
		text-align: center;
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
		transition: color var(--dur-quick) var(--ease-out);
	}

	.cell-sub {
		display: block;
		margin-top: 0.2rem;
		font-size: 0.68rem;
		letter-spacing: 0.03em;
		color: var(--ink-dim);
		font-variant-numeric: tabular-nums;
	}

	.cell-rating {
		display: inline-flex;
		align-items: center;
		gap: 0.22rem;
		vertical-align: baseline;
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

	/* ---------- Session rules ---------- */
	/* Chronological sorts break the ledger into years, their heads set
	   like the favourite shelves': smallcaps year, count, one hairline. */
	.session-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 2.6rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--rule);
	}

	.session-head.first {
		margin-top: 1.9rem;
	}

	.session-label {
		margin: 0;
		color: var(--ink);
	}

	.session-count {
		color: var(--ink-dim);
		font-variant-numeric: tabular-nums;
	}

	/* The head carries the rule, so a grouped list drops its own. */
	.list.grouped {
		margin-top: 0;
		border-top: 0;
	}

	.wall.grouped {
		margin-top: 1.4rem;
	}

	/* The scroll target for the return plate; focus lands here quietly. */
	.controls {
		outline: none;
		scroll-margin-top: 4.5rem;
	}

	/* ---------- Back to the controls ---------- */
	/* A gemmed plate floats up once the visitor is two screens deep in
	   the ledger; kept under the velvet band (z 105). */
	.return {
		position: fixed;
		right: max(1.1rem, env(safe-area-inset-right));
		bottom: max(1.2rem, env(safe-area-inset-bottom));
		z-index: 60;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		background: var(--bg-soft);
		border: 1px solid var(--rule);
		color: var(--ink-muted);
		cursor: pointer;
		box-shadow: 0 12px 28px -14px rgb(0 0 0 / 0.65);
		animation: return-in var(--dur-quick) var(--ease-out) both;
		transition:
			color var(--dur-quick) var(--ease-out),
			border-color var(--dur-quick) var(--ease-out);
	}

	@keyframes return-in {
		from {
			opacity: 0;
		}
	}

	.return:hover,
	.return:focus-visible {
		color: var(--accent);
		border-color: color-mix(in oklab, var(--accent) 45%, var(--rule));
	}

	@media print {
		.return {
			display: none;
		}
	}

	/* ---------- The closing line ---------- */
	.closing-note {
		margin: 0 auto 2.6rem;
		max-width: 34rem;
		text-align: center;
		font-family: var(--font-display);
		font-size: clamp(1.25rem, 2vw + 0.4rem, 1.5rem);
		line-height: 1.4;
		color: var(--ink-muted);
		text-wrap: balance;
	}

	@media (prefers-reduced-motion: reduce) {
		.fav:hover :global(img),
		.fav:focus-visible :global(img),
		.lrow-thumb:hover :global(img),
		.lrow-thumb:focus-visible :global(img),
		.cell:hover :global(img),
		.cell:focus-visible :global(img) {
			transform: none;
		}
	}
</style>
