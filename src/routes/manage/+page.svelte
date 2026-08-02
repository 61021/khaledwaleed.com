<script lang="ts">
	import { onMount } from 'svelte';
	import { Container } from '$lib';
	import Poster from '$lib/components/Poster.svelte';
	import {
		metaToFields,
		pb,
		type FilmInput,
		type FilmMetaFields,
		type FilmRecord
	} from '$lib/pocketbase';
	import type { FilmMeta, MediaType, SearchResult } from '$lib/tmdb';

	// --- Auth ------------------------------------------------------------
	let authed = $state(false);
	let email = $state('master@khaledwaleed.com');
	let password = $state('');
	let authError = $state('');

	onMount(() => {
		authed = pb.authStore.isValid;
		if (authed) loadFilms();
	});

	async function login(e: Event) {
		e.preventDefault();
		authError = '';
		try {
			await pb.collection('_superusers').authWithPassword(email, password);
			authed = true;
			password = '';
			loadFilms();
		} catch (err) {
			authError = (err as Error).message || 'Could not sign in.';
		}
	}

	function logout() {
		pb.authStore.clear();
		authed = false;
		films = [];
		selected = null;
		editing = null;
		query = '';
		results = [];
	}

	/** A 401/403 from PB means the token lapsed — drop back to the gate. */
	function expired(err: unknown): boolean {
		const status = (err as { status?: number }).status;
		if (status !== 401 && status !== 403) return false;
		logout();
		authError = 'Session expired — sign in again.';
		return true;
	}

	// --- Search ----------------------------------------------------------
	let query = $state('');
	let results = $state<SearchResult[]>([]);
	let searching = $state(false);
	let searchTimer: ReturnType<typeof setTimeout>;
	let searchCtl: AbortController | null = null;

	function onQuery() {
		clearTimeout(searchTimer);
		const q = query.trim();
		if (!q) {
			searchCtl?.abort();
			searching = false;
			results = [];
			return;
		}
		searchTimer = setTimeout(() => runSearch(q), 300);
	}

	async function runSearch(q: string) {
		// Abort the in-flight request so a slow response can never overwrite a
		// newer one (the classic stale-search race).
		searchCtl?.abort();
		const ctl = (searchCtl = new AbortController());
		searching = true;
		try {
			const r = await fetch(`/api/tmdb/search?q=${encodeURIComponent(q)}`, { signal: ctl.signal });
			if (ctl !== searchCtl) return;
			results = r.ok ? ((await r.json()).results ?? []) : [];
		} catch (err) {
			if ((err as Error).name !== 'AbortError') results = [];
		} finally {
			if (ctl === searchCtl) searching = false;
		}
	}

	// --- Add / edit form -------------------------------------------------
	let selected = $state<SearchResult | null>(null);
	let editing = $state<FilmRecord | null>(null);
	let rating = $state(8);
	let watched = $state(1);
	let watchedOn = $state(today());
	let notes = $state('');
	let privateNotes = $state('');
	let saving = $state(false);
	let saveError = $state('');

	function today() {
		return new Date().toISOString().slice(0, 10);
	}

	/** The record already holding this search result, if any. */
	const existing = (r: SearchResult): FilmRecord | undefined =>
		films.find((f) => f.tmdbId === r.tmdbId && f.type === r.mediaType);

	function pick(r: SearchResult) {
		// Already in the collection? Jump straight to editing that record —
		// saving a duplicate would only bounce off the unique index.
		const dupe = existing(r);
		if (dupe) return edit(dupe);
		selected = r;
		editing = null;
		rating = 8;
		watched = 1;
		watchedOn = today();
		notes = '';
		privateNotes = '';
		results = [];
		query = '';
	}

	function edit(f: FilmRecord) {
		editing = f;
		selected = {
			tmdbId: f.tmdbId,
			mediaType: f.type,
			title: f.title || `#${f.tmdbId}`,
			year: f.year ?? 0,
			posterPath: f.posterPath || null
		};
		rating = f.rating;
		watched = f.watched;
		watchedOn = f.watchedOn?.slice(0, 10) || today();
		notes = f.notes ?? '';
		privateNotes = f.privateNotes ?? '';
		results = [];
		query = '';
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function cancel() {
		selected = null;
		editing = null;
		saveError = '';
	}

	/** Fetch the TMDB snapshot for one title; null when TMDB is unreachable. */
	async function fetchMeta(type: MediaType, tmdbId: number): Promise<FilmMeta | null> {
		try {
			const r = await fetch(`/api/tmdb/${type}/${tmdbId}`);
			return r.ok ? ((await r.json()) as FilmMeta) : null;
		} catch {
			return null;
		}
	}

	async function save(e: Event) {
		e.preventDefault();
		if (!selected) return;
		saving = true;
		saveError = '';
		// Denormalize the TMDB snapshot into the record, so the public page
		// renders everything from PocketBase in one request.
		const m = await fetchMeta(selected.mediaType, selected.tmdbId);
		const snapshot: Partial<FilmMetaFields> = m
			? metaToFields(m)
			: editing
				? {} // TMDB is down — keep the stored snapshot rather than degrade it
				: {
						// TMDB is down — keep the essentials from the search pick;
						// the ↻ refresh can fill in directors/genres later.
						title: selected.title,
						year: selected.year,
						format: selected.mediaType === 'tv' ? 'TV Series' : 'Movie',
						runtime: 0,
						genres: [],
						directors: [],
						posterPath: selected.posterPath ?? ''
					};
		const data: FilmInput = {
			tmdbId: selected.tmdbId,
			type: selected.mediaType,
			rating,
			watched,
			watchedOn,
			notes,
			privateNotes,
			...snapshot
		};
		try {
			if (editing) await pb.collection('films').update(editing.id, data);
			else await pb.collection('films').create(data);
			cancel();
			await loadFilms();
		} catch (err) {
			if (!expired(err)) saveError = (err as Error).message || 'Could not save.';
		} finally {
			saving = false;
		}
	}

	// --- Collection list -------------------------------------------------
	let films = $state<FilmRecord[]>([]);
	let listError = $state('');

	async function loadFilms() {
		listError = '';
		try {
			films = await pb.collection('films').getFullList<FilmRecord>({ sort: '-rating,-watchedOn' });
		} catch (err) {
			if (!expired(err)) listError = (err as Error).message || 'Could not load your collection.';
		}
	}

	async function remove(f: FilmRecord) {
		if (!confirm('Remove this title from your collection?')) return;
		try {
			await pb.collection('films').delete(f.id);
			films = films.filter((x) => x.id !== f.id);
		} catch (err) {
			if (!expired(err)) listError = (err as Error).message || 'Could not remove.';
		}
	}

	// --- TMDB snapshot sync ----------------------------------------------
	// Records saved before snapshots existed (or while TMDB was down) have no
	// title; fill them in with a small worker pool.
	const missing = $derived(films.filter((f) => !f.title));
	let syncing = $state(false);
	let syncDone = $state(0);
	let syncTotal = $state(0);

	async function syncMissing() {
		const targets = [...missing];
		syncing = true;
		syncTotal = targets.length;
		syncDone = 0;
		let next = 0;
		async function worker() {
			while (next < targets.length && pb.authStore.isValid) {
				const f = targets[next++];
				const m = await fetchMeta(f.type, f.tmdbId);
				if (m) {
					try {
						await pb.collection('films').update(f.id, metaToFields(m));
					} catch (err) {
						expired(err);
					}
				}
				syncDone++;
			}
		}
		await Promise.all(Array.from({ length: 6 }, worker));
		syncing = false;
		if (pb.authStore.isValid) await loadFilms();
	}

	// Re-fetch one title's snapshot (poster swaps, corrected credits, …).
	let refreshingId = $state<string | null>(null);
	async function refreshMeta(f: FilmRecord) {
		refreshingId = f.id;
		listError = '';
		const m = await fetchMeta(f.type, f.tmdbId);
		if (m) {
			try {
				await pb.collection('films').update(f.id, metaToFields(m));
				const i = films.findIndex((x) => x.id === f.id);
				if (i !== -1) films[i] = { ...films[i], ...metaToFields(m) };
			} catch (err) {
				if (!expired(err)) listError = (err as Error).message || 'Could not refresh.';
			}
		} else {
			listError = 'TMDB is unreachable — try again shortly.';
		}
		refreshingId = null;
	}

	const kind = (t: MediaType) => (t === 'tv' ? 'TV' : 'Film');
</script>

<svelte:head>
	<title>Manage · Khaled Waleed</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<Container size="prose">
	{#if !authed}
		<section class="signin">
			<h1 class="m-title">Manage</h1>
			<p class="muted mt-2">Enter the password to enter the secret management area.</p>
			<form class="mt-6 flex flex-col gap-3" onsubmit={login}>
				<input
					class="field"
					type="password"
					placeholder="Password"
					bind:value={password}
					autocomplete="current-password"
					required
				/>
				{#if authError}<p class="err">{authError}</p>{/if}
				<button class="btn" type="submit">Sign in</button>
			</form>
		</section>
	{:else}
		<section class="mt-4">
			<div class="flex items-baseline justify-between gap-4">
				<h1 class="m-title">Manage · Films</h1>
				<button class="link-quiet" type="button" onclick={logout}>Sign out</button>
			</div>

			{#if !selected}
				<!-- Search to add -->
				<div class="mt-4">
					<input
						class="field w-full"
						type="search"
						placeholder="Search a film or show to add…"
						bind:value={query}
						oninput={onQuery}
					/>
					{#if searching}<p class="muted mt-3">Searching…</p>{/if}
					{#if results.length}
						<ul class="results mt-3">
							{#each results as r (r.mediaType + r.tmdbId)}
								{@const dupe = existing(r)}
								<li>
									<button class="result" type="button" onclick={() => pick(r)}>
										<Poster posterPath={r.posterPath} alt="" width={42} />
										<span class="result-main">
											<span class="result-title">{r.title}</span>
											<span class="muted">{r.year || '—'} · {kind(r.mediaType)}</span>
										</span>
										<span class="result-add" class:always={dupe}
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
				<form class="card mt-8" onsubmit={save}>
					<div class="flex gap-4">
						<Poster posterPath={selected.posterPath} alt="" width={66} vivid />
						<div class="min-w-0">
							<div class="result-title">{selected.title}</div>
							<div class="muted">{selected.year || '—'} · {kind(selected.mediaType)}</div>
							<div class="muted mt-1 text-xs">{editing ? 'Editing' : 'Adding'}</div>
						</div>
					</div>

					<div class="mt-5 grid gap-4 sm:grid-cols-3">
						<label class="lbl"
							>Rating
							<input
								class="field"
								type="number"
								min="1"
								max="10"
								step="1"
								bind:value={rating}
								required
							/>
						</label>
						<label class="lbl"
							>Times watched
							<input class="field" type="number" min="1" step="1" bind:value={watched} />
						</label>
						<label class="lbl"
							>Watched on
							<input class="field" type="date" bind:value={watchedOn} />
						</label>
					</div>

					<label class="lbl mt-4"
						>Note <span class="muted">(public)</span>
						<textarea class="field" rows="2" bind:value={notes}></textarea>
					</label>
					<label class="lbl mt-4"
						>Private note <span class="muted">(hidden on the site)</span>
						<textarea class="field" rows="2" bind:value={privateNotes}></textarea>
					</label>

					{#if saveError}<p class="err mt-3">{saveError}</p>{/if}
					<div class="mt-5 flex items-center gap-4">
						<button class="btn" type="submit" disabled={saving}>
							{saving ? 'Saving…' : editing ? 'Save changes' : 'Add to collection'}
						</button>
						<button class="link-quiet" type="button" onclick={cancel}>Cancel</button>
					</div>
				</form>
			{/if}

			<!-- The collection -->
			<h2 class="m-sub mt-4">In your collection · {films.length}</h2>
			{#if listError}<p class="err mt-2">{listError}</p>{/if}
			{#if syncing || missing.length}
				<div class="banner mt-3">
					{#if syncing}
						<span class="muted">Syncing TMDB snapshots… {syncDone}/{syncTotal}</span>
					{:else}
						<span class="muted"
							>{missing.length} title{missing.length === 1 ? ' is' : 's are'} missing the TMDB snapshot.</span
						>
						<button class="btn-sm" type="button" onclick={syncMissing}>Sync now</button>
					{/if}
				</div>
			{/if}
			<ul class="mt-3 divide-y 097 divide-[var(--rule)]">
				{#each films as f (f.id)}
					<li class="row">
						<Poster posterPath={f.posterPath || null} alt="" width={40} />
						<div class="row-main">
							<div class="result-title">{f.title || `#${f.tmdbId}`}</div>
							<div class="muted">
								{f.year ? `${f.year} · ` : ''}rating {f.rating} · seen {f.watched}× · {f.watchedOn?.slice(
									0,
									10
								)}
							</div>
						</div>
						<div class="row-actions">
							<button class="link-quiet" type="button" onclick={() => edit(f)}>Edit</button>
							<button
								class="link-quiet"
								type="button"
								onclick={() => refreshMeta(f)}
								disabled={refreshingId === f.id}
								title="Re-fetch TMDB metadata"
								aria-label="Refresh metadata">{refreshingId === f.id ? '…' : '↻'}</button
							>
							<button class="del" type="button" onclick={() => remove(f)} aria-label="Remove"
								>✕</button
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
		font-style: italic;
		font-weight: 400;
		font-size: clamp(1.9rem, 4vw + 1rem, 2.6rem);
		color: var(--ink);
		margin: 0;
	}

	.m-sub {
		font-family: var(--font-display);
		font-style: italic;
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
		transition: border-color 200ms ease;
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
		transition: opacity 200ms ease;
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
		transition: background-color 200ms ease;
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
		font-style: italic;
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
		transition: opacity 200ms ease;
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
		transition: opacity 200ms ease;
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
	.del {
		color: var(--ink-dim);
		font-size: 0.95rem;
		cursor: pointer;
		transition: color 200ms ease;
	}
	.del:hover {
		color: color-mix(in oklab, #e0556b 78%, var(--ink));
	}
</style>
