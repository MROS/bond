import { persisted } from 'svelte-persisted-store';

type ArticleMeta = {
	title: string;
	id: string;
	// author: string;
	// createTime: Date;
};

export const recentReadArticles = persisted<ArticleMeta[]>('recent-read-articles', []);
