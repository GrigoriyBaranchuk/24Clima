# UI/UX Pro Max Skill - Installation Summary

Successfully installed the UI/UX Pro Max skill into your Claude Code project.

## Installation Location

```
/sessions/optimistic-stoic-rubin/mnt/24clima_calculator_ver55/.claude/skills/ui-ux-pro-max/
```

## Directory Structure

```
ui-ux-pro-max/
├── scripts/
│   ├── core.py                 # BM25 search engine and data loading
│   └── design_system.py        # Design system generator and formatters
├── data/
│   ├── styles.csv              # UI/UX style guides and patterns
│   ├── colors.csv              # Color palettes for different product types
│   ├── charts.csv              # Data visualization guidelines
│   ├── landing.csv             # Landing page patterns and conversions
│   ├── products.csv            # Product-specific design recommendations
│   ├── typography.csv          # Font pairings and typography guidelines
│   ├── icons.csv               # Icon libraries and usage
│   ├── ux-guidelines.csv       # UX best practices and accessibility
│   ├── app-interface.csv       # Web interface guidelines
│   ├── google-fonts.csv        # Google Fonts database
│   ├── react-performance.csv   # React-specific performance tips
│   ├── ui-reasoning.csv        # Design system reasoning rules
│   ├── draft.csv               # Draft designs and experiments
│   ├── _sync_all.py            # Utility to sync data from GitHub
│   └── stacks/                 # Framework-specific guidelines
│       ├── react.csv
│       ├── nextjs.csv
│       ├── vue.csv
│       ├── svelte.csv
│       ├── astro.csv
│       ├── swiftui.csv
│       ├── react-native.csv
│       ├── flutter.csv
│       ├── nuxtjs.csv
│       ├── nuxt-ui.csv
│       ├── html-tailwind.csv
│       ├── shadcn.csv
│       ├── jetpack-compose.csv
│       ├── threejs.csv
│       ├── angular.csv
│       └── laravel.csv
```

## Features

The UI/UX Pro Max skill provides:

### 1. Design System Search (`core.py`)
- **BM25 Search Algorithm**: Fast, relevant document retrieval
- **Multi-Domain Search**: Search across styles, colors, layouts, typography, etc.
- **Stack-Specific Search**: Framework-specific UI/UX guidelines
- **Auto-Domain Detection**: Automatically detects search intent

### 2. Design System Generation (`design_system.py`)
- **Intelligent Pattern Recognition**: Detects product type and recommends patterns
- **Reasoned Recommendations**: Uses AI reasoning rules to customize recommendations
- **Multiple Output Formats**: ASCII box, Markdown, and JSON
- **Master + Override Pattern**: Per-page design system customization
- **Persistence**: Saves design systems to disk for team collaboration

### 3. Comprehensive Data
- **40+ Design Styles**: From minimalism to glassmorphism
- **Color Palettes**: Pre-configured for different product types
- **Typography Pairings**: Google Fonts combinations
- **Icon Systems**: Heroicons and Lucide integration guidance
- **UX Patterns**: Landing pages, dashboards, e-commerce
- **Framework Guides**: React, Vue, Angular, Flutter, SwiftUI, and more
- **Accessibility**: WCAG AAA guidelines and best practices

## Quick Start

### Search for Design Guidance

```python
from scripts.core import search

# Search for a design style
result = search("SaaS dashboard", domain="style")

# Auto-detect domain
result = search("What colors work for e-commerce?")

# Search stack-specific guidelines
result = search_stack("memoization performance", "react")
```

### Generate Complete Design System

```python
from scripts.design_system import generate_design_system

# Generate markdown design system
system = generate_design_system(
    "SaaS dashboard",
    project_name="My Project",
    output_format="markdown"
)

# Persist to disk with overrides
generate_design_system(
    "E-commerce store",
    "My Shop",
    persist=True,
    page="product-detail"
)
```

## Data Files

All CSV data files have been populated with:
- **Proper headers** matching the schema in core.py
- **Sample data** for each category
- **Real-world examples** and best practices

### Syncing Latest Data

To update the CSV files with the latest data from GitHub:

```bash
python3 data/_sync_all.py
```

## Integration Notes

- **Python 3.7+** required
- **No external dependencies** - uses only Python standard library
- **Thread-safe**: Multiple concurrent searches supported
- **Performance**: BM25 index built on-demand, cached results

## What's Next?

1. **Create SKILL.md** - Add skill metadata and usage instructions
2. **Test Search** - Try different search queries to understand the data
3. **Customize Data** - Edit CSV files to match your brand guidelines
4. **Build Skills** - Use the design system generator in your Claude prompts
5. **Extend Stack Data** - Add custom framework guidelines

## Troubleshooting

If modules don't import:
```bash
cd .claude/skills/ui-ux-pro-max
python3 -c "from scripts.core import search; print('OK')"
```

If search returns no results:
- Check that CSV files are in the `data/` directory
- Verify file permissions with `ls -la data/`
- Ensure search_cols in core.py match CSV headers

## Support

For the latest version and updates:
https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

## License

This skill is provided as-is. See LICENSE file for details.
