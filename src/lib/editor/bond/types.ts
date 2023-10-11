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
};
