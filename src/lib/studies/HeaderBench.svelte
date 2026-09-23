<script lang='ts'>
	import type { SiteKey } from './types'
	import { palette, palettes } from './monochrome'

	const MAX = 300

	const boxes = [
		{ title: 'Deploy finished', line: 'Production is live on the new build.' },
		{ title: 'Three new issues', line: 'Two are assigned to you.' },
		{ title: 'Email delivered', line: 'Opened 4 minutes after it was sent.' },
	]

	let site = $state<SiteKey>('resend')
	let scroll = $state(0)
	const p = $derived(palette(site))
	const scrolled = $derived(scroll > 8)
</script>

<figure class='bench'>
	<fieldset class='seg'>
		<legend class='sr-only'>whose header</legend>
		{#each palettes as s (s.key)}
			<label class={['seg-option', site === s.key && 'on']}>
				<input class='sr-only' type='radio' name='header-site' value={s.key} bind:group={site} />
				{s.name}
			</label>
		{/each}
	</fieldset>

	<div class='specimen viewport' style:background={p.canvas} style:--canvas={p.canvas}>
		<div class='page' style:transform={`translateY(${-scroll}px)`} style:color={p.secondary}>
			<p class='lead' style:color={p.text}>the page underneath</p>
			<p>Drag it up under the header.</p>
			{#each boxes as box (box.title)}
				<div class='box'>
					<p class='box-title'>{box.title}</p>
					<p>{box.line}</p>
				</div>
			{/each}
		</div>

		<header class={['head', site, scrolled && 'scrolled']}>
			<span style:color={p.text}>product</span>
			<span style:color={p.secondary}>pricing</span>
			<span style:color={p.secondary}>docs</span>
		</header>
	</div>

	<label class='dial'>
		<span class='dial-name'>scroll</span>
		<input type='range' min='0' max={MAX} step='1' bind:value={scroll} />
		<code translate='no' class='dial-value'>{scroll}px</code>
	</label>
</figure>

<style>
	.bench {
		margin: 2rem 0;
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}

	.viewport {
		height: 20rem;
	}

	.page {
		padding: 5.5rem 1.5rem 3rem;
		font-size: 0.92rem;
		line-height: 1.6;
	}

	.page p {
		margin: 0.6rem 0;
		max-width: 26rem;
	}

	.page .lead {
		font-size: 1.6rem;
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	.box {
		margin: 1.25rem 0;
		padding: 1.1rem 1.25rem 1.6rem;
		border-radius: 10px;
		background: #fff;
		color: #55514a;
	}

	.page .box p {
		margin: 0.2rem 0 0;
	}

	.page .box .box-title {
		color: #1d1a16;
		font-weight: 600;
	}

	.head {
		position: absolute;
		inset: 0 0 auto;
		height: 3.5rem;
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 0 1.5rem;
		font-size: 0.85rem;
		z-index: 1;
	}

	/* vercel: transparent at the top, opaque black plus an alpha
	   hairline once the page moves. No glass at all. */
	.head.vercel.scrolled {
		background: #000;
		box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.14);
	}

	/* linear: glass from the start. */
	.head.linear {
		backdrop-filter: blur(20px);
		background: linear-gradient(180deg, #0b0b0bcc 0%, color-mix(in oklab, #0b0b0bcc 100%, transparent 5%) 100%);
		border-bottom: 1px solid #ffffff14;
	}

	/* resend: two pseudo-elements fade in on scroll. ::after is the
	   dark glass; ::before hangs 120px below the bar and is masked to a
	   single 1px row, so the only thing it shows is the bar's bottom
	   edge, blurred and doubled in brightness from what is under it. */
	.head.resend::before,
	.head.resend::after {
		content: '';
		position: absolute;
		pointer-events: none;
		opacity: 0;
		transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	.head.resend::after {
		inset: 0;
		z-index: -1;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(12px);
	}

	.head.resend::before {
		inset: 0 0 -120px;
		backdrop-filter: blur(40px) brightness(2);
		mask-image: linear-gradient(black, black);
		mask-size: 100% 1px;
		mask-repeat: no-repeat;
		mask-position: 0 calc(100% - 120px);
	}

	.head.resend.scrolled::before,
	.head.resend.scrolled::after {
		opacity: 1;
	}

	/* raycast: a floating pill, inset from the edges, glass at 5px,
	   with a white highlight along its top inside edge. */
	.head.raycast {
		inset: 0.5rem 0.5rem auto;
		height: 3rem;
		border-radius: 12px;
		backdrop-filter: blur(5px);
		background: linear-gradient(137deg, #111214bf 4.87%, #0c0d0fe6 75.88%);
		border: 1px solid #ffffff0f;
		box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.15);
	}

	.dial {
		max-width: 26rem;
	}
</style>
