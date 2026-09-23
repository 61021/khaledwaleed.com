<script lang='ts'>
	import '@fontsource/jetbrains-mono/400.css'

	const { children } = $props()

	// The direction contract, kept in the served markup so the built
	// output can be audited against it. Svelte strips plain template
	// comments from SSR output, hence @html; the string is static.
	const contract = `<!--
THESIS: a drafting table for numbered studies of the craft; refuses the personal-site hub (nav bar, hero, card grid) and the museum next door.
OWN-WORLD: bone paper #e9e4de for the wall, every page a long white sheet lying on it (separated by value alone); warm black ink; one ultramarine pen #2b44a1; the word itself under the hand stroke for a wordmark; Libre Franklin text with JetBrains Mono only for code and measurement; hairline rules; no cards, no shadows, no gradients.
STORY: step out of the museum onto blank paper, read the table of contents, pick a study, read it while its figures run on the real engines.
FIRST VIEWPORT: index: a title sheet, the wordmark set large with what the studies are under it, the numbered contents below, back to the website in the imprint.
FORM: printed working paper with live figures, index and studies on the same sheet; pinned by the brief (#e9e4de, blank page).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html contract}

<div class='studies'>
	{@render children()}
</div>

<style>
	.studies {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
	}

	/* The long white sheet on the wall, shared by the index and every
	   study: flat by value contrast alone, the wall showing above it and
	   running out in a long tail below. The mats keep today's measure:
	   58rem minus two 6rem margins is the 46rem column. */
	.studies :global(.sheet) {
		width: 100%;
		max-width: 58rem;
		margin: clamp(3rem, 12vh, 9rem) auto clamp(5rem, 22vh, 14rem);
		background: #fff;
		padding: clamp(1.5rem, 5vh, 4rem) clamp(1.5rem, 7vw, 6rem) 5rem;
	}

	/* The table sets its headings in the text face; the serif stays in
	   the museum. Mono is reserved for code and measurement. */
	.studies :global(:is(h1, h2, h3)) {
		font-family: var(--font-body);
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	.studies :global(code),
	.studies :global(pre) {
		font-family: var(--font-code);
	}

	/* The one button shape here: a quiet bordered chip. */
	.studies :global(.chip) {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.82rem;
		letter-spacing: 0.02em;
		color: var(--ink-muted);
		border: 1px solid var(--rule);
		border-radius: 999px;
		padding: 0.5rem 0.95rem;
		transition:
			color 200ms cubic-bezier(0.22, 0.7, 0.25, 1),
			border-color 200ms cubic-bezier(0.22, 0.7, 0.25, 1);
	}

	.studies :global(.chip:hover) {
		color: var(--ink);
		border-color: var(--ink-dim);
	}

	/* Segmented pickers, shared by the shelf toggle and the playground. */
	.studies :global(.seg) {
		display: flex;
		gap: 1.1rem;
		border: 0;
		padding: 0;
		margin: 0;
	}

	.studies :global(.seg-option) {
		font-family: var(--font-code);
		font-size: 0.8rem;
		color: var(--ink-muted);
		padding-bottom: 0.2rem;
		border-bottom: 1px solid transparent;
		cursor: pointer;
		transition:
			color 200ms cubic-bezier(0.22, 0.7, 0.25, 1),
			border-color 200ms cubic-bezier(0.22, 0.7, 0.25, 1);
	}

	.studies :global(.seg-option:hover) {
		color: var(--ink);
	}

	.studies :global(.seg-option.on) {
		color: var(--ink);
		border-bottom-color: var(--accent);
	}

	/* A specimen plate: a patch of someone else's dark page glued onto
	   the sheet. Square cut, no frame; the caption sits under it in ink. */
	.studies :global(.specimen) {
		position: relative;
		overflow: hidden;
		isolation: isolate;
		color-scheme: dark;
	}

	.studies :global(.fig-cap) {
		margin: 0.6rem 0 0;
		font-size: 0.78rem;
		line-height: 1.55;
		color: var(--ink-muted);
	}

	.studies :global(.fig-cap code) {
		font-size: 0.72rem;
		color: var(--ink);
	}

	/* A labelled slider row, shared by the benches. */
	.studies :global(.dial) {
		display: grid;
		grid-template-columns: 5.2rem minmax(0, 1fr) 3.4rem;
		align-items: center;
		gap: 0.6rem;
	}

	.studies :global(.dial-name) {
		font-size: 0.82rem;
		color: var(--ink-muted);
	}

	.studies :global(.dial input[type='range']) {
		accent-color: var(--accent);
		min-width: 0;
	}

	.studies :global(.dial-value) {
		font-family: var(--font-code);
		font-size: 0.78rem;
		color: var(--ink);
		text-align: right;
	}

	.studies :global(.seg-option:has(input:focus-visible)) {
		outline: 1px solid var(--accent);
		outline-offset: 3px;
	}
</style>
