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
			},
			focusParagraph: {
				default: undefined
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
				return ({ commands }) => {
					console.log(options);
					return commands.insertContent({
						type: this.name,
						attrs: options
					});
				};
			}
		};
	},
	addNodeView() {
		return ({ node, getPos, editor }) => {
			const { view } = editor;

			// 多包裝一層 div ，以讓 NodeView 之間沒有 margin
			// 當點擊到 margin 時， prosemirror 因不明原因會選擇後一個節點
			const dom = document.createElement('div');
			dom.classList.add('bondNode');
			const wrapper = document.createElement('div');
			wrapper.classList.add('wrapper');

			const attrs = node.attrs as Bond;

			if (typeof getPos == 'boolean') {
				wrapper.innerText = '內部錯誤，本節點不存在文件中';
				return wrapper;
			}

			const paragraphNodes: Array<HTMLDivElement> = [];
			for (const [index, paragraph] of attrs.paragraphs.entries()) {
				const paragraphNode = document.createElement('div');
				paragraphNode.classList.add('paragraphNode');
				paragraphNode.tabIndex = 0;
				if (index == attrs.focusParagraph) {
					setTimeout(() => paragraphNode.focus(), 0);
				}
				paragraphNode.innerText = paragraph.text;
				paragraphNodes.push(paragraphNode);

				// 在滑鼠按下去的瞬間就讓編輯器的選取當前節點
				// 若不在 mousedown 事件就修正當前節點（名為 A）位置
				// 且上一個選取節點是另一個 BondNode 中的 paragraphNode (名為 B) 時
				// 以下兩事件存在時間差：
				// 1. mousedown 事件，導致 B 失焦，A 聚焦，B 所在的 bondNode 因 CSS
				//    .ProseMirror-selectednode:not(:has(div:focus))) 作用而變色
				// 2. click 事件，將 NodeSelection 設為當前 BondNode
				//    .ProseMirror-selectednode 調整到 A 所在 BondNode ，B 所在 BondNode 褪色
				// 該時間差導致前一個選取到的 BondNode 閃動
				paragraphNode.onmousedown = () => {
					editor.commands.setNodeSelection(getPos());
				};
				paragraphNode.onclick = (event) => {
					// 阻止滑鼠點擊事件傳播到整個 Bond 節點
					// 若不阻擋傳播，prosemirror 將會聚焦到整個 Bond 節點，而非我們期望的 paragraphNode
					event.stopPropagation();
				};
				paragraphNode.onmouseup = (event) => {
					// 阻止滑鼠點擊事件傳播到整個 Bond 節點
					// 若不阻擋傳播，prosemirror 將會聚焦到整個 Bond 節點，而非我們期望的 paragraphNode
					event.stopPropagation();
				};
				paragraphNode.onkeydown = (event) => {
					event.stopPropagation();
					event.preventDefault();
					switch (event.key) {
						case 'Enter': {
							console.log('enter');
							if (index > 0) {
								editor
									.chain()
									.insertContentAt(getPos(), {
										type: this.name,
										attrs: {
											attitude: attrs.attitude,
											paragraphs: attrs.paragraphs.slice(0, index),
											focusParagraph: undefined
										}
									})
									.setNodeSelection(getPos() + 1)
									.run();
								// 更新本節點，只保留此 index 以降的段落
								view.dispatch(
									view.state.tr
										.setNodeAttribute(getPos(), 'paragraphs', attrs.paragraphs.slice(index))
										.setNodeAttribute(getPos(), 'focusParagraph', 0)
								);
								return;
							}
						}
					}
				};
			}
			wrapper.append(...paragraphNodes);
			dom.append(wrapper);

			return { dom };
		};
	},
	addKeyboardShortcuts() {
		return {
			Backspace: ({ editor }) => {
				if (!editor.isActive(this.name)) {
					console.log('not active');
					return false;
				}
				console.log('倒退');
				return true;
			}
		};
	}
});

export default BondExtension;
