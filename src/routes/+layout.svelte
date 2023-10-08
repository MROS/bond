<script lang="ts">
	import LoginModal from '$lib/components/login/index.svelte';
	import { loginModalState } from '$lib/components/login/store';
	import { inject } from '@vercel/analytics';
	if (import.meta.env.VERCEL) {
		console.log('vercel web analytic inject');
		inject();
	}
</script>

<header class="header">
	<div class="left">
		<a href="/">無限城3.0</a>
	</div>
	<div class="right">
		<button
			class="pure-button pure-button-active"
			on:click={() => {
				$loginModalState.isOpen = true;
			}}>登入</button
		>
	</div>
</header>
<LoginModal />
<main class="main">
	<slot />
</main>

<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/purecss@3.0.0/build/pure-min.css"
	integrity="sha384-X38yfunGUhNzHpBaEBsWLO+A0HDYOQi8ufWDkZ0k9e0eXz/tH3II7uKZ9msv++Ls"
	crossorigin="anonymous"
/>

<style>
	@import 'sanitize.css';
	@import './variable.css';
	.header {
		position: sticky;
		top: 0px;
		height: var(--header-height);
		font-size: 20px;

		padding: 0px 30px;

		background-color: white;
		border-bottom: 1px solid gainsboro;
		z-index: 100;

		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		& button {
			padding: 0.25em 0.7em;
		}
		@media (min-width: 600px) {
			& button {
				padding: 0.3em 0.8em;
			}
		}
	}
	.main {
		display: flex;
		justify-content: center;
	}
</style>
