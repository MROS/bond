import { writable } from 'svelte/store';

type LoginModalState = {
	isOpen: boolean;
};

export const loginModalState = writable<LoginModalState>({ isOpen: false });
