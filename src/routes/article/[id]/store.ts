import { writable } from 'svelte/store';
export const replyingParagraphId = writable<string | undefined>(undefined);
