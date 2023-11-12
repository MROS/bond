<script lang="ts">
	import type { Bond } from '../types';
	export let bond: Bond;
</script>

<div class="bondNode">
	<div class="wrapper">
		{#each bond.attrs.paragraphs as paragraph}
			<!-- TODO: text 的類型應改爲 Node ，渲染需遞迴調用 -->
			<div class="paragraphNode">
				{paragraph.text}
				<span class="paragraphOrder">
					<!-- 軟體慣以 0 爲始，但文章段落通常以 1 爲始 -->
					第 {paragraph.order + 1} 段
				</span>
			</div>
		{/each}
		<div class="paragraphTitle">
			--
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
