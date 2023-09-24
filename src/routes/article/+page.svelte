<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	console.log(data);
</script>

<div>
	<div>
		<a href="/editor">
			<button>發表文章</button>
		</a>
	</div>
	<ul>
		{#each data.articles as article}
			<li><a href={`/article/${article.id}`}>{article.title}</a></li>
		{/each}
	</ul>
</div>

<style>
</style>
