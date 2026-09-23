<script lang='ts'>
	import Flourish from './Flourish.svelte'

	// The table's wordmark: the word itself, under the hand stroke the
	// old script logo carried. Sized by the caller's font-size.
	const { class: className = '' }: { class?: string } = $props()
</script>

<span class={`mark ${className}`}>
	studies<Flourish class='mark-stroke' />
</span>

<style>
	.mark {
		position: relative;
		display: inline-block;
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1;
	}

	.mark :global(.mark-stroke) {
		position: absolute;
		left: 0;
		bottom: -0.26em;
		width: 100%;
		height: auto;
		color: inherit;
	}
</style>
