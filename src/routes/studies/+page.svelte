<script lang='ts'>
	import { Seo } from '$lib'
	import Flourish from '$lib/studies/Flourish.svelte'
	import { studies, studyNumber } from '$lib/studies/studies'
	import StudiesMark from '$lib/studies/StudiesMark.svelte'
</script>

<Seo
	title='Studies'
	description='Numbered studies by Khaled Waleed on motion and the craft of the web, written on blank paper with figures that run on the real engines.'
	keywords={['studies', 'Khaled Waleed', 'web craft', 'easing', 'gsap', 'css']}
/>

<div class='sheet'>
	<header class='head'>
		<h1><StudiesMark class='wordmark' /></h1>
		<p class='what'>
			working papers on motion and the craft of the web.
			every figure runs on the real engine it describes.
		</p>
	</header>

	<nav class='toc' aria-label='studies'>
		<ol>
			{#each studies as study, i (study.slug)}
				<li>
					<a class='entry' href={`/studies/${study.slug}`}>
						<code translate='no' class='entry-n'>{studyNumber(i)}</code>
						<span class='entry-title'>
							{study.title}
							<Flourish class='entry-flourish' />
						</span>
						<span class='entry-when'>{study.openedLabel}</span>
						<span class='entry-line'>{study.line}</span>
					</a>
				</li>
			{/each}
		</ol>
	</nav>

	<footer class='imprint'>
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
		<span>khaled waleed</span>
	</footer>
</div>

<style>
	/* The title sheet: wordmark and what these are at the top, the
	   contents under them, the imprint held at the foot of the page. */
	.sheet {
		display: flex;
		flex-direction: column;
		min-height: min(42rem, 76vh);
	}

	.head :global(.wordmark) {
		font-size: clamp(2.6rem, 8vw, 4.4rem);
	}

	h1 {
		margin: 0;
	}

	.what {
		margin: 2.2rem 0 0;
		max-width: 30rem;
		font-size: 1.02rem;
		color: var(--ink-muted);
	}

	.toc {
		margin-top: clamp(3rem, 9vh, 5rem);
	}

	.toc ol {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.entry {
		display: grid;
		grid-template-columns: 2.5rem 1fr auto;
		align-items: baseline;
		column-gap: 1rem;
		row-gap: 0.4rem;
		border-top: 1px solid var(--rule);
		padding: 1.4rem 0 1.5rem;
	}

	.entry-n {
		font-size: 0.75rem;
		color: var(--ink-muted);
	}

	.entry-title {
		position: relative;
		font-size: 1.35rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: var(--ink);
		justify-self: start;
		transition: color 250ms cubic-bezier(0.22, 0.7, 0.25, 1);
	}

	.entry-title :global(.entry-flourish) {
		position: absolute;
		left: 0;
		bottom: -0.45rem;
		width: 100%;
		height: auto;
		color: var(--accent);
		opacity: 0;
		transform: translateY(3px);
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
		transform: translateY(0);
	}

	.entry-when {
		font-size: 0.75rem;
		color: var(--ink-muted);
		text-align: right;
	}

	.entry-line {
		grid-column: 2 / -1;
		font-size: 0.92rem;
		color: var(--ink-muted);
		max-width: 28rem;
	}

	.imprint {
		margin-top: auto;
		padding-top: clamp(3rem, 8vh, 4.5rem);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		font-size: 0.78rem;
		color: var(--ink-muted);
	}

	@media (max-width: 34rem) {
		.entry {
			grid-template-columns: 2rem 1fr;
		}

		.entry-when {
			grid-column: 2;
			grid-row: 2;
			text-align: left;
		}

		.entry-line {
			grid-row: 3;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.entry-title :global(.entry-flourish) {
			transform: none;
			transition-duration: 1ms;
		}
	}
</style>
