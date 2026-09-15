<script lang="ts">
	let {
		radius = $bindable(),
		baseMass = $bindable(),
		selected = $bindable(),
		maxMode,
		onReset
	}: {
		radius: number;
		baseMass: number;
		selected: number;
		maxMode: number;
		onReset: () => void;
	} = $props();

	function firstExcitation() {
		selected = 1;
	}
</script>

<div class="controls">
	<label>
		<span>Radius R</span>
		<input type="range" min="0.2" max="2.5" step="0.01" bind:value={radius} />
		<output>{radius.toFixed(2)}</output>
	</label>

	<label>
		<span>Base mass m₀</span>
		<input type="range" min="0" max="1" step="0.01" bind:value={baseMass} />
		<output>{baseMass.toFixed(2)}</output>
	</label>

	<fieldset>
		<legend>Mode n</legend>
		<div class="modes">
			{#each Array.from({ length: maxMode + 1 }, (_, n) => n) as n (n)}
				<button type="button" class:active={n === selected} onclick={() => (selected = n)}>
					{n}
				</button>
			{/each}
		</div>
	</fieldset>

	<div class="row">
		<button type="button" onclick={onReset}>Reset</button>
		<button type="button" onclick={firstExcitation}>First KK excitation</button>
	</div>
</div>

<style>
	.controls {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
		font-size: 0.85rem;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	fieldset {
		border: none;
		padding: 0;
		margin: 0;
	}
	legend {
		font-size: 0.85rem;
		padding: 0;
		margin-bottom: 0.25rem;
	}
	.modes {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}
	.modes button {
		min-width: 1.8rem;
		padding: 0.2rem 0.4rem;
		border: 1px solid var(--ml-border, #d6dbe1);
		background: var(--ml-surface, #fff);
		border-radius: 0.25rem;
		cursor: pointer;
	}
	.modes button.active {
		background: #c2410c;
		color: white;
		border-color: #c2410c;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}
</style>
