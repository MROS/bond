import db from '$lib/db';
import { z } from 'zod';
import { router, publicProcedure } from '..';
import { zodDoc, zodNode } from '$lib/editor/types';

export const articleRouter = router({
	get: publicProcedure.input(z.object({ id: z.string() })).query(async (opts) => {
		return db.article
			.findFirst({
				where: { id: opts.input.id },
				include: { nodes: { orderBy: { order: 'asc' } } }
			})
			.then((article) => {
				if (article == null) {
					return article;
				}
				return {
					...article,
					nodes: article.nodes.map((node) => {
						return {
							...node,
							value: zodNode.parse(JSON.parse(node.value))
						};
					})
				};
			});
	}),
	create: publicProcedure
		.input(
			z.object({
				doc: zodDoc,
				title: z.string()
			})
		)
		.mutation(async (opts) => {
			const { doc, title } = opts.input;
			const nodes = doc.content.map((node, index) => {
				return {
					value: JSON.stringify(node),
					order: index
				};
			});
			return db.article.create({
				data: {
					// TODO: 資料庫更名 doc
					content: JSON.stringify(doc),
					title,
					nodes: {
						create: nodes
					}
				}
			});
		})
});
