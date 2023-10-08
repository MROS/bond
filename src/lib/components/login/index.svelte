<script>
	import { Dialog, DialogOverlay, DialogTitle } from '@rgossiaux/svelte-headlessui';
	import { loginModalState } from './store';
</script>

<Dialog
	class="modal"
	open={$loginModalState.isOpen}
	on:close={() => ($loginModalState.isOpen = false)}
>
	<DialogOverlay class="modalOverlay" />

	<DialogTitle>登入</DialogTitle>
	<div>施工中，目前不需要登入就能使用所有功能</div>
	<button
		on:click={() => {
			$loginModalState.isOpen = false;
		}}>確定</button
	>
	<button on:click={() => ($loginModalState.isOpen = false)}>取消</button>
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
