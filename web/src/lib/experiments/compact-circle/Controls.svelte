<script lang="ts">
	let {
		radius = $bindable(),
		fiberCount = $bindable(),
		visualScale = $bindable(),
		onReset
	}: {
		radius: number;
		fiberCount: number;
		visualScale: number;
		onReset: () => void;
	} = $props();

	const presets = [
		{ label: 'Tiny compact dimension', radius: 0.15 },
		{ label: 'Large compact dimension', radius: 2.5 }
	];
</script>

<div class="controls">
	<label>
		<span>Radius R</span>
		<input type="range" min="0.1" max="3" step="0.01" bind:value={radius} />
		<output>{radius.toFixed(2)}</output>
	</label>

	<label>
		<span>Fiber density</span>
		<input type="range" min="1" max="9" step="1" bind:value={fiberCount} />
		<output>{fiberCount}</output>
	</label>

	<label>
		<span>Visualization scale</span>
		<input type="range" min="0.25" max="3" step="0.05" bind:value={visualScale} />
		<output>{visualScale.toFixed(2)}×</output>
	</label>

	<div class="row">
		<button type="button" onclick={onReset}>Reset</button>
		<label class="preset">
			Preset
			<select
				onchange={(event) => {
					const value = Number((event.target as HTMLSelectElement).value);
					if (!Number.isNaN(value)) radius = value;
				}}
			>
				<option value="">—</option>
				{#each presets as preset (preset.label)}
					<option value={preset.radius}>{preset.label}</option>
				{/each}
			</select>
		</label>
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
	.preset {
		flex-direction: row;
		align-items: center;
		gap: 0.4rem;
	}
</style>
