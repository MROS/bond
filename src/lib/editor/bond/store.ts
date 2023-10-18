import { writable } from 'svelte/store';
import type { BondList } from './types';

type BondModalState = {
	isOpen: boolean;
	setBondList: null | ((bond: BondList) => void);
};

export const bondModalState = writable<BondModalState>({
	isOpen: false,
	setBondList: null
});
