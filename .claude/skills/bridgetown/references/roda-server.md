# Roda Server & Routes

## Basic App

```ruby
# server/roda_app.rb
class RodaApp < Roda
  plugin :bridgetown_server

  route do |r|
    r.bridgetown  # loads routes from server/routes/ and src/_routes/
  end
end
```

## Custom Routes

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

## Enable SSR

In `config/initializers.rb`:
```ruby
only :server do
  init :bridgetown_routes
end
```

Add `src/_routes/` for file-based routing.

## Puma Config

```ruby
# config/puma.rb
port ENV.fetch("BRIDGETOWN_PORT", 4000)
workers ENV.fetch("WEB_CONCURRENCY", 4)   # production
threads 5, 5
preload_app!
```

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
