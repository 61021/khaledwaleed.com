<script lang="ts">
	import { paintings, type Painting } from '$lib/site';

	type Props = {
		/** key in the paintings map */
		room: keyof typeof paintings | string;
		/** override or supply if not in the map */
		painting?: Painting;
		priority?: boolean;
		/** image only — no figure, caption, or reveal (for hero backgrounds) */
		bare?: boolean;
	};

	let { room, painting, priority = false, bare = false }: Props = $props();

	const p = $derived(painting ?? paintings[room as keyof typeof paintings]);
	const src = $derived(`/paintings/${p.key}`);
</script>

{#snippet pic()}
	<picture>
		<source type="image/avif" srcset={`${src}.avif`} />
		<source type="image/webp" srcset={`${src}.webp`} />
		<img
			src={`${src}.webp`}
			alt={p.alt}
			loading={priority ? 'eager' : 'lazy'}
			fetchpriority={priority ? 'high' : 'auto'}
			decoding="async"
		/>
	</picture>
{/snippet}

{#if bare}
	<div class="frontispiece">
		{@render pic()}
	</div>
{:else}
	<figure class="rise">
		<div class="frontispiece">
			{@render pic()}
		</div>

		<figcaption class="plate mx-auto mt-4 px-6 rise-2">
			<em>{p.title}</em>
			<span class="plate-sep">·</span>
			{p.artist}
			<span class="plate-sep">·</span>
			{p.year}
			<span class="plate-sep">·</span>
			<a href={p.museumUrl} target="_blank" rel="noopener noreferrer" class="link-quiet"
				>{p.museum}</a
			>
		</figcaption>
	</figure>
{/if}
