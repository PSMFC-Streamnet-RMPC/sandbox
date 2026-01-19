#!/usr/bin/env python3
"""
Table Generator for Technical Documentation

Generates clean, styled tables as images.
Perfect for data snapshots in documentation where you need
precise numbers in a visually consistent format.

Usage:
    python3 table.py --data '[{"Name": "A", "Value": 100}]' --title "Data"
    python3 table.py --csv data.csv --title "Report" --color teal

Examples:
    # Simple table from JSON
    python3 table.py \
        --data '[{"Year": "2022", "Count": 1200}, {"Year": "2023", "Count": 1850}]' \
        --title "Salmon Counts" \
        --color teal \
        --output ./counts-table.png

    # From CSV
    python3 table.py \
        --csv quarterly_report.csv \
        --title "Q4 Results" \
        --highlight-column "Change" \
        --output ./q4-table.png

    # With row highlighting
    python3 table.py \
        --data '[{"Status": "Active", "Count": 45}, {"Status": "Pending", "Count": 12}]' \
        --title "Status Summary" \
        --highlight-max "Count" \
        --output ./status-table.png
"""

import argparse
import json
import sys
from pathlib import Path

try:
    import matplotlib.pyplot as plt
    import matplotlib.patches as mpatches
    import numpy as np
except ImportError:
    print("Error: matplotlib and numpy are required.")
    print("Install with: pip3 install matplotlib numpy")
    sys.exit(1)

# Add scripts directory to path for style import
sys.path.insert(0, str(Path(__file__).parent))
from style import (
    get_color, create_figure, save_figure, apply_chart_style,
    COLORS, NEUTRALS, FONT_SIZES
)


def load_data_from_json(json_str: str) -> list:
    """Load data from JSON string. Returns list of dicts."""
    try:
        data = json.loads(json_str)
        if isinstance(data, list):
            return data
        elif isinstance(data, dict):
            # Convert single dict to list
            return [data]
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        sys.exit(1)


def load_data_from_csv(csv_path: str) -> list:
    """Load data from CSV file. Returns list of dicts."""
    try:
        import csv
        with open(csv_path, 'r') as f:
            reader = csv.DictReader(f)
            return list(reader)
    except FileNotFoundError:
        print(f"Error: CSV file not found: {csv_path}")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading CSV: {e}")
        sys.exit(1)


