<script lang="ts">
	import type { KKSpectrum } from '$lib/physics/types';

	let { spectrum, selected }: { spectrum: KKSpectrum; selected: number } = $props();

	const width = 320;
	const height = 180;
	const pad = 24;

	let maxMass = $derived(Math.max(0.5, ...spectrum.modes));
	let barWidth = $derived((width - 2 * pad) / spectrum.modes.length);

	function barHeight(mass: number): number {
		return (mass / maxMass) * (height - 2 * pad);
	}
</script>

<svg viewBox="0 0 {width} {height}" role="img" aria-label="Kaluza-Klein mass tower">
	<line
		x1={pad}
		y1={height - pad}
		x2={width - pad}
		y2={height - pad}
		stroke="var(--ml-border, #d6dbe1)"
		stroke-width="1"
	/>
	{#each spectrum.modes as mass, n (n)}
		{@const h = barHeight(mass)}
		{@const x = pad + n * barWidth}
		<rect
			x={x + barWidth * 0.15}
			y={height - pad - h}
			width={barWidth * 0.7}
			height={h}
			fill={n === selected ? '#c2410c' : 'var(--ml-accent, #2f6f8f)'}
		/>
		<text
			x={x + barWidth / 2}
			y={height - pad + 14}
			text-anchor="middle"
			font-size="10"
			fill="var(--ml-text-muted, #5b6572)"
		>
			{n}
		</text>
	{/each}
</svg>

<style>
	svg {
		width: 100%;
		max-width: 22rem;
		display: block;
	}
</style>
