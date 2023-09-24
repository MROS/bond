<header class="header">
	<a href="/">匯流處</a>
</header>
<main class="main">
	<slot />
</main>

<link href="https://unpkg.com/sanitize.css" rel="stylesheet" />
<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/purecss@3.0.0/build/pure-min.css"
	integrity="sha384-X38yfunGUhNzHpBaEBsWLO+A0HDYOQi8ufWDkZ0k9e0eXz/tH3II7uKZ9msv++Ls"
	crossorigin="anonymous"
/>

<style>
	.header {
		position: sticky;
		top: 0px;
		display: flex;
		align-items: center;
		height: 40px;
		font-size: 20px;
		background-color: white;
		padding-left: 30px;
		border-bottom: 1px solid gainsboro;
		z-index: 100;
	}
	.main {
		display: flex;
		justify-content: center;
	}
</style>
