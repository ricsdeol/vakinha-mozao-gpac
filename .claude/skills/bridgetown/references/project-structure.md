# Project Structure

```
.
├── config/
│   ├── initializers.rb     # Main Bridgetown config (Ruby DSL)
│   ├── puma.rb             # Puma web server config
│   └── esbuild.defaults.js # Bridgetown-managed esbuild defaults (don't edit)
├── frontend/
│   ├── javascript/
│   │   └── index.js        # JS entry point
│   └── styles/
│       └── index.css       # CSS entry point
├── server/
│   ├── roda_app.rb         # Main Roda app
│   └── routes/             # Custom API routes
├── src/                    # All content lives here
│   ├── _components/        # Ruby + ERB components
│   ├── _data/              # YAML/JSON/CSV data files
│   ├── _layouts/           # Layout templates
│   ├── _partials/          # Reusable partials (underscore prefix)
│   ├── _posts/             # Blog posts (YEAR-MM-DD-title.md)
│   ├── images/             # Static assets
│   └── index.md            # Homepage
├── output/                 # Generated site (gitignored)
├── plugins/
│   ├── site_builder.rb     # Base class for custom builders
│   └── builders/           # Custom builder plugins
├── config.ru               # Rack boot (Puma entry)
├── esbuild.config.js       # User-facing esbuild config
├── Gemfile
├── Rakefile
└── package.json
```

**Key conventions:**
- Content files in `src/` with YAML front matter become resources
- `src/_data/site_metadata.yml` → `site.metadata`
- `src/_data/foo.yml` → `site.data.foo`
- `src/_posts/` requires date-prefixed filenames: `2024-01-15-my-post.md`
- `src/_partials/` files prefixed with `_` (e.g., `_head.erb`)
