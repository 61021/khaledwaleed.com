<script lang='ts'>
	import type { Attachment } from 'svelte/attachments'
	import type { CraftTile } from './types'
	import { LINK_LABEL, monthLabel } from './craft'

	interface Props {
		tiles: CraftTile[]
		/** The tile on show, or null while closed. */
		index: number | null
		onclose: () => void
		onstep: (delta: number) => void
	}

	const { tiles, index, onclose, onstep }: Props = $props()

	const tile = $derived(index === null ? null : tiles[index])
	const external = $derived(tile?.href?.startsWith('http') ?? false)

	// The dialog opens as a modal whenever a tile is chosen, and hands
	// focus back to whatever opened it.
	let opener: HTMLElement | null = null
	const modal: Attachment<HTMLDialogElement> = (dialog) => {
		if (index !== null && !dialog.open) {
			opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
			dialog.showModal()
			hush(true)
		}
		if (index === null && dialog.open)
			dialog.close()
	}

	// The wall's own clips rest while one plays large: video layers can
	// paint over a modal's backdrop, and nobody watches them behind it.
	function hush(on: boolean) {
		document.documentElement.toggleAttribute('data-viewing', on)
		document.dispatchEvent(new Event('craftviewer'))
	}

	function closed() {
		hush(false)
		onclose()
		opener?.focus()
		opener = null
	}

	function keydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
			e.preventDefault()
			onstep(e.key === 'ArrowRight' ? 1 : -1)
		}
	}

	// A press on the dim surround, not on the clip or its words, closes.
	function backdrop(e: MouseEvent) {
		if (e.target === e.currentTarget || (e.target as Element).classList.contains('stage'))
			(e.currentTarget as HTMLDialogElement).close()
	}
</script>

<dialog
	{@attach modal}
	class='viewer'
	aria-label={tile ? `${tile.title}, ${tile.project}` : 'Clip'}
	onclose={closed}
	onkeydown={keydown}
	onclick={backdrop}
