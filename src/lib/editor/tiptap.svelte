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
	import { imageModalIsOpen, imageUrl, confirmCallback } from './image/store';
	import { bondModalState } from './bond/store';
	import ImageModal from './image/modal.svelte';
	import BondModal from './bond/modal.svelte';
	import type { BondList } from './bond/types';
	import BondExtension from './bond/bond_extenstion';
	import BondListExtension from './bond/bond_list_extension';

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
				BondExtension,
				BondListExtension,
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
		$bondModalState.setBondList = (bondList: BondList) => {
			editor.chain().focus().setBondList(bondList).run();
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
	:global(.bondListNode) {
		border-left: 4px solid brown;
		padding-left: 12px;
		margin: 18px 4px;
		& .bond.ProseMirror-selectednode {
			margin: 4px;
			animation: cursorLike 1000ms infinite alternate linear(0, 1 50%);
		}
	}
	:global(.ProseMirror-selectednode) {
		background-color: antiquewhite;
	}
</style>
