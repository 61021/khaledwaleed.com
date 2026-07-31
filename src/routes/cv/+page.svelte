<script lang="ts">
	import { Seo, Container, Button, PageHeader, Fleuron, SchemaOrg, site } from '$lib';

	const cvUrl = '/Khaled-Waleed-Resume.pdf';

	const cvSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${site.url}/cv#webpage`,
		url: `${site.url}/cv`,
		name: 'CV',
		about: { '@id': `${site.url}/#person` },
		isPartOf: { '@id': `${site.url}/#website` },
		inLanguage: 'en'
	};
</script>

<Seo
	title="CV"
	description="Khaled Waleed’s CV — the work history on two quiet pages, ready to print or forward. View it in the browser or download the PDF."
/>

<SchemaOrg schema={cvSchema} />

<PageHeader room="cv" eyebrow="on paper" title="CV">
	{#snippet lede()}
		<p>The same story as the About page, pressed onto two pages you can print or forward.</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	<section class="rise-3 mt-12 text-left sm:text-center">
		<p class="mx-auto max-w-md italic text-[var(--ink-muted)]">
			Two pages, kept current, no cover letter required.
		</p>
		<div class="mt-6 flex flex-wrap items-center justify-start gap-4 sm:justify-center">
			<Button href={cvUrl} external size="lg">View CV</Button>
			<Button href={cvUrl} download="Khaled-Waleed-Resume.pdf" variant="outline" size="lg">
				Download
			</Button>
		</div>
	</section>

	<Fleuron />

	<section class="rise mt-8 text-left sm:text-center">
		<p class="max-w-md italic text-[var(--ink-muted)] sm:mx-auto">
			Prefer the longer version, with more of the story attached?
		</p>
		<div class="mt-6 flex flex-wrap items-center justify-start gap-4 sm:justify-center">
			<Button href="/about" size="lg">Read the About page</Button>
			<Button href="/contact" variant="outline" size="lg">Get in touch</Button>
		</div>
	</section>
</Container>
