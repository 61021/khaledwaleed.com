<script lang='ts'>
	import { Container, Fleuron, Noted, PageHeader, SchemaOrg, Seo, site } from '$lib'
	import { formatDate } from '$lib/posts'
	import { reveal } from '$lib/reveal'

	const lastUpdated = '2026-08-11'

	/* Same anatomy as /likes: an item is plain text, or a term wearing a
	   small note that shows itself on hover and focus. */
	type Item = string | { label: string, note: string }

	const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

	type Section = {
		name: string
		kicker: string
		items: Item[]
		link?: { href: string, label: string }
	}

	const sections: Section[] = [
		{
			name: 'Desk',
			kicker: 'The machine and what plugs into it',
			items: [
				{
					label: 'ASUS Zenbook 14',
					note: 'UX3405MA, Core Ultra 9 185H. Hostname: archbook.',
				},
				'Logitech MX Master mouse',
				'Logitech MX Keys keyboard',
			],
		},
		{
			name: 'Everyday',
			kicker: 'What leaves the house with me',
			items: [
				'Samsung Galaxy S24 Ultra',
				{
					label: 'Glasses',
					note: 'Zeiss DuraVision Platinum grayscale lenses in a silver Ray-Ban frame.',
				},
				'A black leather bag',
				'A Lumberjack wallet',
				{
					label: 'A USB stick with Arch on it',
					note: 'In case anything happens.',
				},
			],
		},
		{
			name: 'Home & hobby',
			kicker: 'Evenings, mostly',
			items: [
				{
					label: 'LG 55-inch 4K OLED TV',
					note: 'With a soundbar, and the sofa pulled close, exactly as the likes page prescribes.',
				},
				{ label: 'Nikon D7200', note: 'Photos get processed in darktable.' },
			],
			link: { href: '/films', label: 'What the TV is for →' },
		},
		{
			name: 'Road & ritual',
			kicker: 'The car and the coffee',
			items: [
				{
					label: '2022 Toyota Corolla Hybrid',
					note: 'The dream garage stays on the likes page. This one starts every morning.',
				},
				{ label: 'Hario V60', note: 'Iced, mostly.' },
			],
		},
		{
			name: 'System',
			kicker: 'What the machine runs',
			items: [
				'Arch Linux',
				'Hyprland',
				'kitty',
				'fish',
				'paru',
				{ label: 'eww', note: 'The status bar is hand-built.' },
				'VS Code',
				'Firefox',
				'mpv',
				{
					label: 'IBM Plex everywhere',
					note: 'Forced system-wide through fontconfig; JetBrains Mono in the terminal.',
				},
			],
			link: { href: 'https://github.com/61021/dots', label: 'The dotfiles are public →' },
		},
		{
			name: 'Stack',
			kicker: 'What I build with',
			items: [
				'TypeScript',
				'Svelte & SvelteKit',
				'Vue & Nuxt',
				'Go',
				'Tailwind',
				'Vite+',
				'pnpm',
				'PocketBase',
				'Figma',
			],
		},
		{
			name: 'Services',
			kicker: 'Where things run',
			items: [
				'Cloudflare Pages',
				{
					label: 'A Contabo VPS',
					note: 'Docker, nginx, and Coolify, carrying 20+ production deployments.',
				},
				'Self-hosted PocketBase',
				{ label: 'Jellyfin', note: 'The home media server.' },
				'GitHub',
				'Spotify',
			],
		},
	]

	const description = `The hardware, software, and services Khaled Waleed works with, physical and digital: the desk, the system, the stack, and where it all runs. Updated ${lastUpdated}.`

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': `${site.url}/tools#page`,
		'url': `${site.url}/tools`,
		'name': `${site.name}'s Tools`,
		description,
		'dateModified': lastUpdated,
		'isPartOf': { '@id': `${site.url}/#website` },
		'about': { '@id': `${site.url}/#person` },
		'breadcrumb': {
			'@type': 'BreadcrumbList',
			'itemListElement': [
				{ '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': site.url },
				{ '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${site.url}/tools` },
			],
		},
	}
</script>

<Seo title='Tools' {description} />

<SchemaOrg {schema} />

<PageHeader room='tools' title='Tools'>
	{#snippet lede()}
		<p>Everything I work with, physical and digital.</p>
	{/snippet}
</PageHeader>

<Container size='prose'>
	<div class='smallcaps mt-10'>
		updated <time datetime={lastUpdated}>{formatDate(lastUpdated)}</time>
	</div>

	<!-- Section index -->
	<nav aria-label='Sections' class='mt-8'>
		<ul class='smallcaps flex flex-wrap justify-center gap-x-6 gap-y-2'>
			{#each sections as s (s.name)}
				<li>
					<a href={`#${slug(s.name)}`} class='link-quiet'>{s.name}</a>
				</li>
			{/each}
		</ul>
	</nav>

	<Fleuron />

	<div class='space-y-16'>
		{#each sections as s, i (s.name)}
			<section id={slug(s.name)} class='scroll-mt-20' {@attach reveal}>
				<h2
					class='text-[var(--ink)]'
					style='font-family: var(--font-display); font-size: clamp(2rem, 4vw + 0.5rem, 2.75rem); line-height: 1.05;'
				>
					{s.name}
				</h2>
				<!-- The kicker reads as a chapter subtitle, not a filing label. -->
				<p
					class='mt-2 [font-family:var(--font-display)] text-[1.05rem] text-[var(--ink-muted)] italic'
				>
					{s.kicker}
				</p>
				<!-- The separator leads each item (except the first) so it wraps with it
				     and never dangles at the end of a line. -->
				<ul class='mt-5 flex flex-wrap gap-x-3 gap-y-1 leading-relaxed text-[var(--ink-muted)]'>
					{#each s.items as it, j (typeof it === 'string' ? it : it.label)}
						<li>
							{#if j > 0}<span class='mr-3 text-[var(--rule)]' aria-hidden='true'>·</span>{/if}{#if typeof it === 'string'}{it}{:else}<Noted label={it.label} note={it.note} />{/if}
						</li>
					{/each}
				</ul>
				{#if s.link}
					<p class='mt-5'>
						{#if s.link.href.startsWith('http')}
							<a href={s.link.href} class='link' target='_blank' rel='noopener noreferrer'>{s.link.label}</a>
						{:else}
							<a href={s.link.href} class='link'>{s.link.label}</a>
						{/if}
					</p>
				{/if}
				{#if i < sections.length - 1}
					<div class='rule-fine mt-12'></div>
				{/if}
			</section>
		{/each}
	</div>
</Container>
