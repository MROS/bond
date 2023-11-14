<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import Node from '$lib/editor/render/Node.svelte';
	import * as NodeType from '$lib/editor/types';
	import { replyingNodeId } from './store';
	import { localStorage } from '$lib/localStorage';

	type Article = PageData['article'];
	export let article: Article;
	console.log(article);
	let nodes: NodeType.Node[] = [];
	let parseError: null | string = null;

	$: {
		try {
			nodes =
				article?.nodes.map((node) => {
					const json = JSON.parse(node.text);
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
		replyingNodeId.set(undefined);
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
					<!-- TODO: 改寫 ./Node.svelte ， 補回留言功能 -->
					<Node {node} />
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
