<script lang="ts">
	import Tiptap from '$lib/editor/tiptap.svelte';
</script>

<div class="editorPanel">
	<Tiptap />
</div>

<style>
	.editorPanel {
		width: 100%;
		min-height: calc(var(--doc-height) - var(--header-height));
	}
	@media (min-width: 600px) {
		.editorPanel {
			width: 600px;
		}
	}
</style>
