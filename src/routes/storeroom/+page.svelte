<script lang='ts'>
	import { Container, Fleuron, Painting, Seo } from '$lib'
	import { reveal } from '$lib/reveal'
	import { retired } from '$lib/site'
</script>

<!-- Not in the nav, the sitemap, or the index: the storeroom is found,
     not advertised. The command palette knows the way. -->
<Seo title='Storeroom' description='Paintings that used to hang on this site.' noindex />

<Container size='prose'>
	<header class='pt-32 text-center sm:pt-36'>
		<h1>Storeroom</h1>
		<p class='mx-auto mt-4 max-w-md text-[var(--ink-muted)]'>
			Paintings that used to hang here. When a room is re-hung, the old
			canvas comes down to this page, plate and all.
		</p>
	</header>

	<Fleuron />

	<div class='space-y-20 sm:space-y-28'>
		{#each retired as p (p.key)}
			<section {@attach reveal}>
				<Painting room={p.key} painting={p} />
				<p class='smallcaps mt-3 text-center text-[var(--ink-dim)]'>
					hung on {p.hungOn} until {p.until}
				</p>
			</section>
		{/each}
	</div>
</Container>

<style>
	/* Racked canvases, not heroes: show the whole painting at its own
	   aspect, no cover-crop and no bottom fade into the wall. */
	section :global(.frontispiece picture),
	section :global(.frontispiece img) {
		height: auto;
	}

	section :global(.frontispiece::after) {
		display: none;
	}
</style>
