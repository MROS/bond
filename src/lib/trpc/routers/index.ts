import { commentRouter } from './comment';
import { router } from '..';
export const rootRouter = router({
	comment: commentRouter
});

export type RootRouter = typeof rootRouter;
