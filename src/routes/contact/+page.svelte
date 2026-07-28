<script lang="ts">
	import { Seo, Container, PageHeader, Fleuron, Button, SchemaOrg, site } from '$lib';

	const channels = [
		{ label: 'Phone', value: site.phone, href: `tel:${site.phone}` },
		{ label: 'Email', value: site.email, href: `mailto:${site.email}` },
		...site.socials.map((s) => ({ label: s.label, value: s.handle, href: s.href }))
	];

	const contactSchema = {
		'@context': 'https://schema.org',
		'@type': 'ContactPage',
		'@id': `${site.url}/contact#contactpage`,
		url: `${site.url}/contact`,
		name: `Contact — ${site.name}`,
		about: { '@id': `${site.url}/#person` },
		isPartOf: { '@id': `${site.url}/#website` },
		inLanguage: 'en'
	};
</script>

<Seo
	title="Contact"
	description="Get in touch with Khaled Waleed — senior software engineer in Baghdad. Available for select consulting and contract work."
/>

<SchemaOrg schema={contactSchema} />

<PageHeader room="contact" eyebrow="how to reach me" title="Contact">
	{#snippet lede()}
		<p>
			The fastest way is a call, or you can email, I read everything, and I reply within a day or
			two.
		</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	<dl class="rise-3 mt-12 divide-y divide-[var(--rule)]">
		{#each channels as c (c.label)}
			<div class="flex items-baseline gap-4 py-5">
				<dt class="smallcaps shrink-0">{c.label}</dt>
				<dd class="flex min-w-0 flex-1 items-baseline gap-4">
					<span class="leader" aria-hidden="true"></span>
					<a
						href={c.href}
						target={c.href.startsWith('http') ? '_blank' : undefined}
						rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
						class="link italic"
					>
						{c.value}
					</a>
				</dd>
			</div>
		{/each}
	</dl>

	<Fleuron />

	<section class="rise text-left sm:text-center">
		<p class="max-w-md italic text-[var(--ink-muted)] sm:mx-auto">
			Or come look around the rest of the place.
		</p>
		<div class="mt-6 flex flex-wrap items-center justify-start gap-4 sm:justify-center">
			<Button href="/writing" size="lg">Read the essays</Button>
			<Button href="/" variant="outline" size="lg">Back to the front</Button>
		</div>
	</section>
</Container>
