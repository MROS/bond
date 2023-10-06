import db from '$lib/db';
import { z } from 'zod';
import { router, publicProcedure } from '..';

export const commentRouter = router({
	get: publicProcedure.input(z.object({ paragraphId: z.string() })).query(async (opts) => {
		return db.comment.findMany({
			select: { content: true },
			where: { paragraphId: opts.input.paragraphId }
		});
	}),
	create: publicProcedure
		.input(
			z.object({
				paragraphId: z.string(),
				content: z.string()
			})
		)
		.mutation(async (opts) => {
			return db.comment.create({
				data: {
					paragraphId: opts.input.paragraphId,
					content: opts.input.content
				}
			});
		})
});
