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
	import { imageModalIsOpen, imageUrl, confirmCallback } from './extensions/image/store';
	import { bondModalState } from './extensions/bond/store';
	import ImageModal from './extensions/image/modal.svelte';
	import BondModal from './extensions/bond/modal.svelte';
	import type { BondAttribute } from './extensions/bond/types';
	import BondExtension from './extensions/bond/bond_extenstion';
	import { trpc } from '$lib/trpc/client';
	import { zodDoc } from './types';

	let element: HTMLDivElement;
	let editor: Editor;

	let titleValue = '';

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
				Heading.configure({ levels: [2, 3, 4] }),
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
		$bondModalState.setBond = (bond: BondAttribute) => {
			editor.chain().focus().setBond(bond).run();
		};
	};
</script>

<div class="articlePublisher">
	<div>
		<form class="pure-form">
			<input class="title" placeholder="標題" bind:value={titleValue} />
		</form>
	</div>

	{#if editor}
		<div>
			<button
				class="format"
				on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				class:active={editor.isActive('heading', { level: 2 })}
			>
				<Icon icon="mdi:format-header-1" />
			</button>
			<button
				class="format"
				on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
				class:active={editor.isActive('heading', { level: 3 })}
			>
				<Icon icon="mdi:format-header-2" />
			</button>
			<button
				class="format"
				on:click={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
				class:active={editor.isActive('heading', { level: 4 })}
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
		<button
			class="pure-button pure-button-primary"
			on:click={() => {
				trpc().article.create.mutate({
					doc: zodDoc.parse(editor.getJSON()),
					title: titleValue
				});
			}}
		>
			發佈文章
		</button>
	</div>
</div>
<ImageModal />
<BondModal />

<style>
	@import './extensions/bond/style.css';
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
</style>
