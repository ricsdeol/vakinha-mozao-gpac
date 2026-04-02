# Configuration (Initializers)

`config/initializers.rb` is the primary config file (Ruby DSL, not YAML).

```ruby
Bridgetown.configure do |config|
  # Template engine (default is ERB)
  config.template_engine = :erb  # or :liquid, :serbea

  # Site URL (leave empty for relative URLs in dev)
  config.url = "https://example.com"

  # Timezone
  config.timezone = "America/New_York"

  # Permalink style
  config.permalink = "pretty"  # or "date", "ordinal", "none", "/:categories/:year/:month/:day/:title/"

  # Base path (for subdirectory hosting)
  config.base_path = "/my-subdir"

  # Pagination
  config.pagination.enabled = true

  # Define custom collections
  config.collections do
    add :projects, output: true
    add :team, output: true
  end

  # Load plugins/gems
  init :parse_routes       # generates .routes.json
  init :dotenv             # load .env file

  # Server-only config
  only :server do
    init :parse_routes
  end

  # Environment-specific
  except :static do
    # runs in server, console, rake contexts
  end

  # Roda server configuration
  roda do |app|
    app.plugin :default_headers,
      'Content-Type' => 'text/html',
      'X-Frame-Options' => 'deny'
  end

  # Hooks
  hook :site, :after_init do |site|
    # runs after site initialization
  end

  hook :site, :post_write do
    # runs after site is written to output
  end

  # Custom inflections (for Zeitwerk autoloading)
  config.inflections do |inflect|
    inflect.acronym "GPAC"
  end
end
```

**Hook events:**
- `:site` — `:after_init`, `:pre_read`, `:post_read`, `:pre_render`, `:post_render`, `:post_write`, `:fast_refresh`
- `:resource` — `:pre_render`, `:post_render`
- `:slots` — `:pre_render`
