import { z } from 'zod';

export const attitudes = ['中立', '反對', '贊同'] as const;

const zodAttitude = z.enum(attitudes);
export type Attitude = z.infer<typeof zodAttitude>;

const zodQuotedNode = z.object({
	id: z.string(),
	text: z.string(),
	order: z.number()
});

export type QuotedNode = z.infer<typeof zodQuotedNode>;

const zodArticle = z.object({
	id: z.string(),
	title: z.string()
});

export const zodBondAttribute = z.object({
	article: zodArticle,
	quotedNodes: z.array(zodQuotedNode),
	attitude: zodAttitude,

	// 此為編輯狀態中被聚焦的段落，在唯獨狀態無任何作用
	focusQuotedNode: z.number().optional()
});

export type BondAttribute = z.infer<typeof zodBondAttribute>;
