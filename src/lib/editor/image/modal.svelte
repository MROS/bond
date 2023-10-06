<script>
	import {
		Dialog,
		DialogOverlay,
		DialogTitle,
		DialogDescription
	} from '@rgossiaux/svelte-headlessui';
	import { imageModalIsOpen, imageUrl, confirmCallback } from './store';
</script>

<Dialog class="modal" open={$imageModalIsOpen} on:close={() => ($imageModalIsOpen = false)}>
	<DialogOverlay class="modalOverlay" />

	<DialogTitle>插入圖片</DialogTitle>
	<DialogDescription>請輸入圖片網址</DialogDescription>

	<div>
		<input bind:value={$imageUrl} />
	</div>

	<button
		on:click={() => {
			if ($confirmCallback) {
				$confirmCallback();
				$confirmCallback = null;
			}
			$imageModalIsOpen = false;
			$imageUrl = '';
		}}>確定</button
	>
	<button on:click={() => ($imageModalIsOpen = false)}>取消</button>
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
