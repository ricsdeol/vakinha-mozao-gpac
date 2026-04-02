# Bridgetown 2.x Complete Reference

## Table of Contents
1. [CLI Commands](#cli-commands)
2. [Project Structure](#project-structure)
3. [Configuration (Initializers)](#configuration)
4. [Resources & Content Model](#resources)
5. [Collections & Taxonomies](#collections)
6. [ERB Templates & Helpers](#erb-templates)
7. [Layouts & Partials](#layouts-partials)
8. [Components](#components)
9. [Plugins & Builders](#plugins-builders)
10. [Frontend (esbuild + Tailwind)](#frontend)
11. [Roda Server & Routes](#roda-server)

---

## CLI Commands

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

---

## Project Structure

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

---

## Configuration

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

---

## Resources

Every content file in `src/` is a **resource** — a one-to-one mapping between a file and a URL.

### Front Matter

```yaml
---
layout: page
title: About Us
description: Learn about GPAC
date: 2024-01-15
permalink: /about/  # override default URL
---

Content goes here. Access front matter: <%= data.title %>
```

**Accessing front matter in templates:**
```erb
<%= data.title %>          # front matter of current resource
<%= data.description %>
<%= resource.relative_url %> # URL path of current resource
<%= resource.data.title %>   # same as data.title
```

**Dot access for nested data:**
```erb
<%= post.data.author.name %>
<%= site.data.authors.lakshmi.github %>
<%= site.data.authors[resource.data.author].handle %>
```

### Collections

Built-in collections: `posts`, `pages`, `data`.

**Iterating in ERB:**
```erb
<% collections.posts.each do |post| %>
  <article>
    <a href="<%= post.relative_url %>"><h2><%= post.data.title %></h2></a>
    <p><%= post.data.description %></p>
    <time><%= post.data.date %></time>
  </article>
<% end %>
```

**With pagination:**
```erb
<% paginator.each do |post| %>
  <article>
    <a href="<%= post.relative_url %>"><h2><%= post.data.title %></h2></a>
  </article>
<% end %>
```

Enable pagination in front matter:
```yaml
---
paginate:
  collection: posts
  per_page: 10
---
```

**Custom collections** — define in `config/initializers.rb`:
```ruby
config.collections do
  add :projects, output: true
  add :team_members, output: true
end
```

Then use `collections.projects.each` in templates.

**Collection metadata:**
```erb
<%= collections.posts.metadata.title %>
<%= collections.posts.resources.count %>
```

---

## Collections & Taxonomies

### Built-in: Categories & Tags

```yaml
---
categories:
  - resgate
  - animais
tags:
  - gatos
  - adocao
---
```

### Custom Taxonomies

Define in `config/initializers.rb`:
```ruby
config.taxonomies do
  add :genres, key: :genres, title: "Musical Genre"
end
```

Use in resources:
```yaml
genres:
  - Jazz
  - Blues
```

Access in templates:
```erb
<% resource.taxonomies.genres.terms.each do |term| %>
  <%= term.label %>
<% end %>
```

### Resource Relations

Define in `config/initializers.rb`:
```ruby
config.collections do
  add :actors, output: true, relations: { has_many: :movies }
  add :movies, output: true, relations: { belongs_to: [:actors, :studio] }
  add :studios, output: true, relations: { has_many: :movies }
end
```

Front matter uses slugs:
```yaml
# src/_movies/blade-runner.md
actors:
  - harrison-ford
  - sean-young
studio: warner-brothers
```

Template usage:
```erb
<% resource.relations.actors.each do |actor| %>
  <%= link_to actor.data.name, actor %>
<% end %>
<%= link_to resource.relations.studio.data.name, resource.relations.studio %>
```

---

## ERB Templates

### Core Syntax

```erb
---
title: My Page
---
<%= data.title %>           <%# output %>
<% if condition %>          <%# code without output %>
  ...
<% end %>
<%%= literal ERB tag %>     <%# escaped %>
```

**Available objects:**
- `data` — current resource's front matter
- `resource` — current resource object
- `site` — site object
- `site.config` — site configuration
- `site.data` — data files
- `site.metadata` — `src/_data/site_metadata.yml`
- `collections` — all collections
- `paginator` — pagination object (when enabled)
- `layout` — current layout data

### URL/Link Helpers

```erb
<%= link_to "Click me!", "_posts/2024-01-my-post.md" %>
<%# → <a href="/blog/my-post">Click me!</a> %>

<%= link_to "Article", resource, class: "btn", data: { controller: "nav" } %>
<%# → <a href="/..." class="btn" data-controller="nav">Article</a> %>

<%= url_for("_posts/2024-01-my-post.md") %>   <%# returns URL string %>

<%= relative_url "/images/logo.svg" %>         <%# respects base_path %>
<%= absolute_url resource.relative_url %>       <%# full URL with domain %>
```

### Asset Helpers

```erb
<link rel="stylesheet" href="<%= asset_path :css %>" />
<script src="<%= asset_path :js %>" defer></script>
```

### Markdown Helper

```erb
<%= markdownify do %>
  ## Heading
  * item 1
  * item 2
<% end %>

<%= markdownify some_string_variable %>
```

### HTML Helpers

```erb
<p <%= html_attributes({ class: "my-class", id: "some-id" }) %>>Hello</p>
<%# → <p class="my-class" id="some-id">Hello</p> %>

<button <%= html_attributes({ data: { controller: "btn", action: "click->btn#go" } }) %>>
<%# → <button data-controller="btn" data-action="click->btn#go"> %>
```

### Capture

```erb
<% my_var = capture do %>
  Some <%= "content" %>
<% end %>
<%= my_var.upcase %>
```

### Slotted Content

Define in child page/layout, render in parent layout:
```erb
<%# In page: %>
<% slot :sidebar do %>
  <nav>Sidebar content</nav>
<% end %>

<%# In layout: %>
<%= slotted :sidebar %>

<%# With default content: %>
<%= slotted :sidebar do %>
  <p>Default sidebar</p>
<% end %>
```

### HTML Safety

```erb
<%= raw some_html_string %>
<%= some_value.html_safe %>
<%== some_value %>           <%# also outputs without escaping %>
```

---

## Layouts & Partials

### Layouts

Files in `src/_layouts/`. Apply via front matter `layout:` key. Layouts chain: `post.erb` → `page.erb` → `default.erb`.

```erb
<%# src/_layouts/default.erb %>
<!doctype html>
<html lang="<%= site.locale %>">
  <head>
    <%= render "head", metadata: site.metadata, title: data.title %>
  </head>
  <body class="<%= data.layout %>">
    <%= render Shared::Navbar.new(metadata: site.metadata, resource: resource) %>
    <main>
      <%= yield %>
    </main>
    <%= render "footer", metadata: site.metadata %>
  </body>
</html>
```

Child layout extends parent:
```erb
<%# src/_layouts/page.erb %>
---
layout: default
---
<h1><%= data.title %></h1>
<%= yield %>
```

### Partials

Files in `src/_partials/` with `_` prefix. Rendered without the prefix and without extension:

```erb
<%# src/_partials/_head.erb %>
<meta charset="UTF-8" />
<title><%= title %></title>
```

Render partial:
```erb
<%= render "head", title: data.title %>
<%= render "some/partial", key: "value", another_key: 123 %>
```

---

## Components

Ruby components pair a `.rb` class with an `.erb` template.

### File Structure

```
src/_components/
  shared/
    navbar.rb       # Ruby class
    navbar.erb      # Template
    navbar.js       # Optional JS
    navbar.css      # Optional CSS
```

### Ruby Component Class

```ruby
# src/_components/shared/navbar.rb
class Shared::Navbar < Bridgetown::Component
  def initialize(metadata:, resource:)
    @metadata = metadata
    @resource = resource
  end

  def site_title
    @metadata.title
  end
end
```

### ERB Component Template

```erb
<%# src/_components/shared/navbar.erb %>
<header>
  <img src="<%= relative_url '/images/logo.svg' %>" alt="<%= site_title %>" />
</header>
<nav>
  <ul>
    <li><a href="<%= relative_url '/' %>">Home</a></li>
    <li><a href="<%= relative_url '/about' %>">About</a></li>
  </ul>
</nav>
```

### Rendering Components

```erb
<%= render Shared::Navbar.new(metadata: site.metadata, resource: resource) %>

<%# From any ERB template or layout %>
<%= render ComponentClass.new(param: value) %>
```

### Components with Content (Slots)

```ruby
class Card < Bridgetown::Component
  def initialize(title:)
    @title = title
  end
end
```

```erb
<%# card.erb %>
<div class="card">
  <h2><%= @title %></h2>
  <div class="card-body">
    <%= content %>
  </div>
</div>
```

Render with block:
```erb
<%= render Card.new(title: "Hello") do %>
  <p>Card content here</p>
<% end %>
```

### Streamlined (Pure Ruby) Components

For performance-critical components (~1.5x faster than ERB):

```ruby
class SectionComponent < Bridgetown::Component
  def initialize(heading:, **options)
    @heading, @options = heading, options
  end

  def template
    html -> { <<~HTML
      <section #{html_attributes(**@options)}>
        <h3>#{text -> { @heading }}</h3>
        <div>#{html -> { content }}</div>
      </section>
    HTML
    }
  end
end
```

---

## Plugins & Builders

### Creating a Builder

```ruby
# plugins/builders/my_builder.rb
class Builders::MyBuilder < SiteBuilder
  def build
    # Register generators, hooks, helpers, tags, filters
  end
end
```

### Generators

```ruby
def build
  generator do
    site.data.featured_posts = collections.posts.resources
      .select { |post| post.data.featured }
  end
end
```

### Hooks

```ruby
def build
  hook :site, :post_read do
    # runs after all content is read
  end

  hook :resource, :pre_render do |resource|
    resource.data.word_count = resource.content.split.length
  end

  hook :site, :fast_refresh do
    # runs during dev fast refresh
  end
end
```

### Custom Helpers

```ruby
def build
  helper :reading_time do |input|
    words = input.split.length
    (words / 200.0).ceil
  end
end
```

Use in ERB:
```erb
<%= reading_time resource.content %> min read
```

### Custom Liquid Tags & Filters

```ruby
def build
  liquid_tag "youtube" do |id, tag|
    "<iframe src='https://youtube.com/embed/#{id}'></iframe>"
  end

  liquid_filter "upcase_first" do |input|
    input.capitalize
  end
end
```

### Resource Extensions

```ruby
def build
  hook :resource, :post_read do |resource|
    resource.data.excerpt ||= resource.content.split("\n\n").first
  end
end
```

### Priority

```ruby
class Builders::Critical < SiteBuilder
  priority :highest  # :lowest, :low, :normal, :high, :highest

  def build
    # runs before other builders
  end
end
```

### TailwindJIT Pattern (this project)

```ruby
# plugins/builders/tailwind_jit.rb
class Builders::TailwindJit < SiteBuilder
  def build
    return if ARGV.include?("--skip-tw-jit")

    fast_refreshing = false

    hook :site, :fast_refresh do
      fast_refreshing = true
    end

    hook :site, :post_write do
      if fast_refreshing
        fast_refreshing = false
        Thread.new do
          sleep 0.75
          refresh_file = site.in_root_dir("frontend", "styles", "jit-refresh.css")
          File.write refresh_file, "/* #{Time.now.to_i} */"
        end
      end
    end
  end
end
```

---

## Frontend

### esbuild Setup

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

### JS Entry Point

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

### Tailwind CSS v4

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

### PostCSS Config

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

---

## Roda Server

### Basic App

```ruby
# server/roda_app.rb
class RodaApp < Roda
  plugin :bridgetown_server

  route do |r|
    r.bridgetown  # loads routes from server/routes/ and src/_routes/
  end
end
```

### Custom Routes

```ruby
# server/routes/api.rb
class Routes::Api < Bridgetown::Rack::Routes
  route do |r|
    # GET /api/hello/:name
    r.get "api", "hello", String do |name|
      { hello: name }  # returns JSON automatically
    end

    # POST /api/submit
    r.post "api", "submit" do
      data = r.params
      { status: "ok", received: data }
    end
  end
end
```

Rename `server/routes/hello.rb.sample` → `server/routes/hello.rb` to activate.

### Enable SSR

In `config/initializers.rb`:
```ruby
only :server do
  init :bridgetown_routes
end
```

Add `src/_routes/` for file-based routing.

### Puma Config

```ruby
# config/puma.rb
port ENV.fetch("BRIDGETOWN_PORT", 4000)
workers ENV.fetch("WEB_CONCURRENCY", 4)   # production
threads 5, 5
preload_app!
```

---

## Migration Notes (from Jekyll / Legacy Bridgetown)

| Old | New |
|-----|-----|
| `site.posts` | `collections.posts.resources` |
| `page.field` | `data.field` or `resource.data.field` |
| `page` | `resource` |
| `page.url` | `resource.relative_url` |
| `{{ page.url \| prepend: site.baseurl }}` | `<%= relative_url resource.relative_url %>` |
| `paginator.posts` | `paginator.resources` |
| `pagination: enabled: true` | `paginate: { collection: posts }` |
| `bridgetown.config.yml` | `config/initializers.rb` |
