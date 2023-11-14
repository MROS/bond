import 'iconify-icon';
import { Node, mergeAttributes } from '@tiptap/core';

import type { BondAttribute } from './types';
import { Platform, getPlatform } from '$lib/utils/platform';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		bond: {
			setBond: (options: BondAttribute) => ReturnType;
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
	// 若使用 onclick ，則 quotedNodeDiv 在 onmousedown 就失焦，本按鈕也就已經被隱藏，無法真正被點擊到
	button.onmousedown = split;
	return button;
}

function quotedNodeButtonBar(buttons: HTMLButtonElement[]) {
	const bar = document.createElement('div');
	bar.className = 'quotedNodeButtonBar';

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
			quotedNodes: {
				default: []
			},
			focusQuotedNode: {
				default: undefined
			}
		};
	},
	parseHTML() {
		return [
			{
				tag: 'bond'
			}
		];
	},
	renderHTML({ HTMLAttributes }) {
		return ['bond', mergeAttributes(HTMLAttributes)];
	},
	addCommands() {
		return {
			setBond: (bond: BondAttribute) => {
				return ({ commands }) => {
					// 拆解不連續的段落
					const content = [];
					let head = 0;
					let tail = 0;
					for (let i = 1; i < bond.quotedNodes.length; i++) {
						if (bond.quotedNodes[i].order == bond.quotedNodes[tail].order + 1) {
							tail = i;
						} else {
							content.push({
								type: this.name,
								attrs: {
									...bond,
									quotedNodes: bond.quotedNodes.slice(head, i)
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
							quotedNodes: bond.quotedNodes.slice(head, tail + 1)
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
			dom.classList.add('bond');

			if (typeof getPos == 'boolean') {
				dom.innerText = '內部錯誤，本節點不存在文件中';
				return dom;
			}

			const wrapper = document.createElement('div');
			wrapper.classList.add('wrapper');

			const deleteBond = document.createElement('div');
			deleteBond.classList.add('deleteButton');
			deleteBond.innerHTML = '<iconify-icon icon="mdi:close-circle"></iconify-icon>';
			deleteBond.onclick = () => {
				view.dispatch(view.state.tr.delete(getPos(), getPos() + 1));
			};
			wrapper.append(deleteBond);

			const attrs = node.attrs as BondAttribute;

			const quotedNodeDivs: Array<HTMLDivElement> = [];
			for (const [index, quotedNode] of attrs.quotedNodes.entries()) {
				const quotedNodeDiv = document.createElement('div');
				quotedNodeDiv.classList.add('quotedNodeDiv');
				quotedNodeDiv.tabIndex = 0;
				if (index == attrs.focusQuotedNode) {
					setTimeout(() => {
						quotedNodeDiv.focus();
						editor.commands.setNodeSelection(getPos());
					}, 0);
				}
				quotedNodeDiv.innerText = quotedNode.text;
				const quotedNodeOrder = document.createElement('span');
				quotedNodeOrder.classList.add('quotedNodeOrder');
				// TODO: 加入超鏈接，點擊後可以直接跳躍到原文段落
				quotedNodeOrder.innerText = `第 ${quotedNode.order + 1} 段`;
				quotedNodeDiv.appendChild(quotedNodeOrder);

				const splitQuotedNode = () => {
					editor
						.chain()
						.insertContentAt(getPos(), {
							type: this.name,
							attrs: {
								attitude: attrs.attitude,
								quotedNodes: attrs.quotedNodes.slice(0, index),
								article: attrs.article,
								focusQuotedNode: undefined
							}
						})
						.setNodeSelection(getPos() + 1)
						.run();
					// 更新本節點，只保留此 index （含）以降的段落
					view.dispatch(
						view.state.tr
							.setNodeAttribute(getPos(), 'quotedNodes', attrs.quotedNodes.slice(index))
							.setNodeAttribute(getPos(), 'focusQuotedNode', 0)
					);
				};
				const deleteQuotedNode = () => {
					// 若僅有一段落，刪除整個鍵結
					// TODO: 研究能否將 view.dispatch 跟 commands.run 放到同一個 transaction
					const commands = editor.chain();
					// 先在 getPos() 插入下半段
					if (index < attrs.quotedNodes.length - 1) {
						commands.insertContentAt(getPos(), {
							type: this.name,
							attrs: {
								attitude: attrs.attitude,
								quotedNodes: attrs.quotedNodes.slice(index + 1),
								article: attrs.article,
								focusQuotedNode: undefined
							}
						});
					}
					// 再在 getPos() 插入上半段
					if (index > 0) {
						commands.insertContentAt(getPos(), {
							type: this.name,
							attrs: {
								attitude: attrs.attitude,
								quotedNodes: attrs.quotedNodes.slice(0, index),
								article: attrs.article,
								focusQuotedNode: undefined
							}
						});
					}
					commands.run();
					view.dispatch(view.state.tr.delete(getPos(), getPos() + 1));
				};

				const buttons = [deleteButton(deleteQuotedNode)];
				if (index > 0) {
					buttons.push(splitButton(splitQuotedNode));
				}
				quotedNodeDiv.append(quotedNodeButtonBar(buttons));
				quotedNodeDivs.push(quotedNodeDiv);

				// 在滑鼠按下去的瞬間就讓編輯器的選取當前節點
				// 若不在 mousedown 事件就修正當前節點（名為 A）位置
				// 且上一個選取節點是另一個 BondNode 中的 quotedNodeDiv (名為 B) 時
				// 以下兩事件存在時間差：
				// 1. mousedown 事件，導致 B 失焦，A 聚焦，B 所在的 bondNode 因 CSS
				//    .ProseMirror-selectednode:not(:has(div:focus))) 作用而變色
				// 2. click 事件，將 NodeSelection 設為當前 BondNode
				//    .ProseMirror-selectednode 調整到 A 所在 BondNode ，B 所在 BondNode 褪色
				// 該時間差導致前一個選取到的 BondNode 閃動
				quotedNodeDiv.onmousedown = () => {
					editor.commands.setNodeSelection(getPos());
				};
				quotedNodeDiv.onclick = (event) => {
					// 阻止滑鼠點擊事件傳播到整個 Bond 節點
					// 若不阻擋傳播，prosemirror 將會聚焦到整個 Bond 節點，而非我們期望的 quotedNodeDiv
					event.stopPropagation();
				};
				quotedNodeDiv.onmouseup = (event) => {
					// 阻止滑鼠點擊事件傳播到整個 Bond 節點
					// 若不阻擋傳播，prosemirror 將會聚焦到整個 Bond 節點，而非我們期望的 quotedNodeDiv
					event.stopPropagation();
				};
				quotedNodeDiv.onkeydown = (event) => {
					event.stopPropagation();
					event.preventDefault();
					switch (event.key) {
						case 'Enter': {
							if (index > 0) {
								splitQuotedNode();
								return;
							}
						}
					}
				};
			}
			wrapper.append(...quotedNodeDivs);

			const title = document.createElement('div');
			title.classList.add('articleMeta');
			title.innerHTML = `——
			<span class="articleName">
				<a href="/article/${attrs.article.id}">
					${attrs.article.title}
				</a>
			</span>
			`;

			// 當點擊 Android 虛擬鍵盤上 Enter 時， Chrome 的 event.key 並不會直接返回
			//  'Entern' ，而是一個 unidentified 碼然後纔是 'Enter' ，這可能是 Tiptap
			// 無法在 addKeyboardShortcuts 正確捕捉到 'Enter' 的原因。
			// https://stackoverflow.com/questions/36753548/keycode-on-android-is-always-229
			// 需要一個醜陋的暫時解法
			if (getPlatform() == Platform.Android) {
				const hiddenInput = document.createElement('textarea');
				hiddenInput.style.width = '0';
				hiddenInput.style.height = '0';
				hiddenInput.style.opacity = '0';
				hiddenInput.onkeydown = (event) => {
					if (event.key == 'Enter') {
						editor.chain().createParagraphNear().focus().run();
					}
				};
				setTimeout(() => {
					hiddenInput.focus();
				}, 0);
				wrapper.append(hiddenInput);

				wrapper.onmousedown = () => {
					editor.commands.setNodeSelection(getPos());
				};
				wrapper.onclick = (event) => {
					event.stopPropagation();
					hiddenInput.focus();
				};
				wrapper.onmouseup = (event) => {
					event.stopPropagation();
					hiddenInput.focus();
				};
			}
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

				const nodeAttrs = node.attrs as BondAttribute;
				const lastNodeAttrs = lastNode.attrs as BondAttribute;

				// 檢查前一個鍵結與當前鍵結是否
				// 1. 引用同一篇文章
				// 2. 前一個鍵結的最後一段緊接當前鍵結的第一段
				// 兩者都符合，那就將兩鍵結合二爲一
				if (
					lastNode.type.name == this.name &&
					lastNodeAttrs.article.id == nodeAttrs.article.id &&
					lastNodeAttrs.quotedNodes.slice(-1)[0].order + 1 == nodeAttrs.quotedNodes[0].order
				) {
					const { view } = editor;
					view.dispatch(
						view.state.tr
							.setNodeAttribute(currentPosition.pos, 'quotedNodes', [
								...lastNodeAttrs.quotedNodes,
								...nodeAttrs.quotedNodes
							])
							.setNodeAttribute(
								currentPosition.pos,
								'focusQuotedNodes',
								lastNodeAttrs.quotedNodes.length
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
