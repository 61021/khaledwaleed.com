<script lang='ts'>
	import { Seo } from '$lib'
	import { reveal } from '$lib/reveal'
	import { appleEase } from '$lib/studies/apple'
	import EaseFigure from '$lib/studies/EaseFigure.svelte'
	import { cssKeywords, cubicBezier } from '$lib/studies/easing'
	import FooterGray from '$lib/studies/FooterGray.svelte'
	import GlassBench from '$lib/studies/GlassBench.svelte'
	import NavTargets from '$lib/studies/NavTargets.svelte'
	import { studies, studyNumber } from '$lib/studies/studies'
	import StudiesLogo from '$lib/studies/StudiesLogo.svelte'
	import TrackingChart from '$lib/studies/TrackingChart.svelte'

	const index = studies.findIndex(s => s.slug === 'apple')
	const study = studies[index]
	const number = studyNumber(index)

	const appleCode = `cubic-bezier(${appleEase.join(', ')})`
	const easeInOut = cssKeywords.find(k => k.name === 'ease-in-out')!
</script>

<Seo
	title='A study of apple.com'
	bareTitle
	description='Apple writes its design guidelines for apps. Live figures of how apple.com follows them: type and tracking, 44px targets, the glass bar, contrast and motion.'
	keywords={['apple human interface guidelines', 'apple.com design', 'sf pro tracking', 'touch target size', 'backdrop-filter', 'design teardown']}
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
		<h1>a study of apple.com</h1>
		<p class='imprint'><code translate='no'>{number}</code> · {study.openedLabel}</p>

		<p class='lede'>
			Apple writes its design guidelines for apps. Its website follows most of them anyway.
		</p>

		<h2 {@attach reveal}>the type</h2>
		<p>
			Body text is 17px, the size iOS uses. Like Apple's tracking table, the site pulls body
			text tighter and lets headlines out, by its own numbers, and above 40px it pulls them
			tight again.
		</p>

		<div {@attach reveal}>
			<TrackingChart />
		</div>

		<h2 {@attach reveal}>the 44</h2>
		<p>
			The top bar is 44px tall, like the bar at the top of an iPhone app, and so is every link
			in it. Five links are narrower than 44, none narrower than 28, Apple's smallest.
		</p>

		<div {@attach reveal}>
			<NavTargets />
		</div>

		<h2 {@attach reveal}>the glass</h2>
		<p>
			The bar is frosted, white at 80% and blurred, with the color under it pushed up a little.
			Apple's apps moved to Liquid Glass in 2025, the website kept the frost.
		</p>

		<div {@attach reveal}>
			<GlassBench />
		</div>

		<h2 {@attach reveal}>the gray</h2>
		<p>
			The fine print in the footer passes the 4.5 to 1 minimum. Apple asks apps for 7 to 1 on
			small text.
		</p>

		<div {@attach reveal}>
			<FooterGray />
		</div>

		<h2 {@attach reveal}>the curve</h2>
		<p>Nearly half the timing curves in the site's CSS are this one. It's almost ease-in-out.</p>

		<div class='fig-grid' {@attach reveal}>
			<EaseFigure
				label='apple.com'
				code={appleCode}
				fn={cubicBezier(...appleEase)}
				window={[-0.08, 1.08]}
				drive={{ engine: 'css', timing: appleCode }}
			/>
			<EaseFigure
				label={easeInOut.name}
				code={easeInOut.code}
				fn={easeInOut.fn}
				window={[-0.08, 1.08]}
				drive={{ engine: 'css', timing: easeInOut.timing }}
			/>
		</div>

		<h2 {@attach reveal}>the settings</h2>
		<p>
			Turn on reduce motion and the home page's video never loads. Switch your system to dark
			and every page stays light.
		</p>

		<p class='close-line' {@attach reveal}>
			The website keeps most of the rules an app would, dark mode is the one it skips.
		</p>

		<p class='method' {@attach reveal}>
			measured from apple.com's home, iphone and mac pages on 14/10/2026, against the
			guidelines as published that day. off apple devices the font is a stand-in.
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

	.fig-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 2.25rem 1.75rem;
		max-width: 30rem;
		margin: 2rem 0;
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
