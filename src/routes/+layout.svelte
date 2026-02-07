<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from '$lib/components/ui/mode-watcher';
	import { Toaster } from 'svelte-sonner';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { queryClient } from '$lib/api/hooks/queryClient';
	import { auth } from '$lib/stores/auth';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	
	let { children } = $props();
	
	onMount(() => {
		if (browser) {
			auth.init();
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<ModeWatcher />
	<Toaster 
		position="top-right"
		richColors
		closeButton
		duration={4000}
	/>
	<div class="relative min-h-screen bg-background text-foreground antialiased">
		{@render children()}
	</div>
</QueryClientProvider>
