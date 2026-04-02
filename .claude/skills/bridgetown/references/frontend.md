# Frontend (esbuild + Tailwind)

## esbuild Setup

`esbuild.config.js` (user-facing, extend here):
```javascript
import build from "./config/esbuild.defaults.js"

const esbuildOptions = {
  plugins: [
    // add custom esbuild plugins here
  ],
  globOptions: {
    excludeFilter: /\.(dsd|lit)\.css$/
  }
}

build(esbuildOptions)
```

**Do not edit** `config/esbuild.defaults.js` — it's managed by Bridgetown.

## JS Entry Point

```javascript
// frontend/javascript/index.js
import "$styles/index.css"
import "$styles/syntax-highlighting.css"
// Auto-imports all components:
import components from "$components/**/*.{js,jsx,js.rb,css}"
```

**Path aliases** (from `jsconfig.json`):
- `$styles/*` → `frontend/styles/*`
- `$javascript/*` → `frontend/javascript/*`
- `$components/*` → `src/_components/*`

## Tailwind CSS v4

```css
/* frontend/styles/index.css */
@import "tailwindcss";

/* CSS custom properties for theming */
:root {
  --body-background: #f2f2f2;
  --body-color: #444;
  --action-color: #d64045;
}
```

Tailwind v4 uses `@import "tailwindcss"` (no config file needed).

## PostCSS Config

```javascript
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      autoprefixer: { flexbox: 'no-2009' },
      stage: 3
    }
  }
}
```
