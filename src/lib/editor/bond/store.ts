import { writable } from 'svelte/store';

export const attitudes = ['中立', '反對', '贊同'] as const;
export type Attitude = (typeof attitudes)[number];

export const bondModalIsOpen = writable(false);
export const bondArticleId = writable('');
export const bondAttitude = writable<Attitude>('中立');
export const bondArticleParagraphIdList = writable<string[]>([]);
export const confirmCallback = writable<null | (() => void)>(null);
