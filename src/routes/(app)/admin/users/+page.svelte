<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { useUsers, useDeleteUser } from '$lib/api/hooks/users';
	import { Users, Plus, Search, Pencil, Trash2, Shield, User } from 'lucide-svelte';
	import { formatDate, ROLE_LABELS } from '$lib/utils';
	import { confirmDelete } from '$lib/utils/confirm';
	
	let searchQuery = $state('');
	let currentPage = $state(1);
	
	const users = useUsers({ 
		username: searchQuery,
		per_page: 10
	});
	
	const deleteMutation = useDeleteUser();
	
	async function handleDelete(id: number, name: string) {
		const confirmed = await confirmDelete(`¿Estás seguro de eliminar al usuario "${name}"?`);
		if (confirmed) {
			$deleteMutation.mutate(id);
		}
	}
	
	function handleSearch() {
		currentPage = 1;
		$users.refetch();
	}
</script>

<svelte:head>
	<title>Usuarios - Organization Manager</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Usuarios</h1>
			<p class="text-muted-foreground mt-1">
				Gestiona los usuarios del sistema
			</p>
		</div>
		<Button href="/admin/users/new" class="btn-primary">
			<Plus class="mr-2 h-4 w-4" />
			Nuevo Usuario
		</Button>
	</div>
	
	<!-- Search -->
	<Card class="card p-4">
		<div class="flex gap-4">
			<div class="relative flex-1 max-w-sm">
				<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder="Buscar usuarios..."
					class="pl-10"
					bind:value={searchQuery}
					onkeydown={(e) => e.key === 'Enter' && handleSearch()}
				/>
			</div>
			<Button variant="secondary" onclick={handleSearch}>
				Buscar
			</Button>
		</div>
	</Card>
	
	<!-- Users List -->
	<Card class="card overflow-hidden">
		{#if $users.isLoading}
			<div class="flex h-64 items-center justify-center">
				<div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
			</div>
		{:else if $users.isError}
			<div class="flex h-64 flex-col items-center justify-center text-center p-8">
				<p class="text-error mb-2">Error al cargar usuarios</p>
				<Button variant="outline" onclick={() => $users.refetch()}>
					Reintentar
				</Button>
			</div>
		{:else if $users.data?.data.length === 0}
			<div class="flex h-64 flex-col items-center justify-center text-center p-8">
				<Users class="h-12 w-12 text-muted-foreground mb-4" />
				<h3 class="text-lg font-semibold">No hay usuarios</h3>
				<p class="text-muted-foreground mt-1 mb-4">
					Comienza creando un nuevo usuario
				</p>
				<Button href="/admin/users/new" class="btn-primary">
					<Plus class="mr-2 h-4 w-4" />
					Crear Usuario
				</Button>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b border-border bg-muted/50">
							<th class="px-6 py-4 text-left text-sm font-semibold">Usuario</th>
							<th class="px-6 py-4 text-left text-sm font-semibold">Rol</th>
							<th class="px-6 py-4 text-left text-sm font-semibold">Organización</th>
							<th class="px-6 py-4 text-left text-sm font-semibold">Estado</th>
							<th class="px-6 py-4 text-right text-sm font-semibold">Acciones</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-border">
						{#each $users.data?.data || [] as user}
							<tr class="hover:bg-muted/50 transition-colors">
								<td class="px-6 py-4">
									<div class="flex items-center gap-3">
										<div class="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
											<span class="text-sm font-bold text-white">{user.first_name?.[0] || user.username[0]}</span>
										</div>
										<div>
											<p class="font-medium">{user.full_name || user.username}</p>
											<p class="text-xs text-muted-foreground">@{user.username}</p>
										</div>
									</div>
								</td>
								<td class="px-6 py-4">
									<span class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
										<Shield class="h-3 w-3" />
										{ROLE_LABELS[user.user_role_id] || 'Usuario'}
									</span>
								</td>
								<td class="px-6 py-4 text-sm">
									{user.organization?.name || '-'}
								</td>
								<td class="px-6 py-4">
									{#if user.is_active}
										<span class="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
											Activo
										</span>
									{:else}
										<span class="inline-flex items-center rounded-full bg-error/10 px-2.5 py-0.5 text-xs font-medium text-error">
											Inactivo
										</span>
									{/if}
								</td>
								<td class="px-6 py-4 text-right">
									<div class="flex items-center justify-end gap-2">
										<Button 
											variant="ghost" 
											size="icon"
											href="/admin/users/{user.id}"
											title="Editar"
										>
											<Pencil class="h-4 w-4" />
										</Button>
										<Button 
											variant="ghost" 
											size="icon"
											class="text-error hover:text-error hover:bg-error/10"
											onclick={() => handleDelete(user.id, user.username)}
											title="Eliminar"
											disabled={$deleteMutation.isPending}
										>
											<Trash2 class="h-4 w-4" />
										</Button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			
			<!-- Pagination -->
			{#if $users.data?.meta && $users.data.meta.last_page > 1}
				<div class="flex items-center justify-between border-t border-border px-6 py-4">
					<p class="text-sm text-muted-foreground">
						Mostrando {$users.data.data.length} de {$users.data.meta.total} resultados
					</p>
					<div class="flex gap-2">
						<Button 
							variant="outline" 
							size="sm"
							disabled={currentPage === 1}
							onclick={() => currentPage--}
						>
							Anterior
						</Button>
						<Button 
							variant="outline" 
							size="sm"
							disabled={currentPage === $users.data.meta.last_page}
							onclick={() => currentPage++}
						>
							Siguiente
						</Button>
					</div>
				</div>
			{/if}
		{/if}
	</Card>
</div>
