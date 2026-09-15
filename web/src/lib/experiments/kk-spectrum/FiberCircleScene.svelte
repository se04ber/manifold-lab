<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';

	let { radius }: { radius: number } = $props();

	let displayRadius = $derived(Math.max(0.2, Math.min(radius, 2.2)));
</script>

<T.PerspectiveCamera makeDefault position={[0, 1.5, 5]} fov={45}>
	<OrbitControls enableDamping target={[0, 0, 0]} />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.6} />
<T.DirectionalLight position={[3, 5, 4]} intensity={0.8} />

<T.Mesh rotation={[0, Math.PI / 2, 0]}>
	<T.TorusGeometry args={[displayRadius, Math.max(displayRadius * 0.04, 0.01), 16, 64]} />
	<T.MeshStandardMaterial color="#2f6f8f" />
</T.Mesh>

<T.Mesh position={[0, 0, 0]}>
	<T.SphereGeometry args={[0.04, 12, 12]} />
	<T.MeshStandardMaterial color="#5b6572" />
</T.Mesh>
