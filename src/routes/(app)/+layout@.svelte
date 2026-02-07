<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { auth, user, isAdmin } from '$lib/stores/auth';
	import { Button } from '$lib/components/ui/button';
	import { ModeWatcher, toggleMode, mode } from '$lib/components/ui/mode-watcher';
	import { 
		LayoutDashboard, 
		Building2, 
		Users, 
		Settings, 
		LogOut, 
		Menu,
		X,
		Shield,
		ChevronDown,
		Moon,
		Sun
	} from 'lucide-svelte';
	
	let { children } = $props();
	let sidebarOpen = $state(true);
	let mobileMenuOpen = $state(false);
	let userMenuOpen = $state(false);
	
	const adminNavItems = [
		{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/admin/organizations', label: 'Organizaciones', icon: Building2 },
		{ href: '/admin/companies', label: 'Empresas', icon: Building2 },
		{ href: '/admin/users', label: 'Usuarios', icon: Users },
	];
	
	const tenantNavItems = [
		{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/tenant/companies', label: 'Mis Empresas', icon: Building2 },
		{ href: '/tenant/users', label: 'Usuarios', icon: Users },
	];
	
	let navItems = $derived($isAdmin ? adminNavItems : tenantNavItems);
	
	function handleLogout() {
		auth.logout();
	}
</script>

<div class="flex h-screen bg-background">
	<!-- Sidebar Desktop -->
	<aside 
		class="hidden lg:flex flex-col bg-surface border-r border-border transition-all duration-300 {sidebarOpen ? 'w-64' : 'w-20'}"
	>
		<!-- Logo -->
		<div class="flex h-16 items-center justify-center border-b border-border px-4">
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-glow">
					<Shield class="h-5 w-5 text-white" />
				</div>
				{#if sidebarOpen}
					<span class="text-lg font-bold text-gradient">Org Manager</span>
				{/if}
			</div>
		</div>
		
		<!-- Navigation -->
		<nav class="flex-1 overflow-y-auto py-4 px-3">
			<ul class="space-y-1">
				{#each navItems as item}
					<li>
						<a 
							href={item.href}
							class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors {$page.url.pathname === item.href ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
						>
							<item.icon class="h-5 w-5 flex-shrink-0" />
							{#if sidebarOpen}
								<span>{item.label}</span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		
		<!-- User Section -->
		<div class="border-t border-border p-4">
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
					<span class="text-sm font-bold text-white">{$user?.first_name?.[0] || $user?.username?.[0] || 'U'}</span>
				</div>
				{#if sidebarOpen}
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium truncate">{$user?.full_name || $user?.username}</p>
						<p class="text-xs text-muted-foreground truncate">{$user?.role?.name || 'Usuario'}</p>
					</div>
				{/if}
			</div>
		</div>
	</aside>
	
	<!-- Mobile Sidebar Overlay -->
	{#if mobileMenuOpen}
		<div 
			class="fixed inset-0 z-40 bg-black/50 lg:hidden"
			onclick={() => mobileMenuOpen = false}
		></div>
	{/if}
	
	<!-- Mobile Sidebar -->
	<aside 
		class="fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transform transition-transform duration-300 lg:hidden {mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}"
	>
		<div class="flex h-16 items-center justify-between border-b border-border px-4">
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-glow">
					<Shield class="h-5 w-5 text-white" />
				</div>
				<span class="text-lg font-bold text-gradient">Org Manager</span>
			</div>
			<Button variant="ghost" size="icon" onclick={() => mobileMenuOpen = false}>
				<X class="h-5 w-5" />
			</Button>
		</div>
		
		<nav class="p-4">
			<ul class="space-y-1">
				{#each navItems as item}
					<li>
						<a 
							href={item.href}
							class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors {$page.url.pathname === item.href ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
							onclick={() => mobileMenuOpen = false}
						>
							<item.icon class="h-5 w-5" />
							<span>{item.label}</span>
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</aside>
	
	<!-- Main Content -->
	<div class="flex flex-1 flex-col overflow-hidden">
		<!-- Header -->
		<header class="flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:px-6">
			<div class="flex items-center gap-4">
				<!-- Mobile Menu Button -->
				<Button 
					variant="ghost" 
					size="icon" 
					class="lg:hidden"
					onclick={() => mobileMenuOpen = true}
				>
					<Menu class="h-5 w-5" />
				</Button>
				
				<!-- Toggle Sidebar (Desktop) -->
				<Button 
					variant="ghost" 
					size="icon"
					class="hidden lg:flex"
					onclick={() => sidebarOpen = !sidebarOpen}
				>
					{#if sidebarOpen}
						<X class="h-5 w-5" />
					{:else}
						<Menu class="h-5 w-5" />
					{/if}
				</Button>
			</div>
			
			<div class="flex items-center gap-2">
				<!-- Theme Toggle -->
				<Button 
					variant="ghost" 
					size="icon"
					onclick={toggleMode}
				>
					{#if $mode === 'dark'}
						<Sun class="h-5 w-5" />
					{:else}
						<Moon class="h-5 w-5" />
					{/if}
				</Button>
				
				<!-- Logout -->
				<Button 
					variant="ghost" 
					size="icon"
					onclick={handleLogout}
					title="Cerrar sesión"
				>
					<LogOut class="h-5 w-5" />
				</Button>
			</div>
		</header>
		
		<!-- Page Content -->
		<main class="flex-1 overflow-y-auto bg-background p-4 lg:p-8">
			{@render children()}
		</main>
	</div>
</div>
