# Organization Frontend

Frontend moderno para Organization API construido con SvelteKit y tema CYBER NOIR.

## 🚀 Características

- **SvelteKit 5** - Framework moderno con SSR/SPA híbrido
- **TypeScript** - Tipado fuerte y mejor DX
- **TailwindCSS** - Estilos utilitarios con tema CYBER NOIR
- **shadcn-svelte** - Componentes UI personalizables
- **Tema CYBER NOIR** - Paleta de colores púrpura/rosa neón
- **Dark/Light Mode** - Soporte completo de temas

## 🎨 Tema CYBER NOIR

### Colores Principales
- **Primary**: `#A855F7` (Púrpura Futurista)
- **Secondary**: `#EC4899` (Rosa Neón)
- **Background Dark**: `#09090B`
- **Surface Dark**: `#18181B`
- **Card Dark**: `#1F1F23`

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Sincronizar configuración de SvelteKit (obligatorio en primera instalación)
npx svelte-kit sync

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── lib/
│   ├── components/ui/     # Componentes UI (shadcn)
│   └── utils/             # Utilidades (cn, formatters)
├── routes/                # Rutas de SvelteKit
│   ├── +layout.svelte    # Layout principal
│   └── +page.svelte      # Página de inicio
├── app.html              # Template HTML
├── app.css               # Estilos globales Tailwind
└── app.d.ts              # Tipos globales
```

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env`:

```env
PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Tailwind Config

El tema CYBER NOIR está configurado en `tailwind.config.js` con:
- Colores personalizados
- Sombras glow (púrpura/rosa)
- Bordes redondeados
- Fuentes Inter y JetBrains Mono

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run check` - Type checking
- `npm run check:watch` - Type checking en watch mode
- `npm run lint` - Linting
- `npm run format` - Formateo con Prettier

## 🔗 Conexión con API

El frontend está diseñado para conectarse con:
- **Organization API** (Laravel 12 + JWT)
- URL base configurada en variables de entorno
- Autenticación mediante tokens JWT

## 📄 Licencia

Proyecto privado.
