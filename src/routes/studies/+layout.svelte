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

	/* Controls share one hand: pills drawn in a line darker than the
	   rules, the pen's ultramarine marking what is on, and a small press
	   on click. --line is the control edge, one step up from --rule so a
	   control reads as something to touch rather than a hairline. */
	.studies {
		--line: #cdc7bc;
		--press: cubic-bezier(0.22, 0.7, 0.25, 1);
	}

	/* The one button shape here: a bordered chip. */
	.studies :global(.chip) {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.82rem;
		letter-spacing: 0.02em;
		color: var(--ink);
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 999px;
		padding: 0.5rem 1rem;
		cursor: pointer;
		transition:
			color 180ms var(--press),
			border-color 180ms var(--press),
			background-color 180ms var(--press),
			transform 120ms var(--press);
	}

	.studies :global(.chip:hover) {
		color: var(--accent);
		border-color: var(--accent);
		background: color-mix(in oklab, var(--accent) 5%, #fff);
	}

	.studies :global(.chip:active) {
		transform: scale(0.97);
	}

	.studies :global(:is(.chip, .seg-option, .toggle):focus-visible),
	.studies :global(:is(.seg-option, .toggle):has(input:focus-visible)) {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	/* Segmented pickers: a pill track on the soft paper, the chosen
	   option filled with the pen. .code keeps option labels that are
	   code (.out, back.out) in the mono. */
	.studies :global(.seg) {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.2rem;
		align-self: flex-start;
		max-width: 100%;
		margin: 0;
		padding: 0.2rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--bg-soft);
	}

	.studies :global(.seg-option) {
		font-size: 0.82rem;
		line-height: 1.2;
		color: var(--ink-muted);
		padding: 0.42rem 0.95rem;
		border-radius: 999px;
		cursor: pointer;
		user-select: none;
		transition:
			color 180ms var(--press),
			background-color 180ms var(--press),
			transform 120ms var(--press);
	}

	.studies :global(.seg.code .seg-option) {
		font-family: var(--font-code);
		font-size: 0.78rem;
	}

	.studies :global(.seg-option:hover) {
		color: var(--ink);
		background: #fff;
	}

	.studies :global(.seg-option:active) {
		transform: scale(0.96);
	}

	.studies :global(.seg-option.on) {
		color: #fff;
		background: var(--accent);
	}

	/* A checkbox dressed as a pill that fills its box with the pen. */
	.studies :global(.toggle) {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		font-size: 0.82rem;
		color: var(--ink-muted);
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 999px;
		padding: 0.4rem 0.95rem 0.4rem 0.55rem;
		cursor: pointer;
		user-select: none;
		transition:
			color 180ms var(--press),
			border-color 180ms var(--press),
			transform 120ms var(--press);
	}

	.studies :global(.toggle:hover) {
		color: var(--ink);
		border-color: var(--ink-dim);
	}

	.studies :global(.toggle:active) {
		transform: scale(0.97);
	}

	.studies :global(.toggle:has(input:checked)) {
		color: var(--ink);
		border-color: var(--accent);
	}

	.studies :global(.toggle input) {
		appearance: none;
		flex: none;
		width: 1.05rem;
		height: 1.05rem;
		margin: 0;
		border: 1.5px solid var(--line);
		border-radius: 50%;
		background: #fff center / 0.7rem no-repeat;
		cursor: pointer;
		transition:
			background-color 180ms var(--press),
			border-color 180ms var(--press);
	}

	/* phosphor: check, in white */
	.studies :global(.toggle input:checked) {
		border-color: var(--accent);
		background-color: var(--accent);
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath fill='%23fff' d='M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z'/%3E%3C/svg%3E");
	}

	.studies :global(.toggle input:focus-visible) {
		outline: none;
	}

	/* Sliders: a thin rule for the track, the pen filling it up to a
	   round thumb that swells under the hand. --fill comes from the
	   fill attachment (lib/studies/fill.ts). */
	.studies :global(input[type='range']) {
		appearance: none;
		height: 1.4rem;
		margin: 0;
		background: transparent;
		cursor: pointer;
	}

	.studies :global(input[type='range']:focus-visible) {
		outline: none;
	}

	.studies :global(input[type='range']::-webkit-slider-runnable-track) {
		height: 3px;
		border-radius: 999px;
		background:
			linear-gradient(var(--accent), var(--accent)) 0 / var(--fill, 0%) 100% no-repeat,
			var(--line);
	}

	.studies :global(input[type='range']::-moz-range-track) {
		height: 3px;
		border-radius: 999px;
		background: var(--line);
	}

	.studies :global(input[type='range']::-moz-range-progress) {
		height: 3px;
		border-radius: 999px;
		background: var(--accent);
	}

	.studies :global(input[type='range']::-webkit-slider-thumb) {
		appearance: none;
		width: 1rem;
		height: 1rem;
		margin-top: calc(1.5px - 0.5rem);
		border: 2px solid var(--accent);
		border-radius: 50%;
		background: #fff;
		transition: transform 150ms var(--press);
	}

	.studies :global(input[type='range']::-moz-range-thumb) {
		box-sizing: border-box;
		width: 1rem;
		height: 1rem;
		border: 2px solid var(--accent);
		border-radius: 50%;
		background: #fff;
		transition: transform 150ms var(--press);
	}

	.studies :global(input[type='range']:hover::-webkit-slider-thumb) {
		transform: scale(1.2);
	}

	.studies :global(input[type='range']:hover::-moz-range-thumb) {
		transform: scale(1.2);
	}

	.studies :global(input[type='range']:active::-webkit-slider-thumb) {
		transform: scale(1.3);
		background: var(--accent);
	}

	.studies :global(input[type='range']:active::-moz-range-thumb) {
		transform: scale(1.3);
		background: var(--accent);
	}

	.studies :global(input[type='range']:focus-visible::-webkit-slider-thumb) {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.studies :global(input[type='range']:focus-visible::-moz-range-thumb) {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.studies :global(:is(.chip, .seg-option, .toggle)) {
			transition: none;
		}
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
		min-width: 0;
	}

	.studies :global(.dial-value) {
		font-family: var(--font-code);
		font-size: 0.78rem;
		color: var(--ink);
		text-align: right;
	}

</style>
