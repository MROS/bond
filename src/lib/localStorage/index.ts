import type { Writable } from 'svelte/store';
import { persisted } from 'svelte-persisted-store';

type ArticleMeta = {
	title: string;
	id: string;
	// author: string;
	// createTime: Date;
};

class LocalStorage {
	recentReadArticles: Writable<ArticleMeta[]>;
	constructor() {
		this.recentReadArticles = persisted<ArticleMeta[]>('recent-read-articles', []);
	}
	addRecentReadArticle(newMeta: ArticleMeta) {
		this.recentReadArticles.update((metas) => {
			if (metas.some((meta) => meta.id == newMeta.id)) {
				return metas;
			}
			return [{ id: newMeta.id, title: newMeta.title }, ...metas].slice(0, 10);
		});
	}
}

export const localStorage = new LocalStorage();
