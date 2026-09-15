<script lang="ts">
	let { component }: { component: number } = $props();

	// Clamp the drawn arrow length so an extreme A doesn't blow past the
	// viewBox; the numeric value is still shown as text.
	const maxLen = 70;
	let arrowLen = $derived(Math.max(-maxLen, Math.min(maxLen, component * 40)));
</script>

<svg
	viewBox="0 0 240 140"
	role="img"
	aria-label="Effective field A_mu on the lower-dimensional base"
>
	<line x1="20" y1="70" x2="220" y2="70" stroke="var(--ml-border, #d6dbe1)" stroke-width="2" />
	{#each [60, 120, 180] as x (x)}
		<circle cx={x} cy="70" r="3" fill="var(--ml-text-muted, #5b6572)" />
	{/each}

	<g transform="translate(120 70)">
		<line
			x1="0"
			y1="0"
			x2="0"
			y2={-arrowLen}
			stroke="var(--ml-accent, #2f6f8f)"
			stroke-width="3"
			marker-end="url(#arrowhead)"
		/>
	</g>

	<defs>
		<marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto">
			<path d="M0,0 L7,3.5 L0,7 z" fill="var(--ml-accent, #2f6f8f)" />
		</marker>
	</defs>

	<text x="120" y="125" text-anchor="middle" font-size="11" fill="var(--ml-text-muted, #5b6572)">
		A_x = {component.toFixed(2)}
	</text>
</svg>

<style>
	svg {
		width: 100%;
		max-width: 20rem;
		display: block;
	}
</style>
