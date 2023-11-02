import 'iconify-icon';
import { Node, mergeAttributes } from '@tiptap/core';

import type { Bond } from './types';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		bond: {
			setBond: (options: Bond) => ReturnType;
		};
	}
}

function deleteButton(deleteItSelf: () => void): HTMLButtonElement {
	const button = document.createElement('button');
	button.innerHTML = '<iconify-icon icon="mdi:delete"></iconify-icon>';
	button.onmousedown = deleteItSelf;
	return button;
}

function splitButton(split: () => void): HTMLButtonElement {
	const button = document.createElement('button');
	button.innerHTML = '<iconify-icon icon="mdi:arrow-expand-down"></iconify-icon>';
	// 若使用 onclick ，則 paragraphNode 在 onmousedown 就失焦，本按鈕也就已經被隱藏，無法真正被點擊到
	button.onmousedown = (event) => {
		split();
	};
	return button;
}

function paragraphButtonBar(buttons: HTMLButtonElement[]) {
	const bar = document.createElement('div');
	bar.className = 'paragraphButtonBar';

	bar.append(...buttons);

	return bar;
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
			article: {
				default: {
					id: '錯誤：不應出現預設 id',
					title: '錯誤，不應出現預設標題'
				}
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
			setBond: (bond: Bond) => {
				return ({ commands }) => {
					const content = [];
					let head = 0;
					let tail = 0;
					for (let i = 1; i < bond.paragraphs.length; i++) {
						if (bond.paragraphs[i].order == bond.paragraphs[head].order + 1) {
							tail += 1;
						} else {
							content.push({
								type: this.name,
								attrs: {
									...bond,
									paragraphs: bond.paragraphs.slice(head, i)
								}
							});
							head = i;
							tail = i;
						}
					}
					content.push({
						type: this.name,
						attrs: {
							...bond,
							paragraphs: bond.paragraphs.slice(head, tail + 1)
						}
					});
					return commands.insertContent(content);
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

			if (typeof getPos == 'boolean') {
				dom.innerText = '內部錯誤，本節點不存在文件中';
				return dom;
			}

			const wrapper = document.createElement('div');
			wrapper.classList.add('wrapper');

			const attrs = node.attrs as Bond;

			const paragraphNodes: Array<HTMLDivElement> = [];
			for (const [index, paragraph] of attrs.paragraphs.entries()) {
				const paragraphNode = document.createElement('div');
				paragraphNode.classList.add('paragraphNode');
				paragraphNode.tabIndex = 0;
				if (index == attrs.focusParagraph) {
					setTimeout(() => {
						paragraphNode.focus();
						editor.commands.setNodeSelection(getPos());
					}, 0);
				}
				paragraphNode.innerText = paragraph.text;
				const orderNode = document.createElement('span');
				orderNode.classList.add('paragraphOrder');
				orderNode.innerText = `第 ${paragraph.order + 1} 段`;
				paragraphNode.appendChild(orderNode);

				const splitParagraph = () => {
					editor
						.chain()
						.insertContentAt(getPos(), {
							type: this.name,
							attrs: {
								attitude: attrs.attitude,
								paragraphs: attrs.paragraphs.slice(0, index),
								article: attrs.article,
								focusParagraph: undefined
							}
						})
						.setNodeSelection(getPos() + 1)
						.run();
					// 更新本節點，只保留此 index （含）以降的段落
					view.dispatch(
						view.state.tr
							.setNodeAttribute(getPos(), 'paragraphs', attrs.paragraphs.slice(index))
							.setNodeAttribute(getPos(), 'focusParagraph', 0)
					);
				};
				const deleteParagraph = () => {
					// 若僅有一段落，刪除整個鍵結
					// TODO: 研究能否將 view.dispatch 跟 commands.run 放到同一個 transaction
					const commands = editor.chain();
					// 先在 getPos() 插入下半段
					if (index < attrs.paragraphs.length - 1) {
						commands.insertContentAt(getPos(), {
							type: this.name,
							attrs: {
								attitude: attrs.attitude,
								paragraphs: attrs.paragraphs.slice(index + 1),
								article: attrs.article,
								focusParagraph: undefined
							}
						});
					}
					// 再在 getPos() 插入上半段
					if (index > 0) {
						commands.insertContentAt(getPos(), {
							type: this.name,
							attrs: {
								attitude: attrs.attitude,
								paragraphs: attrs.paragraphs.slice(0, index),
								article: attrs.article,
								focusParagraph: undefined
							}
						});
					}
					commands.run();
					view.dispatch(view.state.tr.delete(getPos(), getPos() + 1));
				};

				const buttons = [deleteButton(deleteParagraph)];
				if (index > 0) {
					buttons.push(splitButton(splitParagraph));
				}
				paragraphNode.append(paragraphButtonBar(buttons));
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
							if (index > 0) {
								splitParagraph();
								return;
							}
						}
					}
				};
			}
			const title = document.createElement('div');
			title.classList.add('paragraphTitle');
			title.innerHTML = `——
			<span class="articleName">
				<a href="/article/${attrs.article.id}">
					${attrs.article.title}
				</a>
			</span>
			`;

			// dom.append(title);
			wrapper.append(...paragraphNodes);
			wrapper.append(title);
			dom.append(wrapper);

			return { dom };
		};
	},
	addKeyboardShortcuts() {
		return {
			Backspace: ({ editor }) => {
				if (!editor.isActive(this.name)) {
					return false;
				}
				const currentPosition = editor.state.selection.$anchor;
				const node = currentPosition.nodeAfter;
				const lastNode = currentPosition.nodeBefore;

				if (node == null || lastNode == null) {
					return false;
				}

				const nodeAttrs = node.attrs as Bond;
				const lastNodeAttrs = lastNode.attrs as Bond;

				// 檢查前一個鍵結與當前鍵結是否
				// 1. 引用同一篇文章
				// 2. 前一個鍵結的最後一段緊接當前鍵結的第一段
				// 兩者都符合，那就將兩鍵結合二爲一
				if (
					lastNode.type.name == this.name &&
					lastNodeAttrs.article.id == nodeAttrs.article.id &&
					lastNodeAttrs.paragraphs.slice(-1)[0].order + 1 == nodeAttrs.paragraphs[0].order
				) {
					const { view } = editor;
					view.dispatch(
						view.state.tr
							.setNodeAttribute(currentPosition.pos, 'paragraphs', [
								...lastNodeAttrs.paragraphs,
								...nodeAttrs.paragraphs
							])
							.setNodeAttribute(
								currentPosition.pos,
								'focusParagraph',
								lastNodeAttrs.paragraphs.length
							)
							.delete(currentPosition.pos - lastNode.nodeSize, currentPosition.pos)
					);
					return true;
				}

				// 若無法連接前後鍵結，執行預設行爲
				return false;
			}
		};
	}
});

export default BondExtension;
