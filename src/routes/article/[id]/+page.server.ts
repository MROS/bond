import type { PageServerLoad } from './$types';
import db from '$lib/db';

export const load: PageServerLoad = async ({ params }) => {
	return {
		article: await db.article.findFirst({
			where: { id: parseInt(params.id) },
			include: { paragraphs: { orderBy: { order: 'asc' } } }
		})
	};
};
