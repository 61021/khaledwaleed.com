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

</script>

<Seo
	title='A study of monochrome'
	bareTitle
	description='Resend, Vercel, Linear and Raycast look alike and are built differently. Live specimens of their blacks, glass, edges, color and type.'
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
			Resend, Vercel, Linear and Raycast look alike. They aren't built alike.
		</p>

		<h2 {@attach reveal}>the black</h2>
		<p>Two are pure black. Two have blue in them. Raise the exposure.</p>

		<div {@attach reveal}>
			<BlackPlates />
		</div>

		<h2 {@attach reveal}>what shows through</h2>
		<p>
			Linear and Vercel make their cards solid. Resend and Raycast let the page show through.
			Raycast does it to its text too, and its faint text gets hard to read.
		</p>

		<div {@attach reveal}>
			<AlphaUnderlay />
		</div>

		<h2 {@attach reveal}>the header</h2>
		<p>
			Vercel's is solid black. Linear's and Raycast's are frosted glass. Resend's bottom edge
			lights up when something passes under it.
		</p>

		<div {@attach reveal}>
			<HeaderBench />
		</div>

		<h2 {@attach reveal}>the edge</h2>
		<p>Each one draws the thin line around a card its own way. Look at the corners.</p>

		<div {@attach reveal}>
			<HairlineBench />
		</div>

		<h2 {@attach reveal}>the color</h2>
		<p>
			None of them puts color on the page itself. Raycast pours all its red into one picture.
			Resend turns its own 3D gray.
		</p>

		<div {@attach reveal}>
			<RedCanvas />
		</div>

		<h2 {@attach reveal}>the type</h2>
		<p>
			Resend sets its headlines in Domaine, a serif, and is the only one still using gradient
			text. Vercel uses Geist. Linear and Raycast both use Inter.
		</p>

		<div {@attach reveal}>
			<TypeSpecimen />
		</div>

		<h2 {@attach reveal}>the blur</h2>
		<p>Of the four, only Linear moves with blur. Its headline comes into focus.</p>

		<div {@attach reveal}>
			<BlurIn />
		</div>

		<p class='close-line' {@attach reveal}>
			The black is the easy part to copy, and it's the one thing all four share.
		</p>

		<p class='method' {@attach reveal}>
			measured from each homepage on 23/9/2026. the fonts are stand-ins.
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

	.close-line {
		margin-top: 3.6rem;
		font-size: 1.08rem;
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
