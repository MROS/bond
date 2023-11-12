<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import Paragraph from './Paragraph.svelte';
	import Node from '$lib/editor/render/Node.svelte';
	import * as NodeType from '$lib/editor/types';
	import { replyingParagraphId } from './store';
	import { localStorage } from '$lib/localStorage';

	type Article = PageData['article'];
	export let article: Article;
	let nodes: NodeType.Node[] = [];
	let parseError: null | string = null;

	$: {
		try {
			nodes =
				article?.paragraphs.map((paragraph) => {
					const json = JSON.parse(paragraph.text);
					return NodeType.zodNode.parse(json);
				}) ?? [];
			parseError = null;
		} catch (e) {
			nodes = [];
			console.error(e);
			parseError = (e as Error).message;
		}
	}

	if (article) {
		localStorage.addRecentReadArticle(article);
	}

	onDestroy(() => {
		replyingParagraphId.set(undefined);
	});
</script>

<div class="article">
	{#if article}
		<h1>{article.title}</h1>
		<div class="content">
			{#if parseError}
				格式錯誤：{parseError}
			{:else}
				{#each nodes as node}
					<Node {node} />
					<!-- <Paragraph
				text={paragrapph.text}
				id={paragrapph.id} -->
					<!-- /> -->
				{/each}
			{/if}
		</div>
	{:else}
		<h1>查無此文</h1>
	{/if}
</div>

<style>
	.article {
		& .content {
			font-size: 18px;
		}
	}
</style>
