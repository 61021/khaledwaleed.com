<script lang="ts">
	// The sky over the ruin — the whole viewing log as one night sky.
	// Every title is a star: release year sets its place east to west,
	// a hash hangs it in the firmament, and the score decides how hard
	// it burns. Directors watched three times or more become faint
	// constellations. Hand-rolled SVG, server-rendered; hovering is the
	// only client work.

	export type SkyFilm = {
		tmdbId: number;
		type: string;
		title: string;
		year: number;
		rating: number;
		directors: string[];
	};

	type Star = {
		key: string;
		x: number;
		y: number;
		r: number;
		title: string;
		year: number;
		rating: number;
		directors: string[];
		flare: boolean;
		twinkle: boolean;
		delay: number;
	};

	type Constellation = {
		name: string;
		points: string;
		keys: Set<string>;
	};

	let { films }: { films: SkyFilm[] } = $props();

	// Deterministic 0..1 from a film's identity — the sky must not
	// rearrange itself between visits.
	function hash01(str: string, salt: number): number {
		let h = 2166136261 ^ salt;
		for (let i = 0; i < str.length; i++) {
			h ^= str.charCodeAt(i);
			h = Math.imul(h, 16777619);
		}
		h ^= h >>> 13;
		h = Math.imul(h, 0x5bd1e995);
		h ^= h >>> 15;
		return (h >>> 0) / 4294967296;
	}

	const W = 1000;
	const H = 440;
	const PAD_X = 30;
	const PAD_TOP = 34;
	const PAD_BOTTOM = 52;

	const sky = $derived.by(() => {
		const dated = films.filter((f) => f.year > 0);
		if (dated.length < 2) return null;

		let minY = Infinity;
		let maxY = -Infinity;
		for (const f of dated) {
			if (f.year < minY) minY = f.year;
			if (f.year > maxY) maxY = f.year;
		}
		const span = maxY + 1 - minY;
		const round1 = (n: number) => Math.round(n * 10) / 10;
		const x = (year: number, j: number) =>
			round1(PAD_X + ((year + j - minY) / span) * (W - 2 * PAD_X));

		const stars: Star[] = dated.map((f) => {
			const key = `${f.type}/${f.tmdbId}`;
			return {
				key,
				x: x(f.year, hash01(key, 1)),
				y: round1(PAD_TOP + hash01(key, 2) * (H - PAD_TOP - PAD_BOTTOM)),
				r: round1(1.1 + f.rating * 0.3),
				title: f.title,
				year: f.year,
				rating: f.rating,
				directors: f.directors,
				flare: f.rating >= 9,
				twinkle: f.rating >= 8 && hash01(key, 3) < 0.45,
				delay: hash01(key, 4) * 6
			};
		});

		// Directors seen three times or more, joined star to star by year.
		const byDirector: Record<string, Star[]> = {};
		for (const s of stars) {
			for (const d of s.directors) {
				(byDirector[d] ??= []).push(s);
			}
		}
		const constellations: Constellation[] = [];
		for (const [name, list] of Object.entries(byDirector)) {
			if (list.length < 3) continue;
			const orderly = [...list].sort((a, b) => a.x - b.x);
			constellations.push({
				name,
				points: orderly.map((s) => `${s.x.toFixed(1)},${s.y.toFixed(1)}`).join(' '),
				keys: new Set(orderly.map((s) => s.key))
			});
		}

		// Decade marks along the bottom horizon.
		const ticks: { x: number; label: number }[] = [];
		for (let y = Math.ceil(minY / 10) * 10; y <= maxY; y += 10) {
			ticks.push({ x: x(y, 0.5), label: y });
		}

		const ratings = [...films.map((f) => f.rating)].sort((a, b) => a - b);
		const median = ratings.length ? ratings[Math.floor(ratings.length / 2)] : 0;
		const directors = new Set(films.flatMap((f) => f.directors)).size;

		return { stars, constellations, ticks, median, directors };
	});

	let hovered = $state<Star | null>(null);

	// One delegated handler instead of hundreds — the hit circles carry
	// their star's index.
	function over(e: PointerEvent): void {
		const i = (e.target as SVGElement).dataset?.i;
		hovered = i !== undefined && sky ? sky.stars[Number(i)] : null;
	}

	const inConstellation = (c: Constellation): boolean =>
		hovered !== null && c.keys.has(hovered.key);
</script>