>
	{#if tile}
		<div class='stage'>
			<figure class='piece' style:--ratio='{tile.media.width} / {tile.media.height}'>
				<div class={['media', tile.ground]}>
					{#key tile.id}
						{#if tile.media.video}
							<video
								src='/craft-media/{tile.media.video}'
								poster='/craft-media/{tile.media.poster}'
								autoplay
								muted
								loop
								playsinline
								disablepictureinpicture
							></video>
						{:else}
							<img src='/craft-media/{tile.media.poster}' alt={tile.about} width={tile.media.width} height={tile.media.height} />
						{/if}
					{/key}
				</div>
				<figcaption class='label'>
					<div class='line'>
						<span class='name'>{tile.title}</span>
						<span class='meta'>{tile.project} · <time datetime={tile.made}>{monthLabel(tile.made)}</time></span>
						{#if tile.href}
							<a
								class='visit'
								href={tile.href}
								target={external ? '_blank' : undefined}
								rel={external ? 'noopener' : undefined}
							>
								{LINK_LABEL[tile.link ?? 'production']}
								<!-- phosphor: arrow-up-right -->
								<svg width='14' height='14' viewBox='0 0 256 256' aria-hidden='true'><path fill='currentColor' d='M200 64v104a8 8 0 0 1-16 0V83.31L69.66 197.66a8 8 0 0 1-11.32-11.32L172.69 72H88a8 8 0 0 1 0-16h104a8 8 0 0 1 8 8' /></svg>
							</a>
						{/if}
					</div>
					<p class='about'>{tile.about}</p>
				</figcaption>
			</figure>
		</div>

		<button type='button' class='key close' aria-label='Close' onclick={e => (e.currentTarget.closest('dialog') as HTMLDialogElement).close()}>
			<!-- phosphor: x -->
			<svg width='20' height='20' viewBox='0 0 256 256' aria-hidden='true'><path fill='currentColor' d='M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z' /></svg>
		</button>
		<button type='button' class='key prev' aria-label='Previous clip' onclick={() => onstep(-1)}>
			<!-- phosphor: caret-left -->
			<svg width='20' height='20' viewBox='0 0 256 256' aria-hidden='true'><path fill='currentColor' d='M165.66 202.34a8 8 0 0 1-11.32 11.32l-80-80a8 8 0 0 1 0-11.32l80-80a8 8 0 0 1 11.32 11.32L91.31 128Z' /></svg>
		</button>
		<button type='button' class='key next' aria-label='Next clip' onclick={() => onstep(1)}>
			<!-- phosphor: caret-right -->
			<svg width='20' height='20' viewBox='0 0 256 256' aria-hidden='true'><path fill='currentColor' d='m181.66 133.66l-80 80a8 8 0 0 1-11.32-11.32L164.69 128L90.34 53.66a8 8 0 0 1 11.32-11.32l80 80a8 8 0 0 1 0 11.32' /></svg>
		</button>
	{/if}
</dialog>

<style>
	.viewer {
		width: 100vw;
		height: 100dvh;
		max-width: none;
		max-height: none;
		margin: 0;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--c-ink);
		overscroll-behavior: contain;
	}

	.viewer::backdrop {
		background: rgb(4 4 4 / 0.9);
		transition: opacity 200ms ease;
	}

	@media (prefers-color-scheme: light) {
		.viewer::backdrop {
			background: rgb(244 244 242 / 0.94);
		}
	}

	.stage {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		padding: 64px 72px 32px;
		transition:
			opacity 200ms cubic-bezier(0.23, 1, 0.32, 1),
			scale 200ms cubic-bezier(0.23, 1, 0.32, 1);
	}

	@starting-style {
		.viewer[open] .stage {
			opacity: 0;
			scale: 0.97;
		}

		.viewer[open]::backdrop {
			opacity: 0;
		}
	}

	.piece {
		width: min(1280px, 100%, calc((100dvh - 200px) * var(--ratio)));
		margin: 0;
	}

	.media {
		position: relative;
		aspect-ratio: var(--ratio);
		overflow: hidden;
		border-radius: 12px;
		clip-path: inset(0 round 12px);
		background: var(--c-card);
		box-shadow: inset 0 0 0 1px var(--c-edge);
	}

	.media video,
	.media img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.label {
		padding: 14px 2px 0;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.line {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 4px 12px;
	}

	.name {
		font-weight: 500;
	}

	.meta {
		color: var(--c-muted);
	}

	.visit {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-left: auto;
		color: var(--c-ink);
		text-decoration: none;
		transition: opacity 150ms ease;
	}

	.visit:hover {
		opacity: 0.7;
	}

	.visit svg {
		transition: translate 150ms ease;
	}

	.visit:hover svg {
		translate: 1px -1px;
	}

	.about {
		margin: 4px 0 0;
		max-width: 62ch;
		color: var(--c-muted);
		text-wrap: pretty;
	}

	.key {
		position: fixed;
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		padding: 0;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--c-muted);
		cursor: pointer;
		transition:
			color 150ms ease,
			background-color 150ms ease,
			scale 150ms ease;
	}

	.key:hover {
		color: var(--c-ink);
		background: color-mix(in srgb, var(--c-ink) 8%, transparent);
	}

	.key:active {
		scale: 0.96;
	}

	.key:focus-visible,
	.visit:focus-visible {
		outline: 2px solid var(--c-focus);
		outline-offset: 2px;
	}

	.close {
		top: 12px;
		right: 12px;
	}

	.prev,
	.next {
		top: 50%;
		translate: 0 -50%;
	}

	.prev {
		left: 12px;
	}

	.next {
		right: 12px;
	}

	/* Phones: the clip takes the width, the keys sit under it. */
	@media (max-width: 640px) {
		.stage {
			padding: 64px 16px 88px;
		}

		.prev,
		.next {
			top: auto;
			bottom: 20px;
			translate: none;
		}

		.prev {
			left: calc(50% - 56px);
		}

		.next {
			right: calc(50% - 56px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.stage {
			transition: opacity 200ms ease;
		}

		@starting-style {
			.viewer[open] .stage {
				scale: 1;
			}
		}
	}

	:global(html:has(.viewer[open])) {
		overflow: hidden;
	}
</style>
