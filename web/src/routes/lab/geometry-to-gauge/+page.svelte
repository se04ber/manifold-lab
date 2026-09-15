<script lang="ts">
	import { onMount } from 'svelte';
	import { Canvas } from '@threlte/core';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import ExperimentLayout from '$lib/ExperimentLayout.svelte';
	import Equation from '$lib/equations/Equation.svelte';
	import GeometryToGaugeScene from '$lib/experiments/geometry-to-gauge/GeometryToGaugeScene.svelte';
	import EffectiveFieldDiagram from '$lib/experiments/geometry-to-gauge/EffectiveFieldDiagram.svelte';
	import Controls from '$lib/experiments/geometry-to-gauge/Controls.svelte';
	import { readParamsFromSearch, paramsToSearch } from '$lib/state/urlSync';
	import { defaultSimulationParameters } from '$lib/state/simulationParameters.svelte';
	import { debounce } from '$lib/state/debounce';
	import { effectiveField } from '$lib/physics/geodesic';

	const urlKeys = { radius: 'r', coupling: 'kappa', fieldStrength: 'a' } as const;

	// Prerendered pages have no real request URL, so `page.url.searchParams`
	// can only be read client-side, in onMount (never during SSR/prerender).
	let radius = $state(defaultSimulationParameters.radius);
	let coupling = $state(0.6);
	let fieldStrength = $state(0.6);
	let hydrated = $state(false);

	onMount(() => {
		const initial = readParamsFromSearch(page.url.searchParams, urlKeys, {
			...defaultSimulationParameters,
			coupling: 0.6,
			fieldStrength: 0.6
		});
		radius = initial.radius;
		coupling = initial.coupling;
		fieldStrength = initial.fieldStrength;
		hydrated = true;
	});

	const syncUrl = debounce((r: number, kappa: number, a: number) => {
		const search = paramsToSearch(
			{ ...defaultSimulationParameters, radius: r, coupling: kappa, fieldStrength: a },
			urlKeys,
			{ ...defaultSimulationParameters, coupling: 0.6, fieldStrength: 0.6 }
		);
		const query = search.toString();
		const dest = query
			? resolve(`/lab/geometry-to-gauge?${query}`)
			: resolve('/lab/geometry-to-gauge');
		goto(dest, { replaceState: true, noScroll: true, keepFocus: true });
	}, 200);

	// See the equivalent effect in the compact-circle route for why every
	// dependency is read unconditionally before the `hydrated` check.
	$effect(() => {
		const r = radius;
		const kappa = coupling;
		const a = fieldStrength;
		if (hydrated) syncUrl(r, kappa, a);
	});

	let field = $derived(effectiveField({ radius, coupling, fieldStrength }));

	function reset() {
		radius = defaultSimulationParameters.radius;
		coupling = 0.6;
		fieldStrength = 0.6;
	}
</script>

<svelte:head>
	<title>Geometry → Gauge Field · Manifold Lab</title>
</svelte:head>

<ExperimentLayout title="Geometry → Gauge Field">
	{#snippet geometry()}
		<Canvas>
			<GeometryToGaugeScene {radius} {coupling} {fieldStrength} />
		</Canvas>
	{/snippet}

	{#snippet parameters()}
		<Controls bind:radius bind:coupling bind:fieldStrength onReset={reset} />
	{/snippet}

	{#snippet projection()}
		<p class="schematic-note">Schematic — not a solved higher-dimensional metric.</p>
		<EffectiveFieldDiagram component={field.components[1]} />
		<p>
			The off-diagonal metric components g<sub>μ5</sub> are read off directly as an effective gauge
			field A<sub>μ</sub> on the lower-dimensional base.
		</p>
	{/snippet}

	{#snippet equation()}
		<Equation
			tex={String.raw`ds^2 = g_{\mu\nu}dx^\mu dx^\nu + R^2\left(dy + \kappa A_\mu dx^\mu\right)^2`}
		/>
		<p class="caption">
			<Equation tex={String.raw`g_{\mu 5} \to A_\mu`} display={false} />
		</p>
	{/snippet}

	{#snippet intuition()}
		<p>
			If the circle at each point is tilted or twisted a little differently as you move along the
			base, that changing twist rate is exactly what a lower-dimensional observer would call a gauge
			field. No twist (κ = 0 or A = 0) means the rings all line up the same way, like a plain
			cylinder.
		</p>
	{/snippet}

	{#snippet mathematics()}
		<p>
			The gap marker on each ring winds by <Equation
				tex={String.raw`\kappa A_x \cdot x`}
				display={false}
			/>
			radians relative to the ring at x = 0 — the schematic stand-in for how a connection with component
			A<sub>μ</sub> parallel-transports a reference direction around the fiber as you move along the base.
		</p>
	{/snippet}

	{#snippet details()}
		<p>
			This experiment prescribes A<sub>μ</sub> directly from κ and the field-strength slider rather
			than deriving it from a curved higher-dimensional metric — a real Kaluza–Klein reduction would
			solve Einstein's equations for g<sub>μν</sub> and g<sub>μ5</sub> together. The twisting pattern
			is a visual mnemonic for the geometry → gauge-field correspondence, not a literal rendering of curvature.
		</p>
	{/snippet}
</ExperimentLayout>

<style>
	.caption {
		font-size: 0.8rem;
		color: var(--ml-text-muted, #5b6572);
	}
	.schematic-note {
		font-size: 0.75rem;
		font-style: italic;
		color: var(--ml-text-muted, #5b6572);
		margin-bottom: 0.5rem;
	}
</style>
