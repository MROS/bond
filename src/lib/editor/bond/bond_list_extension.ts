import { Node, mergeAttributes } from '@tiptap/core';

import type { BondList } from './types';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		bond: {
			setBondList: (options: BondList) => ReturnType;
		};
	}
}

const BondListExtension = Node.create({
	name: 'BondList',
	group: 'block',
	content: 'Bond+',
	defining: true,
	addOptions() {
		return {};
	},
	addAttributes() {
		return {
			attitude: {
				default: '中立'
			},
			paragraphs: {
				default: []
			}
		};
	},
	parseHTML() {
		return [
			{
				tag: 'bond-node'
			}
		];
	},
	renderHTML({ HTMLAttributes }) {
		return ['bond-list-node', mergeAttributes(HTMLAttributes)];
	},
	addCommands() {
		return {
			setBondList: (options) => {
				return ({ commands }) => {
					console.log(options);
					return commands.insertContent({
						type: this.name,
						attrs: options,
						content: options.paragraphs.map((paragraph) => {
							return {
								type: 'Bond',
								attrs: { paragraph: paragraph.text }
								// content: [
								// 	{
								// 		type: 'paragraph',
								// 		content: [{ type: 'text', text: paragraph.text }]
								// 	}
								// ]
							};
						})
					});
				};
			}
		};
	},
	addNodeView() {
		return ({ node }) => {
			const dom = document.createElement('div');
			dom.classList.add('bondListNode');

			const content = document.createElement('div');
			content.classList.add('content');
			dom.append(content);

			return { dom, contentDOM: content };
		};
	}
});

export default BondListExtension;
