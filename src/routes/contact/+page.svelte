<script lang='ts'>
	import { Button, Container, Fleuron, PageHeader, SchemaOrg, Seo, site } from '$lib'
	import { reveal } from '$lib/reveal'

	const channels = [
		{ label: 'Phone', value: site.phoneDisplay, href: `tel:${site.phone}` },
		{ label: 'Email', value: site.email, href: `mailto:${site.email}` },
		...site.socials.map(s => ({ label: s.label, value: s.handle, href: s.href })),
	]

	const contactSchema = {
		'@context': 'https://schema.org',
		'@type': 'ContactPage',
		'@id': `${site.url}/contact#contactpage`,
		'url': `${site.url}/contact`,
		'name': `Contact · ${site.name}`,
		'about': { '@id': `${site.url}/#person` },
		'isPartOf': { '@id': `${site.url}/#website` },
		'inLanguage': 'en',
	}
</script>

<Seo
	title='Contact'
	description='Get in touch with Khaled Waleed, lead design engineer in Baghdad. Available for select consulting and contract work.'
/>

<SchemaOrg schema={contactSchema} />

<PageHeader room='contact' title='Contact'>
	{#snippet lede()}
		<p>
			Call if it’s urgent; write if it can wait. I read everything and reply within a day or two.
		</p>
	{/snippet}
</PageHeader>

<Container size='prose'>
	<p class='rise-3 mt-12 text-[var(--ink)]'>I’m open to senior roles and select contract work.</p>

	<dl class='rise-3 mt-6 divide-y divide-[var(--rule)]'>
		{#each channels as c (c.label)}
			<div class='flex items-baseline gap-4 py-5'>
				<dt class='smallcaps shrink-0'>{c.label}</dt>
				<dd class='flex min-w-0 flex-1 items-baseline gap-4'>
					<span class='leader' aria-hidden='true'></span>
					<a
						href={c.href}
						target={c.href.startsWith('http') ? '_blank' : undefined}
						rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
						class='link'
					>
						{c.value}
					</a>
				</dd>
			</div>
		{/each}
	</dl>

	<Fleuron />

	<section class='text-left sm:text-center' {@attach reveal}>
		<div class='flex flex-wrap items-center justify-start gap-8 sm:justify-center'>
			<Button href='/writing' size='lg'>Read the essays</Button>
			<Button href='/' variant='outline' size='lg'>Home</Button>
		</div>
	</section>
</Container>
