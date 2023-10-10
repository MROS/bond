<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import Paragraph from './Paragraph.svelte';
	import { replyingParagraphId } from './store';
	import { localStorage } from '$lib/localStorage';

	type Article = PageData['article'];
	export let data: Article;
	if (data) {
		localStorage.addRecentReadArticle(data);
	}

	onDestroy(() => {
		replyingParagraphId.set(undefined);
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
