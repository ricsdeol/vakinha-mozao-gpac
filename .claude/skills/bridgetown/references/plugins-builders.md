# Plugins & Builders

## Creating a Builder

```ruby
# plugins/builders/my_builder.rb
class Builders::MyBuilder < SiteBuilder
  def build
    # Register generators, hooks, helpers, tags, filters
  end
end
```

## Generators

```ruby
def build
  generator do
    site.data.featured_posts = collections.posts.resources
      .select { |post| post.data.featured }
  end
end
```

## Hooks

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

## Custom Helpers

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

## Custom Liquid Tags & Filters

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

## Resource Extensions

```ruby
def build
  hook :resource, :post_read do |resource|
    resource.data.excerpt ||= resource.content.split("\n\n").first
  end
end
```

## Priority

```ruby
class Builders::Critical < SiteBuilder
  priority :highest  # :lowest, :low, :normal, :high, :highest

  def build
    # runs before other builders
  end
end
```

## TailwindJIT Pattern (this project)

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
