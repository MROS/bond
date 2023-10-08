import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	return {
		isVercel: process.env.VERCEL
	};
};
