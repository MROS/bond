<header class="header">
	<a href="/">匯流處</a>
</header>
<main class="main">
	<slot />
</main>

<link href="https://unpkg.com/sanitize.css" rel="stylesheet" />

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
	}
	.main {
		display: flex;
		justify-content: center;
	}
</style>
