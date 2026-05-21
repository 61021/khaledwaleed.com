<script lang="ts">
	import { page } from '$app/stores';
	import { Seo, Container, Button } from '$lib';
</script>

<Seo title="Page not found" noindex />

<Container>
	<section class="animate-fade-up py-12 text-center sm:py-20">
		<div class="font-mono text-7xl font-bold text-[var(--brand)] sm:text-8xl">
			{$page.status}
		</div>
		<h1 class="mt-6 text-3xl font-semibold tracking-tight text-[var(--fg)] sm:text-4xl">
			{$page.status === 404 ? 'Page not found.' : 'Something went wrong.'}
		</h1>
		<p class="mx-auto mt-4 max-w-md text-[var(--fg-muted)]">
			{$page.status === 404
				? "The page you're looking for doesn't exist — or maybe it never did."
				: ($page.error?.message ?? 'An unexpected error occurred.')}
		</p>
		<div
			class="mt-8 inline-block rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-5 py-3 text-left font-mono text-sm"
		>
			<span class="text-[var(--brand)]">$</span>
			<span class="text-[var(--fg-muted)]"> cd ~ </span>
			<span class="animate-blink ml-0.5 inline-block w-[7px] bg-[var(--brand)]">&nbsp;</span>
		</div>
		<div class="mt-10 flex justify-center gap-3">
			<Button href="/" size="lg">Back home</Button>
			<Button href="/contact" variant="outline" size="lg">Contact me</Button>
		</div>
	</section>
</Container>
