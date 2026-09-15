<script lang="ts">
	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';

	type Tab = 'intuition' | 'mathematics' | 'details';

	let {
		title,
		geometry,
		projection,
		parameters,
		equation,
		intuition,
		mathematics,
		details
	}: {
		title: string;
		geometry: Snippet;
		projection: Snippet;
		parameters: Snippet;
		equation: Snippet;
		intuition: Snippet;
		mathematics: Snippet;
		details: Snippet;
	} = $props();

	let activeTab = $state<Tab>('intuition');
</script>

<div class="experiment">
	<header>
		<a class="brand" href={resolve('/lab')}>Manifold Lab</a>
		<h1>{title}</h1>
	</header>

	<div class="grid">
		<section class="pane geometry" aria-label="Higher-dimensional geometry">
			{@render geometry()}
		</section>
		<aside class="pane parameters" aria-label="Parameters">
			{@render parameters()}
		</aside>
		<section class="pane projection" aria-label="Lower-dimensional projection">
			{@render projection()}
		</section>
		<aside class="pane equation" aria-label="Equation">
			{@render equation()}
		</aside>
	</div>

	<footer class="explain">
		<div class="tab-strip" role="tablist">
			<button
				role="tab"
				aria-selected={activeTab === 'intuition'}
				class:active={activeTab === 'intuition'}
				onclick={() => (activeTab = 'intuition')}
			>
				Intuition
			</button>
			<button
				role="tab"
				aria-selected={activeTab === 'mathematics'}
				class:active={activeTab === 'mathematics'}
				onclick={() => (activeTab = 'mathematics')}
			>
				Mathematics
			</button>
			<button
				role="tab"
				aria-selected={activeTab === 'details'}
				class:active={activeTab === 'details'}
				onclick={() => (activeTab = 'details')}
			>
				Details
			</button>
		</div>
		<div class="tab-content">
			{#if activeTab === 'intuition'}
				{@render intuition()}
			{:else if activeTab === 'mathematics'}
				{@render mathematics()}
			{:else}
				{@render details()}
			{/if}
		</div>
	</footer>
</div>

<style>
	:root {
		--ml-bg: #f6f7f9;
		--ml-surface: #ffffff;
		--ml-border: #d6dbe1;
		--ml-text: #1b2430;
		--ml-text-muted: #5b6572;
		--ml-accent: #2f6f8f;
	}

	@media (prefers-color-scheme: dark) {
		:root {
			--ml-bg: #12161c;
			--ml-surface: #1a2028;
			--ml-border: #2c3644;
			--ml-text: #e5e9ee;
			--ml-text-muted: #99a3af;
			--ml-accent: #7fc1e0;
		}
	}

	.experiment {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		height: 100%;
		color: var(--ml-text);
		background: var(--ml-bg);
	}

	header {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--ml-border);
	}

	.brand {
		font-size: 0.75rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ml-text-muted);
		text-decoration: none;
	}

	.brand:hover {
		color: var(--ml-accent);
	}

	header h1 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0;
	}

	.grid {
		flex: 1;
		display: grid;
		grid-template-columns: 2fr 1fr;
		grid-template-rows: 1fr 1fr;
		gap: 1px;
		background: var(--ml-border);
		min-height: 0;
	}

	.pane {
		background: var(--ml-surface);
		padding: 0.75rem;
		overflow: auto;
		min-height: 0;
	}

	.explain {
		border-top: 1px solid var(--ml-border);
	}

	.tab-strip {
		display: flex;
		gap: 0.25rem;
		padding: 0.5rem 1rem 0;
	}

	.tab-strip button {
		background: none;
		border: none;
		padding: 0.4rem 0.75rem;
		font-size: 0.85rem;
		color: var(--ml-text-muted);
		cursor: pointer;
		border-bottom: 2px solid transparent;
	}

	.tab-strip button.active {
		color: var(--ml-accent);
		border-bottom-color: var(--ml-accent);
	}

	.tab-content {
		padding: 0.5rem 1rem 1rem;
		font-size: 0.9rem;
		color: var(--ml-text-muted);
	}

	@media (max-width: 800px) {
		.grid {
			grid-template-columns: 1fr;
			grid-template-rows: repeat(4, minmax(220px, auto));
			overflow-y: auto;
		}
	}
</style>
