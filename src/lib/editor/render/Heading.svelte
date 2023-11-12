<script lang="ts">
	import type { Heading } from '../types';
	export let heading: Heading;
</script>

{#if heading.attrs.level == 2}
	<h2>{heading.content?.map((text) => text.text)}</h2>
{:else if heading.attrs.level == 3}
	<h3>{heading.content?.map((text) => text.text)}</h3>
{:else if heading.attrs.level == 4}
	<h4>{heading.content?.map((text) => text.text)}</h4>
{/if}
