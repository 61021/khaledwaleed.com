<script lang="ts">
	import { Seo, Container, PageHeader, Fleuron, Button, site } from '$lib';

	const channels = [
		{ label: 'Email', value: site.email, href: `mailto:${site.email}` },
		...site.socials.map((s) => ({ label: s.label, value: s.handle, href: s.href }))
	];
</script>

<Seo
	title="Contact"
	description="Get in touch with Khaled Waleed — senior software engineer in Baghdad. Available for select consulting and contract work."
/>

<PageHeader
	room="contact"
	eyebrow="how to reach me"
	title="Contact"
>
	{#snippet lede()}
		<p>
			The fastest way is email — I read everything, and I reply within a day or two. For
			a quicker note, Telegram or WhatsApp will find me sooner.
		</p>
	{/snippet}
</PageHeader>

<Container size="prose">
	<dl class="rise-3 mt-12 divide-y divide-[var(--rule)]">
		{#each channels as c}
			<div class="flex items-baseline justify-between gap-6 py-5">
				<dt class="smallcaps">{c.label}</dt>
				<dd>
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

	<section class="rise text-center">
		<p class="mx-auto max-w-md italic text-[var(--ink-muted)]">
			Or come look around the rest of the place.
		</p>
		<div class="mt-6 flex flex-wrap items-center justify-center gap-4">
			<Button href="/writing" size="lg">Read the essays</Button>
			<Button href="/" variant="outline" size="lg">Back to the front</Button>
		</div>
	</section>
</Container>
