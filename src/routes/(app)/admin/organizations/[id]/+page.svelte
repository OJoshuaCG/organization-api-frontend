<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card } from '$lib/components/ui/card';
	import { Textarea } from '$lib/components/ui/textarea';
	import { useOrganization, useUpdateOrganization } from '$lib/api/hooks/organizations';
	import { Building2, ArrowLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { formatDate } from '$lib/utils';
	import { z } from 'zod';
	
	const id = parseInt($page.params.id);
	const organization = useOrganization(id);
	const updateMutation = useUpdateOrganization();
	
	const schema = z.object({
		name: z.string().min(1, 'El nombre es requerido').max(50, 'Máximo 50 caracteres'),
		description: z.string().max(150, 'Máximo 150 caracteres').optional(),
		whmcs_id: z.number().optional(),
		is_active: z.boolean()
	});
	
	let name = $state('');
	let description = $state('');
	let whmcs_id = $state('');
	let is_active = $state(true);
	let errors: Record<string, string> = $state({});
	
	// Initialize form when data loads
	$effect(() => {
		if ($organization.data) {
			name = $organization.data.name;
			description = $organization.data.description || '';
			whmcs_id = $organization.data.whmcs_id?.toString() || '';
			is_active = $organization.data.is_active;
		}
	});
	
	function validate() {
		try {
			schema.parse({
				name,
				description,
				whmcs_id: whmcs_id ? parseInt(whmcs_id) : undefined,
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
		
		$updateMutation.mutate({
			id,
			data: {
				name,
				description: description || undefined,
				whmcs_id: whmcs_id ? parseInt(whmcs_id) : undefined,
				is_active
			}
		}, {
			onSuccess: () => {
				goto('/admin/organizations');
			}
		});
	}
</script>

<svelte:head>
	<title>Editar Organización - Organization Manager</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<Button variant="ghost" size="icon" href="/admin/organizations">
			<ArrowLeft class="h-5 w-5" />
		</Button>
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Editar Organización</h1>
			<p class="text-muted-foreground mt-1">
				Modifica los datos de la organización
			</p>
		</div>
	</div>
	
	{#if $organization.isLoading}
		<div class="flex h-64 items-center justify-center">
			<div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
		</div>
	{:else if $organization.isError}
		<div class="flex h-64 flex-col items-center justify-center text-center">
			<p class="text-error mb-4">Error al cargar la organización</p>
			<Button onclick={() => $organization.refetch()}>Reintentar</Button>
		</div>
	{:else}
		<div class="grid gap-6 lg:grid-cols-3">
			<!-- Form -->
			<div class="lg:col-span-2">
				<Card class="card">
					<form onsubmit={handleSubmit} class="p-6 space-y-6">
						<div class="flex items-center gap-4 mb-6">
							<div class="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
								<Building2 class="h-8 w-8 text-primary" />
							</div>
							<div>
								<h2 class="text-lg font-semibold">Información General</h2>
								<p class="text-sm text-muted-foreground">
									Actualiza los datos de la organización
								</p>
							</div>
						</div>
						
						<div class="space-y-4">
							<div class="space-y-2">
								<Label for="name">
									Nombre <span class="text-error">*</span>
								</Label>
								<Input
									id="name"
									placeholder="Nombre de la organización"
									bind:value={name}
									class={errors.name ? 'border-error' : ''}
								/>
								{#if errors.name}
									<p class="text-sm text-error">{errors.name}</p>
								{/if}
							</div>
							
							<div class="space-y-2">
								<Label for="description">Descripción</Label>
								<Textarea
									id="description"
									placeholder="Descripción de la organización (opcional)"
									bind:value={description}
									rows={4}
								/>
								<p class="text-xs text-muted-foreground">
									Máximo 150 caracteres
								</p>
							</div>
							
							<div class="space-y-2">
								<Label for="whmcs_id">ID WHMCS</Label>
								<Input
									id="whmcs_id"
									type="number"
									placeholder="ID de WHMCS (opcional)"
									bind:value={whmcs_id}
								/>
							</div>
							
							<div class="flex items-center gap-2">
								<input
									type="checkbox"
									id="is_active"
									bind:checked={is_active}
									class="h-4 w-4 rounded border-border text-primary focus:ring-primary"
								/>
								<Label for="is_active" class="text-sm font-normal cursor-pointer">
									Organización activa
								</Label>
							</div>
						</div>
						
						<div class="flex items-center justify-end gap-4 pt-4 border-t border-border">
							<Button 
								type="button" 
								variant="outline" 
								href="/admin/organizations"
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
							<span class="font-mono">{$organization.data?.id}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-muted-foreground">Creado:</span>
							<span>{formatDate($organization.data?.created_at || '')}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-muted-foreground">Actualizado:</span>
							<span>{formatDate($organization.data?.updated_at || '')}</span>
						</div>
						{#if $organization.data?.created_by}
							<div class="flex justify-between">
								<span class="text-muted-foreground">Creado por:</span>
								<span>{$organization.data.created_by.name}</span>
							</div>
						{/if}
					</div>
				</Card>
			</div>
		</div>
	{/if}
</div>
