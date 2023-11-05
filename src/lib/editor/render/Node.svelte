<script lang="ts">
	import type { Node } from '../types';
	import Paragraph from './Paragraph.svelte';
	import Heading from './Heading.svelte';
	import Bond from './Bond.svelte';
	export let node: Node;
</script>

{#if node.type == 'paragraph'}
	<Paragraph paragraph={node} />
{:else if node.type == 'heading'}
	<Heading heading={node} />
{:else if node.type == 'Bond'}
	<Bond bond={node} />
{/if}
