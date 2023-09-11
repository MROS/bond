<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import Paragraph from './Paragraph.svelte';
	import { replying_paragraph_id } from './store';

	type Article = PageData['article'];
	export let data: Article;
	console.log(data);

	onDestroy(() => {
		replying_paragraph_id.set(undefined);
	});
</script>

<div class="article">
	{#if data}
		<h1>{data.title}</h1>
		{#each data.paragraphs as paragrapph}
			<Paragraph text={paragrapph.text} id={paragrapph.id} />
		{/each}
	{:else}
		<h1>查無此文</h1>
	{/if}
</div>

<style>
	.article {
		max-width: 680px;
	}
</style>
