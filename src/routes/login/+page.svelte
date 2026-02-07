<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { Shield, Lock, User } from 'lucide-svelte';
	import { browser } from '$app/environment';

	let username = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let error = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isLoading = true;
		error = '';

		const result = await auth.login({ username, password });

		if (result?.success) {
			goto('/dashboard');
		} else {
			error = result?.error || 'Error al iniciar sesión';
		}

		isLoading = false;
	}

	// Redirect if already authenticated
	$effect(() => {
		if (browser && $auth.isAuthenticated) {
			goto('/dashboard');
		}
	});
</script>

<svelte:head>
	<title>Login - Organization Manager</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-background px-4">
	<div class="w-full max-w-md space-y-8">
		<!-- Logo and Title -->
		<div class="text-center">
			<div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary shadow-glow">
				<Shield class="h-8 w-8 text-white" />
			</div>
			<h1 class="text-3xl font-bold tracking-tight">
				<span class="text-gradient">Organization</span> Manager
			</h1>
			<p class="mt-2 text-muted-foreground">
				Inicia sesión para continuar
			</p>
		</div>

		<!-- Login Form -->
		<Card class="card">
			<form onsubmit={handleSubmit} class="space-y-6">
				{#if error}
					<div class="rounded-md bg-error/10 px-4 py-3 text-sm text-error">
						{error}
					</div>
				{/if}

				<div class="space-y-2">
					<Label for="username" class="flex items-center gap-2">
						<User class="h-4 w-4 text-muted-foreground" />
						Usuario
					</Label>
					<Input
						id="username"
						type="text"
						placeholder="superadmin"
						bind:value={username}
						required
						class="input"
					/>
				</div>

				<div class="space-y-2">
					<Label for="password" class="flex items-center gap-2">
						<Lock class="h-4 w-4 text-muted-foreground" />
						Contraseña
					</Label>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						bind:value={password}
						required
						class="input"
					/>
				</div>

				<Button
					type="submit"
					class="btn-primary w-full"
					disabled={isLoading}
				>
					{#if isLoading}
						<div class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
						Iniciando sesión...
					{:else}
						Iniciar Sesión
					{/if}
				</Button>
			</form>
		</Card>

		<!-- Demo credentials -->
		<div class="text-center text-sm text-muted-foreground">
			<p>Demo: <span class="font-mono text-primary">superadmin</span> / <span class="font-mono text-primary">SuperAdmin123!</span></p>
		</div>
	</div>
</div>
