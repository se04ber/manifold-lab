<script lang="ts">
	import { onMount } from 'svelte';
	import { Canvas } from '@threlte/core';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import ExperimentLayout from '$lib/ExperimentLayout.svelte';
	import Equation from '$lib/equations/Equation.svelte';
	import MomentumToChargeScene from '$lib/experiments/momentum-to-charge/MomentumToChargeScene.svelte';
	import ProjectionPlot from '$lib/experiments/momentum-to-charge/ProjectionPlot.svelte';
	import Controls from '$lib/experiments/momentum-to-charge/Controls.svelte';
	import { readParamsFromSearch, paramsToSearch } from '$lib/state/urlSync';
	import { defaultSimulationParameters } from '$lib/state/simulationParameters.svelte';
	import { debounce } from '$lib/state/debounce';
	import { geodesic } from '$lib/physics/geodesic';

	const COUPLING = 0.5;
	const T_MAX = 4;
	const N_SAMPLES = 120;

	const urlKeys = { radius: 'r', hiddenMomentum: 'p5', fieldStrength: 'a' } as const;
	const controlDefaults = { ...defaultSimulationParameters, hiddenMomentum: 2, fieldStrength: 0.7 };

	// Live values drive the sliders and equation immediately. `committed*`
	// only updates 200ms after the sliders settle, and the (comparatively)
	// expensive geodesic recompute reacts to those, not to every tick —
	// rendering/animation stays smooth regardless of how fast someone drags.
	let radius = $state(controlDefaults.radius);
	let p5 = $state(controlDefaults.hiddenMomentum);
	let fieldStrength = $state(controlDefaults.fieldStrength);
	let hydrated = $state(false);

	let committedRadius = $state(controlDefaults.radius);
	let committedP5 = $state(controlDefaults.hiddenMomentum);
	let committedFieldStrength = $state(controlDefaults.fieldStrength);

	const commit = debounce((r: number, momentum: number, a: number) => {
		committedRadius = r;
		committedP5 = momentum;
		committedFieldStrength = a;
	}, 200);

	$effect(() => {
		const r = radius;
		const momentum = p5;
		const a = fieldStrength;
		commit(r, momentum, a);
	});

	onMount(() => {
		const initial = readParamsFromSearch(page.url.searchParams, urlKeys, controlDefaults);
		radius = initial.radius;
		p5 = initial.hiddenMomentum;
		fieldStrength = initial.fieldStrength;
		committedRadius = initial.radius;
		committedP5 = initial.hiddenMomentum;
		committedFieldStrength = initial.fieldStrength;
		hydrated = true;
	});

	const syncUrl = debounce((r: number, momentum: number, a: number) => {
		const search = paramsToSearch(
			{ ...controlDefaults, radius: r, hiddenMomentum: momentum, fieldStrength: a },
			urlKeys,
			controlDefaults
		);
		const query = search.toString();
		const dest = query
			? resolve(`/lab/momentum-to-charge?${query}`)
			: resolve('/lab/momentum-to-charge');
		goto(dest, { replaceState: true, noScroll: true, keepFocus: true });
	}, 200);

	$effect(() => {
		const r = radius;
		const momentum = p5;
		const a = fieldStrength;
		if (hydrated) syncUrl(r, momentum, a);
	});

	let trajectory = $derived(
		geodesic(
			{ position: [0, 0], velocity: [1, 0], fiberMomentum: committedP5 },
			{ radius: committedRadius, coupling: COUPLING, fieldStrength: committedFieldStrength },
			{ tMax: T_MAX, nSamples: N_SAMPLES }
		)
	);

	// Rendering runs on its own clock independent of the (debounced) physics
	// recompute above — this loop just samples whatever `trajectory` is
	// current, interpolating between its precomputed points.
	let animT = $state(0);
	onMount(() => {
		let raf = 0;
		let last: number | null = null;
		function tick(now: number) {
			if (last !== null) {
				const dt = (now - last) / 1000;
				animT = (animT + dt) % T_MAX;
			}
			last = now;
			raf = requestAnimationFrame(tick);
		}
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});

	function reset() {
		radius = controlDefaults.radius;
		p5 = controlDefaults.hiddenMomentum;
		fieldStrength = controlDefaults.fieldStrength;
	}

	let chargeLabel = $derived(
		trajectory.effectiveCharge === 0
			? 'neutral'
			: trajectory.effectiveCharge > 0
				? 'positive'
				: 'negative'
	);
</script>

<svelte:head>
	<title>Momentum → Effective Charge · Manifold Lab</title>
</svelte:head>

<ExperimentLayout title="Momentum → Effective Charge">
	{#snippet geometry()}
		<Canvas>
			<MomentumToChargeScene {trajectory} radius={committedRadius} {animT} />
		</Canvas>
	{/snippet}

	{#snippet parameters()}
		<Controls bind:radius bind:p5 bind:fieldStrength onReset={reset} />
	{/snippet}

	{#snippet projection()}
		<p class="charge-readout">
			Effective charge q = {trajectory.effectiveCharge.toFixed(2)} ({chargeLabel})
		</p>
		<ProjectionPlot {trajectory} {animT} />
	{/snippet}

	{#snippet equation()}
		<Equation tex={String.raw`q = \kappa \, p_5`} />
		<p class="caption">
			Momentum along the hidden dimension (p₅) looks like electric charge to a lower-dimensional
			observer.
		</p>
	{/snippet}

	{#snippet intuition()}
		<p>
			Drag <strong>p₅</strong> across zero: at p₅ = 0 the particle flies straight; away from zero it curves,
			more sharply the further p₅ is from zero, and the curve flips direction when p₅ changes sign. The
			small spiral riding along the path is the particle's actual motion around the hidden circle — the
			curving is what that hidden motion looks like once you forget the hidden dimension exists.
		</p>
	{/snippet}

	{#snippet mathematics()}
		<p>
			The trajectory solves <Equation
				tex={String.raw`\ddot x^\mu = q\,F^{\mu\nu}v_\nu`}
				display={false}
			/>
			for the schematic uniform field from Experiment 02, with effective charge q = κp₅. It's integrated
			once per parameter change (Tsit5 on the Julia side, RK4 in the browser) into a fixed array of samples;
			the animation only interpolates that array, it never re-integrates per frame.
		</p>
	{/snippet}

	{#snippet details()}
		<p>
			The 3D view exaggerates the hidden-dimension winding (drawn at a fixed visual radius,
			independent of how large R actually is) so it stays visible next to the effective curving —
			another simplification, like Experiment 01 and 02's schematic fibers.
		</p>
	{/snippet}
</ExperimentLayout>

<style>
	.caption {
		font-size: 0.8rem;
		color: var(--ml-text-muted, #5b6572);
	}
	.charge-readout {
		font-weight: 600;
		margin-bottom: 0.5rem;
	}
</style>
