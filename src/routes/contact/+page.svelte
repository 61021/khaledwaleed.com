<script lang="ts">
	import { Seo, Container, Eyebrow, Button, Badge, site } from '$lib';

	const channels = [
		{ label: 'Email', value: site.email, href: `mailto:${site.email}`, primary: true },
		{
			label: 'LinkedIn',
			value: 'kwaleedkhalid',
			href: 'https://www.linkedin.com/in/kwaleedkhalid/'
		},
		{ label: 'GitHub', value: '@61021', href: 'https://github.com/61021' },
		{ label: 'Telegram', value: '@x61021', href: 'https://t.me/x61021' },
		{ label: 'WhatsApp', value: 'Message me', href: 'https://wa.me/message/6N52L7STPCUJO1' },
		{ label: 'Instagram', value: '@khaled.jsx', href: 'https://www.instagram.com/khaled.jsx/' }
	];
</script>

<Seo
	title="Contact"
	description="Get in touch with Khaled Waleed — senior software engineer in Baghdad, Iraq. Available for select consulting and contract work."
/>

<Container>
	<section class="animate-fade-up space-y-6">
		<Eyebrow label="~/contact" />
		<h1 class="text-4xl font-bold tracking-tight text-[var(--fg)] sm:text-5xl">Let's talk.</h1>
		<p class="max-w-xl text-lg leading-relaxed text-[var(--fg-muted)]">
			The fastest way to reach me is email — I read everything and reply within a day or two. For
			quicker pings, Telegram or WhatsApp work great.
		</p>
		<div class="pt-2">
			<Badge tone="brand">● Available for select work</Badge>
		</div>
	</section>

	<section class="mt-16">
		<div class="grid gap-3 sm:grid-cols-2">
			{#each channels as c}
				<a
					href={c.href}
					target={c.href.startsWith('http') ? '_blank' : undefined}
					rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
					class="surface surface-hover group flex items-center justify-between p-5 {c.primary
						? 'sm:col-span-2'
						: ''}"
				>
					<div>
						<div class="font-mono text-[11px] tracking-wider text-[var(--brand)] uppercase">
							{c.label}
						</div>
						<div class="mt-1 text-[var(--fg)]">{c.value}</div>
					</div>
					<svg
						class="h-4 w-4 text-[var(--fg-dim)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--brand)]"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
					</svg>
				</a>
			{/each}
		</div>
	</section>

	<section class="mt-16 border-t border-[var(--border)] pt-10">
		<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<p class="font-mono text-sm text-[var(--fg-muted)]">
				<span class="text-[var(--brand)]">$</span> echo "thanks for stopping by."
			</p>
			<Button href="/" variant="ghost">← Back home</Button>
		</div>
	</section>
</Container>
