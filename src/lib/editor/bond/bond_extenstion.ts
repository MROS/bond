import { Node, mergeAttributes } from '@tiptap/core';

const BondExtension = Node.create({
	name: 'Bond',
	group: 'block',
	// content: 'block',
	atom: true,
	addOptions() {
		return {};
	},
	addAttributes() {
		// return {};
		return {
			paragraph: {
				default: ''
			}
		};
	},
	// parseHTML() {
	// 	return [
	// 		{
	// 			tag: `div[data-type=${this.name}]`
	// 		}
	// 	];
	// },
	// renderHTML({ HTMLAttributes }) {
	// 	return ['div', mergeAttributes(HTMLAttributes, { 'data-type': this.name, class: 'bond' }), 0];
	// }
	parseHTML() {
		return [
			{
				tag: 'bond-node'
			}
		];
	},
	renderHTML({ HTMLAttributes }) {
		return ['bond-node', mergeAttributes(HTMLAttributes)];
	},
	addNodeView() {
		return ({ node }) => {
			const dom = document.createElement('div');
			dom.classList.add('bond');
			dom.innerText = node.attrs.paragraph;

			return { dom };
		};
	},
	addKeyboardShortcuts() {
		return {
			Enter: ({ editor }) => {
				// 此處定義的 Enter 只應作用在 Bond 上
				if (!editor.isActive(this.name)) {
					return false;
				}

				const head = editor.state.selection.$head;
				if (head.index(head.depth) == 1) {
					console.log('first child');
					editor
						.chain()
						.selectParentNode()
						.insertContentAt(editor.state.selection.from - 1, {
							type: 'paragraph'
						})
						.run();
					return true;
				}
				editor
					.chain()
					.splitBlock()
					.insertContentAt(editor.state.selection.from, {
						type: 'paragraph'
					})
					.run();
				return true;
			},
			Backspace: ({ editor }) => {
				if (!editor.isActive(this.name)) {
					return false;
				}
				const head = editor.state.selection.$head;
				if (head.index(head.depth) == 1) {
					console.log('first child');
					editor.chain().selectParentNode().joinUp().run();
					return true;
				}
				return true;
				// return true;
			}
		};
	}
});

export default BondExtension;
