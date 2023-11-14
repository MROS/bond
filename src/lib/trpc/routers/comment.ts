import db from '$lib/db';
import { z } from 'zod';
import { router, publicProcedure } from '..';

export const commentRouter = router({
	get: publicProcedure.input(z.object({ nodeId: z.string() })).query(async (opts) => {
		return db.comment.findMany({
			select: { content: true },
			where: { nodeId: opts.input.nodeId }
		});
	}),
	create: publicProcedure
		.input(
			z.object({
				nodeId: z.string(),
				content: z.string()
			})
		)
		.mutation(async (opts) => {
			return db.comment.create({
				data: {
					nodeId: opts.input.nodeId,
					content: opts.input.content
				}
			});
		})
});