{#if sky}
	<figure class="sky">
		<div class="sky-frame">
			<svg
				viewBox="0 0 {W} {H}"
				role="img"
				aria-label="Every title in the log drawn as a star: placed by release year, its brightness following my score. Directors watched three or more times are joined into faint constellations. The full list follows below."
				onpointerleave={() => (hovered = null)}
			>
				<defs>
					<radialGradient id="star-halo">
						<stop offset="0%" stop-color="var(--accent)" stop-opacity="0.5" />
						<stop offset="55%" stop-color="var(--accent)" stop-opacity="0.14" />
						<stop offset="100%" stop-color="var(--accent)" stop-opacity="0" />
					</radialGradient>
				</defs>

				<!-- Constellations first: lines lie behind the stars. -->
				{#each sky.constellations as c (c.name)}
					<polyline class="cons" class:lit={inConstellation(c)} points={c.points} fill="none" />
				{/each}

				{#each sky.stars as s (s.key)}
					<g
						class="star"
						class:dimmed={hovered !== null && hovered.key !== s.key}
						opacity={0.45 + s.rating * 0.055}
					>
						<circle class="halo" cx={s.x} cy={s.y} r={s.r * 3.2} fill="url(#star-halo)" />
						{#if s.flare}
							<path
								class="flare"
								d="M {s.x - s.r * 3.4} {s.y} H {s.x + s.r * 3.4} M {s.x} {s.y - s.r * 3.4} V {s.y +
									s.r * 3.4}"
							/>
						{/if}
						<circle
							class="core"
							class:twinkle={s.twinkle}
							style:animation-delay={s.twinkle ? `${s.delay.toFixed(2)}s` : undefined}
							cx={s.x}
							cy={s.y}
							r={s.r}
						/>
					</g>
				{/each}

				<!-- Decade marks on the horizon. -->
				{#each sky.ticks as t (t.label)}
					<line class="tick" x1={t.x} y1={H - PAD_BOTTOM + 14} x2={t.x} y2={H - PAD_BOTTOM + 22} />
					<text class="tick-label" x={t.x} y={H - 14} text-anchor="middle">{t.label}</text>
				{/each}

				<!-- Invisible, generous hit targets, drawn last so they win.
				     Pointer-only sugar: the svg is the labelled image, and the
				     full log below carries the data for everyone else. -->
				<g
					class="hits"
					role="presentation"
					onpointerover={over}
					onpointerout={() => (hovered = null)}
				>
					{#each sky.stars as s, i (s.key)}
						<circle data-i={i} cx={s.x} cy={s.y} r="9" fill="transparent" />
					{/each}
				</g>
			</svg>
		</div>

		<figcaption class="plate sky-plate" aria-live="off">
			{#if hovered}
				<em>{hovered.title}</em>
				<span class="plate-sep">·</span>{hovered.year}
				<span class="plate-sep">·</span><span class="sky-score">★ {hovered.rating}</span>
				{#if hovered.directors.length}
					<span class="plate-sep">·</span>{hovered.directors.join(', ')}
				{/if}
			{:else}
				{films.length} titles
				<span class="plate-sep">·</span>{sky.directors} directors
				<span class="plate-sep">·</span>median ★ {sky.median}
				<span class="plate-sep">·</span>brightness follows the score
			{/if}
		</figcaption>
	</figure>
{/if}

<style>
	.sky {
		margin: 0;
	}

	/* The same thin matting the room cards wear. */
	.sky-frame {
		border: 1px solid var(--rule);
		background: color-mix(in oklab, var(--bg-soft) 55%, transparent);
		padding: 0.5rem;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
	}

	.cons {
		stroke: var(--accent);
		stroke-width: 0.5;
		opacity: 0.13;
		transition: opacity 350ms ease;
	}

	.cons.lit {
		opacity: 0.55;
	}

	.star {
		transition: opacity 350ms ease;
	}

	.star.dimmed {
		opacity: 0.3;
	}

	.core {
		fill: var(--ink);
	}

	.flare {
		stroke: color-mix(in oklab, var(--accent) 75%, var(--ink));
		stroke-width: 0.45;
		opacity: 0.55;
	}

	.tick {
		stroke: var(--rule);
		stroke-width: 1;
	}

	.tick-label {
		fill: var(--ink-dim);
		font-family: var(--font-body);
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.08em;
	}

	.twinkle {
		animation: twinkle 4.5s ease-in-out infinite alternate;
	}

	@keyframes twinkle {
		from {
			opacity: 1;
		}
		to {
			opacity: 0.55;
		}
	}

	.sky-plate {
		margin-top: 0.9rem;
		min-height: 1.6em;
	}

	.sky-score {
		color: var(--accent);
		font-style: normal;
	}

	@media (max-width: 640px) {
		.tick-label {
			font-size: 18px;
		}
	}
</style>
