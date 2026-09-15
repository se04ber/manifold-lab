<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';

	let {
		radius,
		fiberCount,
		visualScale
	}: {
		radius: number;
		fiberCount: number;
		visualScale: number;
	} = $props();

	const spacing = 1.2;
	let positions = $derived(
		Array.from({ length: fiberCount }, (_, i) => (i - (fiberCount - 1) / 2) * spacing)
	);
	let baseLength = $derived((positions.length - 1) * spacing + spacing);
	let displayRadius = $derived(Math.max(0.05, radius * visualScale));
</script>

<T.PerspectiveCamera makeDefault position={[0, 2.5, 6]} fov={45}>
	<OrbitControls enableDamping target={[0, 0, 0]} />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.6} />
<T.DirectionalLight position={[3, 5, 4]} intensity={0.8} />

<!-- the lower-dimensional base space -->
<T.Mesh>
	<T.BoxGeometry args={[baseLength, 0.02, 0.02]} />
	<T.MeshStandardMaterial color="#5b6572" />
</T.Mesh>

<!-- the S^1 fiber attached at each point of the base -->
{#each positions as x (x)}
	<T.Mesh position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
		<T.TorusGeometry args={[displayRadius, Math.max(displayRadius * 0.04, 0.005), 12, 48]} />
		<T.MeshStandardMaterial color="#2f6f8f" />
	</T.Mesh>
{/each}
