import { Schema } from '@tiptap/pm/model';

// Tiptap 不讓直接設定 schema ，而是由 extensions 中推導 prosemirror 的 schema
// 本 schema 是在 tiptap Editor 實例化之後從 editor.schame 中取出的
// https://github.com/ueberdosis/tiptap/issues/85

// TODO: 改用 prosemirror 以手動設定 schema ，並嘗試從 schema 中導出 prosemirror
// 產生出的 JSON 的 typescript 類型

// 目前無用途
const SCHEMA = new Schema({
	nodes: {
		text: {},
		doc: { content: 'text*' }
	}
});
