<script lang="ts">
	import { Seo, Container, PageHeader, Fleuron } from '$lib';

	let { data } = $props();

	const rangeLabel: Record<string, string> = {
		short: 'over the last four weeks',
		medium: 'over the last six months',
		long: 'over the years'
	};

	const ranges = [
		{ key: 'short', label: '4 weeks' },
		{ key: 'medium', label: '6 months' },
		{ key: 'long', label: 'all time' }
	];

	// A quiet relative timestamp for the "last spins" list.
	function ago(iso: string): string {
		const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
		if (mins < 2) return 'just now';
		if (mins < 60) return `${mins} min ago`;
		const hours = Math.round(mins / 60);
		if (hours < 24) return `${hours} h ago`;
		const days = Math.round(hours / 24);
		return days === 1 ? 'yesterday' : `${days} days ago`;
	}
</script>

<Seo
	title="Music"
	description="What Khaled Waleed has been listening to: top tracks and artists, pulled live from Spotify."
/>

<svelte:head>
	<link rel="preconnect" href="https://i.scdn.co" />
</svelte:head>

<PageHeader room="music" title="Music">
	{#snippet lede()}
		<p>What I’ve been listening to: top tracks and artists, live from Spotify.</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	{#if !data.ok}
		<Fleuron />
		<p class="rise text-center italic text-[var(--ink-muted)]">
			Spotify is not answering right now. Check back soon.
		</p>
	{:else}
		<!-- Time-range switcher (server-rendered; each is a plain link) -->
		<div class="rise mt-8 flex justify-center">
			<div class="line" role="group" aria-label="Time range">
				{#each ranges as r, i (r.key)}
					{#if i}<span class="vsep" aria-hidden="true"></span>{/if}
					<a
						href={`?range=${r.key}`}
						class="line-opt"
						class:on={data.range === r.key}
						aria-current={data.range === r.key ? 'page' : undefined}
						data-sveltekit-noscroll
					>
						{r.label}
					</a>
				{/each}
			</div>
		</div>

		<p class="mt-4 text-center smallcaps">{rangeLabel[data.range] ?? ''}</p>

		<Fleuron />

		<!-- Top tracks -->
		{#if data.tracks.length}
			<section class="rise">
				<h2>On repeat</h2>
				<ol class="mt-4 divide-y divide-[var(--rule)]">
					{#each data.tracks as t, i (t.url)}
						<li class="group flex items-center gap-4 py-3">
							<span class="w-5 shrink-0 text-right smallcaps tabular-nums">{i + 1}</span>
							{#if t.image}
								<img src={t.image} alt="" width="48" height="48" class="art" loading="lazy" />
							{/if}
							<a href={t.url} target="_blank" rel="noopener noreferrer" class="min-w-0 flex-1">
								<div
									class="truncate text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]"
									style="font-family: var(--font-display); font-size: 1.15rem; line-height: 1.2;"
								>
									{t.name}
								</div>
								<div class="truncate text-sm text-[var(--ink-muted)]">{t.artists}</div>
							</a>
						</li>
					{/each}
				</ol>
			</section>
		{/if}

		<!-- Top artists -->
		{#if data.artists.length}
			<Fleuron />

			<section class="rise">
				<h2>In heavy rotation</h2>
				<ul class="mt-6 grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-4">
					{#each data.artists as a (a.url)}
						<li>
							<a
								href={a.url}
								target="_blank"
								rel="noopener noreferrer"
								class="group block text-center"
							>
								{#if a.image}
									<img
										src={a.image}
										alt=""
										width="160"
										height="160"
										class="artist-art"
										loading="lazy"
									/>
								{/if}
								<div
									class="mt-3 truncate text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]"
									style="font-family: var(--font-display); font-size: 1.05rem;"
								>
									{a.name}
								</div>
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		<!-- Recently played -->
		{#if data.recent.length}
			<Fleuron />

			<section class="rise">
				<h2>Last spins</h2>
				<ol class="mt-4 divide-y divide-[var(--rule)]">
					{#each data.recent as t, i (`${t.url}-${t.playedAt}-${i}`)}
						<li class="group flex items-center gap-4 py-2.5">
							{#if t.image}
								<img src={t.image} alt="" width="36" height="36" class="art" loading="lazy" />
							{/if}
							<a href={t.url} target="_blank" rel="noopener noreferrer" class="min-w-0 flex-1">
								<span class="flex items-baseline justify-between gap-4">
									<span
										class="truncate text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]"
										style="font-family: var(--font-display); font-size: 1.05rem;"
									>
										{t.name}
									</span>
									<time datetime={t.playedAt} class="shrink-0 smallcaps tabular-nums"
										>{ago(t.playedAt)}</time
									>
								</span>
								<span class="block truncate text-sm text-[var(--ink-muted)]">{t.artists}</span>
							</a>
						</li>
					{/each}
				</ol>
			</section>
		{/if}
	{/if}

	<Fleuron />

	<div class="rise text-center smallcaps">
		<a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer" class="link-quiet">
			listening data via Spotify
		</a>
	</div>
</Container>

<style>
	.art {
		display: block;
		object-fit: cover;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
		outline: 1px solid oklch(1 0 0 / 0.1);
		outline-offset: -1px;
		filter: saturate(0.85) brightness(0.95);
		transition: filter 400ms ease;
	}

	.group:hover .art {
		filter: none;
	}

	.artist-art {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 1;
		border-radius: 9999px;
		object-fit: cover;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
		outline: 1px solid oklch(1 0 0 / 0.1);
		outline-offset: -1px;
		filter: saturate(0.85) brightness(0.95);
		transition:
			filter 400ms ease,
			transform 400ms ease;
	}

	.group:hover .artist-art {
		filter: none;
		transform: translateY(-3px);
	}

	/* The range switcher speaks the same underline language as the films
	   filters — one control voice across the log rooms. */
	.line {
		display: flex;
		align-items: center;
		gap: 0.9rem;
	}

	.line-opt {
		position: relative;
		padding: 0.5rem 0;
		border-bottom: 1px solid transparent;
		font-family: var(--font-body);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-muted);
		white-space: nowrap;
		transition:
			color 250ms ease,
			border-color 250ms ease;
	}

	/* Small type, full-size target. */
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

	.vsep {
		flex: none;
		width: 1px;
		height: 0.85em;
		background: var(--rule);
	}

	@media (prefers-reduced-motion: reduce) {
		.group:hover .artist-art {
			transform: none;
		}
	}
</style>
