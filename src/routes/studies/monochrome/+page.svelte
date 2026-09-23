<script lang='ts'>
	import { Seo } from '$lib'
	import { reveal } from '$lib/reveal'
	import AlphaUnderlay from '$lib/studies/AlphaUnderlay.svelte'
	import BlackPlates from '$lib/studies/BlackPlates.svelte'
	import BlurIn from '$lib/studies/BlurIn.svelte'
	import HairlineBench from '$lib/studies/HairlineBench.svelte'
	import HeaderBench from '$lib/studies/HeaderBench.svelte'
	import RedCanvas from '$lib/studies/RedCanvas.svelte'
	import { studies, studyNumber } from '$lib/studies/studies'
	import StudiesLogo from '$lib/studies/StudiesLogo.svelte'
	import TypeSpecimen from '$lib/studies/TypeSpecimen.svelte'

	const index = studies.findIndex(s => s.slug === 'monochrome')
	const study = studies[index]
	const number = studyNumber(index)

	// Visible elements with a real hue at rest, per site, and where they sit.
	const ledger = [
		{ site: 'vercel', count: '5', where: 'three green checkmarks in a terminal card, one blue status dot and its label' },
		{ site: 'raycast', count: '19', where: 'swatches and window buttons in the mockups, plus the hero, which is one webgl canvas of red' },
		{ site: 'resend', count: '63', where: 'strings in code, email status badges, one rainbow pill in the hero' },
		{ site: 'linear', count: '681', where: 'all of them inside the product mockups: chart dots, syntax, labels. none in the page around them' },
	]
</script>

<Seo
	title='A study of monochrome'
	bareTitle
	description='Resend, Vercel, Linear and Raycast taken apart on one day: where each black page puts its opacity, its blur, its hairlines and its color, with live specimens of every recipe.'
	keywords={['monochrome web design', 'dark mode', 'backdrop-filter', 'glassmorphism', 'css hairline', 'design teardown']}
	type='article'
	publishedTime={study.opened}
/>

