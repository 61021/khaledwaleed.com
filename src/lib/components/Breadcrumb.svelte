<script lang="ts">
	import { site } from '$lib/site';

	interface Crumb {
		name: string;
		href: string;
	}

	let { items }: { items: Crumb[] } = $props();

	const schema = $derived({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((c, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: c.name,
			item: `${site.url}${c.href}`
		}))
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>

<nav aria-label="Breadcrumb" class="text-sm">
	<ol class="flex flex-wrap items-center gap-2 text-[var(--fg-dim)]">
		{#each items as item, i (item.href)}
			<li class="flex items-center gap-2">
				{#if i < items.length - 1}
					<a href={item.href} class="hover:text-[var(--fg)] transition-colors">{item.name}</a>
					<span aria-hidden="true" class="text-[var(--fg-dim)]/50">/</span>
				{:else}
					<span class="text-[var(--fg-muted)]" aria-current="page">{item.name}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
