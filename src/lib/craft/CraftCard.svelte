<script lang='ts'>
	import type { CraftTile } from './types'
	import { clip } from './clip'
	import { LINK_LABEL, monthLabel } from './craft'

	interface Props {
		tile: CraftTile
		/** The first row paints with the page instead of waiting its turn. */
		eager?: boolean
		/** Unlinked tiles open the clip large. */
		onopen?: () => void
	}

	const { tile, eager = false, onopen }: Props = $props()

	const media = $derived(tile.media)
	const external = $derived(tile.href?.startsWith('http') ?? false)
</script>

{#snippet frame()}
	<span
		class={['frame', tile.ground, tile.caption === 'top' && 'top']}
		style:aspect-ratio='{media.width} / {media.height}'
	>
		<img class='lqip' src={media.lqip} alt='' aria-hidden='true' />
		<img
			class='poster'
			src='/craft-media/{media.poster}'
			alt=''
			width={media.width}
			height={media.height}
			loading={eager ? 'eager' : 'lazy'}
			fetchpriority={eager ? 'high' : undefined}
			decoding='async'
		/>
		{#if media.video}
			<video
				{@attach clip(`/craft-media/${media.video}`)}
				muted
				loop
				playsinline
				disablepictureinpicture
				preload='none'
				aria-hidden='true'
			></video>
		{/if}
		<span class='caption'>
			<span class='title'>{tile.title}<span class='sr-only'>, {tile.project}. {tile.about}</span></span>
			<time class='date' datetime={tile.made}>{monthLabel(tile.made)}</time>
		</span>
	</span>
{/snippet}

{#if tile.href}
	<a
		class='tile linked'
		style:--order={tile.order}
		href={tile.href}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener' : undefined}
	>
		{@render frame()}
		<span class='sr-only'>{LINK_LABEL[tile.link ?? 'production']}</span>
	</a>
{:else}
	<button type='button' class='tile viewable' style:--order={tile.order} aria-haspopup='dialog' onclick={onopen}>
		{@render frame()}
		<span class='sr-only'>View larger</span>
	</button>
{/if}

<style>
	.tile {
		position: relative;
		display: block;
		width: 100%;
		margin: 0 0 var(--gap);
		overflow: hidden;
		background: var(--c-card);
		border: 1px solid var(--c-edge);
		border-radius: 12px;
		/* Its own layer, so the clips inside never repaint the wall. */
		transform: translateZ(0);
		color: var(--c-ink);
		text-decoration: none;
	}

	.linked {
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	.viewable {
		padding: 0;
		font: inherit;
		text-align: inherit;
		cursor: zoom-in;
		-webkit-tap-highlight-color: transparent;
	}

	.linked:focus-visible,
	.viewable:focus-visible {
		outline: 2px solid var(--c-focus);
		outline-offset: 2px;
	}

	/* Composited media slip past overflow's rounded corners in GPU Firefox;
	   clip-path holds them. 11px is the tile's 12px less its 1px edge. */
	.frame {
		--round: 11px;
		position: relative;
		display: block;
		overflow: hidden;
		border-radius: var(--round);
		clip-path: inset(0 round var(--round));
	}

	.lqip,
	.poster,
	video {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.lqip {
		filter: blur(32px);
		transform: scale(1.1);
	}

	video {
		opacity: 0;
		transition: opacity 200ms ease;
	}

	.tile:global([data-playing]) video {
		opacity: 1;
	}

	:global(html[data-viewing]) video {
		visibility: hidden;
	}

	/* The caption sits on the clip with a soft scrim of the clip's own
	   ground, so it reads on footage of either kind. */
	.frame::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -64px;
		width: 100%;
		height: 200px;
		pointer-events: none;
	}

	.dark::after {
		background: linear-gradient(to top, rgb(0 0 0 / 0.9), 50%, rgb(0 0 0 / 0));
	}

	.light::after {
		background: linear-gradient(rgb(255 255 255 / 0), 50%, rgb(255 255 255 / 0.9));
	}

	.top::after {
		top: -64px;
		bottom: auto;
		transform: rotate(180deg);
	}

	.caption {
		position: absolute;
		z-index: 1;
		left: 0;
		bottom: 8px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		width: 100%;
		height: 32px;
		padding: 16px;
		font-size: 0.8125rem;
		line-height: 1.75rem;
		white-space: nowrap;
	}

	.top .caption {
		top: 8px;
		bottom: auto;
	}

	.title {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.dark .title {
		color: #ededed;
	}

	.dark .date {
		color: rgb(255 255 255 / 0.59);
	}

	.light .title {
		color: #171717;
	}

	.light .date {
		color: rgb(0 0 0 / 0.57);
	}

	/* A linked tile shows where it leads with a small arrow chip in its
	   free corner, under the pointer or focus; touch screens keep it on. */
	.linked::before,
	.linked::after {
		content: '';
		position: absolute;
		top: 12px;
		right: 12px;
		pointer-events: none;
		transition:
			opacity 150ms ease,
			translate 150ms ease,
			background-color 150ms ease;
	}

	.linked::after {
		z-index: 3;
		width: 30px;
		height: 30px;
		border-radius: 999px;
	}

	/* phosphor: arrow-up-right */
	.linked::before {
		z-index: 4;
		width: 14px;
		height: 14px;
		margin: 8px 8px 0 0;
		background: currentColor;
		mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath d='M200 64v104a8 8 0 0 1-16 0V83.31L69.66 197.66a8 8 0 0 1-11.32-11.32L172.69 72H88a8 8 0 0 1 0-16h104a8 8 0 0 1 8 8'/%3E%3C/svg%3E")
			center / contain no-repeat;
	}

	.linked:has(.top)::before,
	.linked:has(.top)::after {
		top: auto;
		bottom: 12px;
	}

	.linked:has(.top)::before {
		margin: 0 8px 8px 0;
	}

	.linked:has(.dark)::after {
		background: rgb(0 0 0 / 0.42);
		box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.14);
	}

	.linked:has(.dark)::before {
		color: #ededed;
	}

	.linked:has(.light)::after {
		background: rgb(255 255 255 / 0.72);
		box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.1);
	}

	.linked:has(.light)::before {
		color: #171717;
	}

	.linked:is(:hover, :focus-visible)::before {
		translate: 1px -1px;
	}

	.linked:has(.dark):is(:hover, :focus-visible)::after {
		background: rgb(0 0 0 / 0.6);
	}

	.linked:has(.light):is(:hover, :focus-visible)::after {
		background: rgb(255 255 255 / 0.92);
	}

	@media (hover: hover) {
		.linked:not(:hover, :focus-visible)::before,
		.linked:not(:hover, :focus-visible)::after {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.linked::before {
			translate: none !important;
		}
	}
</style>
