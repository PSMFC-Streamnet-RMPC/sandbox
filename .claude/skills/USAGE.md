# Tech Documentation Visual Skills - Usage Guide

Two complementary skills for creating consistent visuals for technical documentation.

## Overview

| Skill | Purpose | Style | Best For |
|-------|---------|-------|----------|
| **tech-doc-illustrator** | AI-generated illustrations | Hand-drawn, conceptual | Diagrams, icons, scenes, concepts |
| **tech-doc-charts** | Code-generated data viz | Clean, precise | Bar charts, line charts, tables |

Both share the same **color palette** for visual consistency.

---

## Color Palette

| Color  | Hex       | When to Use                              |
|--------|-----------|------------------------------------------|
| coral  | `#e85d3b` | Errors, action, warnings, important items |
| teal   | `#0d9488` | Data flow, success, connectivity, default |
| indigo | `#6366f1` | AI/ML, security, advanced concepts        |
| amber  | `#eab308` | Warnings, configuration, attention        |

---

## tech-doc-illustrator

AI-generated illustrations using Google's Imagen API.

### Setup

```bash
# Install dependencies
pip3 install google-genai

# Optional: for transparent backgrounds
pip3 install "rembg[cpu]"

# Set API key (add to ~/.zshrc for persistence)
export GOOGLE_API_KEY="your-key-here"
```

### Basic Usage

```bash
cd ~/Projects/github-work/sandbox

python3 .claude/skills/tech-doc-illustrator/scripts/generate.py \
  --prompt "Your description here" \
  --color teal \
  --output ./my-image.png
```

### Options

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--prompt` | `-p` | Image description (required) | - |
| `--color` | `-c` | Accent color | coral |
| `--type` | `-t` | Illustration type | diagram |
| `--style` | `-s` | Visual aesthetic | hand-drawn |
| `--aspect-ratio` | `-a` | Image dimensions | 16:9 |
| `--output` | `-o` | Output file path | auto |
| `--transparent` | - | Remove background | false |
| `--verbose` | `-v` | Show full prompt | false |
| `--fast` | - | Use faster model | false |

### Illustration Types

| Type | Best For |
|------|----------|
| `diagram` | Technical diagrams, flowcharts, system layouts |
| `scene` | Contextual illustrations with environment |
| `icon` | Simple, bold icons (use 1:1 aspect ratio) |
| `process` | Step-by-step workflows |
| `architecture` | System architecture, layered components |
| `concept` | Abstract ideas, metaphorical representations |

### Visual Styles

| Style | Aesthetic |
|-------|-----------|
| `hand-drawn` | Sketchy lines, warm off-white background, minimal |
| `corporate-flat` | Notion/Slack style, soft shapes, no outlines |
| `blueprint` | Engineering drawing, dark blue background, white lines |

### Examples

```bash
# Simple diagram
python3 generate.py \
  --prompt "Three connected database tables" \
  --color teal \
  --type diagram \
  --output ./db-diagram.png

# Icon with transparency
python3 generate.py \
  --prompt "A salmon fish jumping" \
  --color coral \
  --type icon \
  --aspect-ratio 1:1 \
  --transparent \
  --output ./salmon-icon.png

# Blueprint style
python3 generate.py \
  --prompt "Network topology with firewall" \
  --style blueprint \
  --color teal \
  --output ./network-blueprint.png

# Corporate flat style
python3 generate.py \
  --prompt "Team collaborating on project" \
  --style corporate-flat \
  --color indigo \
  --output ./team-collab.png
```

### Tips for Better Results

1. **Be specific** - "Three servers connected to a load balancer" beats "server architecture"
2. **Describe relationships** - "A flowing from B to C" creates better diagrams
3. **Add context** - "Scientists counting salmon at observation window" adds scene detail
4. **Request no text** - Add "no text, no labels" if you want to add your own
5. **Iterate** - Same prompt generates different results; run multiple times

### Transparent Backgrounds

Two approaches:

**Option A: Built-in (rembg)**
```bash
python3 generate.py --prompt "..." --transparent --output ./image.png
```
Creates a "sticker" effect with slight edge artifacts.

**Option B: Photopea (cleaner)**
1. Open image at photopea.com
2. Double-click Background layer to convert it
3. Magic Wand tool → click background
4. Edit → Clear
5. Image → Trim (removes whitespace)
6. File → Export as → PNG

---

## tech-doc-charts

Code-generated charts using matplotlib. Precise, data-accurate.

### Setup

```bash
pip3 install matplotlib numpy
```

### Bar Chart

```bash
python3 .claude/skills/tech-doc-charts/scripts/bar_chart.py \
  --data '{"Q1": 1200, "Q2": 1850, "Q3": 2400, "Q4": 3100}' \
  --title "Quarterly Revenue" \
  --ylabel "Revenue ($)" \
  --color teal \
  --output ./revenue.png
