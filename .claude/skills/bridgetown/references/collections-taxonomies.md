# Collections & Taxonomies

## Built-in: Categories & Tags

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

## Custom Taxonomies

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

## Resource Relations

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
