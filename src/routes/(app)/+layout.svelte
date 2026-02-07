<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, isLoading } from '$lib/stores/auth';
	import { browser } from '$app/environment';
	
	let { children } = $props();
	
	// Protect route - redirect to login if not authenticated
	$effect(() => {
		if (browser && !$isLoading && !$auth.isAuthenticated) {
			goto('/login');
		}
	});
</script>

{#if $isLoading}
	<div class="flex h-screen items-center justify-center bg-background">
		<div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
	</div>
{:else if $auth.isAuthenticated}
	{@render children()}
{/if}
