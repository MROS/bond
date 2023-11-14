import { writable } from 'svelte/store';
export const replyingNodeId = writable<string | undefined>(undefined);
