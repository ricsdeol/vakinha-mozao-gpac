# ERB Templates & Helpers

## Core Syntax

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

## URL/Link Helpers

```erb
<%= link_to "Click me!", "_posts/2024-01-my-post.md" %>
<%# → <a href="/blog/my-post">Click me!</a> %>

<%= link_to "Article", resource, class: "btn", data: { controller: "nav" } %>
<%# → <a href="/..." class="btn" data-controller="nav">Article</a> %>

<%= url_for("_posts/2024-01-my-post.md") %>   <%# returns URL string %>

<%= relative_url "/images/logo.svg" %>         <%# respects base_path %>
<%= absolute_url resource.relative_url %>       <%# full URL with domain %>
```

## Asset Helpers

```erb
<link rel="stylesheet" href="<%= asset_path :css %>" />
<script src="<%= asset_path :js %>" defer></script>
```

## Markdown Helper

```erb
<%= markdownify do %>
  ## Heading
  * item 1
  * item 2
<% end %>

<%= markdownify some_string_variable %>
```

## HTML Helpers

```erb
<p <%= html_attributes({ class: "my-class", id: "some-id" }) %>>Hello</p>
<%# → <p class="my-class" id="some-id">Hello</p> %>

<button <%= html_attributes({ data: { controller: "btn", action: "click->btn#go" } }) %>>
<%# → <button data-controller="btn" data-action="click->btn#go"> %>
```

## Capture

```erb
<% my_var = capture do %>
  Some <%= "content" %>
<% end %>
<%= my_var.upcase %>
```

## Slotted Content

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

## HTML Safety

```erb
<%= raw some_html_string %>
<%= some_value.html_safe %>
<%== some_value %>           <%# also outputs without escaping %>
```
