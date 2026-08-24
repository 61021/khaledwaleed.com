<script lang='ts'>
	import { Seo } from '$lib'
	import CreativeSpaceLogo from '$lib/space/CreativeSpaceLogo.svelte'
	import EaseFigure from '$lib/space/EaseFigure.svelte'
	import EasePlayground from '$lib/space/EasePlayground.svelte'
	import EaseRace from '$lib/space/EaseRace.svelte'
	import { cssKeywords, cubicBezier, linearStopsFn, sampleStops, stepsEase, toCssLinear } from '$lib/space/easing'
	import { spaceNumber, spaces } from '$lib/space/spaces'
	import { gsap } from 'gsap'

	const study = spaces[0]
	const number = spaceNumber(0)

	const [linearKw, easeKw, easeInKw, easeOutKw, easeInOutKw] = cssKeywords

	// steps() and a deliberately coarse linear() round out the css shelf
	const steps5 = stepsEase(5)
	const bounceStops = sampleStops(gsap.parseEase('bounce.out'), 12)
	const bounce12 = linearStopsFn(bounceStops)
	const bounce12Css = toCssLinear(bounceStops)

	// the ceiling: one cubic chasing an elastic settle
	const springFake = cubicBezier(0.34, 1.56, 0.64, 1)
	const elasticTarget = gsap.parseEase('elastic.out(1, 0.3)')

	// the gsap shelf, conjugated by one shared toggle
	type Dir = 'in' | 'out' | 'inOut'
	const families = ['sine', 'power2', 'power4', 'expo', 'circ', 'back', 'elastic', 'bounce']
	const dirs: Dir[] = ['in', 'out', 'inOut']
	let dir = $state<Dir>('out')
	const shelf = $derived(families.map(family => ({
		family,
		ease: `${family}.${dir}`,
		fn: gsap.parseEase(`${family}.${dir}`),
	})))
	// elastic.in dives to -0.35 and elastic.out rings past 1.35, so the
	// shared frame follows the conjugation instead of clipping it
	const shelfWin = $derived<[number, number]>(
		dir === 'out' ? [-0.1, 1.42] : dir === 'in' ? [-0.45, 1.08] : [-0.28, 1.28],
	)

	// the 80-stop transplant, printed in full below
	const transplant = toCssLinear(sampleStops(elasticTarget, 80))
</script>

<Seo
	title='A study of easing'
	description='CSS built-in easing functions plotted against GSAP eases: what one cubic-bezier can draw, what it cannot, and why GSAP named, parameterized curves win.'
	keywords={['easing functions', 'cubic-bezier', 'linear()', 'gsap eases', 'css transitions', 'web animation']}
	type='article'
	publishedTime={study.opened}
/>

