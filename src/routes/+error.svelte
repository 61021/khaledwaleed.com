<script lang="ts">
	import { page } from '$app/stores';
	import { Seo, Container, Button, PageHeader, Fleuron } from '$lib';
</script>

<Seo title="Page not found" noindex />

<PageHeader
	room="404"
	eyebrow="not found"
	title={$page.status === 404 ? 'A page that isn’t' : 'Something went wrong'}
>
	{#snippet lede()}
		<p>
			{$page.status === 404
				? 'The page you were looking for is not here — perhaps it never was.'
				: ($page.error?.message ?? 'An unexpected error occurred.')}
		</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	<Fleuron />
	<div class="rise text-center">
		<div
			class="italic text-[var(--ink-muted)]"
			style="font-family: var(--font-display); font-size: 6rem; line-height: 1;"
		>
			{$page.status}
		</div>
		<div class="mt-10 flex flex-wrap items-center justify-center gap-4">
			<Button href="/" size="lg">Back to the front</Button>
			<Button href="/writing" variant="outline" size="lg">Read something instead</Button>
		</div>
	</div>
</Container>
