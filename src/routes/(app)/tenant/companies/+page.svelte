<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Building2, Plus, Search, Pencil } from 'lucide-svelte';
	import { useCompanies } from '$lib/api/hooks/companies';
	import { formatDate } from '$lib/utils';

	let searchQuery = $state('');
	let currentPage = $state(1);

	const companies = useCompanies({
		name: searchQuery,
		per_page: 10
	});

	function handleSearch() {
		currentPage = 1;
		$companies.refetch();
	}
</script>

<svelte:head>
	<title>Mis Empresas - Organization Manager</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Mis Empresas</h1>
			<p class="text-muted-foreground mt-1">
				Gestiona tus empresas
			</p>
		</div>
	</div>

	<Card class="card p-4">
		<div class="flex gap-4">
			<div class="relative flex-1 max-w-sm">
				<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder="Buscar empresas..."
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

	<Card class="card overflow-hidden">
		{#if $companies.isLoading}
			<div class="flex h-64 items-center justify-center">
				<div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
			</div>
		{:else if $companies.isError}
			<div class="flex h-64 flex-col items-center justify-center text-center p-8">
				<p class="text-error mb-2">Error al cargar empresas</p>
				<Button variant="outline" onclick={() => $companies.refetch()}>
					Reintentar
				</Button>
			</div>
		{:else if $companies.data?.data.length === 0}
			<div class="flex h-64 flex-col items-center justify-center text-center p-8">
				<Building2 class="h-12 w-12 text-muted-foreground mb-4" />
				<h3 class="text-lg font-semibold">No hay empresas</h3>
				<p class="text-muted-foreground mt-1 mb-4">
					No tienes empresas asignadas
				</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b border-border bg-muted/50">
							<th class="px-6 py-4 text-left text-sm font-semibold">Nombre</th>
							<th class="px-6 py-4 text-left text-sm font-semibold">Estado</th>
							<th class="px-6 py-4 text-left text-sm font-semibold">Creado</th>
							<th class="px-6 py-4 text-right text-sm font-semibold">Acciones</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-border">
						{#each $companies.data?.data || [] as company}
							<tr class="hover:bg-muted/50 transition-colors">
								<td class="px-6 py-4">
									<div class="flex items-center gap-3">
										<div class="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
											<Building2 class="h-5 w-5 text-secondary" />
										</div>
										<div>
											<p class="font-medium">{company.name}</p>
											{#if company.whmcs_id}
												<p class="text-xs text-muted-foreground">WHMCS: {company.whmcs_id}</p>
											{/if}
										</div>
									</div>
								</td>
								<td class="px-6 py-4">
									{#if company.is_active}
										<span class="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
											Activa
										</span>
									{:else}
										<span class="inline-flex items-center rounded-full bg-error/10 px-2.5 py-0.5 text-xs font-medium text-error">
											Inactiva
										</span>
									{/if}
								</td>
								<td class="px-6 py-4 text-sm text-muted-foreground">
									{formatDate(company.created_at)}
								</td>
								<td class="px-6 py-4 text-right">
									<Button
										variant="ghost"
										size="icon"
										href="/tenant/companies/{company.id}"
										title="Ver detalles"
									>
										<Pencil class="h-4 w-4" />
									</Button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</Card>
</div>
