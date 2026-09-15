<script lang="ts">
	let {
		radius = $bindable(),
		coupling = $bindable(),
		fieldStrength = $bindable(),
		onReset
	}: {
		radius: number;
		coupling: number;
		fieldStrength: number;
		onReset: () => void;
	} = $props();
</script>

<div class="controls">
	<label>
		<span>Radius R</span>
		<input type="range" min="0.3" max="2.5" step="0.01" bind:value={radius} />
		<output>{radius.toFixed(2)}</output>
	</label>

	<label>
		<span>Coupling κ</span>
		<input type="range" min="-1.5" max="1.5" step="0.01" bind:value={coupling} />
		<output>{coupling.toFixed(2)}</output>
	</label>

	<label>
		<span>Field strength A</span>
		<input type="range" min="-1.5" max="1.5" step="0.01" bind:value={fieldStrength} />
		<output>{fieldStrength.toFixed(2)}</output>
	</label>

	<div class="row">
		<button type="button" onclick={onReset}>Reset</button>
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
	.row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}
</style>
