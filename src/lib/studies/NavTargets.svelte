<script lang='ts'>
	import { NAV_HEIGHT, navLinks, TARGET } from './apple'

	// The bar's links span x 222 to 1218 at 1440 wide; a little air
	// either side, then the whole strip scales down to the sheet.
	const LEFT = 206
	const SPAN = 1028
	const BELOW = 30

	let w = $state(736)
	let shown = $state(false)

	const k = $derived(Math.min(1, Math.max(0.62, w / SPAN)))
</script>

<figure class='targets'>
	<div class='specimen' bind:clientWidth={w}>
		<div class='scroller'>
			<div class='stage' style:width={`${SPAN * k}px`} style:height={`${(NAV_HEIGHT + BELOW) * k}px`}>
				<div class='strip' style:width={`${SPAN}px`} style:transform={`scale(${k})`}>
					<div class='bar' style:height={`${NAV_HEIGHT}px`}>
						{#each navLinks as link (link.label)}
							<span
								class={['link', shown && 'shown', link.width < TARGET && 'narrow']}
								style:left={`${link.x - LEFT}px`}
								style:width={`${link.width}px`}
							>
								{#if link.icon === 'apple'}
									<!-- phosphor: apple-logo -->
									<svg width='15' height='15' viewBox='0 0 256 256' aria-label='Apple'>
										<path fill='currentColor' d='M223.3 169.59a8.07 8.07 0 0 0-2.8-3.4C203.53 154.53 200 134.64 200 120c0-17.67 13.47-33.06 21.5-40.67a8 8 0 0 0 0-11.62C208.82 55.74 187.82 48 168 48a72.2 72.2 0 0 0-40 12.13a71.56 71.56 0 0 0-90.71 9.09A74.63 74.63 0 0 0 16 123.4a127.06 127.06 0 0 0 40.14 89.73A39.8 39.8 0 0 0 83.59 224h87.68a39.84 39.84 0 0 0 29.12-12.57a125 125 0 0 0 17.82-24.6c7.02-12.83 6.12-14.83 5.09-17.24m-34.63 30.94a23.76 23.76 0 0 1-17.4 7.47H83.59a23.82 23.82 0 0 1-16.44-6.51A111.14 111.14 0 0 1 32 123a58.5 58.5 0 0 1 16.65-42.53A54.8 54.8 0 0 1 88 64h.78A55.45 55.45 0 0 1 123 76.28a8 8 0 0 0 10 0A55.44 55.44 0 0 1 168 64a70.64 70.64 0 0 1 36 10.35c-13 14.52-20 30.47-20 45.65c0 23.77 7.64 42.73 22.18 55.3a105.8 105.8 0 0 1-17.51 25.23M128.23 30A40 40 0 0 1 167 0h1a8 8 0 0 1 0 16h-1a24 24 0 0 0-23.24 18a8 8 0 1 1-15.5-4Z' />
									</svg>
								{:else if link.icon === 'search'}
									<!-- phosphor: magnifying-glass -->
									<svg width='15' height='15' viewBox='0 0 256 256' aria-label='Search'>
										<path fill='currentColor' d='m229.66 218.34l-50.07-50.06a88.11 88.11 0 1 0-11.31 11.31l50.06 50.07a8 8 0 0 0 11.32-11.32M40 112a72 72 0 1 1 72 72a72.08 72.08 0 0 1-72-72' />
									</svg>
								{:else if link.icon === 'bag'}
									<!-- phosphor: handbag -->
									<svg width='15' height='15' viewBox='0 0 256 256' aria-label='Shopping bag'>
										<path fill='currentColor' d='m239.89 198.12l-14.26-120a16 16 0 0 0-16-14.12H176a48 48 0 0 0-96 0H46.33a16 16 0 0 0-16 14.12l-14.26 120A16 16 0 0 0 20 210.6a16.13 16.13 0 0 0 12 5.4h191.92a16.13 16.13 0 0 0 12.08-5.4a16 16 0 0 0 3.89-12.48M128 32a32 32 0 0 1 32 32H96a32 32 0 0 1 32-32M32 200L46.33 80H80v24a8 8 0 0 0 16 0V80h64v24a8 8 0 0 0 16 0V80h33.75l14.17 120Z' />
									</svg>
								{:else}
									{link.label}
								{/if}
								<code translate='no' class='width'>{Math.round(link.width)}</code>
							</span>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>

	<label class='toggle'>
		<input type='checkbox' bind:checked={shown} />
		show the hit areas
	</label>
</figure>

<style>
	.targets {
		margin: 2rem 0;
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}

	.specimen {
		background: #f5f5f7;
		color-scheme: light;
	}

	/* Narrow sheets keep the bar legible and let it pan instead. */
	.scroller {
		overflow-x: auto;
		overscroll-behavior-x: contain;
	}

	.stage {
		position: relative;
	}

	.strip {
		position: absolute;
		inset: 0 auto auto 0;
		height: 100%;
		transform-origin: 0 0;
	}

	/* The home page's bar at rest: white at 80% over the page. */
	.bar {
		position: relative;
		background: rgba(255, 255, 255, 0.8);
	}

	.link {
		position: absolute;
		top: 0;
		bottom: 0;
		display: grid;
		place-items: center;
		font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, var(--font-body);
		font-size: 12px;
		letter-spacing: -0.01em;
		color: rgba(0, 0, 0, 0.8);
		white-space: nowrap;
		transition:
			background-color 180ms var(--press),
			box-shadow 180ms var(--press);
	}

	.link svg {
		display: block;
	}

	.link.shown {
		background: rgba(29, 26, 22, 0.06);
		box-shadow: inset 0 0 0 1px var(--ink);
	}

	/* Under 44 wide: the same box, drawn as a dashed outline. */
	.link.shown.narrow {
		box-shadow: none;
		outline: 1.5px dashed var(--ink);
		outline-offset: -1.5px;
	}

	.width {
		position: absolute;
		top: calc(100% + 8px);
		left: 50%;
		translate: -50% 0;
		font-family: var(--font-code);
		font-size: 13px;
		color: var(--ink-muted);
		opacity: 0;
		transition: opacity 180ms var(--press);
	}

	.narrow .width {
		color: var(--ink);
		font-weight: 700;
	}

	.shown .width {
		opacity: 1;
	}

	.toggle {
		align-self: flex-start;
	}

	@media (prefers-reduced-motion: reduce) {
		.link,
		.width {
			transition: none;
		}
	}
</style>
