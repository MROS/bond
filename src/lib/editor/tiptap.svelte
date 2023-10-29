<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import Document from '@tiptap/extension-document';
	import History from '@tiptap/extension-history';
	import Paragraph from '@tiptap/extension-paragraph';
	import Text from '@tiptap/extension-text';
	import Heading from '@tiptap/extension-heading';
	import Image from '@tiptap/extension-image';
	import Placeholder from '@tiptap/extension-placeholder';
	import Icon from '@iconify/svelte';
	import { imageModalIsOpen, imageUrl, confirmCallback } from './image/store';
	import { bondModalState } from './bond/store';
	import ImageModal from './image/modal.svelte';
	import BondModal from './bond/modal.svelte';
	import type { Bond } from './bond/types';
	import BondExtension from './bond/bond_extenstion';

	let element: HTMLDivElement;
	let editor: Editor;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				Document,
				History,
				Paragraph,
				Text,
				Placeholder.configure({
					placeholder: '開始寫作...'
				}),
				Heading.configure({ levels: [1, 2, 3] }),
				BondExtension,
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
		$imageModalIsOpen = true;
		$confirmCallback = () => {
			if ($imageUrl.length > 0) {
				editor.chain().focus().setImage({ src: $imageUrl }).run();
			}
		};
	};
	const addBond = () => {
		$bondModalState.isOpen = true;
		$bondModalState.setBond = (bond: Bond) => {
			editor.chain().focus().setBond(bond).run();
		};
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
			<button class="format" on:click={addBond}>
				<!-- TODO 改爲碳鍵 logo -->
				<Icon icon="mdi:format-quote-close" />
			</button>
			<button class="format" on:click={() => editor.commands.undo()}>
				<!-- TODO 改爲碳鍵 logo -->
				<Icon icon="mdi:undo" />
			</button>
			<button class="format" on:click={() => editor.commands.redo()}>
				<!-- TODO 改爲碳鍵 logo -->
				<Icon icon="mdi:redo" />
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
<ImageModal />
<BondModal />

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
			padding: 0px 0.5em;
			border: 3px solid black;
			flex: 1;
			& *:focus {
				outline: none;
			}
		}
	}
	@keyframes -global-cursorLike {
		from {
			border-left: 10px solid black;
		}
		to {
			border-left: 0px solid black;
		}
	}
	:global(.bondNode) {
		padding: 8px 4px;
		& .wrapper {
			border-left: 4px solid brown;
			padding-left: 12px;
			& .paragraphNode {
				border: 1px solid transparent;
				margin: 4px;
			}
			& .paragraphNode:focus {
				border: 1px solid black;
				margin: 4px;
				animation: cursorLike 1000ms infinite alternate linear(0, 1 50%);
				background-color: antiquewhite;
			}
		}
	}
	:global(.ProseMirror-selectednode:not(:has(div:focus))) {
		& .wrapper {
			background-color: antiquewhite;
		}
	}
</style>
