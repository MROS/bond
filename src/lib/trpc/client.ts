import type { RootRouter } from './routers';
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit';

let browserClient: ReturnType<typeof createTRPCClient<RootRouter>>;

export function trpc(init?: TRPCClientInit) {
	const isBrowser = typeof window !== 'undefined';
	if (isBrowser && browserClient) return browserClient;
	const client = createTRPCClient<RootRouter>({ init });
	if (isBrowser) browserClient = client;
	return client;
}
