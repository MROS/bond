import { z } from 'zod';

export const attitudes = ['中立', '反對', '贊同'] as const;
export const zodAttitude = z.enum(attitudes);
export type Attitude = z.infer<typeof zodAttitude>;

export type NodeWithMeta = {
	id: string;
	value: Node;
	order: number;
};

const zodNodeWithMeta: z.ZodType<NodeWithMeta> = z.lazy(() =>
	z.object({
		id: z.string(),
		value: zodNode,
		order: z.number()
	})
);

const zodArticle = z.object({
	id: z.string(),
	title: z.string()
});

export const zodBondAttribute = z.object({
	article: zodArticle,
	quotedNodes: z.array(zodNodeWithMeta),
	attitude: zodAttitude,

	// 此為編輯狀態中被聚焦的段落，在唯獨狀態無任何作用
	focusQuotedNode: z.number().optional()
});

export type BondAttribute = z.infer<typeof zodBondAttribute>;

const zodText = z.object({
	type: z.literal('text'),
	text: z.string()
});

const zodHeading = z.object({
	type: z.literal('heading'),
	attrs: z.object({
		level: z.union([z.literal(2), z.literal(3), z.literal(4)])
	}),
	content: z.array(zodText).optional()
});

export type Heading = z.infer<typeof zodHeading>;

const zodParagraph = z.object({
	type: z.literal('paragraph'),
	content: z.array(zodText).optional()
});

export type Paragraph = z.infer<typeof zodParagraph>;

const zodBond = z.object({
	type: z.literal('Bond'),
	attrs: zodBondAttribute
});

export type Bond = z.infer<typeof zodBond>;

export const zodNode = z.discriminatedUnion('type', [zodHeading, zodParagraph, zodBond]);
export type Node = z.infer<typeof zodNode>;

export const zodDoc = z.object({
	type: z.literal('doc'),
	content: z.array(zodNode)
});

export type Doc = z.infer<typeof zodDoc>;
