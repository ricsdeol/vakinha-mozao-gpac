# CLI Commands

```bash
# Create new site
bridgetown new PATH
  --apply=URL        # Apply automation script
  --configure=NAME   # Apply bundled config
  -t serbea|liquid   # Template engine (default: ERB)
  --use-sass         # Enable Sass

# Development
bin/bridgetown start       # Start Puma server at localhost:4000 with live reload
bin/bridgetown build       # Single build to output/
bin/bridgetown build -w    # Watch mode (rebuilds on changes)
bin/bridgetown deploy      # Build frontend + site for production

# Utilities
bin/bridgetown console     # IRB with site context
bin/bridgetown console -s  # With server context
bin/bridgetown clean       # Remove output/ and caches
bin/bridgetown plugins list
bin/bridgetown apply URL   # Run automation script
bin/bridgetown date        # Print current date for front matter

# Rake tasks (via Rakefile)
rake deploy           # clean + frontend:build + build
rake clean
rake frontend:build   # One-shot minified esbuild
rake frontend:dev     # esbuild in watch mode
```
