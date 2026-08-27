<script lang='ts'>
	import '@fontsource/jetbrains-mono/400.css'

	const { children } = $props()

	// The direction contract, kept in the served markup so the built
	// output can be audited against it. Svelte strips plain template
	// comments from SSR output, hence @html; the string is static.
	const contract = `<!--
THESIS: a drafting table for numbered studies of the craft; refuses the personal-site hub (nav bar, hero, card grid) and the museum next door.
OWN-WORLD: bone paper #e9e4de for the wall, each study a long white sheet lying on it (separated by value alone); warm black ink; one ultramarine pen #2b44a1; the hand-drawn creative-space script; Libre Franklin text with JetBrains Mono only for code and measurement; hairline rules; no cards, no shadows, no gradients.
STORY: step out of the museum onto blank paper, pick a study, read it while its figures run on the real engines.
FIRST VIEWPORT: index: back-to-website chip top left, wordmark alone in the upper third, the studies listed at center page.
FORM: printed working paper with live figures, each study a sheet on the drafting table; pinned by the brief (logo, #e9e4de, blank page).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html contract}

<div class='space'>
	{@render children()}
</div>

<style>
	.space {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
	}

	/* The space sets its headings in the text face; the serif stays in
	   the museum. Mono is reserved for code and measurement. */
	.space :global(:is(h1, h2, h3)) {
		font-family: var(--font-body);
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	.space :global(code),
	.space :global(pre) {
		font-family: var(--font-code);
	}

	/* The space's one button shape: a quiet bordered chip. */
	.space :global(.chip) {
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

	.space :global(.chip:hover) {
		color: var(--ink);
		border-color: var(--ink-dim);
	}

	/* Segmented pickers, shared by the shelf toggle and the playground. */
	.space :global(.seg) {
		display: flex;
		gap: 1.1rem;
		border: 0;
		padding: 0;
		margin: 0;
	}

	.space :global(.seg-option) {
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

	.space :global(.seg-option:hover) {
		color: var(--ink);
	}

	.space :global(.seg-option.on) {
		color: var(--ink);
		border-bottom-color: var(--accent);
	}

	.space :global(.seg-option:has(input:focus-visible)) {
		outline: 1px solid var(--accent);
		outline-offset: 3px;
	}
</style>
