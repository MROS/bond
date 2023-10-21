import { writable } from 'svelte/store';
import type { Bond } from './types';

type BondModalState = {
	isOpen: boolean;
	setBond: null | ((bond: Bond) => void);
};

export const bondModalState = writable<BondModalState>({
	isOpen: false,
	setBond: null
});
