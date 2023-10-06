import { writable } from 'svelte/store';

export const imageModalIsOpen = writable(false);
export const imageUrl = writable('');
export const confirmCallback = writable<null | (() => void)>(null);
