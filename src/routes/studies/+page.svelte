<script lang='ts'>
	import { Seo } from '$lib'
	import Scribble from '$lib/studies/Scribble.svelte'
	import { studies, studyNumber } from '$lib/studies/studies'
	import StudiesLogo from '$lib/studies/StudiesLogo.svelte'
</script>

<Seo
	title='Studies'
	bareTitle
	description='Numbered studies on motion and the craft of the web, written on blank paper with figures that run on the real engines.'
	keywords={['studies', 'web craft', 'easing', 'gsap', 'css']}
/>

<div class='sheet'>
	<header class='head'>
		<h1>
			<span class='sr-only'>My Studies</span>
			<StudiesLogo class='wordmark' />
		</h1>
	</header>

	<nav class='toc' aria-label='studies'>
		<ol>
			{#each studies as study, i (study.slug)}
				<li>
					<a class='entry' href={`/studies/${study.slug}`}>
						<code translate='no' class='entry-n'>{studyNumber(i)}</code>
						<span class='entry-title'>
							{study.title}
							<Scribble class='entry-scribble' />
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
		display: block;
		width: clamp(11rem, 27vw, 15.5rem);
		height: auto;
		color: var(--ink);
	}

	h1 {
		margin: 0;
	}

	.toc {
		margin-top: clamp(3.5rem, 11vh, 6rem);
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
		row-gap: 0.55rem;
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

	/* The pen goes under the title on the way in: one stroke out and a
	   shorter one back, drawn by its own dash. */
	.entry-title :global(.entry-scribble) {
		position: absolute;
		left: -0.15rem;
		right: -0.15rem;
		bottom: -0.55rem;
		width: auto;
		height: 0.75rem;
		overflow: visible;
		color: var(--accent);
	}

	.entry-title :global(.entry-scribble path) {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		transition: stroke-dashoffset 420ms cubic-bezier(0.3, 0.55, 0.35, 1);
	}

	.entry:hover .entry-title,
	.entry:focus-visible .entry-title {
		color: var(--accent);
	}

	.entry:hover .entry-title :global(.entry-scribble path),
	.entry:focus-visible .entry-title :global(.entry-scribble path) {
		stroke-dashoffset: 0;
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
		.entry-title :global(.entry-scribble path) {
			transition-duration: 1ms;
		}
	}
</style>
