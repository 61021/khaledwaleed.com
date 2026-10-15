<script lang='ts'>
	import type { CraftTile } from './types'
	import { clip } from './clip'
	import { LINK_LABEL, monthLabel } from './craft'

	interface Props {
		tile: CraftTile
		/** The first row paints with the page instead of waiting its turn. */
		eager?: boolean
	}

	const { tile, eager = false }: Props = $props()

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
		<span class='cta'>{LINK_LABEL[tile.link ?? 'production']}</span>
	</a>
{:else}
	<figure class='tile' style:--order={tile.order}>
		{@render frame()}
	</figure>
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
		padding: 4px;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	.linked:focus-visible {
		outline: 2px solid var(--c-focus);
		outline-offset: 2px;
	}

	.frame {
		position: relative;
		display: block;
		overflow: hidden;
		transform: translateZ(0);
	}

	.linked .frame {
		border-radius: 8px;
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

	.cta {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 40px;
		margin-top: 4px;
		border-radius: 8px;
		background: var(--c-well);
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--c-ink);
		transition: background-color 150ms ease;
	}

	.linked:hover .cta,
	.linked:focus-visible .cta {
		background: var(--c-well-hover);
	}
</style>
