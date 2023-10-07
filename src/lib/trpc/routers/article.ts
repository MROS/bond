import db from '$lib/db';
import { z } from 'zod';
import { router, publicProcedure } from '..';

export const articleRouter = router({
	get: publicProcedure.input(z.object({ id: z.string() })).query(async (opts) => {
		return db.article.findFirst({
			where: { id: opts.input.id },
			include: { paragraphs: { orderBy: { order: 'asc' } } }
		});
	})
});
