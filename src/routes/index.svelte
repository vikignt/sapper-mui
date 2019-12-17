<div class="warning">
	<p>
		<em>WARNING</em>
	</p>
	<p>This is a demo of work in progress...</p>
</div>

<section>
	{@html introduction}
	{@html quickStart}
	{@html byExample}
</section>

<script>
	import introduction from './home/introduction.md';
	import quickStart from './home/quick-start.md';
	import byExample from './home/by-example.md';
</script>

<style>
	section :global(p),
	section :global(li) {
		font-family: var(--code-font-family);
		font-size: 14px;
		letter-spacing: 0.01em;
		line-height: 1.5em;
	}
	section :global(pre) {
		background: #212121;
		color: #fff;
		border-radius: 4px;
		padding: 1rem;
		overflow-x: auto;
	}
	section :global(:not(pre) code),
	section :global(:not(pre) code) {
		font-size: 14px;
		color: var(--accent);
	}
	.warning {
		background: var(--bg-panel);
		border-left: 4px solid #fdd835;
		margin-bottom: 34px;
		padding: 8px;
		font-size: 14px;
	}
</style>
