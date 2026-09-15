<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Manifold Lab</title>
</svelte:head>

<main>
	<h1>Manifold Lab</h1>
	<p>
		Interactive toy models of dimensional compactification and effective lower-dimensional physics —
		built up step by step from a compact circle to Kaluza&ndash;Klein towers.
	</p>
	<p class="disclaimer">
		This is not a string-theory simulator. Every visualization is a schematic, dimensionally-reduced
		picture built to develop intuition.
	</p>
	<a class="cta" href={resolve('/lab')}>Open the lab</a>
</main>

<style>
	main {
		max-width: 40rem;
		margin: 3rem auto;
		padding: 0 1.5rem;
	}
	.disclaimer {
		color: #5b6572;
		font-size: 0.9rem;
	}
	.cta {
		display: inline-block;
		margin-top: 1rem;
		padding: 0.5rem 1rem;
		border: 1px solid currentColor;
		border-radius: 0.25rem;
		text-decoration: none;
		color: inherit;
	}
</style>
