<script lang="ts">
	import { onMount } from 'svelte';
	import { Canvas } from '@threlte/core';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import ExperimentLayout from '$lib/ExperimentLayout.svelte';
	import Equation from '$lib/equations/Equation.svelte';
	import FiberCircleScene from '$lib/experiments/kk-spectrum/FiberCircleScene.svelte';
	import SpectrumChart from '$lib/experiments/kk-spectrum/SpectrumChart.svelte';
	import Controls from '$lib/experiments/kk-spectrum/Controls.svelte';
	import { readParamsFromSearch, paramsToSearch } from '$lib/state/urlSync';
	import { defaultSimulationParameters } from '$lib/state/simulationParameters.svelte';
	import { debounce } from '$lib/state/debounce';
	import { kkSpectrum } from '$lib/physics/kk';

	const MAX_MODE = 6;
	const urlKeys = { radius: 'r', mode: 'n' } as const;
	const controlDefaults = { ...defaultSimulationParameters, radius: 1, mode: 0 };

	let radius = $state(controlDefaults.radius);
	let baseMass = $state(0.15);
	let selected = $state(controlDefaults.mode);
	let hydrated = $state(false);

	onMount(() => {
		const initial = readParamsFromSearch(page.url.searchParams, urlKeys, controlDefaults);
		radius = initial.radius;
		selected = Math.min(MAX_MODE, Math.max(0, Math.round(initial.mode)));
		hydrated = true;
	});

	const syncUrl = debounce((r: number, n: number) => {
		const search = paramsToSearch(
			{ ...controlDefaults, radius: r, mode: n },
			urlKeys,
			controlDefaults
		);
		const query = search.toString();
		const dest = query ? resolve(`/lab/kk-spectrum?${query}`) : resolve('/lab/kk-spectrum');
		goto(dest, { replaceState: true, noScroll: true, keepFocus: true });
	}, 200);

	$effect(() => {
		const r = radius;
		const n = selected;
		if (hydrated) syncUrl(r, n);
	});

	let spectrum = $derived(kkSpectrum({ radius, baseMass, maxMode: MAX_MODE }));
	let selectedMass = $derived(spectrum.modes[selected]);

	function reset() {
		radius = controlDefaults.radius;
		baseMass = 0.15;
		selected = controlDefaults.mode;
	}
</script>

<svelte:head>
	<title>Kaluza–Klein Tower · Manifold Lab</title>
</svelte:head>

<ExperimentLayout title="Kaluza–Klein Tower">
	{#snippet geometry()}
		<Canvas>
			<FiberCircleScene {radius} />
		</Canvas>
	{/snippet}

	{#snippet parameters()}
		<Controls bind:radius bind:baseMass bind:selected maxMode={MAX_MODE} onReset={reset} />
	{/snippet}

	{#snippet projection()}
		<p class="mass-readout">
			m<sub>{selected}</sub> = {selectedMass.toFixed(3)}
		</p>
		<SpectrumChart {spectrum} {selected} />
	{/snippet}

	{#snippet equation()}
		<Equation tex={String.raw`m_n = \sqrt{m_0^2 + n^2/R^2}`} />
		<p class="caption">Each integer Fourier mode n around the fiber is a separate 4D particle.</p>
	{/snippet}

	{#snippet intuition()}
		<p>
			A wave has to fit a whole number of wavelengths around the compact circle, just like a
			standing wave on a guitar string — that's why n is an integer. Shrinking R packs the same
			integer modes into a smaller circle, which costs more energy, so every m<sub>n&gt;0</sub>
			grows as R shrinks.
		</p>
	{/snippet}

	{#snippet mathematics()}
		<p>
			Expanding a field on M × S¹ in Fourier modes e<sup>iny/R</sup> along the fiber gives, from the
			higher-dimensional wave equation, a tower of 4D masses m<sub>n</sub> = √(m₀² + n²/R²) — the n =
			0 mode is the only one that survives R → ∞.
		</p>
	{/snippet}

	{#snippet details()}
		<p>
			Only the mass tower is modeled here — couplings between modes, and how they'd actually
			interact in a full theory, are out of scope for this toy.
		</p>
	{/snippet}
</ExperimentLayout>

<style>
	.caption {
		font-size: 0.8rem;
		color: var(--ml-text-muted, #5b6572);
	}
	.mass-readout {
		font-weight: 600;
		margin-bottom: 0.5rem;
	}
</style>
