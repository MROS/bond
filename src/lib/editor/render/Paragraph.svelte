<script lang="ts">
	import type { Paragraph } from '../types';
	export let paragraph: Paragraph;
</script>

<p>{paragraph.content?.map((text) => text.text)}</p>
