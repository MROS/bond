import { writable } from 'svelte/store';
import type { BondAttribute } from './types';

type BondModalState = {
	isOpen: boolean;
	setBond: null | ((bond: BondAttribute) => void);
};

export const bondModalState = writable<BondModalState>({
	isOpen: false,
	setBond: null
});
