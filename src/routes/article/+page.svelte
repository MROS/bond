<script lang="ts">
	let articles = [
		{ title: '#公告 時事板 9/27 起實施身份驗證（2021/10/4 更新）', id: 0 },
		{ title: '[問卦] 到底誰騙我經濟不好？', id: 1 },
		{ title: '[問卦] 九萬跟四萬的125cc機車差在哪裡？', id: 2 },
		{ title: '[小說轉載] 太平妖術', id: 3 }
	];
</script>

<div>
	<ul>
		{#each articles as article}
			<li><a href={`/article/${article.id}`}>{article.title}</a></li>
		{/each}
	</ul>
</div>
