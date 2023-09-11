<script lang="ts">
	export let text: string;
	export let id: string;
	import { replying_paragraph_id } from './store';

	function set_id() {
		if ($replying_paragraph_id != id) {
			replying_paragraph_id.set(id);
			return;
		}
		replying_paragraph_id.set(undefined);
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={set_id} class:selected={$replying_paragraph_id === id}>
	<p>{text}</p>
</div>

<style>
	.selected {
		background-color: antiquewhite;
	}
</style>
