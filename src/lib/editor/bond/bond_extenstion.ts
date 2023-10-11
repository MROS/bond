import { Node, mergeAttributes } from '@tiptap/core';

import type { Bond } from './types';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		bond: {
			setBond: (options: Bond) => ReturnType;
		};
	}
}

const BondExtension = Node.create({
	name: 'Bond',
	group: 'block',
	// atom: true,
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
		return ['bond-node', mergeAttributes(HTMLAttributes)];
	},
	addCommands() {
		return {
			setBond: (options) => {
				console.log('set Bond outer');
				return ({ commands }) => {
					console.log('set Bond inner');
					return commands.insertContent({
						type: this.name,
						attrs: options
					});
				};
			}
		};
	},
	addNodeView() {
		return ({ node }) => {
			const dom = document.createElement('div');
			dom.classList.add('bondNode');
			for (const paragraph of node.attrs.paragraphs) {
				const paragraphNode = document.createElement('div');
				paragraphNode.innerText = paragraph.text;
				dom.appendChild(paragraphNode);
			}

			return { dom };
		};
	}
});

export default BondExtension;
