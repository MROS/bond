import { Extension } from '@tiptap/core';

import type { Attitude } from './store';

const Bond = Extension.create({
	name: 'Bond',
	addOptions() {
		return {};
	},
	addAttributes() {
		return {
			attitude: {
				default: '中立',
				parseHTML: (element) => element.getAttribute('data-attitude'),
				renderHTML: (attributes) => ({ 'data-attitude': attributes.attitude })
			}
		};
	},
	parseHTML() {
		return [
			{
				tag: `div[data-type=${this.name}]`
			}
		];
	},
	renderHTML({ node, HTMLAttributes }) {
		[
			'div',
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				'data-type': this.name
			}),
			['']
		];
	}
});

export { Bond as Bond };

export default Bond;
