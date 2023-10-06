import { commentRouter } from './comment';
import { router } from '..';
import { articleRouter } from './article';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
export const rootRouter = router({
	comment: commentRouter,
	article: articleRouter
});

export type RootRouter = typeof rootRouter;
export type RouterInput = inferRouterInputs<RootRouter>;
export type RouterOutput = inferRouterOutputs<RootRouter>;
