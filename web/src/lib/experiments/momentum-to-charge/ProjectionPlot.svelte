<script lang="ts">
	import { sampleTrajectory } from '$lib/physics/interpolateTrajectory';
	import type { Trajectory } from '$lib/physics/types';

	let { trajectory, animT }: { trajectory: Trajectory; animT: number } = $props();

	const width = 260;
	const height = 160;
	const pad = 16;

	let bounds = $derived.by(() => {
		const xs = trajectory.position.map((p) => p[0]);
		const zs = trajectory.position.map((p) => p[1]);
		const xMin = Math.min(...xs);
		const xMax = Math.max(...xs);
		const zAbs = Math.max(0.5, ...zs.map((z) => Math.abs(z)));
		return { xMin, xMax: Math.max(xMax, xMin + 1e-6), zAbs };
	});

	function toScreen([x, z]: [number, number]): [number, number] {
		const sx = pad + ((x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * (width - 2 * pad);
		const sy = height / 2 - (z / bounds.zAbs) * (height / 2 - pad);
		return [sx, sy];
	}

	let pathD = $derived(
		trajectory.position.map((p, i) => `${i === 0 ? 'M' : 'L'}${toScreen(p).join(',')}`).join(' ')
	);

	let markerPos = $derived(toScreen(sampleTrajectory(trajectory, animT).position));
</script>

<svg
	viewBox="0 0 {width} {height}"
	role="img"
	aria-label="Lower-dimensional projection of the trajectory"
>
	<line
		x1={pad}
		y1={height / 2}
		x2={width - pad}
		y2={height / 2}
		stroke="var(--ml-border, #d6dbe1)"
		stroke-width="1"
	/>
	<path d={pathD} fill="none" stroke="var(--ml-accent, #2f6f8f)" stroke-width="2" />
	<circle cx={markerPos[0]} cy={markerPos[1]} r="5" fill="#c2410c" />
</svg>

<style>
	svg {
		width: 100%;
		max-width: 20rem;
		display: block;
	}
</style>