```

| Flag | Description |
|------|-------------|
| `--data` | JSON: `'{"label": value, ...}'` |
| `--csv` | CSV file path (alternative to --data) |
| `--title` | Chart title |
| `--xlabel`, `--ylabel` | Axis labels |
| `--color` | Bar color |
| `--horizontal` | Horizontal bars |
| `--no-values` | Hide value labels |
| `--width`, `--height` | Figure size (inches) |

### Line Chart

```bash
# Single series
python3 .claude/skills/tech-doc-charts/scripts/line_chart.py \
  --data '{"Jan": 100, "Feb": 120, "Mar": 140, "Apr": 130}' \
  --title "Monthly Trend" \
  --markers \
  --fill \
  --color teal \
  --output ./trend.png

# Multiple series
python3 .claude/skills/tech-doc-charts/scripts/line_chart.py \
  --series '{"Revenue": {"Q1": 100, "Q2": 150}, "Costs": {"Q1": 80, "Q2": 90}}' \
  --title "Revenue vs Costs" \
  --output ./comparison.png
```

| Flag | Description |
|------|-------------|
| `--data` | Single series JSON |
| `--series` | Multi-series JSON |
| `--csv` | CSV file path |
| `--markers` | Show data points |
| `--fill` | Fill area under line |

### Table

```bash
python3 .claude/skills/tech-doc-charts/scripts/table.py \
  --data '[{"Year": "2022", "Count": 1200}, {"Year": "2023", "Count": 1850}]' \
  --title "Annual Data" \
  --highlight-max "Count" \
  --color teal \
  --output ./data-table.png
```

| Flag | Description |
|------|-------------|
| `--data` | JSON array: `'[{"col": "val"}, ...]'` |
| `--csv` | CSV file path |
| `--highlight-column` | Color a specific column |
| `--highlight-max` | Highlight row with max value |
| `--highlight-min` | Highlight row with min value |

### CSV Format

All chart scripts accept `--csv` for file input:

```csv
Month,Revenue,Costs
Jan,1000,800
Feb,1200,850
Mar,1100,820
```

```bash
# Specify columns
python3 bar_chart.py --csv data.csv --x-column Month --y-column Revenue

# Line chart uses all numeric columns as series
python3 line_chart.py --csv data.csv --x-column Month
```

---

## Decision Guide

| Need | Use | Example |
|------|-----|---------|
| Explain a concept | illustrator | "How authentication flows work" |
| Show actual numbers | charts | Quarterly sales data |
| Create an icon | illustrator + icon type | App feature icon |
| Compare values | charts + bar | Department budgets |
| Show a trend | charts + line | User growth over time |
| Data snapshot | charts + table | Configuration values |
| System diagram | illustrator + architecture | Microservices layout |
| Process flow | illustrator + process | Deployment pipeline |

---

## File Locations

```
~/Projects/github-work/sandbox/.claude/skills/
├── tech-doc-illustrator/
│   ├── SKILL.md
│   ├── README.md          # How repeatable aesthetics work
│   ├── scripts/
│   │   └── generate.py
│   └── references/
│       ├── colors.md
│       ├── style-guide.md
│       ├── concept-mapping.md
│       └── example-prompts.md
│
├── tech-doc-charts/
│   ├── SKILL.md
│   └── scripts/
│       ├── style.py       # Shared styling
│       ├── bar_chart.py
│       ├── line_chart.py
│       └── table.py
│
└── USAGE.md               # This file
```

---

## Quick Reference

```bash
# Illustration
python3 .claude/skills/tech-doc-illustrator/scripts/generate.py \
  --prompt "DESCRIPTION" --color COLOR --type TYPE --output FILE

# Bar Chart
python3 .claude/skills/tech-doc-charts/scripts/bar_chart.py \
  --data 'JSON' --title "TITLE" --color COLOR --output FILE

# Line Chart
python3 .claude/skills/tech-doc-charts/scripts/line_chart.py \
  --data 'JSON' --title "TITLE" --markers --output FILE

# Table
python3 .claude/skills/tech-doc-charts/scripts/table.py \
  --data 'JSON_ARRAY' --title "TITLE" --output FILE
```

Colors: `coral` | `teal` | `indigo` | `amber`
