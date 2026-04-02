# Resources & Content Model

Every content file in `src/` is a **resource** — a one-to-one mapping between a file and a URL.

## Front Matter

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

## Collections

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
