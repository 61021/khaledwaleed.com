<script lang="ts">
	import { site } from '$lib/site';
	import { page } from '$app/stores';

	type Props = {
		title?: string;
		description?: string;
		image?: string;
		type?: 'website' | 'article' | 'profile';
		keywords?: readonly string[];
		noindex?: boolean;
		publishedTime?: string;
		modifiedTime?: string;
	};

	let {
		title,
		description = site.tagline,
		image = site.ogImage,
		type = 'website',
		keywords = site.keywords,
		noindex = false,
		publishedTime,
		modifiedTime
	}: Props = $props();

	const fullTitle = $derived(
		title
			? `${title} — ${site.name}`
			: `${site.name} — ${site.role} (${site.location.city}, ${site.location.country})`
	);
	const url = $derived(`${site.url}${$page.url.pathname}`);
	const imageUrl = $derived(image.startsWith('http') ? image : `${site.url}${image}`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords.join(', ')} />
	<meta name="author" content={site.name} />
	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<meta name="robots" content="index, follow, max-image-preview:large" />
	{/if}
	<link rel="canonical" href={url} />

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:locale" content={site.location.locale} />
	{#if publishedTime}<meta property="article:published_time" content={publishedTime} />{/if}
	{#if modifiedTime}<meta property="article:modified_time" content={modifiedTime} />{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	<!-- Geo -->
	<meta name="geo.region" content="IQ-BG" />
	<meta name="geo.placename" content={site.location.city} />
</svelte:head>
