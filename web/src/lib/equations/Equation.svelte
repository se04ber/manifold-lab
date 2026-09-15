<script lang="ts">
	import katex from 'katex';

	let { tex, display = true }: { tex: string; display?: boolean } = $props();

	let html = $derived(
		katex.renderToString(tex, { displayMode: display, throwOnError: false, output: 'html' })
	);
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -- katex output is generated locally from our own tex strings, never user input -->
{@html html}
