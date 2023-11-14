<script lang="ts">
	import type { Bond } from '../types';
	export let bond: Bond;
</script>

<div class="bond">
	<div class="wrapper">
		{#each bond.attrs.quotedNodes as quotedNode}
			<!-- TODO: text 的類型應改爲 Node ，渲染需遞迴調用 -->
			<div class="quotedNodeDiv">
				{quotedNode.text}
				<span class="quotedNodeOrder">
					<!-- 軟體慣以 0 爲始，但文章段落通常以 1 爲始 -->
					第 {quotedNode.order + 1} 段
				</span>
			</div>
		{/each}
		<div class="articleMeta">
			——
			<span class="articleName">
				<a href="/article/{bond.attrs.article.id}">
					{bond.attrs.article.title}
				</a>
			</span>
		</div>
	</div>
</div>

<style>
	@import '$lib/editor/extensions/bond/style.css';
</style>
