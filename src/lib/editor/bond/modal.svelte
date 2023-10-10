<script lang="ts">
	import { Dialog, DialogOverlay, DialogTitle } from '@rgossiaux/svelte-headlessui';
	import { bondModalState, attitudes } from './store';
	import { localStorage } from '$lib/localStorage';
	import { trpc } from '$lib/trpc/client';
	import type { RouterOutput } from '$lib/trpc/routers';
	let { recentReadArticles } = localStorage;
	type Article = RouterOutput['article']['get'];
	let selectedArticle: Article | null = null;
	let selectedParagraphs: string[] = [];
</script>

<Dialog
	class="bondModal"
	open={$bondModalState.isOpen}
	on:close={() => {
		$bondModalState.isOpen = false;
		selectedArticle = null;
	}}
>
	<DialogOverlay class="modalOverlay" />

	<DialogTitle>引用</DialogTitle>

	<!-- <div>
		<input placeholder="文章標題/代碼" bind:value={$bondArticleId} />
		<button>查詢</button>
	</div> -->
	<div>
		{#if selectedArticle}
			<div>
				{selectedArticle.title}
				<button
					on:click={() => {
						selectedArticle = null;
					}}>選擇其他文章</button
				>
				<div class="paragraphs">
					{#each selectedArticle.paragraphs as paragraph}
						<label>
							<div>
								<input type="checkbox" value={paragraph.id} bind:group={selectedParagraphs} />
								{paragraph.text}
							</div>
						</label>
					{/each}
				</div>
				<div>
					態度
					<select bind:value={$bondModalState.attitude}>
						{#each attitudes as attitude}
							<option value={attitude}>
								{attitude}
							</option>
						{/each}
					</select>
				</div>
			</div>
		{:else}
			<div>
				最近閱讀
				<ul>
					{#each $recentReadArticles as articleMeta}
						<li>
							<button
								on:click={() => {
									$bondModalState.articleId = articleMeta.id;
									trpc()
										.article.get.query({ id: articleMeta.id })
										.then((article) => {
											selectedArticle = article;
										});
								}}>{articleMeta.title}</button
							>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>

	<button
		on:click={() => {
			if ($bondModalState.confirmCallback) {
				$bondModalState.confirmCallback();
				$bondModalState.confirmCallback = null;
			}
			$bondModalState.isOpen = false;
			$bondModalState.articleId = null;
			$bondModalState.attitude = '中立';
			selectedArticle = null;
		}}>確定</button
	>
	<button on:click={() => ($bondModalState.isOpen = false)}>取消</button>
</Dialog>

<style>
	:global(.bondModal) {
		position: fixed;
		width: 100%;
		max-height: var(--doc-height);
		z-index: 200;
		background-color: white;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		border: 1px solid black;
		@media (min-width: 600px) {
			width: 600px;
		}

		& :global(.modalOverlay) {
			position: fixed;
			top: 0;
			left: 0;
			background-color: rgb(0 0 0);
			opacity: 0.3;
		}
		& .paragraphs {
			margin: 10px;
			max-height: 400px;
			overflow-y: scroll;
			/* NOTE: 火狐到 110 版都還沒支援 has 關鍵字
			https://stackoverflow.com/questions/73936048/how-do-you-enable-has-selector-on-firefox */
			& div:has(input:checked) {
				background-color: antiquewhite;
			}
		}
	}
</style>
