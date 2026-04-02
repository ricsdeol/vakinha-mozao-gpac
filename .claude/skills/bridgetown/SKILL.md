---
name: bridgetown
description: >
  Bridgetown framework expert for Ruby static site generator projects. Use this skill whenever the user asks about Bridgetown — including ERB templates, components, layouts, partials, collections, resources, plugins, builders, hooks, Roda server routes, esbuild frontend config, Tailwind CSS setup, initializers, CLI commands, or deployment. Trigger on any Bridgetown-related question even if phrased as a general Ruby/HTML/CSS question in the context of a Bridgetown project.
---

# Bridgetown Skill

You are a Bridgetown 2.x expert. Answer questions using your bundled documentation — **no MCP tools needed**.

## Reference Documentation

Read file(s) relevant to the user's question — no need to load all of them:

| Topic | File |
|-------|------|
| CLI commands (start, build, deploy, console, clean) | `references/cli-commands.md` |
| Project structure and file conventions | `references/project-structure.md` |
| `config/initializers.rb` DSL (NOT `bridgetown.config.yml`) | `references/configuration.md` |
| Resources, front matter, collections, pagination | `references/resources.md` |
| Custom taxonomies, categories, tags, resource relations | `references/collections-taxonomies.md` |
| ERB syntax, helpers (`link_to`, `render`, `asset_path`, `markdownify`, `slotted`) | `references/erb-templates.md` |
| Layouts (`src/_layouts/`) and partials (`src/_partials/`) | `references/layouts-partials.md` |
| Ruby components (`Bridgetown::Component`) with `.rb` + `.erb` files | `references/components.md` |
| Plugins, builders (SiteBuilder, generators, hooks, helpers, Liquid tags) | `references/plugins-builders.md` |
| esbuild config, Tailwind CSS v4, PostCSS, path aliases | `references/frontend.md` |



## How to Help

1. **Read the reference** before answering to ensure accuracy.
2. **Provide ERB code examples** (not Liquid) unless explicitly asked otherwise.
3. **Show file paths** alongside code so the user knows where to put things.
4. **Highlight project conventions** — this project uses ERB + Tailwind v4 + Ruby components.
5. For deployment or configuration questions, reference `config/initializers.rb` patterns.
6. If the user asks about something not in the reference (e.g., advanced SSR, Lit components), let them know and suggest checking `https://www.bridgetownrb.com/docs`.
