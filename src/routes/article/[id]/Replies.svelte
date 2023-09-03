<script lang="ts">
	import { slide } from 'svelte/transition';
	import { replying_paragraph_id } from './store';

	// let comment: string = '';
	let textarea_element: HTMLTextAreaElement;
</script>

{#if $replying_paragraph_id != undefined}
	<div class="replies" transition:slide={{ axis: 'x' }}>
		<div class="inner">尚無評論</div>
		<form method="POST" action="?/comment">
			<label>
				<textarea
					name="text"
					bind:this={textarea_element}
					on:input={() => {
						let height = Math.max(textarea_element.scrollHeight, 24);
						textarea_element.style.height = `${height}px`;
					}}
					placeholder="發表評論"
					class="comment"
				/>
			</label>
			<button>送出</button>
		</form>
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
