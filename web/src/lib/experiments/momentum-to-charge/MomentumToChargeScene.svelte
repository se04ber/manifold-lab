<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { fiberPeriod } from '$lib/physics/geodesic';
	import { sampleTrajectory } from '$lib/physics/interpolateTrajectory';
	import type { Trajectory } from '$lib/physics/types';

	let {
		trajectory,
		radius,
		animT
	}: {
		trajectory: Trajectory;
		radius: number;
		animT: number;
	} = $props();

	const trailCount = 24;
	const fiberRadius = 0.18;
	const chargeScale = 0.5; // visual compression of the effective curving

	let current = $derived(sampleTrajectory(trajectory, animT));
	let period = $derived(fiberPeriod(radius));

	function offsetFor(fiber: number): { y: number; z: number } {
		const phase = (2 * Math.PI * fiber) / period;
		return { y: fiberRadius * Math.cos(phase), z: fiberRadius * Math.sin(phase) };
	}

	let particlePos = $derived.by(() => {
		const [x, z] = current.position;
		const offset = offsetFor(current.fiber);
		return { x, y: z * chargeScale + offset.y, z: offset.z };
	});

	let trail = $derived.by(() => {
		const points: { x: number; y: number; z: number; t: number }[] = [];
		for (let i = 0; i <= trailCount; i++) {
			const t = animT - (animT * i) / trailCount;
			if (t < 0) continue;
			const sample = sampleTrajectory(trajectory, t);
			const [x, z] = sample.position;
			const offset = offsetFor(sample.fiber);
			points.push({ x, y: z * chargeScale + offset.y, z: offset.z, t });
		}
		return points;
	});

	let baseLength = $derived(
		Math.max(4, (trajectory.position.at(-1)?.[0] ?? 0) - (trajectory.position[0]?.[0] ?? 0) + 1)
	);
</script>

<T.PerspectiveCamera makeDefault position={[1, 2, 7]} fov={45}>
	<OrbitControls enableDamping target={[baseLength / 4, 0, 0]} />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.6} />
<T.DirectionalLight position={[3, 5, 4]} intensity={0.8} />

<T.Mesh position={[baseLength / 2 - 0.5, 0, 0]}>
	<T.BoxGeometry args={[baseLength, 0.02, 0.02]} />
	<T.MeshStandardMaterial color="#5b6572" />
</T.Mesh>

{#each trail as point, i (i)}
	<T.Mesh position={[point.x, point.y, point.z]}>
		<T.SphereGeometry args={[0.035, 8, 8]} />
		<T.MeshStandardMaterial
			color="#2f6f8f"
			transparent
			opacity={0.15 + 0.55 * (1 - i / trailCount)}
		/>
	</T.Mesh>
{/each}

<T.Mesh position={[particlePos.x, particlePos.y, particlePos.z]}>
	<T.SphereGeometry args={[0.08, 16, 16]} />
	<T.MeshStandardMaterial color="#c2410c" />
</T.Mesh>
