<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';

	let {
		radius,
		coupling,
		fieldStrength
	}: {
		radius: number;
		coupling: number;
		fieldStrength: number;
	} = $props();

	const spacing = 1.2;
	const fiberCount = 7;
	let positions = $derived(
		Array.from({ length: fiberCount }, (_, i) => (i - (fiberCount - 1) / 2) * spacing)
	);
	let baseLength = $derived((positions.length - 1) * spacing + spacing);
	let displayRadius = $derived(Math.max(0.3, Math.min(radius, 2)));

	// A_mu = (0, coupling * fieldStrength) is spatially uniform (see
	// effectiveField()); integrated along x that's a phase that grows
	// linearly with position, so each ring's gap winds a little further than
	// its neighbor's — the schematic stand-in for parallel transport around
	// a nonzero connection.
	function twist(x: number): number {
		return coupling * fieldStrength * x;
	}
</script>

<T.PerspectiveCamera makeDefault position={[0, 2.5, 7]} fov={45}>
	<OrbitControls enableDamping target={[0, 0, 0]} />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.6} />
<T.DirectionalLight position={[3, 5, 4]} intensity={0.8} />

<T.Mesh>
	<T.BoxGeometry args={[baseLength, 0.02, 0.02]} />
	<T.MeshStandardMaterial color="#5b6572" />
</T.Mesh>

{#each positions as x (x)}
	<T.Mesh position={[x, 0, 0]} rotation={[0, Math.PI / 2, twist(x)]}>
		<T.TorusGeometry
			args={[displayRadius, Math.max(displayRadius * 0.05, 0.006), 12, 48, Math.PI * 1.85]}
		/>
		<T.MeshStandardMaterial color="#2f6f8f" />
	</T.Mesh>
{/each}
