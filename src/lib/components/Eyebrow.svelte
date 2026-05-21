<script lang="ts">
	// Small mono prompt-style label e.g. `~/about $`. Keeps the terminal flavor
	// as an accent without dressing every section in shell chrome.
	type Props = { label: string; class?: string };
	let { label, class: cls = '' }: Props = $props();
</script>

<div class="flex items-center gap-2 {cls}">
	<span class="h-px w-6 bg-[var(--brand)]/40"></span>
	<span class="font-mono text-xs tracking-tight text-[var(--brand)]">{label}</span>
</div>
