<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import Document from '@tiptap/extension-document';
	import Paragraph from '@tiptap/extension-paragraph';
	import Text from '@tiptap/extension-text';
	import Heading from '@tiptap/extension-heading';
	import Image from '@tiptap/extension-image';
	import Placeholder from '@tiptap/extension-placeholder';
	import Icon from '@iconify/svelte';

	let element: HTMLDivElement;
	let editor: Editor;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				Document,
				Paragraph,
				Text,
				Placeholder.configure({
					placeholder: '開始寫作...'
				}),
				Heading.configure({ levels: [1, 2, 3] }),
				Image.configure({ HTMLAttributes: { class: 'tiptapImage' } })
			],
			content: '',
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

	const addImage = () => {
		const url = window.prompt('URL');

		if (url) {
			editor.chain().focus().setImage({ src: url }).run();
		}
	};
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
			<button class="format" on:click={addImage}>
				<Icon icon="mdi:image" />
			</button>
		</div>
	{/if}

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="editor" bind:this={element} on:click={() => editor.chain().focus()} />
	<div>
		<button class="pure-button pure-button-primary">發佈文章</button>
	</div>
</div>

<style>
	:global(.tiptapImage) {
		max-width: 100%;
	}
	:global(.tiptap p.is-editor-empty:first-child::before) {
		color: #adb5bd;
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}
	.title {
		width: 100%;
	}
	.format {
		font-size: 24px;
		background-color: white;
		border: 0px;
		&:hover {
			background-color: lavender;
			cursor: pointer;
		}
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
