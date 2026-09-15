<script lang="ts">
	import { onMount } from 'svelte';
	import { Canvas } from '@threlte/core';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import ExperimentLayout from '$lib/ExperimentLayout.svelte';
	import Equation from '$lib/equations/Equation.svelte';
	import CompactCircleScene from '$lib/experiments/compact-circle/CompactCircleScene.svelte';
	import Controls from '$lib/experiments/compact-circle/Controls.svelte';
	import { readParamsFromSearch, paramsToSearch } from '$lib/state/urlSync';
	import { defaultSimulationParameters } from '$lib/state/simulationParameters.svelte';
	import { debounce } from '$lib/state/debounce';

	const urlKeys = { radius: 'r' } as const;

	// Prerendered pages have no real request URL, so `page.url.searchParams`
	// can only be read client-side, in onMount (never during SSR/prerender).
	let radius = $state(defaultSimulationParameters.radius);
	let fiberCount = $state(5);
	let visualScale = $state(1);
	let hydrated = $state(false);

	onMount(() => {
		radius = readParamsFromSearch(page.url.searchParams, urlKeys).radius;
		hydrated = true;
	});

	const syncUrl = debounce((r: number) => {
		const search = paramsToSearch({ ...defaultSimulationParameters, radius: r }, urlKeys);
		const query = search.toString();
		const dest = query ? resolve(`/lab/compact-circle?${query}`) : resolve('/lab/compact-circle');
		goto(dest, { replaceState: true, noScroll: true, keepFocus: true });
	}, 200);

	// Always reads `hydrated` and `radius` unconditionally so both stay
	// tracked dependencies from the very first run — an early return before
	// reading `radius` would otherwise drop it from this effect's dependency
	// set and silently stop future radius changes from re-triggering it.
	$effect(() => {
		const r = radius;
		if (hydrated) syncUrl(r);
	});

	function reset() {
		radius = defaultSimulationParameters.radius;
		fiberCount = 5;
		visualScale = 1;
	}
</script>

<svelte:head>
	<title>Compact Dimension · Manifold Lab</title>
</svelte:head>

<ExperimentLayout title="Compact Dimension">
	{#snippet geometry()}
		<Canvas>
			<CompactCircleScene {radius} {fiberCount} {visualScale} />
		</Canvas>
	{/snippet}

	{#snippet parameters()}
		<Controls bind:radius bind:fiberCount bind:visualScale onReset={reset} />
	{/snippet}

	{#snippet projection()}
		<p>
			Zoomed out far enough, the fiber disappears: a lower-dimensional observer sees only the base
			line, not the circle attached at each of its points.
		</p>
	{/snippet}

	{#snippet equation()}
		<Equation tex={String.raw`y \sim y + 2\pi R`} />
		<p class="caption">The fiber coordinate y is periodic with period 2πR.</p>
	{/snippet}

	{#snippet intuition()}
		<p>
			Imagine a garden hose seen from far away: it looks like a one-dimensional line. Up close, its
			surface is a thin cylinder — at every point along the line there's a small circle. That circle
			is the compact dimension. Drag <strong>R</strong> to make it larger or smaller relative to the base.
		</p>
	{/snippet}

	{#snippet mathematics()}
		<p>
			The space is a product <Equation tex={String.raw`M \times S^1`} display={false} /> where the S¹
			factor has circumference 2πR. A point on the fiber is labelled by a coordinate y with the identification
			<Equation tex={String.raw`y \sim y + 2\pi R`} display={false} />, so functions on this space
			that are well-defined must be periodic in y.
		</p>
	{/snippet}

	{#snippet details()}
		<p>
			This view is schematic: the fiber circle is drawn at a fixed visual scale relative to the base
			so it stays visible across the whole R range, not at the true (often vastly smaller) physical
			scale a real compactified dimension would have.
		</p>
	{/snippet}
</ExperimentLayout>

<style>
	.caption {
		font-size: 0.8rem;
		color: var(--ml-text-muted, #5b6572);
	}
</style>
