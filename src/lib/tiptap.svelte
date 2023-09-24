<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Icon from '@iconify/svelte';

	let element: HTMLDivElement;
	let editor: Editor;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [StarterKit],
			content: '<p>正文在此</p>',
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div class="articlePublisher">
	<div>
		<form class="pure-form">
			<input class="title" placeholder="標題" />
		</form>
	</div>

	{#if editor}
		<div>
			<button
				class="format"
				on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
				class:active={editor.isActive('heading', { level: 1 })}
			>
				<Icon icon="mdi:format-header-1" />
			</button>
			<button
				class="format"
				on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				class:active={editor.isActive('heading', { level: 2 })}
			>
				<Icon icon="mdi:format-header-2" />
			</button>
			<button
				class="format"
				on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
				class:active={editor.isActive('heading', { level: 3 })}
			>
				<Icon icon="mdi:format-header-3" />
			</button>
			<button
				class="format"
				on:click={() => editor.chain().focus().setParagraph().run()}
				class:active={editor.isActive('paragraph')}
			>
				<Icon icon="mdi:format-text" />
			</button>
		</div>
	{/if}

	<div class="editor" bind:this={element} />
	<div>
		<button class="pure-button pure-button-primary">發佈文章</button>
	</div>
</div>

<style>
	.title {
		width: 100%;
	}
	.format {
		font-size: 24px;
		background-color: white;
		border: 0px;
	}
	.format.active {
		background: black;
		color: white;
	}
	.articlePublisher {
		display: flex;
		flex-direction: column;
		height: 100%;
		& .editor {
			border: 3px solid black;
			flex: 1;
			& *:focus {
				outline: none;
			}
		}
	}
</style>
