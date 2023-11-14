<script lang="ts">
	import { slide } from 'svelte/transition';
	import { replyingNodeId } from './store';
	import { trpc } from '$lib/trpc/client';

	let commentValue = '';
	let textareaElement: HTMLTextAreaElement;
	async function createComment(content: string) {
		if ($replyingNodeId == undefined) {
			console.error('未指定留言對應的段落 ID');
			return;
		}
		return trpc()
			.comment.create.mutate({ content, nodeId: $replyingNodeId })
			.then((comment) => {
				console.log(`comment created: ${JSON.stringify(comment)}`);
			});
	}

	type Comment = {
		content: string;
	};

	// sveltekit 的 loading 狀態如何表示
	let comments: null | Comment[] = null;

	function refreshComments() {
		if (!$replyingNodeId) {
			return;
		}
		trpc()
			.comment.get.query({ nodeId: $replyingNodeId })
			.then((refreshedCmments) => {
				comments = refreshedCmments;
			});
	}

	// 當 replyingNodeId 變化時，改變 comments 內容
	replyingNodeId.subscribe(() => {
		refreshComments();
	});
</script>

{#if $replyingNodeId != undefined}
	<div class="replies" transition:slide={{ axis: 'x' }}>
		<div class="inner">
			{#if comments == null}
				載入評論中
			{:else if comments?.length == 0}
				尚無評論
			{:else}
				{#each comments as comment}
					<p>
						{comment.content}
					</p>
				{/each}
			{/if}
			<label>
				<textarea
					name="content"
					bind:this={textareaElement}
					bind:value={commentValue}
					on:input={() => {
						let height = Math.max(textareaElement.scrollHeight, 24);
						textareaElement.style.height = `${height}px`;
					}}
					placeholder="發表評論"
					class="comment"
				/>
			</label>
			<input type="hidden" name="node_id" value={$replyingNodeId} />
			<button
				on:click={() =>
					createComment(commentValue).then(() => {
						commentValue = '';
						refreshComments();
					})}>送出</button
			>
		</div>
	</div>
{/if}

<style>
	.replies {
		top: 41px;
		position: sticky;
		width: 350px;
		height: calc(100vh - 41px);
		border-left: 1px solid gainsboro;
	}
	.inner {
		width: 350px;
		overflow-x: hidden;
	}
	.comment {
		width: 100%;
		height: 24px;
		overflow-y: hidden;
	}
</style>
