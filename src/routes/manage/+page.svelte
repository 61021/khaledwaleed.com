<script lang='ts'>
	import type { FilmInput, FilmMetaFields, FilmRecord } from '$lib/pocketbase'
	import type { FilmMeta, MediaType, SearchResult } from '$lib/tmdb'
	import { Container } from '$lib'
	import Poster from '$lib/components/Poster.svelte'
	import { metaToFields, pb } from '$lib/pocketbase'
	import { posterRef, tmdbRef } from '$lib/posters'
	import { onMount } from 'svelte'

	// --- Auth ------------------------------------------------------------
	let authed = $state(false)
	const email = 'master@khaledwaleed.com'
	let password = $state('')
	let authError = $state('')

	onMount(() => {
		authed = pb.authStore.isValid
		if (authed)
			loadFilms()
	})

	async function login(e: Event) {
		e.preventDefault()
		authError = ''
		try {
			await pb.collection('_superusers').authWithPassword(email, password)
			authed = true
			password = ''
			loadFilms()
		}
		catch (err) {
			authError = (err as Error).message || 'Could not sign in.'
		}
	}

	function logout() {
		pb.authStore.clear()
		authed = false
		films = []
		selected = null
		editing = null
		query = ''
		results = []
	}

	/** A 401/403 from PB means the token lapsed; drop back to the gate. */
	function expired(err: unknown): boolean {
		const status = (err as { status?: number }).status
		if (status !== 401 && status !== 403)
			return false
		logout()
		authError = 'Session expired. Sign in again.'
		return true
	}

	// --- Search ----------------------------------------------------------
	let query = $state('')
	// API responses that are only ever reassigned: raw state, no deep proxy.
	let results = $state.raw<SearchResult[]>([])
	let searching = $state(false)
	let searchTimer: ReturnType<typeof setTimeout>
	let searchCtl: AbortController | null = null

	function onQuery() {
		clearTimeout(searchTimer)
		const q = query.trim()
		if (!q) {
			searchCtl?.abort()
			searching = false
			results = []
			return
		}
		searchTimer = setTimeout(runSearch, 300, q)
	}

	async function runSearch(q: string) {
		// Abort the in-flight request so a slow response can never overwrite a
		// newer one (the classic stale-search race).
		searchCtl?.abort()
		const ctl = (searchCtl = new AbortController())
		searching = true
		try {
			const r = await fetch(`/api/tmdb/search?q=${encodeURIComponent(q)}`, { signal: ctl.signal })
			if (ctl !== searchCtl)
				return
			results = r.ok ? ((await r.json()).results ?? []) : []
		}
		catch (err) {
			if ((err as Error).name !== 'AbortError')
				results = []
		}
		finally {
			if (ctl === searchCtl)
				searching = false
		}
	}

	// --- Add / edit form -------------------------------------------------
	let selected = $state<SearchResult | null>(null)
	let editing = $state<FilmRecord | null>(null)
	let rating = $state(8)
	let watched = $state(1)
	let watchedOn = $state(today())
	let notes = $state('')
	let privateNotes = $state('')
	let saving = $state(false)
	let saveError = $state('')

	function today() {
		return new Date().toISOString().slice(0, 10)
	}

	/** The record already holding this search result, if any. */
	const existing = (r: SearchResult): FilmRecord | undefined =>
		films.find(f => f.tmdbId === r.tmdbId && f.type === r.mediaType)

	function pick(r: SearchResult) {
		// Already in the collection? Jump straight to editing that record;
		// saving a duplicate would only bounce off the unique index.
		const dupe = existing(r)
		if (dupe)
			return edit(dupe)
		selected = r
		editing = null
		rating = 8
		watched = 1
		watchedOn = today()
		notes = ''
		privateNotes = ''
		results = []
		query = ''
	}

	function edit(f: FilmRecord) {
		editing = f
		selected = {
			tmdbId: f.tmdbId,
			mediaType: f.type,
			title: f.title || `#${f.tmdbId}`,
			year: f.year ?? 0,
			posterPath: f.posterPath || null,
		}
		rating = f.rating
		watched = f.watched
		watchedOn = f.watchedOn?.slice(0, 10) || today()
		notes = f.notes ?? ''
		privateNotes = f.privateNotes ?? ''
		results = []
		query = ''
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	function cancel() {
		selected = null
		editing = null
		saveError = ''
	}

	/** Fetch the TMDB snapshot for one title; null when TMDB is unreachable. */
	async function fetchMeta(type: MediaType, tmdbId: number): Promise<FilmMeta | null> {
		try {
			const r = await fetch(`/api/tmdb/${type}/${tmdbId}`)
			return r.ok ? ((await r.json()) as FilmMeta) : null
		}
		catch {
			return null
		}
	}

	/**
	 * Copy the TMDB image onto the record's own `poster` file (via our proxy,
	 * which also dodges locally blocked image.tmdb.org). Quietly returns null
	 * on failure: the record is fine, and the poster banner catches it later.
	 */
	async function ensurePoster(id: string, posterPath: string | null | undefined): Promise<FilmRecord | null> {
		if (!posterPath)
			return null
		try {
			const r = await fetch(`/api/tmdb/poster/w780${posterPath}`)
			if (!r.ok)
				return null
			const form = new FormData()
			form.append('poster', await r.blob(), posterPath.slice(1))
			return await pb.collection('films').update<FilmRecord>(id, form)
		}
		catch (err) {
			expired(err)
			return null
		}
	}

	async function save(e: Event) {
		e.preventDefault()
		if (!selected)
			return
		saving = true
		saveError = ''
		// Denormalize the TMDB snapshot into the record, so the public page
		// renders everything from PocketBase in one request.
		const m = await fetchMeta(selected.mediaType, selected.tmdbId)
		const snapshot: Partial<FilmMetaFields> = m
			? metaToFields(m)
			: editing
			? {} // TMDB is down; keep the stored snapshot rather than degrade it
			: {
				// TMDB is down: keep the essentials from the search pick;
						// the refresh button can fill in directors/genres later.
				title: selected.title,
				year: selected.year,
				format: selected.mediaType === 'tv' ? 'TV Series' : 'Movie',
				runtime: 0,
				genres: [],
				directors: [],
				posterPath: selected.posterPath ?? '',
			}
		const data: FilmInput = {
			tmdbId: selected.tmdbId,
			type: selected.mediaType,
			rating,
			watched,
			watchedOn,
			notes,
			privateNotes,
			...snapshot,
		}
		try {
			const rec = editing
				? await pb.collection('films').update<FilmRecord>(editing.id, data)
				: await pb.collection('films').create<FilmRecord>(data)
			// The image becomes ours at save time; skip only when the stored
			// file already matches this TMDB poster.
			if (data.posterPath && (!rec.poster || data.posterPath !== editing?.posterPath))
				await ensurePoster(rec.id, data.posterPath)
			cancel()
			await loadFilms()
		}
		catch (err) {
			if (!expired(err))
				saveError = (err as Error).message || 'Could not save.'
		}
		finally {
			saving = false
		}
	}

	// --- Collection list -------------------------------------------------
	// Reassigned wholesale on every change (see refreshMeta), so raw state
	// skips proxying a few hundred records.
	let films = $state.raw<FilmRecord[]>([])
	let listError = $state('')

	async function loadFilms() {
		listError = ''
		try {
			films = await pb.collection('films').getFullList<FilmRecord>({ sort: '-rating,-watchedOn' })
		}
		catch (err) {
			if (!expired(err))
				listError = (err as Error).message || 'Could not load your collection.'
		}
	}

	async function remove(f: FilmRecord) {
		// eslint-disable-next-line no-alert
		if (!confirm('Remove this title from your collection?'))
			return
		try {
			await pb.collection('films').delete(f.id)
			films = films.filter(x => x.id !== f.id)
		}
		catch (err) {
			if (!expired(err))
				listError = (err as Error).message || 'Could not remove.'
		}
	}

	// --- TMDB snapshot sync ----------------------------------------------
	// Records saved before snapshots existed (or while TMDB was down) have no
	// title; fill them in with a small worker pool.
	const missing = $derived(films.filter(f => !f.title))
	let syncing = $state(false)
	let syncDone = $state(0)
	let syncTotal = $state(0)

	async function syncMissing() {
		const targets = [...missing]
		syncing = true
		syncTotal = targets.length
		syncDone = 0
		let next = 0
		async function worker() {
			while (next < targets.length && pb.authStore.isValid) {
				const f = targets[next++]
				const m = await fetchMeta(f.type, f.tmdbId)
				if (m) {
					try {
						await pb.collection('films').update(f.id, metaToFields(m))
					}
					catch (err) {
						expired(err)
					}
				}
				syncDone++
			}
		}
		await Promise.all(Array.from({ length: 6 }, worker))
		syncing = false
		if (pb.authStore.isValid)
			await loadFilms()
	}

	// --- Poster files ------------------------------------------------------
	// Records whose image still lives only on TMDB: added before posters were
	// stored here, or saved while the image fetch failed.
	const missingPosters = $derived(films.filter(f => f.posterPath && !f.poster))
	let postering = $state(false)
	let posterDone = $state(0)
	let posterTotal = $state(0)

	async function storeMissingPosters() {
		const targets = [...missingPosters]
		postering = true
		posterTotal = targets.length
		posterDone = 0
		let next = 0
		async function worker() {
			while (next < targets.length && pb.authStore.isValid) {
				const f = targets[next++]
				await ensurePoster(f.id, f.posterPath)
				posterDone++
			}
		}
		await Promise.all(Array.from({ length: 4 }, worker))
		postering = false
		if (pb.authStore.isValid)
			await loadFilms()
	}

	// Re-fetch one title's snapshot (poster swaps, corrected credits, …).
	let refreshingId = $state<string | null>(null)
	async function refreshMeta(f: FilmRecord) {
		refreshingId = f.id
		listError = ''
		const m = await fetchMeta(f.type, f.tmdbId)
		if (m) {
			const fields = metaToFields(m)
			try {
				await pb.collection('films').update(f.id, fields)
				// A swapped TMDB poster (or a record still missing its file)
				// gets re-stored so the site keeps serving our own copy.
				const stored
					= fields.posterPath && (fields.posterPath !== f.posterPath || !f.poster)
						? await ensurePoster(f.id, fields.posterPath)
						: null
				films = films.map(x =>
					x.id === f.id ? { ...x, ...fields, ...(stored ? { poster: stored.poster } : {}) } : x,
				)
			}
			catch (err) {
				if (!expired(err))
					listError = (err as Error).message || 'Could not refresh.'
			}
		}
		else {
			listError = 'TMDB is unreachable. Try again shortly.'
		}
		refreshingId = null
	}

	const kind = (t: MediaType) => (t === 'tv' ? 'TV' : 'Film')
</script>

<svelte:head>
	<title>Manage · Khaled Waleed</title>
	<meta name='robots' content='noindex, nofollow' />
</svelte:head>

<Container size='prose'>
	{#if !authed}
		<section class='signin'>
			<h1 class='m-title'>Manage</h1>
			<p class='muted mt-2'>Enter the password to enter the secret management area.</p>
			<form class='mt-6 flex flex-col gap-3' onsubmit={login}>
				<input
					class='field'
					type='password'
					placeholder='Password'
					bind:value={password}
					autocomplete='current-password'
					required
				/>
				{#if authError}<p class='err'>{authError}</p>{/if}
				<button class='btn' type='submit'>Sign in</button>
			</form>
		</section>
	{:else}
		<section class='mt-4'>
			<div class='flex items-baseline justify-between gap-4'>
				<h1 class='m-title'>Manage · Films</h1>
				<button class='link-quiet' type='button' onclick={logout}>Sign out</button>
			</div>

			{#if !selected}
				<!-- Search to add -->
				<div class='mt-4'>
					<input
						class='field w-full'
						type='search'
						placeholder='Search a film or show to add…'
						bind:value={query}
						oninput={onQuery}
					/>
					{#if searching}<p class='muted mt-3'>Searching…</p>{/if}
					{#if results.length}
						<ul class='results mt-3'>
							{#each results as r (r.mediaType + r.tmdbId)}
								{@const dupe = existing(r)}
								<li>
									<button class='result' type='button' onclick={() => pick(r)}>
										<Poster poster={tmdbRef(r.posterPath)} alt="" width={42} />
										<span class='result-main'>
											<span class='result-title'>{r.title}</span>
											<span class='muted'>{r.year || '?'} · {kind(r.mediaType)}</span>
										</span>
										<span class={['result-add', dupe && 'always']}
										>{dupe ? 'In collection · Edit' : 'Add'}</span
										>
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			{:else}
				<!-- Add / edit details -->
				<form class='card mt-8' onsubmit={save}>
					<div class='flex gap-4'>
						<Poster
							poster={(editing && posterRef(editing)) || tmdbRef(selected.posterPath)}
							alt=""
							width={66}
							vivid
						/>
						<div class='min-w-0'>
							<div class='result-title'>{selected.title}</div>
							<div class='muted'>{selected.year || '?'} · {kind(selected.mediaType)}</div>
							<div class='muted mt-1 text-xs'>{editing ? 'Editing' : 'Adding'}</div>
						</div>
					</div>

					<div class='mt-5 grid gap-4 sm:grid-cols-3'>
						<label class='lbl'
						>Rating
							<input
								class='field'
								type='number'
								min='1'
								max='10'
								step='1'
								bind:value={rating}
								required
							/>
						</label>
						<label class='lbl'
						>Times watched
							<input class='field' type='number' min='1' step='1' bind:value={watched} />
						</label>
						<label class='lbl'
						>Watched on
							<input class='field' type='date' bind:value={watchedOn} />
						</label>
					</div>

					<label class='lbl mt-4'
					>Note <span class='muted'>(public)</span>
						<textarea class='field' rows='2' bind:value={notes}></textarea>
					</label>
					<label class='lbl mt-4'
					>Private note <span class='muted'>(hidden on the site)</span>
						<textarea class='field' rows='2' bind:value={privateNotes}></textarea>
					</label>

					{#if saveError}<p class='err mt-3'>{saveError}</p>{/if}
					<div class='mt-5 flex items-center gap-4'>
						<button class='btn' type='submit' disabled={saving}>
							{saving ? 'Saving…' : editing ? 'Save changes' : 'Add to collection'}
						</button>
						<button class='link-quiet' type='button' onclick={cancel}>Cancel</button>
					</div>
				</form>
			{/if}

			<!-- The collection -->
			<h2 class='m-sub mt-4'>In your collection · {films.length}</h2>
			{#if listError}<p class='err mt-2'>{listError}</p>{/if}
			{#if syncing || missing.length}
				<div class='banner mt-3'>
					{#if syncing}
						<span class='muted'>Syncing TMDB snapshots… {syncDone}/{syncTotal}</span>
					{:else}
						<span class='muted'
						>{missing.length} title{missing.length === 1 ? ' is' : 's are'} missing the TMDB snapshot.</span
						>
						<button class='btn-sm' type='button' onclick={syncMissing}>Sync now</button>
					{/if}
				</div>
			{/if}
			{#if postering || missingPosters.length}
				<div class='banner mt-3'>
					{#if postering}
						<span class='muted'>Storing posters… {posterDone}/{posterTotal}</span>
					{:else}
						<span class='muted'
						>{missingPosters.length} poster{missingPosters.length === 1 ? ' is' : 's are'} not stored here yet.</span
						>
						<button class='btn-sm' type='button' onclick={storeMissingPosters}>Store now</button>
					{/if}
				</div>
			{/if}
			<ul class='mt-3 divide-y divide-[var(--rule)]'>
				{#each films as f (f.id)}
					<li class='row'>
						<Poster poster={posterRef(f) ?? tmdbRef(f.posterPath)} alt="" width={40} />
						<div class='row-main'>
							<div class='result-title'>{f.title || `#${f.tmdbId}`}</div>
							<div class='muted'>
								{f.year ? `${f.year} · ` : ''}rating {f.rating} · seen {f.watched}× · {f.watchedOn?.slice(
									0,
									10,
								)}
							</div>
						</div>
						<div class='row-actions'>
							<button class='link-quiet' type='button' onclick={() => edit(f)}>Edit</button>
							<button
								class='link-quiet icon-btn'
								type='button'
								onclick={() => refreshMeta(f)}
								disabled={refreshingId === f.id}
								title='Re-fetch TMDB metadata'
								aria-label='Refresh metadata'
							>{#if refreshingId === f.id}…{:else}<svg
								xmlns='http://www.w3.org/2000/svg'
								width='14'
								height='14'
								viewBox='0 0 256 256'
								aria-hidden='true'
							><!-- Icon from Phosphor by Phosphor Icons - https://github.com/phosphor-icons/core/blob/main/LICENSE --><path
								fill='currentColor'
								d='M224 48v48a8 8 0 0 1-8 8h-48a8 8 0 0 1 0-16h28.69l-14.63-14.63a79.56 79.56 0 0 0-56.13-23.43h-.45a79.52 79.52 0 0 0-55.89 22.77a8 8 0 0 1-11.18-11.44a96 96 0 0 1 135 .79L208 76.69V48a8 8 0 0 1 16 0m-37.59 135.29a80 80 0 0 1-112.47-.66L59.31 168H88a8 8 0 0 0 0-16H40a8 8 0 0 0-8 8v48a8 8 0 0 0 16 0v-28.69l14.63 14.63A95.43 95.43 0 0 0 130 222.06h.53a95.36 95.36 0 0 0 67.07-27.33a8 8 0 0 0-11.18-11.44Z'
							/></svg
							>{/if}</button
							>
							<button
								class='del icon-btn'
								type='button'
								onclick={() => remove(f)}
								aria-label='Remove'
							><svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 256 256' aria-hidden='true'
							><!-- Icon from Phosphor by Phosphor Icons - https://github.com/phosphor-icons/core/blob/main/LICENSE --><path
								fill='currentColor'
								d='M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z'
							/></svg
							></button
							>
						</div>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</Container>

<style>
	.signin {
		max-width: 22rem;
		margin: 4rem auto 0;
	}

	.m-title {
		font-family: var(--font-display);
		font-weight: 400;
		font-size: clamp(1.9rem, 4vw + 1rem, 2.6rem);
		color: var(--ink);
		margin: 0;
	}

	.m-sub {
		font-family: var(--font-display);
		font-size: 1.4rem;
		color: var(--ink);
	}

	.muted {
		color: var(--ink-muted);
		font-size: 0.9rem;
	}

	.err {
		color: color-mix(in oklab, #e0556b 78%, var(--ink));
		font-size: 0.9rem;
	}

	.field {
		width: 100%;
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--rule);
		border-radius: 0.6rem;
		background: var(--bg-soft);
		color: var(--ink);
		font-family: var(--font-body);
		font-size: 1rem;
		transition: border-color var(--dur-quick) var(--ease-out);
	}
	.field:focus {
		outline: none;
		border-color: var(--accent);
	}

	.lbl {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-family: var(--font-body);
		font-size: 0.78rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		font-weight: 600;
		color: var(--ink-muted);
	}

	.btn {
		align-self: flex-start;
		padding: 0.6rem 1.4rem;
		border-radius: 0.7rem;
		background: var(--accent);
		color: var(--bg);
		font-family: var(--font-body);
		font-weight: 600;
		letter-spacing: 0.02em;
		cursor: pointer;
		transition: opacity var(--dur-quick) var(--ease-out);
	}
	.btn:hover {
		opacity: 0.9;
	}
	.btn:disabled {
		opacity: 0.55;
		cursor: default;
	}

	.card {
		padding: 1.25rem;
		border: 1px solid var(--rule);
		border-radius: 1rem;
		background: var(--bg-soft);
	}

	.results {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.result {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		width: 100%;
		padding: 0.5rem;
		border-radius: 0.7rem;
		text-align: left;
		cursor: pointer;
		transition: background-color var(--dur-quick) var(--ease-out);
	}
	.result:hover {
		background: var(--bg-soft);
	}
	.result-main {
		display: flex;
		min-width: 0;
		flex: 1;
		flex-direction: column;
	}
	.result-title {
		font-family: var(--font-display);
		font-size: 1.1rem;
		color: var(--ink);
		line-height: 1.2;
	}
	.result-add {
		font-family: var(--font-body);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
		opacity: 0;
		transition: opacity var(--dur-quick) var(--ease-out);
	}
	.result:hover .result-add {
		opacity: 1;
	}
	/* Titles already in the collection announce it before hover. */
	.result-add.always {
		opacity: 1;
		color: var(--ink-muted);
	}
	.result:hover .result-add.always {
		color: var(--accent);
	}

	.banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.7rem 1rem;
		border: 1px solid color-mix(in oklab, var(--accent) 32%, var(--rule));
		border-radius: 0.7rem;
		background: color-mix(in oklab, var(--accent) 7%, var(--bg-soft));
	}

	.btn-sm {
		flex-shrink: 0;
		padding: 0.4rem 0.9rem;
		border-radius: 0.6rem;
		background: var(--accent);
		color: var(--bg);
		font-family: var(--font-body);
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		cursor: pointer;
		transition: opacity var(--dur-quick) var(--ease-out);
	}
	.btn-sm:hover {
		opacity: 0.9;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		padding: 0.7rem 0.25rem;
	}
	.row-main {
		min-width: 0;
		flex: 1;
	}
	.row-actions {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		flex-shrink: 0;
	}
	.icon-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
	}

	.del {
		color: var(--ink-dim);
		cursor: pointer;
		transition: color var(--dur-quick) var(--ease-out);
	}
	.del:hover {
		color: color-mix(in oklab, #e0556b 78%, var(--ink));
	}
</style>
