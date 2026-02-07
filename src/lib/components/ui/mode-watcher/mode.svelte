<script lang="ts">
	import { onMount } from 'svelte';
	import { setInitialMode } from './mode';

	onMount(() => {
		setInitialMode();
	});
</script>
