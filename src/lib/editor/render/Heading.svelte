<script lang="ts">
	import type { Heading } from '../types';
	export let heading: Heading;
</script>

{#if heading.attrs.level == 1}
	<h1>{heading.content?.map((text) => text.text)}</h1>
{:else if heading.attrs.level == 2}
	<h2>{heading.content?.map((text) => text.text)}</h2>
{:else if heading.attrs.level == 3}
	<h3>{heading.content?.map((text) => text.text)}</h3>
{/if}
