# Organization Frontend

Frontend moderno construido con SvelteKit para la gestión multi-tenant de organizaciones, empresas y usuarios.

## 🚀 Tecnologías

- **SvelteKit 5** - Framework moderno con SSR/SPA
- **TypeScript 5** - Tipado fuerte
- **TailwindCSS 3** - Estilos utilitarios
- **TanStack Query** - Manejo de estado del servidor
- **Axios** - Cliente HTTP
- **Zod** - Validación de schemas

## 🎨 Tema CYBER NOIR

Paleta de colores futurista:
- **Primary**: `#A855F7` (Púrpura)
- **Secondary**: `#EC4899` (Rosa neón)
- **Background**: `#09090B` (Oscuro)
- **Surface**: `#18181B` (Superficie)

## 📁 Estructura

```
src/
├── lib/
│   ├── api/           # Cliente HTTP y hooks
│   ├── components/    # Componentes UI
│   ├── stores/        # Estado global
│   └── utils/         # Utilidades
├── routes/            # Rutas de la aplicación
└── app.css           # Estilos globales
```

## 🛠️ Instalación

```bash
npm install
cp .env.example .env
npm run dev
```

## 🔐 Autenticación

- JWT con refresh automático
- Store de autenticación en Svelte
- Guards de rutas protegidas

## 📦 Scripts

- `npm run dev` - Desarrollo
- `npm run build` - Producción
- `npm run check` - Type checking

## 🔗 API Backend

Conectado a: `http://localhost:8000/api/v1`

---

**Versión**: 1.0.0  
**Autor**: Claude Code
