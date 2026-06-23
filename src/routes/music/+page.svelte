<script lang="ts">
	import { Seo, Container, PageHeader, Fleuron } from '$lib';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

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
</script>

<Seo
	title="Music"
	description="What Khaled Waleed has been listening to — top tracks and artists, pulled live from Spotify."
/>

<svelte:head>
	<link rel="preconnect" href="https://i.scdn.co" />
</svelte:head>

<PageHeader room="music" eyebrow="a listening log" title="Music">
	{#snippet lede()}
		<p>What I have actually had on — top tracks and artists, pulled live from Spotify.</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	<div class="rise-3 mt-10">
		<Breadcrumb
			items={[
				{ name: 'Home', href: '/' },
				{ name: 'Music', href: '/music' }
			]}
		/>
	</div>

	{#if !data.ok}
		<Fleuron />
		<p class="rise text-center italic text-[var(--ink-muted)]">
			The turntable is quiet right now — check back soon.
		</p>
	{:else}
		<!-- Time-range switcher (server-rendered; each is a plain link) -->
		<div class="rise mt-6 flex justify-center">
			<div class="seg" role="group" aria-label="Time range">
				{#each ranges as r (r.key)}
					<a
						href={`?range=${r.key}`}
						class="seg-opt"
						class:is-active={data.range === r.key}
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
				<h2 class="italic">On repeat</h2>
				<ol class="mt-4 divide-y divide-[var(--rule)]">
					{#each data.tracks as t, i (t.url)}
						<li class="group flex items-center gap-4 py-3">
							<span class="w-5 shrink-0 text-right smallcaps">{i + 1}</span>
							{#if t.image}
								<img src={t.image} alt="" width="48" height="48" class="art" loading="lazy" />
							{/if}
							<a href={t.url} target="_blank" rel="noopener noreferrer" class="min-w-0 flex-1">
								<div
									class="truncate italic text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]"
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
				<h2 class="italic">In heavy rotation</h2>
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
									class="mt-3 truncate italic text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]"
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
		border-radius: 3px;
		object-fit: cover;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
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
		outline: 1px solid var(--rule);
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

	.seg {
		display: inline-flex;
		gap: 0.25rem;
		padding: 0.3rem;
		border: 1px solid var(--rule);
		border-radius: 9999px;
		background: var(--bg-soft);
	}

	.seg-opt {
		padding: 0.55rem 1.1rem;
		border-radius: 9999px;
		font-family: var(--font-body);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--ink-muted);
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

	@media (prefers-reduced-motion: reduce) {
		.group:hover .artist-art {
			transform: none;
		}
	}
</style>
