import { writable } from 'svelte/store';

export const attitudes = ['中立', '反對', '贊同'] as const;
export type Attitude = (typeof attitudes)[number];

type BondModalState = {
	isOpen: boolean;
	articleId: null | string;
	attitude: Attitude;
	paragraphIdList: string[];
	confirmCallback: null | (() => void);
};

export const bondModalState = writable<BondModalState>({
	isOpen: false,
	articleId: null,
	attitude: '中立',
	paragraphIdList: [],
	confirmCallback: null
});
