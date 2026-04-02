# Layouts & Partials

## Layouts

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

## Partials

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
