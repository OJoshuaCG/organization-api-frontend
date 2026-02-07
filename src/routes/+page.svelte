<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Shield, Users, Building, Sparkles } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Organization Manager - CYBER NOIR</title>
	<meta name="description" content="Organization Management System" />
</svelte:head>

<div class="min-h-screen bg-background">
	<!-- Hero Section -->
	<section class="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
		<!-- Background Gradient -->
		<div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
		
		<!-- Animated Grid Background -->
		<div class="absolute inset-0 opacity-[0.02]" style="background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0); background-size: 40px 40px;"></div>
		
		<div class="relative mx-auto max-w-7xl text-center">
			<!-- Badge -->
			<div class="mb-8 flex justify-center">
				<span class="badge badge-primary">
					<Sparkles class="mr-1 h-3 w-3" />
					SvelteKit + Laravel API
				</span>
			</div>
			
			<!-- Title -->
			<h1 class="mb-6 text-5xl font-bold tracking-tight sm:text-7xl">
				<span class="text-gradient">Organization</span>
				<br />
				<span class="text-foreground">Manager</span>
			</h1>
			
			<!-- Subtitle -->
			<p class="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
				Sistema de gestión multi-tenant con tema <span class="text-primary">CYBER NOIR</span>. 
				Construido con SvelteKit, TailwindCSS y Laravel API.
			</p>
			
			<!-- CTA Buttons -->
			<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
				<Button size="lg" class="btn-primary text-base">
					<Shield class="mr-2 h-5 w-5" />
					Panel de Administración
				</Button>
				<Button size="lg" variant="outline" class="btn-secondary text-base">
					<Users class="mr-2 h-5 w-5" />
					Área de Clientes
				</Button>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="px-4 py-16 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-7xl">
			<h2 class="mb-12 text-center text-3xl font-bold tracking-tight">
				Características <span class="text-gradient">Principales</span>
			</h2>
			
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<!-- Feature 1 -->
				<Card class="card group transition-all duration-300 hover:border-primary/50 hover:glow">
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Building class="h-6 w-6 text-primary" />
					</div>
					<h3 class="mb-2 text-xl font-semibold">Multi-Organización</h3>
					<p class="text-muted-foreground">
						Gestiona múltiples organizaciones con aislamiento completo de datos y configuraciones.
					</p>
				</Card>
				
				<!-- Feature 2 -->
				<Card class="card group transition-all duration-300 hover:border-secondary/50 hover:glow-secondary">
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
						<Users class="h-6 w-6 text-secondary" />
					</div>
					<h3 class="mb-2 text-xl font-semibold">Gestión de Usuarios</h3>
					<p class="text-muted-foreground">
						Roles jerárquicos (Super Admin → Admin → Org Owner → Company Owner → User).
					</p>
				</Card>
				
				<!-- Feature 3 -->
				<Card class="card group transition-all duration-300 hover:border-primary/50 hover:glow">
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Shield class="h-6 w-6 text-primary" />
					</div>
					<h3 class="mb-2 text-xl font-semibold">JWT Seguro</h3>
					<p class="text-muted-foreground">
						Autenticación con tokens JWT, refresh automático y control de acceso granular.
					</p>
				</Card>
			</div>
		</div>
	</section>

	<!-- Tech Stack Section -->
	<section class="border-t border-border px-4 py-16 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-7xl">
			<h2 class="mb-12 text-center text-3xl font-bold tracking-tight">
				Stack <span class="text-gradient">Tecnológico</span>
			</h2>
			
			<div class="flex flex-wrap items-center justify-center gap-4">
				{#each ['SvelteKit 5', 'TypeScript', 'TailwindCSS', 'Laravel 12', 'JWT', 'shadcn-svelte'] as tech}
					<span class="badge badge-primary border border-primary/20">
						{tech}
					</span>
				{/each}
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-border px-4 py-8 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-7xl text-center text-sm text-muted-foreground">
			<p>© 2026 Organization Manager. Built with SvelteKit + Laravel.</p>
		</div>
	</footer>
</div>
