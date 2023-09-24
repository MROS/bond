<script lang="ts">
	import Tiptap from '$lib/tiptap.svelte';
</script>

<div class="editorPanel">
	<Tiptap />
</div>

<style>
	.editorPanel {
		width: 100%;
		min-height: calc(100vh - 40px);
	}
	@media (min-width: 480px) {
		.editorPanel {
			width: 480px;
		}
	}
</style>
