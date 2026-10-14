<script lang='ts'>
	import { alphaFor, black, footer, SMALL_TEXT_RATIO } from './apple'
	import { contrast } from './monochrome'

	type Mode = 'served' | 'aim'

	const aim = alphaFor(SMALL_TEXT_RATIO, footer.ground)
	const columns = [
		{ heading: 'Shop and Learn', links: ['Store', 'Mac', 'iPad', 'iPhone'] },
		{ heading: 'Account', links: ['Manage Your Apple Account', 'Apple Store Account', 'iCloud.com'] },
		{ heading: 'Apple Store', links: ['Find a Store', 'Genius Bar', 'Today at Apple'] },
	]

	let mode = $state<Mode>('served')

	const fine = $derived(mode === 'served' ? footer.fine : aim)
	const rows = $derived([
		{ name: 'fine print', alpha: fine },
		{ name: 'links', alpha: footer.link },
		{ name: 'headings', alpha: footer.heading },
	])

	function ratio(alpha: number): string {
		return `${contrast(black(alpha), footer.ground).toFixed(1)}:1`
	}
</script>

<figure class='gray'>
	<fieldset class='seg'>
		<legend class='sr-only'>the fine print</legend>
		<label class={['seg-option', mode === 'served' && 'on']}>
			<input class='sr-only' type='radio' name='gray-mode' value='served' bind:group={mode} />
			as served
		</label>
		<label class={['seg-option', mode === 'aim' && 'on']}>
			<input class='sr-only' type='radio' name='gray-mode' value='aim' bind:group={mode} />
			at {SMALL_TEXT_RATIO}:1
		</label>
	</fieldset>

	<div class='specimen foot' style:background={footer.ground}>
		<p class='fine' style:color={black(fine)}>
			This is the fine print, 12px and black at {Math.round(fine * 100)}%, where the footnotes,
			prices and terms go.
		</p>
		<div class='columns'>
			{#each columns as column (column.heading)}
				<div class='column'>
					<p class='heading' style:color={black(footer.heading)}>{column.heading}</p>
					{#each column.links as link (link)}
						<p style:color={black(footer.link)}>{link}</p>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<dl class='ratios'>
		{#each rows as row (row.name)}
			<div class='ratio'>
				<dt>{row.name}</dt>
				<dd><code translate='no'>{Math.round(row.alpha * 100)}%</code></dd>
				<dd><code translate='no' class={[row.name === 'fine print' && 'strong']}>{ratio(row.alpha)}</code></dd>
			</div>
		{/each}
	</dl>
</figure>

<style>
	.gray {
		margin: 2rem 0;
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}

	/* apple.com's footer, at its own size: 12px on 16px lines. */
	.foot {
		padding: 1.4rem 1.5rem 1.6rem;
		color-scheme: light;
		font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, var(--font-body);
		font-size: 12px;
		line-height: 16px;
		letter-spacing: -0.01em;
	}

	.foot p {
		margin: 0;
	}

	.fine {
		padding-bottom: 1rem;
		border-bottom: 1px solid #d2d2d7;
	}

	.columns {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
		gap: 1.4rem 1.5rem;
		margin-top: 1.1rem;
	}

	.column p + p {
		margin-top: 0.5rem;
	}

	.foot .heading {
		font-weight: 600;
		margin-bottom: 0.8rem;
	}

	.ratios {
		display: grid;
		gap: 0.35rem;
		max-width: 22rem;
		margin: 0;
	}

	.ratio {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 3.5rem 4rem;
		align-items: baseline;
		font-size: 0.82rem;
	}

	dt {
		color: var(--ink-muted);
	}

	dd {
		margin: 0;
		text-align: right;
	}

	dd code {
		font-size: 0.78rem;
		color: var(--ink-muted);
	}

	dd code.strong {
		color: var(--ink);
		font-weight: 700;
	}
</style>