<div class='study'>
	<header class='top'>
		<a href='/space' class='mark' aria-label='back to the creative space'>
			<CreativeSpaceLogo class='mark-svg' />
		</a>
	</header>

	<article>
		<h1>a study of easing</h1>
		<p class='imprint'><code translate='no'>{number}</code> · {study.openedLabel} · khaled waleed</p>

		<p class='lede'>
			An easing function bends time. The animation's clock runs 0 to 1 at a constant rate,
			and the ease maps each tick to how far the value has actually moved. Weight, snap,
			hesitation: the whole character of a motion lives in that map. CSS ships five bends.
			GSAP ships a vocabulary. The figures below run on the real engines, so press play on
			everything.
		</p>

		<div class='fig-grid two'>
			<EaseFigure
				label={linearKw.name}
				code={linearKw.code}
				fn={linearKw.fn}
				drive={{ engine: 'css', timing: linearKw.timing }}
			/>
			<EaseFigure
				label={easeOutKw.name}
				code={easeOutKw.code}
				fn={easeOutKw.fn}
				drive={{ engine: 'css', timing: easeOutKw.timing }}
			/>
		</div>

		<h2>the css set</h2>
		<p>
			Five keywords, and every one is a single <code translate='no'>cubic-bezier()</code> in different
			clothes. <code translate='no'>linear</code> leaves the handles on the diagonal; the other four move
			them a few tenths. The caption under each figure shows the four numbers its keyword
			stands for. Past the keywords you write your own numbers with
			<code translate='no'>cubic-bezier()</code>, hold frames with <code translate='no'>steps()</code>, or, since 2023,
			hand the browser a list of points with <code translate='no'>linear()</code> and let it connect the
			dots.
		</p>

		<div class='fig-grid'>
			{#each [easeKw, easeInKw, easeOutKw, easeInOutKw] as kw (kw.name)}
				<EaseFigure
					label={kw.name}
					code={kw.code}
					fn={kw.fn}
					drive={{ engine: 'css', timing: kw.timing }}
				/>
			{/each}
			<EaseFigure
				label='steps'
				code='steps(5)'
				fn={steps5}
				drive={{ engine: 'css', timing: 'steps(5)' }}
			/>
			<EaseFigure
				label='linear()'
				code={bounce12Css}
				fn={bounce12}
				drive={{ engine: 'css', timing: bounce12Css }}
			/>
		</div>
		<p class='fig-note'>
			The last figure is a bounce squeezed into 12 generated points. Keep the corners in
			mind; they come back at the end.
		</p>

		<h2>the ceiling</h2>
		<p>
			One cubic segment can change direction twice, and that is the whole budget. Push a
			y handle past 1 and you buy a single overshoot, the spring fake below. A real bounce
			turns six times. An elastic settle keeps turning until it dies out. No four numbers
			draw either shape, so past this line CSS needs a generated <code translate='no'>linear()</code>
			list, and somebody has to generate it.
		</p>

		<div class='fig-wide'>
			<EaseFigure
				label='the spring fake'
				code='cubic-bezier(0.34, 1.56, 0.64, 1)'
				fn={springFake}
				drive={{ engine: 'css', timing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
				window={[-0.1, 1.45]}
				width={200}
				duration={1.5}
				ghost={{ fn: elasticTarget, stroke: 'var(--accent)', dash: '4 3' }}
			/>
		</div>
		<p class='fig-note'>
			The dashed blue curve is <code translate='no'>elastic.out(1, 0.3)</code>, the shape the cubic is
			chasing. It catches the first swing and misses the rest.
		</p>

		<h2>the gsap shelf</h2>
		<p>
			GSAP names its curves and grades them. <code translate='no'>sine</code> is the gentlest;
			<code translate='no'>power1</code> through <code translate='no'>power4</code> raise the same shape by degrees;
			<code translate='no'>expo</code> and <code translate='no'>circ</code> sit at the steep end. <code translate='no'>back</code>
			overshoots, <code translate='no'>elastic</code> rings, <code translate='no'>bounce</code> lands like a dropped
			ball. Every family conjugates three ways, and the suffix is the design decision:
			<code translate='no'>.out</code> for arrivals, <code translate='no'>.in</code> for exits, <code translate='no'>.inOut</code> for
			moves between rest states. The name carries the intent.
			<code translate='no'>ease: "power2.out"</code> reads at a glance;
			<code translate='no'>cubic-bezier(0, 0, 0.58, 1)</code> sends the next reader off to plot it.
		</p>
		<p>
			GSAP will not even default to a straight line. Tweens fall back to
			<code translate='no'>power1.out</code>, because constant speed is the one thing almost nothing in
			the physical world moves at.
		</p>

		<fieldset class='seg dirs'>
			<legend class='sr-only'>conjugation</legend>
			{#each dirs as d (d)}
				<label class={['seg-option', dir === d && 'on']}>
					<input class='sr-only' type='radio' name='shelf-dir' value={d} bind:group={dir} />
					.{d}
				</label>
			{/each}
		</fieldset>

		<div class='fig-grid'>
			{#each shelf as item (item.family)}
				<EaseFigure
					label={item.family}
					code={`"${item.ease}"`}
					fn={item.fn}
					drive={{ engine: 'gsap', ease: item.ease }}
					window={shelfWin}
				/>
			{/each}
		</div>

		<h2>tuning</h2>
		<p>
			When a bezier needs more overshoot, you write four new numbers and squint at the
			plot. When <code translate='no'>back</code> needs more, you write <code translate='no'>back.out(2.5)</code>.
			Parameters carry the adjustment: overshoot for <code translate='no'>back</code>, amplitude and
			period for <code translate='no'>elastic</code>, a count for <code translate='no'>steps</code>. Same name,
			different temperament.
		</p>

		<EasePlayground />

		<h2>the transplant</h2>
		<p>
			Here is elastic in CSS, honestly. The one-cubic spring fake above was the best four
			numbers can do. The faithful version is <code translate='no'>linear()</code> fed 80 stops, and the
			80 stops come from sampling GSAP's own function:
		</p>

		<pre class='transplant'><code translate='no'>transition-timing-function: {transplant};</code></pre>

		<p>
			That string renders the right motion. It is also unreadable, untunable by hand, and
			authored by the library it stands in for. Change the period and you regenerate all
			80 numbers; in GSAP you edit one.
		</p>

		<EaseRace />

		<h2>the verdict</h2>
		<p>
			For interface furniture, CSS is enough and often better. A hover tint, a menu
			slide, a transform the compositor can run off the main thread with no JavaScript on
			the page: the five keywords and a hand-tuned bezier earn their keep there.
		</p>
		<p>
			GSAP's eases win the moment motion is designed. They are named and parameterized,
			so <code translate='no'>ease: "elastic.out(1, 0.3)"</code> records the decision in the code. They
			cover shapes one cubic never will. And each ease is a plain function of progress,
			so the same curve drives a transform today, a scroll position tomorrow, a WebGL
			uniform after that, then plays backwards inside a timeline without a rewrite.
			<code translate='no'>cubic-bezier()</code> styles one property on one element in one direction,
			and that is the gap the four numbers never close.
		</p>
		<p>
			The museum next door changes rooms on two cubic-beziers; that job is CSS-sized.
			Every figure here that rings or bounces runs on GSAP, because CSS still cannot draw
			those curves on its own.
		</p>

		<p class='method'>
			method: css curves are plotted from the spec's cubic-bezier math, gsap curves are
			sampled from gsap.parseEase (gsap 3.15). the dots run on the engines themselves:
			css transitions drive the pencil lanes, gsap tweens drive the blue. reduced motion
			is honored; demos jump to their endings and the curves stay still ink.
		</p>

		<footer class='close'>
			<a href='/space' class='chip'>
				<!-- phosphor: arrow-left -->
				<svg width='12' height='12' viewBox='0 0 256 256' aria-hidden='true'>
					<path
						fill='currentColor'
						d='M224 128a8 8 0 0 1-8 8H59.31l58.35 58.34a8 8 0 0 1-11.32 11.32l-72-72a8 8 0 0 1 0-11.32l72-72a8 8 0 0 1 11.32 11.32L59.31 120H216a8 8 0 0 1 8 8Z'
					/>
				</svg>
				back to the space
			</a>
		</footer>
	</article>
</div>

<style>
	.study {
		width: 100%;
		max-width: 46rem;
		margin: 0 auto;
		padding: 1.5rem 1.5rem 5rem;
	}

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

	.mark :global(.mark-svg) {
		width: 5.2rem;
		height: auto;
		display: block;
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

	.fig-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
		gap: 2.25rem 1.75rem;
		margin: 2rem 0;
	}

	.fig-grid.two {
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		margin-top: 2.5rem;
	}

	.fig-wide {
		max-width: 30rem;
		margin: 2rem 0 1.25rem;
	}

	.fig-note {
		font-size: 0.85rem;
		color: var(--ink-muted);
	}

	.dirs {
		justify-content: flex-end;
		margin: 1.75rem 0 0.5rem;
	}

	.transplant {
		background: var(--bg-soft);
		border: 1px solid var(--rule);
		padding: 1rem 1.25rem;
		margin: 1.5rem 0;
		font-size: 0.72rem;
		line-height: 1.8;
		color: var(--ink-muted);
		white-space: pre-wrap;
		overflow-wrap: anywhere;
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
