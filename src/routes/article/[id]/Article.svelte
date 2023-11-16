<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import RenderNode from '$lib/editor/render/Node.svelte';
	import type * as NodeType from '$lib/editor/types';
	import { replyingNodeId } from './store';
	import { localStorage } from '$lib/localStorage';

	type Article = PageData['article'];
	export let article: Article;
	let nodes: NodeType.NodeWithMeta[] = [];
	if (article) {
		nodes = article.nodes;
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
			{#each nodes as node}
				<!-- TODO: 改寫 ./Node.svelte ， 補回留言功能 -->
				<RenderNode node={node.value} />
			{/each}
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
