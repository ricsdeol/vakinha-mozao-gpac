# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vakinha Mozao GPAC** - Static campaign site for animal rescue NGO (GPAC) fundraising.
Built with **Bridgetown 2.1.2** (Ruby SSG), **Tailwind CSS 4.2**, **esbuild**, and **Roda** server.

## Common Commands

```bash
# Development (starts Puma server + esbuild watcher on port 4000)
bin/bridgetown start

# Production build (clean + frontend:build + bridgetown build)
bin/bridgetown deploy
# or equivalently:
rake deploy

# Build only (no frontend)
bin/bridgetown build

# Watch mode (rebuilds on source changes, no server)
bin/bridgetown build -w

# Console (IRB with site context loaded)
bin/bridgetown console

# Clean output directory
rake clean

# Frontend only
rake frontend:build     # one-shot minified build
rake frontend:dev       # esbuild watch mode
```

## Architecture

### Content Pipeline
- **Source content** lives in `src/` — Markdown/HTML files with YAML front matter become resources
- **Template engine:** ERB (configured in `config/initializers.rb`)
- **Layouts** in `src/_layouts/` chain via front matter (`post.erb` → `default.erb`)
- **Partials** in `src/_partials/` (prefixed with `_`) rendered via `<%= render "name" %>`
- **Components** in `src/_components/` — Ruby classes extending `Bridgetown::Component` paired with `.erb` templates
- **Data files** in `src/_data/` (YAML) — accessible as `site.data.<filename>` or `site.metadata`
- **Posts** in `src/_posts/` — date-prefixed Markdown, iterable via `collections.posts`
- **Static assets** in `src/images/` — copied as-is to output

### Frontend Build
- **Entry point:** `frontend/javascript/index.js` — imports CSS and auto-discovers components
- **CSS:** `frontend/styles/index.css` uses `@import "tailwindcss"` with CSS custom properties for theming
- **esbuild config:** `esbuild.config.js` extends `config/esbuild.defaults.js` (Bridgetown-managed, don't edit defaults)
- **PostCSS:** `postcss.config.js` chains `@tailwindcss/postcss` → `postcss-flexbugs-fixes` → `postcss-preset-env`
- **Path aliases** (in `jsconfig.json`): `$styles/*`, `$javascript/*`, `$components/*`

### Server
- **Roda** app in `server/roda_app.rb` — serves built site + optional API routes in `server/routes/`
- **Puma** configured in `config/puma.rb` (port 4000, 4 workers in production)
- Boot chain: `config.ru` → `Bridgetown::Rack.boot` → `RodaApp`

### Plugins
- Custom builders go in `plugins/builders/` and subclass `SiteBuilder` (defined in `plugins/site_builder.rb`)
- `TailwindJit` builder triggers CSS recompilation on fast refresh during development
- Bridgetown configuration is in `config/initializers.rb` (not the legacy `bridgetown.config.yml`)

### Output
- Built site goes to `output/` (gitignored)
- Frontend bundle manifest at `output/_bridgetown/static/`

## Key Conventions

- Use ERB for templates (not Liquid or Serbea)
- Access resource front matter via `data.field_name` (not `page.field_name`)
- Access site metadata via `site.metadata` (loaded from `src/_data/site_metadata.yml`)
- Iterate collections with `collections.<name>.each` in ERB
- Components use the pattern: `src/_components/shared/name.rb` + `name.erb`
- Render components with `<%= render ComponentClass.new(args) %>`
- Render partials with `<%= render "partial_name", local: value %>`
- `config/esbuild.defaults.js` is Bridgetown-managed — customize via `esbuild.config.js`
- Ruby version: 3.4.9 (see `.ruby-version`)
- Node packages use ES modules (`"type": "module"` in package.json)

## Bridgetown Documentation

Use Context7 MCP tool with library ID `/websites/bridgetownrb` to query up-to-date Bridgetown docs.
