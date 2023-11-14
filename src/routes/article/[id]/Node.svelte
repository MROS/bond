<script lang="ts">
	export let text: string;
	export let id: string;
	import { replyingNodeId } from './store';

	function setId() {
		console.log('點擊段落');
		if ($replyingNodeId != id) {
			replyingNodeId.set(id);
			return;
		}
		replyingNodeId.set(undefined);
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={setId} class:selected={$replyingNodeId === id}>
	<p>{text}</p>
</div>

<style>
	.selected {
		background-color: antiquewhite;
	}
</style>
