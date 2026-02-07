<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card } from '$lib/components/ui/card';
	import { useCreateUser } from '$lib/api/hooks/users';
	import { useOrganizations } from '$lib/api/hooks/organizations';
	import { useCompanies } from '$lib/api/hooks/companies';
	import { Users, ArrowLeft, Shield } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { z } from 'zod';
	import { ROLE_LABELS } from '$lib/utils';
	
	const schema = z.object({
		username: z.string().min(3, 'Mínimo 3 caracteres').max(50, 'Máximo 50 caracteres'),
		email: z.string().email('Email inválido').optional().or(z.literal('')),
		password: z.string().min(8, 'Mínimo 8 caracteres'),
		first_name: z.string().max(60, 'Máximo 60 caracteres').optional(),
		last_name: z.string().max(60, 'Máximo 60 caracteres').optional(),
		user_role_id: z.number().min(1, 'El rol es requerido'),
		organization_id: z.number().optional(),
		company_id: z.number().optional(),
		is_active: z.boolean().default(true)
	});
	
	let username = $state('');
	let email = $state('');
	let password = $state('');
	let first_name = $state('');
	let last_name = $state('');
	let user_role_id = $state('');
	let organization_id = $state('');
	let company_id = $state('');
	let is_active = $state(true);
	let errors: Record<string, string> = $state({});
	
	const organizations = useOrganizations({ per_page: 100 });
	const companies = useCompanies({ 
		organization_id: organization_id ? parseInt(organization_id) : undefined,
		per_page: 100 
	});
	const createMutation = useCreateUser();
	
	function validate() {
		try {
			schema.parse({
				username,
				email,
				password,
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
		
		$createMutation.mutate({
			username,
			email: email || undefined,
			password,
			first_name: first_name || undefined,
			last_name: last_name || undefined,
			user_role_id: parseInt(user_role_id),
			organization_id: organization_id ? parseInt(organization_id) : undefined,
			company_id: company_id ? parseInt(company_id) : undefined,
			is_active
		}, {
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
	<title>Nuevo Usuario - Organization Manager</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<Button variant="ghost" size="icon" href="/admin/users">
			<ArrowLeft class="h-5 w-5" />
		</Button>
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Nuevo Usuario</h1>
			<p class="text-muted-foreground mt-1">
				Crea un nuevo usuario en el sistema
			</p>
		</div>
	</div>
	
	<Card class="card max-w-2xl">
		<form onsubmit={handleSubmit} class="p-6 space-y-6">
			<div class="flex items-center gap-4 mb-6">
				<div class="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
					<Users class="h-8 w-8 text-white" />
				</div>
				<div>
					<h2 class="text-lg font-semibold">Información del Usuario</h2>
					<p class="text-sm text-muted-foreground">
						Completa los datos del usuario
					</p>
				</div>
			</div>
			
			<div class="space-y-4">
				<!-- Username & Email -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="space-y-2">
						<Label for="username">
							Usuario <span class="text-error">*</span>
						</Label>
						<Input
							id="username"
							placeholder="nombre_usuario"
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
							placeholder="usuario@email.com"
							bind:value={email}
							class={errors.email ? 'border-error' : ''}
						/>
						{#if errors.email}
							<p class="text-sm text-error">{errors.email}</p>
						{/if}
					</div>
				</div>
				
				<!-- Password -->
				<div class="space-y-2">
					<Label for="password">
						Contraseña <span class="text-error">*</span>
					</Label>
					<Input
						id="password"
						type="password"
						placeholder="Mínimo 8 caracteres"
						bind:value={password}
						class={errors.password ? 'border-error' : ''}
					/>
					{#if errors.password}
						<p class="text-sm text-error">{errors.password}</p>
					{/if}
				</div>
				
				<!-- Name -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="space-y-2">
						<Label for="first_name">Nombre</Label>
						<Input
							id="first_name"
							placeholder="Nombre"
							bind:value={first_name}
						/>
					</div>
					
					<div class="space-y-2">
						<Label for="last_name">Apellido</Label>
						<Input
							id="last_name"
							placeholder="Apellido"
							bind:value={last_name}
						/>
					</div>
				</div>
				
				<!-- Role -->
				<div class="space-y-2">
					<Label for="user_role_id">
						Rol <span class="text-error">*</span>
					</Label>
					<select
						id="user_role_id"
						bind:value={user_role_id}
						class="input {errors.user_role_id ? 'border-error' : ''}"
					>
						<option value="">Selecciona un rol</option>
						{#each availableRoles as role}
							<option value={role.id}>{role.label}</option>
						{/each}
					</select>
					{#if errors.user_role_id}
						<p class="text-sm text-error">{errors.user_role_id}</p>
					{/if}
				</div>
				
				<!-- Organization -->
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
				
				<!-- Company -->
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
				
				<!-- Active -->
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
					disabled={$createMutation.isPending}
				>
					Cancelar
				</Button>
				<Button 
					type="submit" 
					class="btn-primary"
					disabled={$createMutation.isPending}
				>
					{#if $createMutation.isPending}
						<div class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
						Creando...
					{:else}
						Crear Usuario
					{/if}
				</Button>
			</div>
		</form>
	</Card>
</div>
