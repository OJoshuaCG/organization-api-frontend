<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { user, isAdmin } from '$lib/stores/auth';
	import { Building2, Users, Shield, ArrowUpRight } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Dashboard - Organization Manager</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
		<p class="text-muted-foreground mt-1">
			Bienvenido de vuelta, {$user?.full_name || $user?.username}
		</p>
	</div>
	
	<!-- Stats Cards -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		<Card class="card relative overflow-hidden group">
			<div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
			<div class="relative p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-muted-foreground">Organizaciones</p>
						<h3 class="text-2xl font-bold mt-2">--</h3>
					</div>
					<div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
						<Building2 class="h-6 w-6 text-primary" />
					</div>
				</div>
				{#if $isAdmin}
					<Button variant="ghost" class="mt-4 -ml-2 text-primary" href="/admin/organizations">
						Ver todas <ArrowUpRight class="ml-1 h-4 w-4" />
					</Button>
				{/if}
			</div>
		</Card>
		
		<Card class="card relative overflow-hidden group">
			<div class="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
			<div class="relative p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-muted-foreground">Empresas</p>
						<h3 class="text-2xl font-bold mt-2">--</h3>
					</div>
					<div class="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
						<Building2 class="h-6 w-6 text-secondary" />
					</div>
				</div>
				<Button variant="ghost" class="mt-4 -ml-2 text-secondary" href={$isAdmin ? '/admin/companies' : '/tenant/companies'}>
					Ver todas <ArrowUpRight class="ml-1 h-4 w-4" />
				</Button>
			</div>
		</Card>
		
		<Card class="card relative overflow-hidden group">
			<div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
			<div class="relative p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-muted-foreground">Usuarios</p>
						<h3 class="text-2xl font-bold mt-2">--</h3>
					</div>
					<div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
						<Users class="h-6 w-6 text-primary" />
					</div>
				</div>
				<Button variant="ghost" class="mt-4 -ml-2 text-primary" href={$isAdmin ? '/admin/users' : '/tenant/users'}>
					Ver todos <ArrowUpRight class="ml-1 h-4 w-4" />
				</Button>
			</div>
		</Card>
	</div>
	
	<!-- Quick Actions -->
	<div class="grid gap-4 lg:grid-cols-2">
		<Card class="card">
			<div class="p-6">
				<h3 class="text-lg font-semibold mb-4">Acciones Rápidas</h3>
				<div class="flex flex-wrap gap-3">
					{#if $isAdmin}
						<Button href="/admin/organizations/new" class="btn-primary">
							<Building2 class="mr-2 h-4 w-4" />
							Nueva Organización
						</Button>
						<Button href="/admin/companies/new" class="btn-secondary">
							<Building2 class="mr-2 h-4 w-4" />
							Nueva Empresa
						</Button>
					{/if}
					<Button href={$isAdmin ? '/admin/users/new' : '/tenant/users/new'} class="btn-secondary">
						<Users class="mr-2 h-4 w-4" />
						Nuevo Usuario
					</Button>
				</div>
			</div>
		</Card>
		
		<Card class="card">
			<div class="p-6">
				<h3 class="text-lg font-semibold mb-4">Información del Sistema</h3>
				<div class="space-y-3 text-sm">
					<div class="flex justify-between">
						<span class="text-muted-foreground">Rol:</span>
						<span class="font-medium">{$user?.role?.name || 'Usuario'}</span>
					</div>
					{#if $user?.organization}
						<div class="flex justify-between">
							<span class="text-muted-foreground">Organización:</span>
							<span class="font-medium">{$user.organization.name}</span>
						</div>
					{/if}
					{#if $user?.company}
						<div class="flex justify-between">
							<span class="text-muted-foreground">Empresa:</span>
							<span class="font-medium">{$user.company.name}</span>
						</div>
					{/if}
					<div class="flex justify-between">
						<span class="text-muted-foreground">Versión:</span>
						<span class="font-medium">v1.0.0</span>
					</div>
				</div>
			</div>
		</Card>
	</div>
</div>
