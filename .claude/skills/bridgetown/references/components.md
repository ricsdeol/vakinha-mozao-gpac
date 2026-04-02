# Components

Ruby components pair a `.rb` class with an `.erb` template.

## File Structure

```
src/_components/
  shared/
    navbar.rb       # Ruby class
    navbar.erb      # Template
    navbar.js       # Optional JS
    navbar.css      # Optional CSS
```

## Ruby Component Class

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

## ERB Component Template

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

## Rendering Components

```erb
<%= render Shared::Navbar.new(metadata: site.metadata, resource: resource) %>

<%# From any ERB template or layout %>
<%= render ComponentClass.new(param: value) %>
```

## Components with Content (Slots)

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

## Streamlined (Pure Ruby) Components

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
