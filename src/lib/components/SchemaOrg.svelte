<script lang='ts'>
	// Renders a schema.org JSON-LD block into the document head.
	// Centralised so pages never hand-roll JSON-LD tags inside template
	// literals (which breaks the svelte-eslint parser and risks close-tag
	// injection if data ever contains one).
	const { schema }: { schema: Record<string, unknown> } = $props()

	// `<` can never appear raw inside a JSON-LD script body.
	const json = $derived(JSON.stringify(schema).replace(/</g, '\\u003c'))
	const tag = $derived('<scr' + `ipt type="application/ld+json">${json}</scr` + 'ipt>')
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON is escaped above -->
	{@html tag}
</svelte:head>
