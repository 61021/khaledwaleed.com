<script lang="ts">
	import { onMount } from 'svelte';
	import { Container } from '$lib';
	import Poster from '$lib/components/Poster.svelte';
	import { pb, type FilmRecord } from '$lib/pocketbase';
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
		query = '';
		results = [];
	}

	// --- Search ----------------------------------------------------------
	let query = $state('');
	let results = $state<SearchResult[]>([]);
	let searching = $state(false);
	let searchTimer: ReturnType<typeof setTimeout>;

	function onQuery() {
		clearTimeout(searchTimer);
		const q = query.trim();
		if (!q) {
			results = [];
			return;
		}
		searchTimer = setTimeout(() => runSearch(q), 300);
	}

	async function runSearch(q: string) {
		searching = true;
		try {
			const r = await fetch(`/api/tmdb/search?q=${encodeURIComponent(q)}`);
			results = r.ok ? ((await r.json()).results ?? []) : [];
		} catch {
			results = [];
		} finally {
			searching = false;
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

	function pick(r: SearchResult) {
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
		const m = meta[metaKey(f)];
		editing = f;
		selected = {
			tmdbId: f.tmdbId,
			mediaType: f.type,
			title: m?.title ?? `#${f.tmdbId}`,
			year: m?.year ?? 0,
			posterPath: m?.posterPath ?? null
		};
		rating = f.rating;
		watched = f.watched;
		watchedOn = f.watchedOn?.slice(0, 10) || today();
		notes = f.notes ?? '';
		privateNotes = f.privateNotes ?? '';
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function cancel() {
		selected = null;
		editing = null;
		saveError = '';
	}

	async function save(e: Event) {
		e.preventDefault();
		if (!selected) return;
		saving = true;
		saveError = '';
		const data = {
			tmdbId: selected.tmdbId,
			type: selected.mediaType,
			rating,
			watched,
			watchedOn,
			notes,
			privateNotes
		};
		try {
			if (editing) await pb.collection('films').update(editing.id, data);
			else await pb.collection('films').create(data);
			cancel();
			await loadFilms();
		} catch (err) {
			saveError = (err as Error).message || 'Could not save.';
		} finally {
			saving = false;
		}
	}

	// --- Collection list -------------------------------------------------
	let films = $state<FilmRecord[]>([]);
	let listError = $state('');
	let meta = $state<Record<string, FilmMeta>>({});
	const metaKey = (f: { type: MediaType; tmdbId: number }) => `${f.type}/${f.tmdbId}`;

	async function loadFilms() {
		listError = '';
		try {
			films = await pb.collection('films').getFullList<FilmRecord>({ sort: '-rating,-watchedOn' });
			for (const f of films) {
				const k = metaKey(f);
				if (meta[k]) continue;
				fetch(`/api/tmdb/${f.type}/${f.tmdbId}`)
					.then((r) => (r.ok ? r.json() : null))
					.then((m) => {
						if (m) meta[k] = m as FilmMeta;
					})
					.catch(() => {});
			}
		} catch (err) {
			listError = (err as Error).message || 'Could not load your collection.';
		}
	}

	async function remove(f: FilmRecord) {
		if (!confirm('Remove this title from your collection?')) return;
		try {
			await pb.collection('films').delete(f.id);
			films = films.filter((x) => x.id !== f.id);
		} catch (err) {
			listError = (err as Error).message || 'Could not remove.';
		}
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
								<li>
									<button class="result" type="button" onclick={() => pick(r)}>
										<Poster posterPath={r.posterPath} alt="" width={42} />
										<span class="result-main">
											<span class="result-title">{r.title}</span>
											<span class="muted">{r.year || '—'} · {kind(r.mediaType)}</span>
										</span>
										<span class="result-add">Add</span>
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
							<input class="field" type="number" min="1" max="10" bind:value={rating} required />
						</label>
						<label class="lbl"
							>Times watched
							<input class="field" type="number" min="1" bind:value={watched} />
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
			<ul class="mt-3 divide-y divide-[var(--rule)]">
				{#each films as f (f.id)}
					{@const m = meta[metaKey(f)]}
					<li class="row">
						<Poster posterPath={m?.posterPath ?? null} alt="" width={40} />
						<div class="row-main">
							<div class="result-title">{m?.title ?? `#${f.tmdbId}`}</div>
							<div class="muted">
								{m?.year || ''} · rating {f.rating} · seen {f.watched}× · {f.watchedOn?.slice(
									0,
									10
								)}
							</div>
						</div>
						<div class="row-actions">
							<button class="link-quiet" type="button" onclick={() => edit(f)}>Edit</button>
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
