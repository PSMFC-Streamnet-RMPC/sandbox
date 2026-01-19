# Tech Doc Charts

Generate precise, styled charts and tables for technical documentation using matplotlib.

This skill complements `tech-doc-illustrator` by providing **data-accurate** visualizations that share the same color palette but use clean, precise rendering instead of the hand-drawn aesthetic.

## When to Use

- **Use this skill** for actual data: numbers, comparisons, trends, tables
- **Use tech-doc-illustrator** for conceptual illustrations, diagrams, icons

## Available Charts

### Bar Chart
```bash
python3 .claude/skills/tech-doc-charts/scripts/bar_chart.py \
  --data '{"Q1": 1200, "Q2": 1850, "Q3": 2400, "Q4": 3100}' \
  --title "Quarterly Revenue" \
  --ylabel "Revenue ($)" \
  --color teal \
  --output ./revenue.png
```

Options:
- `--data` or `--csv`: Data source (JSON or CSV file)
- `--title`: Chart title
- `--xlabel`, `--ylabel`: Axis labels
- `--color`: coral, teal, indigo, amber
- `--horizontal`: Create horizontal bar chart
- `--no-values`: Hide value labels on bars
- `--width`, `--height`: Figure dimensions

### Line Chart
```bash
python3 .claude/skills/tech-doc-charts/scripts/line_chart.py \
  --data '{"Jan": 100, "Feb": 120, "Mar": 115, "Apr": 140, "May": 180}' \
  --title "Monthly Active Users" \
  --markers \
  --fill \
  --color teal \
  --output ./mau.png
```

Multi-series example:
```bash
python3 .claude/skills/tech-doc-charts/scripts/line_chart.py \
  --series '{"Revenue": {"Q1": 100, "Q2": 150, "Q3": 180}, "Costs": {"Q1": 80, "Q2": 90, "Q3": 95}}' \
  --title "Revenue vs Costs" \
  --output ./comparison.png
```

Options:
- `--data`: Single series JSON
- `--series`: Multi-series JSON
- `--csv`: CSV file with multiple columns
- `--markers`: Show data point markers
- `--fill`: Fill area under line (single series)
- `--color`: Base color for series

### Table
```bash
python3 .claude/skills/tech-doc-charts/scripts/table.py \
  --data '[{"Year": "2022", "Count": 1200, "Change": "+5%"}, {"Year": "2023", "Count": 1850, "Change": "+54%"}]' \
  --title "Salmon Population" \
  --highlight-column "Change" \
  --color teal \
  --output ./population-table.png
```

Options:
- `--data`: JSON array of objects
- `--csv`: CSV file path
- `--highlight-column`: Column to highlight with accent color
- `--highlight-max`: Highlight row with max value in column
- `--highlight-min`: Highlight row with min value in column
- `--color`: Header/accent color

## Color Palette

All charts use the same palette as tech-doc-illustrator:

| Color  | Hex       | Use For                           |
|--------|-----------|-----------------------------------|
| coral  | #e85d3b   | Errors, action, important items   |
| teal   | #0d9488   | Data flow, success, connectivity  |
| indigo | #6366f1   | AI/ML, security, advanced topics  |
| amber  | #eab308   | Warnings, config, attention       |

## CSV Format

Charts can read data from CSV files:

```csv
Month,Revenue,Costs
Jan,1000,800
Feb,1200,850
Mar,1100,820
```

```bash
# Bar chart from CSV
python3 bar_chart.py --csv data.csv --x-column Month --y-column Revenue

# Line chart from CSV (multiple series)
python3 line_chart.py --csv data.csv --x-column Month

# Table from CSV
python3 table.py --csv data.csv --title "Monthly Report"
```

## Dependencies

```bash
pip3 install matplotlib numpy
```

## Workflow

1. **Gather data**: Get the numbers from the user or source
2. **Choose chart type**: Bar for comparisons, Line for trends, Table for exact values
3. **Select color**: Match the semantic meaning (teal for data, coral for warnings, etc.)
4. **Generate**: Run the appropriate script
5. **Iterate**: Adjust title, labels, or styling as needed

## Example Prompts

User: "Create a chart showing our quarterly salmon counts"
→ Use bar_chart.py with their data

User: "I need a table comparing the old vs new configuration values"
→ Use table.py with highlight-column for the differences

User: "Show the trend of fish ladder usage over the past 5 years"
→ Use line_chart.py with markers and possibly fill
