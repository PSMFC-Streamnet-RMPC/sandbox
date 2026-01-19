#!/usr/bin/env python3
"""
Bar Chart Generator for Technical Documentation

Generates clean, precise bar charts with consistent styling.

Usage:
    python3 bar_chart.py --data '{"2020": 100, "2021": 150}' --title "Growth"
    python3 bar_chart.py --csv data.csv --title "Sales by Region" --color coral

Examples:
    # Simple bar chart from JSON
    python3 bar_chart.py \
        --data '{"Q1": 1200, "Q2": 1850, "Q3": 2400, "Q4": 3100}' \
        --title "Quarterly Revenue" \
        --color teal \
        --output ./revenue-chart.png

    # Horizontal bar chart
    python3 bar_chart.py \
        --data '{"Engineering": 45, "Sales": 32, "Marketing": 28}' \
        --title "Team Size by Department" \
        --horizontal \
        --output ./team-size.png

    # From CSV file
    python3 bar_chart.py \
        --csv sales_data.csv \
        --x-column "Month" \
        --y-column "Revenue" \
        --title "Monthly Revenue" \
        --output ./monthly-revenue.png
"""

import argparse
import json
import sys
from pathlib import Path

try:
    import matplotlib.pyplot as plt
    import numpy as np
except ImportError:
    print("Error: matplotlib and numpy are required.")
    print("Install with: pip3 install matplotlib numpy")
    sys.exit(1)

# Add scripts directory to path for style import
sys.path.insert(0, str(Path(__file__).parent))
from style import (
    get_color, get_color_sequence, create_figure, style_axis, save_figure,
    COLORS, NEUTRALS
)


def load_data_from_json(json_str: str) -> tuple:
    """Load data from JSON string. Returns (labels, values)."""
    try:
        data = json.loads(json_str)
        if isinstance(data, dict):
            return list(data.keys()), list(data.values())
        elif isinstance(data, list):
            # Assume list of dicts with 'label' and 'value' keys
            labels = [item.get('label', str(i)) for i, item in enumerate(data)]
            values = [item.get('value', 0) for item in data]
            return labels, values
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        sys.exit(1)


def load_data_from_csv(csv_path: str, x_column: str = None, y_column: str = None) -> tuple:
    """Load data from CSV file. Returns (labels, values)."""
    try:
        import csv
        with open(csv_path, 'r') as f:
            reader = csv.DictReader(f)
            rows = list(reader)

            if not rows:
                print("Error: CSV file is empty")
                sys.exit(1)

            # Use first and second columns if not specified
            columns = list(rows[0].keys())
            x_col = x_column or columns[0]
            y_col = y_column or columns[1]

            labels = [row[x_col] for row in rows]
            values = [float(row[y_col]) for row in rows]
            return labels, values

    except FileNotFoundError:
        print(f"Error: CSV file not found: {csv_path}")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading CSV: {e}")
        sys.exit(1)


