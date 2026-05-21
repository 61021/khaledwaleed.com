<script lang="ts">
	import { Seo, Container, Button, Badge, Eyebrow, Terminal, site } from '$lib';

	const stack = [
		{ group: 'Frontend', items: ['SvelteKit', 'Nuxt.js', 'TypeScript', 'Tailwind', 'Vite'] },
		{ group: 'Backend', items: ['Go', 'Node.js', 'PostgreSQL', 'Redis', 'REST'] },
		{ group: 'Platform', items: ['Docker', 'Kubernetes', 'Linux', 'Nginx', 'CI/CD'] }
	];

	const highlights = [
		{
			title: 'Qi',
			role: 'Senior Software Engineer',
			summary:
				'Leading frontend architecture across multiple products — design systems, performance budgets, and a tighter feedback loop with the product team.',
			url: 'https://qi.iq',
			tag: 'current'
		},
		{
			title: 'Vitex',
			role: 'Senior Software Engineer',
			summary:
				'Shipping Nuxt.js interfaces backed by Go services. Owning end-to-end work from API design to UI polish.',
			url: 'https://vitex.dev',
			tag: 'current'
		}
	];
</script>

<Seo
	description="Khaled Waleed — Senior Software Engineer in Baghdad, Iraq. I build fast, reliable web apps with SvelteKit, Nuxt and Go. Currently shipping at Qi and Vitex."
/>

<Container size="wide">
	<!-- ===================== Hero ===================== -->
	<section class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
		<div class="animate-fade-up space-y-7 lg:col-span-7">
			<Eyebrow label="~/ · {site.location.city}, {site.location.country}" />

			<h1 class="text-4xl font-bold tracking-tight text-[var(--fg)] sm:text-5xl lg:text-6xl">
				{site.name}
				<span class="block text-[var(--fg-muted)]">{site.role}.</span>
			</h1>

			<p class="max-w-xl text-lg leading-relaxed text-[var(--fg-muted)]">
				I design and ship modern web apps end to end — <span class="text-[var(--fg)]">SvelteKit</span>
				and <span class="text-[var(--fg)]">Nuxt</span> on the frontend,
				<span class="text-[var(--fg)]">Go</span> on the backend. Currently building at
				<a href="https://qi.iq" target="_blank" rel="noopener" class="text-[var(--brand)] hover:underline">Qi</a>
				and
				<a href="https://vitex.dev" target="_blank" rel="noopener" class="text-[var(--brand)] hover:underline">Vitex</a>.
			</p>

			<div class="flex flex-wrap items-center gap-3 pt-2">
				<Button href="/contact" size="lg">
					Work with me
					<svg class="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
				</Button>
				<Button href="/about" variant="outline" size="lg">About me</Button>
			</div>

			<!-- status / availability strip -->
			<div class="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 text-xs text-[var(--fg-dim)]">
				<span class="inline-flex items-center gap-2">
					<span class="relative flex h-2 w-2">
						<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand)] opacity-60"></span>
						<span class="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand)]"></span>
					</span>
					<span>Available for select work</span>
				</span>
				<span class="text-[var(--border-strong)]">·</span>
				<span>5+ years experience</span>
			</div>
		</div>

		<!-- Terminal signature -->
		<div class="animate-fade-up lg:col-span-5" style="animation-delay: 120ms;">
			<Terminal />
		</div>
	</section>

	<!-- ===================== Currently ===================== -->
	<section class="mt-28 space-y-10">
		<div class="flex items-end justify-between gap-6">
			<div class="space-y-3">
				<Eyebrow label="Currently" />
				<h2 class="text-2xl font-semibold tracking-tight text-[var(--fg)] sm:text-3xl">
					Shipping at two companies I believe in.
				</h2>
			</div>
			<a href="/about" class="hidden text-sm text-[var(--fg-muted)] hover:text-[var(--brand)] sm:inline">
				More about me →
			</a>
		</div>

		<div class="grid gap-5 sm:grid-cols-2">
			{#each highlights as h}
				<a
					href={h.url}
					target="_blank"
					rel="noopener"
					class="surface surface-hover group relative block p-7"
				>
					<div class="mb-5 flex items-center justify-between">
						<div class="flex items-center gap-3">
							<div
								class="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border-strong)] bg-white/[0.03] font-mono text-sm font-bold text-[var(--brand)]"
							>
								{h.title[0]}
							</div>
							<div>
								<div class="text-lg font-semibold text-[var(--fg)]">{h.title}</div>
								<div class="text-xs text-[var(--fg-dim)]">{h.role}</div>
							</div>
						</div>
						<Badge tone="brand">● {h.tag}</Badge>
					</div>
					<p class="text-sm leading-relaxed text-[var(--fg-muted)]">{h.summary}</p>
					<div class="mt-5 inline-flex items-center gap-1.5 text-xs text-[var(--fg-dim)] transition-colors group-hover:text-[var(--brand)]">
						Visit
						<svg class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- ===================== Stack ===================== -->
	<section class="mt-28 space-y-10">
		<div class="space-y-3">
			<Eyebrow label="Stack" />
			<h2 class="max-w-2xl text-2xl font-semibold tracking-tight text-[var(--fg)] sm:text-3xl">
				A small, opinionated toolkit I reach for to ship fast without regrets.
			</h2>
		</div>

		<div class="grid gap-5 md:grid-cols-3">
			{#each stack as col}
				<div class="surface p-6">
					<div class="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--brand)]">
						{col.group}
					</div>
					<div class="flex flex-wrap gap-1.5">
						{#each col.items as item}
							<Badge>{item}</Badge>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- ===================== CTA ===================== -->
	<section class="mt-28">
		<div class="surface relative overflow-hidden p-10 sm:p-14">
			<div
				class="pointer-events-none absolute -top-32 -right-20 h-80 w-80 rounded-full bg-[var(--brand)]/10 blur-3xl"
			></div>
			<div
				class="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"
			></div>

			<div class="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
				<div class="max-w-xl space-y-3">
					<Eyebrow label="Let's build" />
					<h2 class="text-2xl font-semibold tracking-tight text-[var(--fg)] sm:text-3xl">
						Got an idea worth building? I'd love to hear it.
					</h2>
					<p class="text-[var(--fg-muted)]">
						Whether it's a green-field product, a stuck team, or a stack you want modernised — let's talk.
					</p>
				</div>
				<div class="flex flex-wrap gap-3">
					<Button href="/contact" size="lg">Start a conversation</Button>
					<Button href="mailto:{site.email}" variant="outline" size="lg">{site.email}</Button>
				</div>
			</div>
		</div>
	</section>
</Container>
