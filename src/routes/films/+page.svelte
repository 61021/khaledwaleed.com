<script lang='ts'>
	import type { PageData } from './$types'
	import { Container, PageHeader, Seo } from '$lib'
	import FilmLog from './FilmLog.svelte'

	const { data }: { data: PageData } = $props()
</script>

<PageHeader room='films' title='Films'>
	{#snippet lede()}
		<p>Every film and series I have watched, scored 1 to 10.</p>
	{/snippet}
</PageHeader>

{#await data.films}
	<Seo title='Films' description='Every film and series Khaled Waleed has rated, scored 1 to 10.' />
	<Container>
		<div class='pending' role='status' aria-label='Loading the log'>
			{#each ['Favourite films', 'Favourite series'] as label (label)}
				<div class='shelf'>
					<div class='shelf-head smallcaps'>{label}</div>
					<div class='shelf-row' aria-hidden='true'>
						{#each { length: 8 }, i (i)}
							<span class='plate'></span>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</Container>
{:then films}
	<FilmLog {films} />
{/await}

<style>
	/* Shaped like the shelves it stands in for. It waits a beat before
	   showing so a quick answer never flashes it. */
	.pending {
		opacity: 0;
		animation: pending-show var(--dur-beat, 240ms) var(--ease-out) 250ms forwards;
	}

	.shelf {
		margin-top: 2.25rem;
	}

	.shelf + .shelf {
		margin-top: 1.6rem;
	}

	.shelf-head {
		border-bottom: 1px solid var(--rule);
		padding-bottom: 0.55rem;
		color: var(--ink-dim);
	}

	.shelf-row {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: clamp(6rem, 22vw, 7rem);
		gap: 0.8rem;
		margin-top: 1rem;
		overflow: hidden;
	}

	.plate {
		aspect-ratio: 2 / 3;
		background: var(--bg-soft);
		outline: 1px solid var(--rule);
		outline-offset: -1px;
	}

	@media (prefers-reduced-motion: no-preference) {
		.plate {
			animation: pending-breathe 1.6s ease-in-out 250ms infinite alternate;
		}
	}

	@keyframes pending-show {
		to {
			opacity: 1;
		}
	}

	@keyframes pending-breathe {
		to {
			opacity: 0.45;
		}
	}
</style>
