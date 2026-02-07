# Componentes UI

## 🧩 Componentes Base

### Button
```svelte
<Button variant="primary" size="lg">Click me</Button>
```

**Variants**: `primary` | `secondary` | `ghost` | `outline`  
**Sizes**: `sm` | `default` | `lg`

### Card
```svelte
<Card class="card">
  <h3>Título</h3>
  <p>Contenido</p>
</Card>
```

### Input
```svelte
<Input 
  bind:value={email} 
  type="email"
  placeholder="Email"
/>
```

### Textarea
```svelte
<Textarea 
  bind:value={description}
  rows={4}
/>
```

## 🎨 Clases CSS Personalizadas

### Surface
```html
<div class="surface">Contenido</div>
```

### Card
```html
<div class="card">Tarjeta con estilos</div>
```

### Buttons
```html
<button class="btn-primary">Primario</button>
<button class="btn-secondary">Secundario</button>
```

### Formularios
```html
<input class="input" />
<textarea class="input"></textarea>
```

### Badges
```html
<span class="badge badge-primary">Activo</span>
<span class="badge badge-secondary">Pendiente</span>
```

## 🌙 Modo Oscuro/Claro

```svelte
<script>
  import { toggleMode, mode } from '$lib/components/ui/mode-watcher';
</script>

<Button onclick={toggleMode}>
  {$mode === 'dark' ? '☀️' : '🌙'}
</Button>
```

## ♿ Accesibilidad

- Todos los inputs tienen Labels
- Contraste WCAG AA
- Focus rings visibles
- ARIA labels donde aplica
