# Integración con API

## 🔌 Configuración

**Archivo**: `.env`
```
VITE_API_URL=http://localhost:8000/api/v1
```

## 🔐 Autenticación

### Login
```typescript
import { auth } from '$lib/stores/auth';

const result = await auth.login({
  username: 'admin',
  password: 'secret'
});

if (result.success) {
  goto('/dashboard');
}
```

### Store de Autenticación
```typescript
import { auth, user, isAuthenticated } from '$lib/stores/auth';

// Leer estado
$isAuthenticated  // boolean
$user             // User | null
```

## 📡 Hooks de TanStack Query

### Organizaciones
```typescript
import { useOrganizations, useCreateOrganization } from '$lib/api/hooks/organizations';

// Listar
const orgs = useOrganizations({ name: 'search' });

// Crear
const create = useCreateOrganization();
create.mutate({ name: 'Org', description: 'Desc' });
```

### Empresas
```typescript
import { useCompanies, useCompany } from '$lib/api/hooks/companies';

const companies = useCompanies({ organization_id: 1 });
const company = useCompany(1);
```

### Usuarios
```typescript
import { useUsers, useCreateUser } from '$lib/api/hooks/users';

const users = useUsers({ user_role_id: 2 });
```

## 🔄 Estados de Query

```svelte
{#if $query.isLoading}
  <Loading />
{:else if $query.isError}
  <Error message={$query.error.message} />
{:else}
  {#each $query.data as item}
    <Item {item} />
  {/each}
{/if}
```

## ✅ Validación con Zod

```typescript
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email(),
  is_active: z.boolean()
});

// Usar en formulario
const result = schema.parse(formData);
```

## 🍞 Notificaciones (Toast)

```typescript
import { toast } from 'svelte-sonner';

toast.success('Éxito!');
toast.error('Error!');
toast.info('Información');
```

## 📋 Endpoints Disponibles

| Recurso | Listar | Crear | Editar | Eliminar |
|---------|--------|-------|--------|----------|
| Organizations | ✅ | ✅ | ✅ | ✅ |
| Companies | ✅ | ✅ | ✅ | ✅ |
| Users | ✅ | ✅ | ✅ | ✅ |
