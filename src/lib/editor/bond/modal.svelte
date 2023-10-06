<script>
	import { Dialog, DialogOverlay, DialogTitle } from '@rgossiaux/svelte-headlessui';
	import {
		bondModalIsOpen,
		bondAttitude,
		attitudes,
		bondArticleId,
		confirmCallback
	} from './store';
	import { recentReadArticles } from '$lib/localStorage/store';
</script>

<Dialog class="modal" open={$bondModalIsOpen} on:close={() => ($bondModalIsOpen = false)}>
	<DialogOverlay class="modalOverlay" />

	<DialogTitle>引用</DialogTitle>

	<!-- <div>
		<input placeholder="文章標題/代碼" bind:value={$bondArticleId} />
		<button>查詢</button>
	</div> -->
	<div>
		最近閱讀
		<ul>
			{#each $recentReadArticles as article}
				<li>
					<button
						on:click={() => {
							// TODO: article id 改爲字串
							$bondArticleId = `${article.id}`;
						}}>{article.title}</button
					>
				</li>
			{/each}
		</ul>
	</div>
	<div>
		態度
		<select bind:value={$bondAttitude}>
			{#each attitudes as attitude}
				<option value={attitude}>
					{attitude}
				</option>
			{/each}
		</select>
	</div>

	<button
		on:click={() => {
			if ($confirmCallback) {
				$confirmCallback();
				$confirmCallback = null;
			}
			$bondModalIsOpen = false;
			$bondArticleId = '';
			$bondAttitude = '中立';
		}}>確定</button
	>
	<button on:click={() => ($bondModalIsOpen = false)}>取消</button>
</Dialog>

<style>
	:global(.modal) {
		position: fixed;
		max-width: 400px;
		z-index: 200;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		border: 1px solid black;
	}
	:global(.modalOverlay) {
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgb(0 0 0);
		opacity: 0.3;
	}
</style>
