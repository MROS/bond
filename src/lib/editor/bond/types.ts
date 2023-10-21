export const attitudes = ['中立', '反對', '贊同'] as const;
export type Attitude = (typeof attitudes)[number];
export type Paragraph = {
	id: string;
	text: string;
	order: number;
};
export type Bond = {
	paragraphs: Paragraph[];
	attitude: Attitude;

	// 此為編輯狀態中被聚焦的段落，在唯獨狀態不顯示
	focusParagraph: number | undefined;
};
