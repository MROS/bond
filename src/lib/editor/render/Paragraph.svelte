<script lang="ts">
	import type { Paragraph } from '../types';
	export let paragraph: Paragraph;
	const text = paragraph.content?.map((text) => text.text) ?? '';
</script>

<!-- paragraph.content 可能爲空 -->
<p>{text}</p>
