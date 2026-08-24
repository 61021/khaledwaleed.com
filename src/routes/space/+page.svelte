<script lang='ts'>
	import { Seo } from '$lib'
	import CreativeSpaceLogo from '$lib/space/CreativeSpaceLogo.svelte'
	import Flourish from '$lib/space/Flourish.svelte'
	import { spaceNumber, spaces } from '$lib/space/spaces'
</script>

<Seo
	title='Creative space'
	description='The creative space of Khaled Waleed: numbered studies in motion and the craft of the web, on blank paper.'
	keywords={['creative space', 'Khaled Waleed', 'studies', 'easing', 'gsap', 'css']}
/>

<div class='wall'>
	<div class='door'>
		<a href='/' class='chip'>
			<!-- phosphor: arrow-left -->
			<svg width='12' height='12' viewBox='0 0 256 256' aria-hidden='true'>
				<path
					fill='currentColor'
					d='M224 128a8 8 0 0 1-8 8H59.31l58.35 58.34a8 8 0 0 1-11.32 11.32l-72-72a8 8 0 0 1 0-11.32l72-72a8 8 0 0 1 11.32 11.32L59.31 120H216a8 8 0 0 1 8 8Z'
				/>
			</svg>
			back to the website
		</a>
	</div>

	<header class='mark'>
		<h1 class='sr-only'>creative space</h1>
		<CreativeSpaceLogo class='mark-svg' />
	</header>

	<nav class='spaces' aria-label='studies'>
		<ol>
			{#each spaces as space, i (space.slug)}
				<li>
					<a class='entry' href={`/space/${space.slug}`}>
						<code translate='no' class='entry-n'>{spaceNumber(i)}</code>
						<span class='entry-title'>
							{space.title}
							<Flourish class='entry-flourish' />
						</span>
						<span class='entry-line'>{space.line}</span>
						<span class='entry-date'>{space.openedLabel}</span>
					</a>
				</li>
			{/each}
		</ol>
	</nav>
</div>

<style>
	.wall {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1.5rem;
	}

	.mark {
		display: flex;
		justify-content: center;
		margin-top: clamp(3rem, 12vh, 7rem);
	}

	.mark :global(.mark-svg) {
		width: clamp(11rem, 24vw, 15rem);
		height: auto;
		color: var(--ink);
	}

	.spaces {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3rem 0 14vh;
	}

	.spaces ol {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 1.25rem;
		justify-items: center;
	}

	.entry {
		display: grid;
		justify-items: center;
		gap: 0.45rem;
		text-align: center;
		padding: 1.25rem 2rem;
	}

	.entry-n {
		font-size: 0.75rem;
		color: var(--ink-muted);
	}

	.entry-title {
		position: relative;
		font-size: 1.5rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: var(--ink);
		padding-bottom: 0.6rem;
		transition: color 250ms cubic-bezier(0.22, 0.7, 0.25, 1);
	}

	.entry-title :global(.entry-flourish) {
		position: absolute;
		left: 50%;
		bottom: 0;
		width: 8.5rem;
		transform: translate(-50%, 3px);
		color: var(--accent);
		opacity: 0;
		transition:
			opacity 300ms cubic-bezier(0.22, 0.7, 0.25, 1),
			transform 300ms cubic-bezier(0.22, 0.7, 0.25, 1);
	}

	.entry:hover .entry-title,
	.entry:focus-visible .entry-title {
		color: var(--accent);
	}

	.entry:hover .entry-title :global(.entry-flourish),
	.entry:focus-visible .entry-title :global(.entry-flourish) {
		opacity: 1;
		transform: translate(-50%, 0);
	}

	.entry-line {
		font-size: 0.95rem;
		color: var(--ink-muted);
		max-width: 26rem;
	}

	.entry-date {
		font-size: 0.72rem;
		color: var(--ink-muted);
		margin-top: 0.3rem;
	}
</style>
