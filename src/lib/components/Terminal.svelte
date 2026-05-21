<script lang="ts">
	import { onMount } from 'svelte';

	type Line = { prompt?: boolean; text: string; color?: string };
	type Props = { lines?: Line[] };

	const defaultLines: Line[] = [
		{ prompt: true, text: 'whoami' },
		{ text: 'Khaled Waleed — Senior Software Engineer (Baghdad, Iraq)' },
		{ prompt: true, text: 'cat stack.txt' },
		{ text: 'frontend  → SvelteKit · Nuxt · TypeScript · Tailwind', color: 'accent' },
		{ text: 'backend   → Go · PostgreSQL · Redis · REST', color: 'accent' },
		{ text: 'platform  → Docker · Kubernetes · Linux · CI/CD', color: 'accent' },
		{ prompt: true, text: 'uptime' },
		{ text: 'currently shipping at Qi and Vitex.' }
	];

	let { lines = defaultLines }: Props = $props();

	let rendered = $state<{ prompt?: boolean; text: string; color?: string; partial: string }[]>([]);
	let cursorOn = $state(true);
	let done = $state(false);

	onMount(() => {
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const cursor = setInterval(() => (cursorOn = !cursorOn), 520);

		if (reduce) {
			rendered = lines.map((l) => ({ ...l, partial: l.text }));
			done = true;
			return () => clearInterval(cursor);
		}

		let li = 0;
		let ci = 0;
		rendered = [{ ...lines[0], partial: '' }];

		const tick = () => {
			if (li >= lines.length) {
				done = true;
				return;
			}
			const line = lines[li];
			if (ci < line.text.length) {
				ci++;
				rendered[li] = { ...line, partial: line.text.slice(0, ci) };
				rendered = rendered;
				const delay = line.prompt ? 22 + Math.random() * 35 : 10 + Math.random() * 20;
				setTimeout(tick, delay);
			} else {
				li++;
				ci = 0;
				if (li < lines.length) {
					rendered = [...rendered, { ...lines[li], partial: '' }];
					setTimeout(tick, lines[li].prompt ? 320 : 180);
				} else {
					done = true;
				}
			}
		};
		setTimeout(tick, 450);
		return () => clearInterval(cursor);
	});
</script>

<div class="surface overflow-hidden">
	<!-- chrome -->
	<div
		class="flex items-center justify-between border-b border-[var(--border)] bg-white/[0.02] px-4 py-3"
	>
		<div class="flex items-center gap-1.5">
			<span class="h-3 w-3 rounded-full bg-[#ff5f57]"></span>
			<span class="h-3 w-3 rounded-full bg-[#febc2e]"></span>
			<span class="h-3 w-3 rounded-full bg-[#28c840]"></span>
		</div>
		<div class="font-mono text-xs text-[var(--fg-dim)]">khaled@arch ~ zsh</div>
		<div class="w-12"></div>
	</div>

	<!-- body -->
	<div class="px-5 py-5 font-mono text-[13px] leading-relaxed sm:px-6 sm:text-sm">
		{#each rendered as line, i (i)}
			<div class="flex gap-2">
				{#if line.prompt}
					<span class="text-[var(--brand)] select-none">$</span>
					<span class="text-[var(--fg)]">{line.partial}</span>
				{:else if line.color === 'accent'}
					<span class="text-[var(--accent)]">{line.partial}</span>
				{:else}
					<span class="text-[var(--fg-muted)]">{line.partial}</span>
				{/if}
				{#if i === rendered.length - 1 && !done}
					<span class="-ml-1 inline-block w-[7px] bg-[var(--brand)]" class:animate-blink={cursorOn}
						>&nbsp;</span
					>
				{/if}
			</div>
		{/each}
		{#if done}
			<div class="flex gap-2 pt-1">
				<span class="text-[var(--brand)] select-none">$</span>
				<span class="animate-blink inline-block w-[7px] bg-[var(--brand)]">&nbsp;</span>
			</div>
		{/if}
	</div>
</div>
