<script lang='ts'>
	import { Button, Container, Fleuron, PageHeader, SchemaOrg, Seo, site } from '$lib'
	import { reveal } from '$lib/reveal'

	// The lede names two ways in; the card sets exactly those two large.
	// The socials keep to one quiet row beneath.
	const direct = [
		{ label: 'Phone', value: site.phoneDisplay, href: `tel:${site.phone}` },
		{ label: 'Email', value: site.email, href: `mailto:${site.email}` },
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
	description='Get in touch with Khaled Waleed, design engineer in Baghdad. Available for select consulting and contract work.'
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
	<p class='rise-3 mt-12 text-left text-[var(--ink)] sm:text-center'>
		I’m open to senior roles and select contract work.
	</p>

	<!-- A carte de visite left on the hall table: the panel draws its own
	     1px rule; the engraved corners attend it from without. -->
	<div class='visite frame-engraved rise-3'>
		<h2 class='visite-name'>{site.name}</h2>
		<span class='smallcaps visite-role'>{site.role}</span>

		<div class='rule-engraved visite-rule' aria-hidden='true'><span class='gem'></span></div>

		{#each direct as c (c.label)}
			<p class='direct-line'>
				<span class='smallcaps direct-label'>{c.label}</span>
				<a href={c.href} class='link'>{c.value}</a>
			</p>
		{/each}

		<div class='rule-engraved visite-rule' aria-hidden='true'><span class='gem'></span></div>

		<div class='socials'>
			{#each site.socials as s (s.label)}
				<a href={s.href} target='_blank' rel='noopener noreferrer' class='smallcaps link-quiet social-link'>
					{s.label}
				</a>
			{/each}
		</div>
	</div>

	<Fleuron />

	<section class='text-left sm:text-center' {@attach reveal}>
		<div class='button-row'>
			<Button href='/writing' size='lg'>Read the essays</Button>
			<Button href='/' variant='outline' size='lg'>Home</Button>
		</div>
	</section>
</Container>

<style>
	.visite {
		position: relative;
		max-width: 30rem;
		margin: 2rem auto 0;
		padding: 2rem 1.25rem 1.9rem;
		background: var(--bg-soft);
		border: 1px solid var(--rule);
		text-align: center;
	}

	.visite-name {
		font-size: 1.6rem;
		line-height: 1.2;
	}

	.visite-role {
		display: block;
		margin-top: 0.45rem;
	}

	.visite-rule {
		max-width: 11rem;
		margin: 1.6rem auto;
	}

	.direct-line {
		margin: 1.1rem 0 0;
	}

	.direct-label {
		display: block;
		margin-bottom: 0.15rem;
		color: var(--ink-dim);
	}

	.direct-line a {
		font-family: var(--font-display);
		font-size: 1.15rem;
		line-height: 1.4;
		overflow-wrap: anywhere;
	}

	.socials {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		column-gap: 1rem;
		margin-top: 0.2rem;
	}

	/* The smallcaps row keeps the tasting's optics; the padding widens the
	   tap targets without moving the visual gaps. */
	.social-link {
		padding: 0.35rem 0.25rem;
	}

	@media (min-width: 640px) {
		.visite {
			margin-top: 2.5rem;
			padding: 2.4rem 2rem 2.2rem;
		}

		.visite-name {
			font-size: 1.9rem;
		}

		.direct-line a {
			font-size: 1.32rem;
		}
	}
</style>
