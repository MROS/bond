<script lang="ts">
	import type { Bond } from '../types';
	export let bond: Bond;
</script>

<div>
	<!-- TODO:實作之  -->
	<blockquote>
		{#each bond.attrs.paragraphs as paragraph}
			<!-- TODO: text 的類型應改爲 Node ，渲染需遞迴調用 -->
			<p>{paragraph.text}</p>
		{/each}
	</blockquote>
</div>
