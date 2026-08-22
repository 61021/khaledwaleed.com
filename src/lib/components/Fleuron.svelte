<!-- Section divider: three gilt diamonds seated between engraved
     hairlines fading at their outer ends, the same ornament language
     as .rule-engraved, .orn, and the catalogue diamonds. -->
<div class='fleuron' aria-hidden='true'>
	<span class='gems'>
		<span class='gem'></span>
		<span class='gem gem-mid'></span>
		<span class='gem'></span>
	</span>
</div>

<style>
	.fleuron {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.1rem;
		margin: 2.75rem 0;
	}

	/* Narrow columns carry shorter hairlines; the wall keeps the long ones. */
	.fleuron::before,
	.fleuron::after {
		content: '';
		height: 1px;
		flex: 0 0 4rem;
		background: var(--rule);
	}

	@media (min-width: 640px) {
		.fleuron {
			margin: 4rem 0;
		}

		.fleuron::before,
		.fleuron::after {
			flex-basis: 5.5rem;
		}
	}

	.fleuron::before {
		-webkit-mask-image: linear-gradient(to right, transparent, black 65%);
		mask-image: linear-gradient(to right, transparent, black 65%);
	}

	.fleuron::after {
		-webkit-mask-image: linear-gradient(to left, transparent, black 65%);
		mask-image: linear-gradient(to left, transparent, black 65%);
	}

	.gems {
		display: flex;
		align-items: center;
		gap: 0.55rem;
	}

	.gem {
		width: 0.26rem;
		height: 0.26rem;
		background: color-mix(in oklab, var(--accent) 38%, transparent);
		transform: rotate(45deg);
	}

	.gem-mid {
		width: 0.38rem;
		height: 0.38rem;
		background: color-mix(in oklab, var(--accent) 62%, transparent);
	}
</style>
