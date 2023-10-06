<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import Paragraph from './Paragraph.svelte';
	import { replyingParagraphId } from './store';
	import { recentReadArticles } from '$lib/localStorage/store';

	type Article = PageData['article'];
	export let data: Article;
	recentReadArticles.update((metas) => {
		if (data == null) {
			return metas;
		}
		if (metas.some((meta) => meta.id == data!.id)) {
			return metas;
		}
		return [{ id: data.id, title: data.title }, ...metas].slice(0, 10);
	});

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
