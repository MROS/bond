import type { PageServerLoad } from './$types';
import { createContext } from '$lib/trpc/context';
import { rootRouter } from '$lib/trpc/routers';

export const load: PageServerLoad = async (event) => {
	const { params } = event;
	return {
		// TODO(https://github.com/MROS/bond/issues/5)
		article: await rootRouter.article
			.createCaller(await createContext(event))
			.get({ id: parseInt(params.id) })
	};
};