<div class='study sheet'>
	<header class='top'>
		<a href='/studies' class='mark' aria-label='back to the contents'>
			<StudiesLogo class='mark-logo' />
		</a>
	</header>

	<article>
		<h1>a study of monochrome</h1>
		<p class='imprint'><code translate='no'>{number}</code> · {study.openedLabel}</p>

		<p class='lede'>
			Resend, Vercel, Linear and Raycast all sell to developers from a black page. The look
			gets described as black, opacity and blur, and it gets copied from that description.
			The figures here use each homepage as it was served on 23/9/2026: the CSS read line by
			line, then every element on the page measured in a browser. The black holds. The
			opacity holds, but it goes somewhere different on each site. The blur doesn't hold at
			all. Every plate below runs that site's own CSS.
		</p>

		<h2 {@attach reveal}>the four blacks</h2>
		<p>
			Two of the four use pure black. The other two use a black with a little blue in it:
			Linear's <code translate='no'>#08090a</code> and Raycast's <code translate='no'>#07080a</code> lift
			the blue channel by two points. At normal exposure the four look the same. Raise the
			exposure and <code translate='no'>brightness()</code> multiplies every channel, so
			<code translate='no'>#000</code> stays black however far you push it and the other two give
			their blue up.
		</p>

		<div {@attach reveal}>
			<BlackPlates />
		</div>

		<p>
			Only Raycast sets its text in pure white. The other three stop between
			<code translate='no'>#ededed</code> and <code translate='no'>#f7f8f8</code>.
		</p>

		<h2 {@attach reveal}>where the opacity goes</h2>
		<p>
			All four ship more transparent colors than solid ones. What differs is which parts of
			the page are allowed to be transparent. A transparent color takes on whatever lies
			under it, so the quickest way to find them is to put something under the card.
		</p>

		<div {@attach reveal}>
			<AlphaUnderlay />
		</div>

		<p>
			Linear's card stops the strip. Its surfaces look like white at 3 and 5 percent, and
			they are, only mixed ahead of time into solid hexes: white at 3% over
			<code translate='no'>#08090a</code> is exactly <code translate='no'>#0f1011</code>. Vercel's card is
			solid too, and only its edge picks up the red. Resend and Raycast let the strip
			through the whole card.
		</p>
		<p>
			Text is where it matters. Linear and Vercel set every line of text in a solid color.
			Resend's dimmest step is transparent, at about 48%, and it only marks the comments in
			its code blocks. Raycast sets its descriptions in white at 40%. On its own canvas that
			is 3.75:1, which fails AA for text that size. The other three keep their secondary
			text above 6:1.
		</p>

		<h2 {@attach reveal}>the header</h2>
		<p>
			The blur is where the four split furthest. Vercel's page has no
			<code translate='no'>backdrop-filter</code> anywhere; its header turns opaque black with a
			one-pixel line once the page moves. Linear's header is glass at 20px from the top.
			Raycast's floats over the page as a pill, and the page carries 86
			<code translate='no'>backdrop-filter</code> declarations, most of them on a macOS desktop it
			rebuilds in CSS further down. Raycast sells an app that lives in a window on a Mac and
			has the most glass. Vercel sells infrastructure and has none.
		</p>
		<p>
			Resend's is the one to take apart. Its bottom edge is not a border. A pseudo-element
			hangs 120px below the bar with <code translate='no'>blur(40px) brightness(2)</code> on it, and a
			mask cuts it down to a single row of pixels. Over black that row is invisible. Slide a
			colored block under it and the edge lights up in the block's color.
		</p>

		<div {@attach reveal}>
			<HeaderBench />
		</div>

		<h2 {@attach reveal}>the line around everything</h2>
		<p>
			Cards on all four pages have a one-pixel edge, and no two sites draw it the same
			way. Vercel uses no CSS borders at all. The browser found zero elements with a border
			width, and every edge is a box-shadow ring, which takes no layout space, so a hover
			can thicken it without moving anything. Linear lights its borders at one corner
			through a radial mask. Resend paints a gradient into the border box behind a solid
			padding box. Raycast draws a gradient ring on a pseudo-element and cuts the middle out
			with <code translate='no'>mask-composite</code>.
		</p>

		<div {@attach reveal}>
			<HairlineBench />
		</div>

		<p>
			The inset highlight, the white line along the inside top edge that gets copied first
			from this look, is rarer than its reputation. Raycast uses it on its windows and its
			nav. Linear hides one at 4% inside a button. Resend has one, on a status pill in the
			footer. Vercel has none.
		</p>

		<h2 {@attach reveal}>where the color went</h2>
		<p>
			None of the four puts color in its own chrome. Each one keeps it inside something.
		</p>

		<dl class='ledger' {@attach reveal}>
			{#each ledger as row (row.site)}
				<div class='ledger-row'>
					<dt><code translate='no'>{row.count}</code> {row.site}</dt>
					<dd>{row.where}</dd>
				</div>
			{/each}
		</dl>
		<p class='fig-note'>
			Counted as visible elements with a real hue in their text, background or border, at
			rest. The four counts used slightly different cutoffs for what counts as a hue, so read
			them as sizes, not exact scores.
		</p>

		<p>
			Linear's indigo survives in the sidebar icons of its mockup and in
			<code translate='no'>::selection</code>. Select some text on its homepage and the brand shows
			up. Raycast has the most color of the four and still keeps the rule: nearly all its red
			is in the hero canvas, and the rest is its logo and a few faint glows. Resend does the opposite with its own 3D. The cube in its
			hero is a live Spline scene, and its parent carries
			<code translate='no'>filter: grayscale(1)</code>.
		</p>

		<div {@attach reveal}>
			<RedCanvas />
		</div>

		<h2 {@attach reveal}>the headline</h2>
		<p>
			Three of the four ship gradient text in their CSS. Only Resend puts it on the page, on
			the H1 and all nine section headings. Vercel, Linear and Raycast wrote the recipe and
			left it unused. Resend is also the only one with a serif headline, Domaine at 96px, on
			a page that sells an email API. Nobody else in the group made that choice.
		</p>
		<p>
			Tracking tightens with size on two of them. Vercel steps from 0 at 16px to -6% at
			48px and up. Linear holds -0.022em from 32px and -0.012em below it. Raycast leaves it
			at normal.
		</p>

		<div {@attach reveal}>
			<TypeSpecimen />
		</div>

		<h2 {@attach reveal}>blur as motion</h2>
		<p>
			Linear is the only one of the four where blur is the effect rather than the material.
			Its H1 lines arrive in the HTML with a blur already on them, and a script tweens them
			sharp. Take the blur away and the same entrance is an ordinary fade.
		</p>

		<div {@attach reveal}>
			<BlurIn />
		</div>

		<p>
			None of the four uses CSS scroll-driven animation for its reveals; all of them run on
			IntersectionObserver or a motion library. Vercel removed the word-by-word heading
			reveal it had in August and now has no scroll animation at all.
		</p>

		<h2 {@attach reveal}>the verdict</h2>
		<p>
			The black is the part of this look anyone can copy, and it's the part that tells
			these four apart least. Two of them use the same <code translate='no'>#000</code>. What tells
			them apart is a serif, a triangle, a real app window and a red canvas.
		</p>
		<p>
			What carries over is smaller and harder. Decide which parts of the page may be
			transparent, and keep text off the list. Mix the surface levels ahead of time, the way
			Linear does. Draw the edge as a ring or a masked line. Keep color inside the product.
			Use blur where there is something behind it to blur. Glass over flat black is a
			gradient and a noise tile, which is what Resend's buttons turn out to be.
		</p>

		<p class='method' {@attach reveal}>
			method: each homepage as served on 23/9/2026. the css chunks were read and grepped for
			tokens, transparent colors, curves and filters, then each page was scrolled in 400px
			steps in headless chromium at 1440x900 in dark mode and every visible element and
			pseudo-element was read with getComputedStyle. contrast is wcag 2.x with transparent
			colors composited over the canvas first; the ratios on this page are computed live
			from the same values. the plates run each site's css as served. the faces are
			stand-ins, and radii are held equal where they would distract from the line.
		</p>

		<footer class='close' {@attach reveal}>
			<a href='/studies' class='chip'>
				<!-- phosphor: arrow-left -->
				<svg width='12' height='12' viewBox='0 0 256 256' aria-hidden='true'>
					<path
						fill='currentColor'
						d='M224 128a8 8 0 0 1-8 8H59.31l58.35 58.34a8 8 0 0 1-11.32 11.32l-72-72a8 8 0 0 1 0-11.32l72-72a8 8 0 0 1 11.32 11.32L59.31 120H216a8 8 0 0 1 8 8Z'
					/>
				</svg>
				back to the contents
			</a>
		</footer>
	</article>
</div>

<style>
	/* The sheet geometry lives in the layout; this page only dresses it. */
	.top {
		display: flex;
	}

	.mark {
		color: var(--ink);
		transition: color 250ms cubic-bezier(0.22, 0.7, 0.25, 1);
	}

	.mark:hover {
		color: var(--accent);
	}

	.mark :global(.mark-logo) {
		display: block;
		width: 6rem;
		height: auto;
	}

	article {
		margin-top: clamp(2.5rem, 7vh, 4.5rem);
	}

	h1 {
		font-size: clamp(2.1rem, 4.5vw, 3.1rem);
		margin: 0;
	}

	.imprint {
		margin: 0.9rem 0 0;
		font-size: 0.8rem;
		color: var(--ink-muted);
	}

	.imprint code {
		font-size: 0.75rem;
	}

	.lede {
		margin-top: 2.2rem;
		font-size: 1.08rem;
	}

	h2 {
		font-size: 1.3rem;
		margin: 3.6rem 0 1rem;
	}

	p {
		max-width: 40rem;
		margin: 1rem 0;
	}

	p code {
		font-size: 0.84em;
		color: var(--ink);
		background: var(--bg-soft);
		padding: 0.05em 0.35em;
	}

	.fig-note {
		font-size: 0.85rem;
		color: var(--ink-muted);
	}

	/* The ledger: the count hung in its own column, one hairline above
	   each row, the same beat as the contents. */
	.ledger {
		margin: 2rem 0 0.75rem;
	}

	.ledger-row {
		display: grid;
		grid-template-columns: 9rem minmax(0, 1fr);
		gap: 1rem;
		border-top: 1px solid var(--rule);
		padding: 0.9rem 0;
	}

	.ledger dt {
		font-weight: 700;
		color: var(--ink);
	}

	.ledger dt code {
		display: inline-block;
		min-width: 2.6rem;
		font-weight: 400;
		color: var(--ink-muted);
	}

	.ledger dd {
		margin: 0;
		font-size: 0.92rem;
		color: var(--ink-muted);
	}

	@media (max-width: 34rem) {
		.ledger-row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.3rem;
		}
	}

	.method {
		margin-top: 4rem;
		font-family: var(--font-code);
		font-size: 0.72rem;
		line-height: 1.8;
		color: var(--ink-muted);
	}

	.close {
		margin-top: 3rem;
	}
</style>
