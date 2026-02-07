<script lang="ts">
	import { onMount } from 'svelte';
	import { mode } from './mode';
	import { browser } from '$app/environment';

	onMount(() => {
		if (!browser) return;
		
		// Initialize mode on mount
		const stored = localStorage.getItem('mode');
		const initial = stored === 'light' || stored === 'dark' 
			? stored 
			: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		
		mode.set(initial);
		document.documentElement.classList.toggle('dark', initial === 'dark');
	});
</script>
