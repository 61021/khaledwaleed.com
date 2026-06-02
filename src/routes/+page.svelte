<script lang="ts">
	import { Seo, Container, Button, PageHeader, Fleuron, site } from '$lib';
</script>

<Seo
	description="Khaled Waleed is a senior software engineer in Baghdad, Iraq, building production web apps in SvelteKit, Nuxt, and Go."
/>

<PageHeader
	room="home"
	eyebrow="front matter"
	title="Khaled Waleed"
>
	{#snippet lede()}
		<p>
			A senior software engineer in Baghdad, Iraq — building quiet, well-made software for the
			web.
		</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	<section class="rise-3 mt-12">
		<p class="dropcap text-[1.15rem] leading-[1.78] text-[var(--ink)]">
			I make web applications for a living — SvelteKit and Nuxt on the surface,
			<em>Go</em> underneath, a tidy Linux box wherever a Linux box
			belongs. The work I am proudest of is the kind no one notices.
		</p>
		<p>
			I work primarily with two companies I admire — <a
				href="https://qi.iq"
				target="_blank"
				rel="noopener"
				class="link">Qi</a
			>, where I lead frontend architecture across several products, and
			<a href="https://vitex.dev" target="_blank" rel="noopener" class="link">Vitex</a>, My personal software company. The rest of the time I read, write here,
			and walk around the city looking at things.
		</p>
	</section>

	<Fleuron />

	<section class="rise mt-8 space-y-6">
		<h2 class="text-center italic">Where I am, currently</h2>
		<ol class="space-y-6">
			{#each site.companies as c}
				<li class="border-l-2 border-[var(--accent)] pl-5">
					<a
						href={c.url}
						target="_blank"
						rel="noopener"
						class="block"
					>
						<div
							class="text-[1.4rem] italic text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
							style="font-family: var(--font-display);"
						>
							{c.name}
						</div>
						<div class="smallcaps mt-1">{c.role}</div>
					</a>
				</li>
			{/each}
		</ol>
		<p class="italic text-[var(--ink-muted)]">
			Available, in small amounts, for additional work that interests me — quietly told via
			<a href="/contact" class="link">contact</a>.
		</p>
	</section>

	<Fleuron />

	<section class="rise mt-8 space-y-5 text-center">
		<h2 class="italic">A small invitation</h2>
		<p class="mx-auto max-w-md italic text-[var(--ink-muted)]">
			If anything here is your kind of thing, write to me. I read everything, and I reply.
		</p>
		<div class="flex flex-wrap items-center justify-center gap-4 pt-2">
			<Button href="/contact" size="lg">Write to me</Button>
			<Button href="/writing" variant="outline" size="lg">Read the essays</Button>
		</div>
	</section>
</Container>
