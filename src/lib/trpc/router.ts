import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import db from '$lib/db';
import { z } from 'zod';

export const t = initTRPC.context<Context>().create();

// TODO: 加入 logger
export const router = t.router({
	getComment: t.procedure.input(z.object({ paragraphId: z.string() })).query(async (opts) => {
		return db.comment.findMany({
			select: { content: true },
			where: { paragraphId: opts.input.paragraphId }
		});
	}),
	createComment: t.procedure
		.input(
			z.object({
				paragraphId: z.string(),
				content: z.string()
			})
		)
		.mutation(async (opts) => {
			console.log('create comment');
			return db.comment.create({
				data: {
					paragraphId: opts.input.paragraphId,
					content: opts.input.content
				}
			});
		})
});

export type Router = typeof router;
