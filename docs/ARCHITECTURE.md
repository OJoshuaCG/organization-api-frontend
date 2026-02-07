# Arquitectura del Frontend

## 🏗️ Patrones de Diseño

### 1. **Component-Based Architecture**
- Componentes reutilizables en `lib/components/`
- Cada componente tiene su carpeta con:
  - `index.svelte` - Componente principal
  - `index.ts` - Exportaciones

### 2. **API Layer Pattern**
```
lib/api/
├── client.ts           # Axios configurado
├── types.ts           # Interfaces TypeScript
└── hooks/
    ├── organizations.ts
    ├── companies.ts
    └── users.ts
```

### 3. **Store Pattern (Svelte)**
- `auth.ts` - Estado de autenticación
- JWT tokens manejados automáticamente
- Interceptores para refresh token

### 4. **Route Groups**
```
routes/
├── (app)/             # Rutas autenticadas
│   ├── admin/         # Panel admin
│   └── dashboard/
└── login/             # Públicas
```

## 🔄 Flujo de Datos

```
Usuario → Componente → Hook (TanStack) → API Client → Backend
              ↓
         Store (Auth)
```

## 🎨 Sistema de Diseño

### Colores (CYBER NOIR)
```css
--color-primary: #A855F7;
--color-secondary: #EC4899;
--bg: #09090B;
--surface: #18181B;
--card: #1F1F23;
```

### Componentes Base
- **Button** - Con variants (primary, secondary, ghost)
- **Card** - Contenedor con sombra
- **Input/Textarea** - Formularios
- **Label** - Etiquetas accesibles

## 🔐 Seguridad

1. **JWT Storage** - localStorage
2. **Token Refresh** - Automático en 401
3. **Route Guards** - Layout de autenticación
4. **CORS** - Configurado para API

## 📱 Responsive

- Mobile-first con Tailwind
- Sidebar colapsable
- Menú móvil con overlay

## 🧪 Testing

- Estructura lista para Vitest
- Playwright para E2E
