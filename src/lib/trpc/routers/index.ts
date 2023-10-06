import { commentRouter } from './comment';
import { router } from '..';
import { articleRouter } from './article';
export const rootRouter = router({
	comment: commentRouter,
	article: articleRouter
});

export type RootRouter = typeof rootRouter;
