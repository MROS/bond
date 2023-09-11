import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import db from '$lib/db';

export const load: PageServerLoad = async ({ params }) => {
	return {
		article: await db.article.findFirst({
			where: { id: parseInt(params.id) },
			include: { paragraphs: {orderBy: {order: 'asc'}} }
		})
	};
};

export const actions = {
	comment: async ({request}) => {
		const data = await request.formData();
		const content = data.get('content') as string;
		const id = data.get('paragraph_id') as string;
		if (!content) {
			return fail(400, {content, missing: true});
		}
		return db.comment.create({data: {paragraphId: id, content }})
	}
};
