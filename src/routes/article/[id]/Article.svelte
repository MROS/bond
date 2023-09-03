<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import Paragraph from './Paragraph.svelte';
	import { replying_paragraph_id } from './store';

	type Article = PageData['post'];
	export let data: Article;

	onDestroy(() => {
		replying_paragraph_id.set(undefined);
	});
</script>

<div class="article">
	<h1>{data.title}</h1>
	{#each data.content.split('\n') as paragrapph, i}
		<Paragraph content={paragrapph} id={i} />
	{/each}
</div>

<style>
	.article {
		max-width: 680px;
	}
</style>
