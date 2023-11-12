<script lang="ts">
	import type { PageData } from './$types';
	import Article from './Article.svelte';
	import Replies from './Replies.svelte';
	export let data: PageData;
</script>

<div class="main">
	<div>
		<nav>
			<a href="/article">回文章列表</a>
		</nav>
		<Article article={data.article} />
	</div>
	<Replies />
</div>

<style>
	.main {
		display: flex;
		width: 100%;
		justify-content: center;
		& > div {
			width: 100%;
			@media (min-width: 600px) {
				width: 600px;
			}
		}
	}
</style>