def create_table(
    data: list,
    title: str = None,
    color: str = "teal",
    highlight_column: str = None,
    highlight_max: str = None,
    highlight_min: str = None,
    output_path: str = None,
    width: float = None,
    max_col_width: int = 20
) -> str:
    """
    Create a styled table image.

    Args:
        data: List of dicts (rows)
        title: Table title
        color: Accent color for header
        highlight_column: Column name to highlight with color
        highlight_max: Column name - highlight row with max value
        highlight_min: Column name - highlight row with min value
        output_path: Path to save the table image
        width: Figure width (auto-calculated if None)
        max_col_width: Max characters before truncating

    Returns:
        Path to saved image
    """

    if not data:
        print("Error: No data provided")
        sys.exit(1)

    # Extract columns and rows
    columns = list(data[0].keys())
    rows = [[str(row.get(col, ''))[:max_col_width] for col in columns] for row in data]

    # Calculate figure size based on content
    n_cols = len(columns)
    n_rows = len(rows)

    if width is None:
        # Estimate width based on content
        max_col_lens = [max(len(col), max(len(str(row[i])) for row in rows))
                        for i, col in enumerate(columns)]
        width = max(6, min(14, sum(max_col_lens) * 0.15 + 1))

    height = max(2, 0.4 * (n_rows + 2))  # +2 for header and padding

    # Create figure
    apply_chart_style()
    fig, ax = plt.subplots(figsize=(width, height), dpi=150)
    ax.axis('off')

    # Colors
    header_color = get_color(color, "primary")
    header_text = 'white'
    alt_row_color = NEUTRALS["background_alt"]
    cell_text_color = NEUTRALS["text"]

    # Find highlight row if specified
    highlight_row_idx = None
    if highlight_max and highlight_max in columns:
        col_idx = columns.index(highlight_max)
        try:
            values = [float(row[col_idx]) for row in rows]
            highlight_row_idx = values.index(max(values))
        except (ValueError, TypeError):
            pass
    elif highlight_min and highlight_min in columns:
        col_idx = columns.index(highlight_min)
        try:
            values = [float(row[col_idx]) for row in rows]
            highlight_row_idx = values.index(min(values))
        except (ValueError, TypeError):
            pass

    # Create table
    table = ax.table(
        cellText=rows,
        colLabels=columns,
        cellLoc='center',
        loc='center',
        colColours=[header_color] * n_cols,
    )

    # Style the table
    table.auto_set_font_size(False)
    table.set_fontsize(FONT_SIZES["label"])
    table.scale(1.2, 1.8)

    # Style cells
    for i in range(n_rows + 1):  # +1 for header
        for j in range(n_cols):
            cell = table[i, j]

            if i == 0:
                # Header row
                cell.set_text_props(color=header_text, fontweight='bold')
                cell.set_facecolor(header_color)
            else:
                # Data rows
                row_idx = i - 1

                # Alternating row colors
                if row_idx % 2 == 1:
                    cell.set_facecolor(alt_row_color)
                else:
                    cell.set_facecolor(NEUTRALS["background"])

                # Highlight specific row
                if row_idx == highlight_row_idx:
                    cell.set_facecolor(get_color(color, "light"))

                # Highlight specific column
                if highlight_column and columns[j] == highlight_column:
                    cell.set_text_props(color=header_color, fontweight='bold')
                else:
                    cell.set_text_props(color=cell_text_color)

            # Border
            cell.set_edgecolor(NEUTRALS["grid"])
            cell.set_linewidth(0.5)

    # Add title
    if title:
        ax.set_title(
            title,
            fontsize=FONT_SIZES["title"],
            fontweight='medium',
            color=NEUTRALS["text"],
            pad=20
        )

    # Determine output path
    if output_path is None:
        output_path = f"table-{color}.png"

    # Save
    fig.tight_layout()
    fig.savefig(
        output_path,
        facecolor=NEUTRALS["background"],
        edgecolor='none',
        bbox_inches='tight',
        pad_inches=0.3
    )
    plt.close(fig)
    print(f"Table saved to: {output_path}")
    return output_path


def main():
    parser = argparse.ArgumentParser(
        description="Generate styled table images for technical documentation",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s --data '[{"Name": "A", "Value": 100}, {"Name": "B", "Value": 200}]'
  %(prog)s --csv data.csv --title "Report" --highlight-max "Value"
  %(prog)s --data '[...]' --color coral --highlight-column "Status"

Available colors: coral, teal, indigo, amber
        """
    )

    # Data source (one required)
    data_group = parser.add_mutually_exclusive_group(required=True)
    data_group.add_argument(
        "--data", "-d",
        help='JSON array: \'[{"col1": "val1", "col2": "val2"}, ...]\''
    )
    data_group.add_argument(
        "--csv",
        help="Path to CSV file"
    )

    # Display options
    parser.add_argument(
        "--title", "-t",
        help="Table title"
    )
    parser.add_argument(
        "--color", "-c",
        default="teal",
        choices=list(COLORS.keys()),
        help="Header color (default: teal)"
    )
    parser.add_argument(
        "--highlight-column",
        help="Column name to highlight with accent color"
    )
    parser.add_argument(
        "--highlight-max",
        help="Highlight row with maximum value in this column"
    )
    parser.add_argument(
        "--highlight-min",
        help="Highlight row with minimum value in this column"
    )
    parser.add_argument(
        "--output", "-o",
        help="Output file path (default: auto-generated)"
    )
    parser.add_argument(
        "--width",
        type=float,
        help="Figure width in inches (default: auto)"
    )

    args = parser.parse_args()

    # Load data
    if args.data:
        data = load_data_from_json(args.data)
    else:
        data = load_data_from_csv(args.csv)

    # Create table
    create_table(
        data=data,
        title=args.title,
        color=args.color,
        highlight_column=args.highlight_column,
        highlight_max=args.highlight_max,
        highlight_min=args.highlight_min,
        output_path=args.output,
        width=args.width
    )


if __name__ == "__main__":
    main()
