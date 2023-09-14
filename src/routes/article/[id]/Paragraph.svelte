<script lang="ts">
	export let text: string;
	export let id: string;
	import { replyingParagraphId } from './store';

	function setId() {
		console.log('點擊段落');
		if ($replyingParagraphId != id) {
			replyingParagraphId.set(id);
			return;
		}
		replyingParagraphId.set(undefined);
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={setId} class:selected={$replyingParagraphId === id}>
	<p>{text}</p>
</div>

<style>
	.selected {
		background-color: antiquewhite;
	}
</style>
