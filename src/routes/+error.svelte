<script lang='ts'>
	import { page } from '$app/state'
	import { Button, Container, Fleuron, PageHeader, Seo } from '$lib'
</script>

<Seo title='Page not found' noindex />

<PageHeader room='404' title={page.status === 404 ? 'Page not found' : 'Something went wrong'}>
	{#snippet lede()}
		<p>
			{page.status === 404
				? 'Nothing lives at this address. The link may be old, or the page may have moved.'
				: (page.error?.message ?? 'An unexpected error occurred.')}
		</p>
	{/snippet}
</PageHeader>

<Container size='prose'>
	<Fleuron />
	<div class='text-center'>
		<div
			class='text-[var(--ink-muted)]'
			style='font-family: var(--font-display); font-size: 6rem; line-height: 1;'
		>
			{page.status}
		</div>
		<div class='button-row mt-8'>
			<Button href='/' size='lg'>Home</Button>
			<Button href='/writing' variant='outline' size='lg'>Read something instead</Button>
		</div>
	</div>
</Container>
