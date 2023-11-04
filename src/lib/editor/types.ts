import { z } from 'zod';
import { zodBondAttribute } from './extensions/bond/types';

const zodText = z.object({
	type: z.literal('text'),
	text: z.string()
});

const zodHeading = z.object({
	type: z.literal('heading'),
	attrs: z.object({
		level: z.union([z.literal(1), z.literal(2), z.literal(3)])
	}),
	content: z.array(zodText).optional()
});

type Heading = z.infer<typeof zodHeading>;

const zodParagraph = z.object({
	type: z.literal('paragraph'),
	content: z.array(zodText).optional()
});

type Paragraph = z.infer<typeof zodParagraph>;

const zodBond = z.object({
	type: z.literal('Bond'),
	attrs: zodBondAttribute
});

type Bond = z.infer<typeof zodBond>;

const zodNode = z.discriminatedUnion('type', [zodHeading, zodParagraph, zodBond]);
type Node = z.infer<typeof zodNode>;

export const zodDoc = z.object({
	type: z.literal('doc'),
	content: z.array(zodNode)
});

export type Doc = z.infer<typeof zodDoc>;
