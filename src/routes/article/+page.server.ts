import type { PageServerLoad } from './$types';
import db from '$lib/db';

export const load: PageServerLoad = async () => {
	return {
		articles: await db.article.findMany({ select: { title: true, id: true } })
	};
};
