<script lang="ts">
	import { resolve } from '$app/paths';

	const experiments = [
		{
			title: '01 · Compact Dimension',
			description: 'A lower-dimensional base with an S¹ fiber at every point.',
			href: resolve('/lab/compact-circle')
		},
		{
			title: '02 · Geometry → Gauge Field',
			description: 'How off-diagonal metric components become a gauge field.',
			href: resolve('/lab/geometry-to-gauge')
		},
		{
			title: '03 · Momentum → Effective Charge',
			description: 'Momentum along the hidden dimension looks like electric charge.',
			href: resolve('/lab/momentum-to-charge')
		},
		{
			title: '04 · Kaluza–Klein Tower',
			description: 'The discrete mass spectrum from quantized fiber momentum.',
			href: undefined
		}
	];
</script>

<svelte:head>
	<title>Lab · Manifold Lab</title>
</svelte:head>

<main>
	<h1>Experiments</h1>
	<ul>
		{#each experiments as experiment (experiment.title)}
			<li>
				{#if experiment.href}
					<a href={experiment.href}>{experiment.title}</a>
				{:else}
					<span class="upcoming">{experiment.title} <em>(coming soon)</em></span>
				{/if}
				<p>{experiment.description}</p>
			</li>
		{/each}
	</ul>
</main>

<style>
	main {
		max-width: 40rem;
		margin: 3rem auto;
		padding: 0 1.5rem;
	}
	ul {
		list-style: none;
		padding: 0;
	}
	li {
		padding: 1rem 0;
		border-bottom: 1px solid #d6dbe1;
	}
	li p {
		margin: 0.25rem 0 0;
		color: #5b6572;
		font-size: 0.9rem;
	}
	.upcoming {
		color: #5b6572;
	}
</style>
