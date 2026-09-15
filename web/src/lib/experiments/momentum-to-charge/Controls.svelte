<script lang="ts">
	let {
		radius = $bindable(),
		p5 = $bindable(),
		fieldStrength = $bindable(),
		onReset
	}: {
		radius: number;
		p5: number;
		fieldStrength: number;
		onReset: () => void;
	} = $props();

	const presets = [
		{ label: 'Neutral', p5: 0 },
		{ label: 'Positive effective charge', p5: 2 },
		{ label: 'Negative effective charge', p5: -2 }
	];
</script>

<div class="controls">
	<label>
		<span>Radius R</span>
		<input type="range" min="0.3" max="2.5" step="0.01" bind:value={radius} />
		<output>{radius.toFixed(2)}</output>
	</label>

	<label>
		<span>Fiber momentum p₅</span>
		<input type="range" min="-3" max="3" step="0.05" bind:value={p5} />
		<output>{p5.toFixed(2)}</output>
	</label>

	<label>
		<span>Field strength A</span>
		<input type="range" min="-1.5" max="1.5" step="0.01" bind:value={fieldStrength} />
		<output>{fieldStrength.toFixed(2)}</output>
	</label>

	<div class="row">
		<button type="button" onclick={onReset}>Reset</button>
		<label class="preset">
			Preset
			<select
				onchange={(event) => {
					const value = Number((event.target as HTMLSelectElement).value);
					if (!Number.isNaN(value)) p5 = value;
				}}
			>
				<option value="">—</option>
				{#each presets as preset (preset.label)}
					<option value={preset.p5}>{preset.label}</option>
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
