<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card } from '$lib/components/ui/card';
	import { useUser, useUpdateUser } from '$lib/api/hooks/users';
	import { useOrganizations } from '$lib/api/hooks/organizations';
	import { useCompanies } from '$lib/api/hooks/companies';
	import { Users, ArrowLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { formatDate, ROLE_LABELS } from '$lib/utils';
	import { z } from 'zod';
	
	const id = parseInt($page.params.id);
	const user = useUser(id);
	const organizations = useOrganizations({ per_page: 100 });
	
	const schema = z.object({
		username: z.string().min(3, 'Mínimo 3 caracteres').max(50, 'Máximo 50 caracteres'),
		email: z.string().email('Email inválido').optional().or(z.literal('')),
		first_name: z.string().max(60).optional(),
		last_name: z.string().max(60).optional(),
		user_role_id: z.number().min(1, 'El rol es requerido'),
		organization_id: z.number().optional(),
		company_id: z.number().optional(),
		is_active: z.boolean()
	});
	
	let username = $state('');
	let email = $state('');
	let first_name = $state('');
	let last_name = $state('');
	let user_role_id = $state('');
	let organization_id = $state('');
	let company_id = $state('');
	let is_active = $state(true);
	let errors: Record<string, string> = $state({});
	
	const companies = useCompanies({ 
		organization_id: organization_id ? parseInt(organization_id) : undefined,
		per_page: 100 
	});
	
	const updateMutation = useUpdateUser();
	
	// Initialize form when data loads
	$effect(() => {
		if ($user.data) {
			username = $user.data.username;
			email = $user.data.email || '';
			first_name = $user.data.first_name || '';
			last_name = $user.data.last_name || '';
			user_role_id = String($user.data.user_role_id);
			organization_id = $user.data.organization_id ? String($user.data.organization_id) : '';
			company_id = $user.data.company_id ? String($user.data.company_id) : '';
			is_active = $user.data.is_active;
		}
	});
	
	function validate() {
		try {
			schema.parse({
				username,
				email,
				first_name,
				last_name,
				user_role_id: parseInt(user_role_id),
				organization_id: organization_id ? parseInt(organization_id) : undefined,
				company_id: company_id ? parseInt(company_id) : undefined,
				is_active
			});
			errors = {};
			return true;
		} catch (e) {
			if (e instanceof z.ZodError) {
				errors = e.errors.reduce((acc, err) => {
					acc[err.path[0]] = err.message;
					return acc;
				}, {} as Record<string, string>);
			}
			return false;
		}
	}
	
	async function handleSubmit(e: Event) {
		e.preventDefault();
		
		if (!validate()) return;
		
		const data: any = {
			username,
			email: email || undefined,
			first_name: first_name || undefined,
			last_name: last_name || undefined,
			user_role_id: parseInt(user_role_id),
			organization_id: organization_id ? parseInt(organization_id) : undefined,
			company_id: company_id ? parseInt(company_id) : undefined,
			is_active
		};
		
		$updateMutation.mutate({ id, data }, {
			onSuccess: () => {
				goto('/admin/users');
			}
		});
	}
	
	const availableRoles = [
		{ id: 1, label: ROLE_LABELS[1] },
		{ id: 2, label: ROLE_LABELS[2] },
		{ id: 3, label: ROLE_LABELS[3] },
		{ id: 4, label: ROLE_LABELS[4] },
		{ id: 5, label: ROLE_LABELS[5] }
	];
</script>

<svelte:head>
	<title>Editar Usuario - Organization Manager</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<Button variant="ghost" size="icon" href="/admin/users">
			<ArrowLeft class="h-5 w-5" />
		</Button>
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Editar Usuario</h1>
			<p class="text-muted-foreground mt-1">
				Modifica los datos del usuario
			</p>
		</div>
	</div>
	
	{#if $user.isLoading}
		<div class="flex h-64 items-center justify-center">
			<div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
		</div>
	{:else if $user.isError}
		<div class="flex h-64 flex-col items-center justify-center text-center">
			<p class="text-error mb-4">Error al cargar el usuario</p>
			<Button onclick={() => $user.refetch()}>Reintentar</Button>
		</div>
	{:else}
		<div class="grid gap-6 lg:grid-cols-3">
			<!-- Form -->
			<div class="lg:col-span-2">
				<Card class="card">
					<form onsubmit={handleSubmit} class="p-6 space-y-6">
						<div class="flex items-center gap-4 mb-6">
							<div class="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
								<Users class="h-8 w-8 text-white" />
							</div>
							<div>
								<h2 class="text-lg font-semibold">Información del Usuario</h2>
								<p class="text-sm text-muted-foreground">
									Actualiza los datos del usuario
								</p>
							</div>
						</div>
						
						<div class="space-y-4">
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div class="space-y-2">
									<Label for="username">Usuario</Label>
									<Input
										id="username"
										bind:value={username}
										class={errors.username ? 'border-error' : ''}
									/>
									{#if errors.username}
										<p class="text-sm text-error">{errors.username}</p>
									{/if}
								</div>
								
								<div class="space-y-2">
									<Label for="email">Email</Label>
									<Input
										id="email"
										type="email"
										bind:value={email}
										class={errors.email ? 'border-error' : ''}
									/>
								</div>
							</div>
							
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div class="space-y-2">
									<Label for="first_name">Nombre</Label>
									<Input id="first_name" bind:value={first_name} />
								</div>
								
								<div class="space-y-2">
									<Label for="last_name">Apellido</Label>
									<Input id="last_name" bind:value={last_name} />
								</div>
							</div>
							
							<div class="space-y-2">
								<Label for="user_role_id">Rol</Label>
								<select
									id="user_role_id"
									bind:value={user_role_id}
									class="input"
								>
									{#each availableRoles as role}
										<option value={role.id}>{role.label}</option>
									{/each}
								</select>
							</div>
							
							<div class="space-y-2">
								<Label for="organization_id">Organización</Label>
								<select
									id="organization_id"
									bind:value={organization_id}
									class="input"
									onchange={() => company_id = ''}
								>
									<option value="">Sin organización</option>
									{#if $organizations.data?.data}
										{#each $organizations.data.data as org}
											<option value={org.id}>{org.name}</option>
										{/each}
									{/if}
								</select>
							</div>
							
							{#if organization_id}
								<div class="space-y-2">
									<Label for="company_id">Empresa</Label>
									<select
										id="company_id"
										bind:value={company_id}
										class="input"
									>
										<option value="">Sin empresa</option>
										{#if $companies.data?.data}
											{#each $companies.data.data as company}
												<option value={company.id}>{company.name}</option>
											{/each}
										{/if}
									</select>
								</div>
							{/if}
							
							<div class="flex items-center gap-2">
								<input
									type="checkbox"
									id="is_active"
									bind:checked={is_active}
									class="h-4 w-4 rounded border-border text-primary focus:ring-primary"
								/>
								<Label for="is_active" class="text-sm font-normal cursor-pointer">
									Usuario activo
								</Label>
							</div>
						</div>
						
						<div class="flex items-center justify-end gap-4 pt-4 border-t border-border">
							<Button 
								type="button" 
								variant="outline" 
								href="/admin/users"
								disabled={$updateMutation.isPending}
							>
								Cancelar
							</Button>
							<Button 
								type="submit" 
								class="btn-primary"
								disabled={$updateMutation.isPending}
							>
								{#if $updateMutation.isPending}
									<div class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
									Guardando...
								{:else}
									Guardar Cambios
								{/if}
							</Button>
						</div>
					</form>
				</Card>
			</div>
			
			<!-- Info Sidebar -->
			<div>
				<Card class="card p-6">
					<h3 class="text-lg font-semibold mb-4">Información</h3>
					<div class="space-y-3 text-sm">
						<div class="flex justify-between">
							<span class="text-muted-foreground">ID:</span>
							<span class="font-mono">{$user.data?.id}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-muted-foreground">Creado:</span>
							<span>{formatDate($user.data?.created_at || '')}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-muted-foreground">Actualizado:</span>
							<span>{formatDate($user.data?.updated_at || '')}</span>
						</div>
					</div>
				</Card>
			</div>
		</div>
	{/if}
</div>
