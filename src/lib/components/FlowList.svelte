<script lang='ts'>
	import type { FlowItem } from '$lib/types'
	import { lineStarts } from '$lib/line-starts'
	import Noted from './Noted.svelte'

	type Props = { items: FlowItem[] }
	const { items }: Props = $props()
</script>

<!-- Each separator hangs in the gap before its item, and lineStarts hides
     the one that would open a line. Phones stack the items instead, with
     a hanging indent so a wrapped item never reads as two. -->
<ul
	class='mt-5 flex flex-col gap-y-1 leading-relaxed text-[var(--ink-muted)] sm:flex-row sm:flex-wrap sm:gap-x-7'
	{@attach lineStarts}
>
	{#each items as it, j (typeof it === 'string' ? it : it.label)}
		<li class='group relative pl-4 -indent-4 sm:pl-0 sm:indent-0'>
			{#if j > 0}<span
				class='absolute top-0 -left-3.5 hidden -translate-x-1/2 text-[var(--rule)] sm:inline sm:group-data-line-start:hidden'
				aria-hidden='true'
			>·</span>{/if}{#if typeof it === 'string'}{it}{:else}<Noted label={it.label} note={it.note} />{/if}
		</li>
	{/each}
</ul>