def create_bar_chart(
    labels: list,
    values: list,
    title: str = None,
    xlabel: str = None,
    ylabel: str = None,
    color: str = "teal",
    horizontal: bool = False,
    show_values: bool = True,
    output_path: str = None,
    width: float = 10,
    height: float = 6
) -> str:
    """
    Create a bar chart with consistent styling.

    Args:
        labels: List of category labels
        values: List of numeric values
        title: Chart title
        xlabel: X-axis label
        ylabel: Y-axis label
        color: Color name (coral, teal, indigo, amber)
        horizontal: If True, create horizontal bar chart
        show_values: If True, display values on bars
        output_path: Path to save the chart
        width: Figure width in inches
        height: Figure height in inches

    Returns:
        Path to saved chart
    """

    # Create figure
    fig, ax = create_figure(width=width, height=height)

    # Get color
    bar_color = get_color(color, "primary")

    # Create bars
    x = np.arange(len(labels))
    bar_width = 0.7

    if horizontal:
        bars = ax.barh(x, values, height=bar_width, color=bar_color)
        ax.set_yticks(x)
        ax.set_yticklabels(labels)
        ax.invert_yaxis()  # Top to bottom

        # Value labels
        if show_values:
            for bar, val in zip(bars, values):
                ax.text(
                    bar.get_width() + max(values) * 0.02,
                    bar.get_y() + bar.get_height() / 2,
                    f'{val:,.0f}' if isinstance(val, (int, float)) else str(val),
                    va='center',
                    ha='left',
                    fontsize=9,
                    color=NEUTRALS["text_secondary"]
                )

        # Swap axis labels for horizontal
        xlabel, ylabel = ylabel, xlabel

        # Grid on x-axis for horizontal
        ax.xaxis.grid(True, linestyle='-', alpha=0.7)
        ax.yaxis.grid(False)

    else:
        bars = ax.bar(x, values, width=bar_width, color=bar_color)
        ax.set_xticks(x)
        ax.set_xticklabels(labels)

        # Value labels on top of bars
        if show_values:
            for bar, val in zip(bars, values):
                ax.text(
                    bar.get_x() + bar.get_width() / 2,
                    bar.get_height() + max(values) * 0.02,
                    f'{val:,.0f}' if isinstance(val, (int, float)) else str(val),
                    ha='center',
                    va='bottom',
                    fontsize=9,
                    color=NEUTRALS["text_secondary"]
                )

    # Apply styling
    style_axis(ax, title=title, xlabel=xlabel, ylabel=ylabel)

    # Determine output path
    if output_path is None:
        output_path = f"bar-chart-{color}.png"

    # Save
    save_figure(fig, output_path)
    return output_path


def main():
    parser = argparse.ArgumentParser(
        description="Generate styled bar charts for technical documentation",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s --data '{"Q1": 100, "Q2": 150, "Q3": 200}' --title "Quarterly Sales"
  %(prog)s --data '{"A": 10, "B": 20, "C": 15}' --color coral --horizontal
  %(prog)s --csv data.csv --x-column "Category" --y-column "Value"

Available colors: coral, teal, indigo, amber
        """
    )

    # Data source (one required)
    data_group = parser.add_mutually_exclusive_group(required=True)
    data_group.add_argument(
        "--data", "-d",
        help='JSON data: \'{"label1": value1, "label2": value2}\''
    )
    data_group.add_argument(
        "--csv",
        help="Path to CSV file"
    )

    # CSV options
    parser.add_argument(
        "--x-column",
        help="Column name for labels (CSV only)"
    )
    parser.add_argument(
        "--y-column",
        help="Column name for values (CSV only)"
    )

    # Chart options
    parser.add_argument(
        "--title", "-t",
        help="Chart title"
    )
    parser.add_argument(
        "--xlabel", "-x",
        help="X-axis label"
    )
    parser.add_argument(
        "--ylabel", "-y",
        help="Y-axis label"
    )
    parser.add_argument(
        "--color", "-c",
        default="teal",
        choices=list(COLORS.keys()),
        help="Bar color (default: teal)"
    )
    parser.add_argument(
        "--horizontal", "-H",
        action="store_true",
        help="Create horizontal bar chart"
    )
    parser.add_argument(
        "--no-values",
        action="store_true",
        help="Hide value labels on bars"
    )
    parser.add_argument(
        "--output", "-o",
        help="Output file path (default: auto-generated)"
    )
    parser.add_argument(
        "--width",
        type=float,
        default=10,
        help="Figure width in inches (default: 10)"
    )
    parser.add_argument(
        "--height",
        type=float,
        default=6,
        help="Figure height in inches (default: 6)"
    )

    args = parser.parse_args()

    # Load data
    if args.data:
        labels, values = load_data_from_json(args.data)
    else:
        labels, values = load_data_from_csv(args.csv, args.x_column, args.y_column)

    # Create chart
    create_bar_chart(
        labels=labels,
        values=values,
        title=args.title,
        xlabel=args.xlabel,
        ylabel=args.ylabel,
        color=args.color,
        horizontal=args.horizontal,
        show_values=not args.no_values,
        output_path=args.output,
        width=args.width,
        height=args.height
    )


if __name__ == "__main__":
    main()
