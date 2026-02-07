# Agent Context - Organization Frontend

> **Instrucciones para IA**: Contexto completo del proyecto frontend. Lee esto antes de hacer cambios.

---

## 🎯 Visión General

Frontend SvelteKit con tema CYBER NOIR para gestión multi-tenant.

**Stack**: SvelteKit 5 + TypeScript + TailwindCSS + TanStack Query

---

## 🏗️ Arquitectura

### Estructura de Carpetas

```
src/
├── lib/
│   ├── api/
│   │   ├── client.ts         # Axios + JWT interceptors
│   │   ├── types.ts          # Interfaces
│   │   └── hooks/            # TanStack Query hooks
│   ├── components/ui/        # Componentes base
│   ├── stores/auth.ts        # Auth store (Svelte)
│   └── utils/                # Helpers
├── routes/
│   ├── (app)/               # Autenticado
│   │   ├── admin/           # CRUDs Admin
│   │   └── dashboard/
│   └── login/               # Público
└── app.css                  # Tailwind + CYBER NOIR
```

### Patrones Importantes

1. **Hooks de API**: Usar TanStack Query siempre
2. **Validación**: Zod en todos los formularios
3. **Estilos**: Clases de Tailwind, no CSS custom
4. **Componentes**: Reutilizar los de lib/components/ui/

---

## 🎨 Tema CYBER NOIR

**NO MODIFICAR estos colores**:
- Primary: `#A855F7` (púrpura)
- Secondary: `#EC4899` (rosa)
- Background: `#09090B`
- Surface: `#18181B`

**Usar clases de utilidad**:
```svelte
<div class="card bg-surface">
  <button class="btn-primary">Action</button>
</div>
```

---

## 🔐 Autenticación

### Store de Auth
```typescript
import { auth, user, isAuthenticated } from '$lib/stores/auth';

// Login
await auth.login({ username, password });

// Logout
auth.logout();
```

### Proteger Ruta
```svelte
<!-- routes/(app)/+layout.svelte -->
<script>
  import { auth } from '$lib/stores/auth';
  if (!$auth.isAuthenticated) goto('/login');
</script>
```

---

## 📡 API Integration

### Hooks Disponibles

```typescript
// Organizaciones
import { useOrganizations, useCreateOrganization } from '$lib/api/hooks/organizations';

// Empresas
import { useCompanies, useCompany } from '$lib/api/hooks/companies';

// Usuarios
import { useUsers, useCreateUser } from '$lib/api/hooks/users';
```

### Patrón de Uso

```svelte
<script>
  const query = useOrganizations();
  const mutation = useCreateOrganization();
</script>

{#if $query.isLoading}
  <Loading />
{:else}
  {#each $query.data?.data || [] as org}
    <Card>{org.name}</Card>
  {/each}
{/if}
```

---

## ✅ Mejores Prácticas

### DO ✅
- Usar TypeScript estricto
- Validar con Zod antes de enviar
- Manejar errores con toast
- Usar componentes UI existentes
- Seguir convención de commits

### DON'T ❌
- No modificar colores del tema
- No usar any en TypeScript
- No ignorar errores de lint
- No duplicar lógica de validación

---

## 📝 Convenciones

### Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: cambios de formato
refactor: refactorización
test: tests
chore: tareas de mantenimiento
```

### Nombres
- Componentes: PascalCase (`Button.svelte`)
- Hooks: camelCase (`useOrganizations.ts`)
- Stores: camelCase (`auth.ts`)
- Rutas: kebab-case (`/admin/users`)

---

## 🧪 Testing

### Estructura
```
tests/
├── unit/
└── e2e/
```

### Comandos
```bash
npm run test        # Unit tests
npm run test:e2e    # E2E tests
```

---

## 🚨 Troubleshooting

### Error: JWT no funciona
- Verificar `VITE_API_URL` en .env
- Comprobar que backend está corriendo
- Revisar localStorage tiene tokens

### Error: Estilos no aplican
- Verificar clase `dark` en html
- Comprobar Tailwind config
- Revisar app.css está importado

### Error: Hooks no funcionan
- Verificar QueryClientProvider en layout
- Comprobar que queryClient está configurado

---

## 🔗 Recursos

- [SvelteKit Docs](https://kit.svelte.dev)
- [TanStack Query](https://tanstack.com/query)
- [TailwindCSS](https://tailwindcss.com)
- Backend API: `organization-api/`

---

**Versión**: 1.0.0  
**Última actualización**: 2026-02-07
