#!/usr/bin/env python3
"""
Line Chart Generator for Technical Documentation

Generates clean, precise line charts with consistent styling.
Supports single or multiple data series.

Usage:
    python3 line_chart.py --data '{"2020": 100, "2021": 150}' --title "Growth"
    python3 line_chart.py --csv data.csv --title "Trends" --color coral

Examples:
    # Simple line chart from JSON
    python3 line_chart.py \
        --data '{"Jan": 100, "Feb": 120, "Mar": 115, "Apr": 140}' \
        --title "Monthly Active Users" \
        --color teal \
        --output ./mau-chart.png

    # Multi-series from JSON
    python3 line_chart.py \
        --series '{"Sales": {"Q1": 100, "Q2": 150}, "Costs": {"Q1": 80, "Q2": 90}}' \
        --title "Sales vs Costs" \
        --output ./comparison.png

    # With markers and area fill
    python3 line_chart.py \
        --data '{"2020": 1000, "2021": 1500, "2022": 2200, "2023": 3000}' \
        --title "User Growth" \
        --markers \
        --fill \
        --output ./growth.png
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


def load_single_series(json_str: str) -> tuple:
    """Load single series from JSON. Returns (labels, values)."""
    try:
        data = json.loads(json_str)
        if isinstance(data, dict):
            return list(data.keys()), list(data.values())
        elif isinstance(data, list):
            return list(range(len(data))), data
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        sys.exit(1)


def load_multi_series(json_str: str) -> dict:
    """Load multiple series from JSON. Returns {name: {label: value}}."""
    try:
        data = json.loads(json_str)
        return data
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        sys.exit(1)


def load_data_from_csv(csv_path: str, x_column: str = None, y_columns: list = None) -> tuple:
    """Load data from CSV. Returns (labels, {series_name: values})."""
    try:
        import csv
        with open(csv_path, 'r') as f:
            reader = csv.DictReader(f)
            rows = list(reader)

            if not rows:
                print("Error: CSV file is empty")
                sys.exit(1)

            columns = list(rows[0].keys())
            x_col = x_column or columns[0]

            # If no y_columns specified, use all except x_column
            if y_columns:
                y_cols = y_columns
            else:
                y_cols = [c for c in columns if c != x_col]

            labels = [row[x_col] for row in rows]
            series = {}
            for y_col in y_cols:
                series[y_col] = [float(row[y_col]) for row in rows]

            return labels, series

    except FileNotFoundError:
        print(f"Error: CSV file not found: {csv_path}")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading CSV: {e}")
        sys.exit(1)


def create_line_chart(
    labels: list,
    series: dict,
    title: str = None,
    xlabel: str = None,
    ylabel: str = None,
    color: str = "teal",
    markers: bool = False,
    fill: bool = False,
    smooth: bool = False,
    output_path: str = None,
    width: float = 10,
    height: float = 6
) -> str:
    """
    Create a line chart with consistent styling.

    Args:
        labels: List of x-axis labels
        series: Dict of {series_name: [values]} for multi-series,
                or just [values] for single series
        title: Chart title
        xlabel: X-axis label
        ylabel: Y-axis label
        color: Base color name (coral, teal, indigo, amber)
        markers: If True, show data point markers
        fill: If True, fill area under line (single series only)
        smooth: If True, use smooth interpolation
        output_path: Path to save the chart
        width: Figure width in inches
        height: Figure height in inches

    Returns:
        Path to saved chart
    """

    # Create figure
    fig, ax = create_figure(width=width, height=height)

    # Handle single series passed as list
    if isinstance(series, list):
        series = {"Data": series}

    # Get colors for each series
    colors = get_color_sequence(color, len(series))

    x = np.arange(len(labels))

    # Plot each series
    for i, (name, values) in enumerate(series.items()):
        line_color = colors[i]

        # Marker style
        marker = 'o' if markers else None
        markersize = 6 if markers else 0

        # Plot line
        line, = ax.plot(
            x, values,
            color=line_color,
            marker=marker,
            markersize=markersize,
            markerfacecolor='white',
            markeredgecolor=line_color,
            markeredgewidth=2,
            linewidth=2.5,
            label=name if len(series) > 1 else None
        )

        # Fill area under line (single series only)
        if fill and len(series) == 1:
            ax.fill_between(
                x, values,
                color=line_color,
                alpha=0.15
            )

    # Set x-axis
    ax.set_xticks(x)
    ax.set_xticklabels(labels)

    # Apply styling
    style_axis(ax, title=title, xlabel=xlabel, ylabel=ylabel)

    # Both grids for line charts
    ax.yaxis.grid(True, linestyle='-', alpha=0.7)
    ax.xaxis.grid(True, linestyle='-', alpha=0.3)

    # Legend for multi-series
    if len(series) > 1:
        ax.legend(loc='upper left', frameon=False)

    # Determine output path
    if output_path is None:
        output_path = f"line-chart-{color}.png"

    # Save
    save_figure(fig, output_path)
    return output_path


def main():
    parser = argparse.ArgumentParser(
        description="Generate styled line charts for technical documentation",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s --data '{"Jan": 100, "Feb": 150, "Mar": 200}' --title "Monthly Trend"
  %(prog)s --series '{"A": {"x": 1, "y": 2}, "B": {"x": 2, "y": 3}}' --title "Comparison"
  %(prog)s --csv data.csv --title "From CSV" --markers --fill

Available colors: coral, teal, indigo, amber
        """
    )

    # Data source (one required)
    data_group = parser.add_mutually_exclusive_group(required=True)
    data_group.add_argument(
        "--data", "-d",
        help='Single series JSON: \'{"label1": value1, "label2": value2}\''
    )
    data_group.add_argument(
        "--series", "-s",
        help='Multi-series JSON: \'{"Series1": {...}, "Series2": {...}}\''
    )
    data_group.add_argument(
        "--csv",
        help="Path to CSV file"
    )

    # CSV options
    parser.add_argument(
        "--x-column",
        help="Column name for x-axis labels (CSV only)"
    )
    parser.add_argument(
        "--y-columns",
        help="Comma-separated column names for y values (CSV only)"
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
        help="Line color (default: teal)"
    )
    parser.add_argument(
        "--markers", "-m",
        action="store_true",
        help="Show data point markers"
    )
    parser.add_argument(
        "--fill", "-f",
        action="store_true",
        help="Fill area under line (single series only)"
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
        labels, values = load_single_series(args.data)
        series = {"Data": values}
    elif args.series:
        multi = load_multi_series(args.series)
        # Extract labels from first series
        first_series = list(multi.values())[0]
        labels = list(first_series.keys())
        series = {name: list(data.values()) for name, data in multi.items()}
    else:
        y_cols = args.y_columns.split(',') if args.y_columns else None
        labels, series = load_data_from_csv(args.csv, args.x_column, y_cols)

    # Create chart
    create_line_chart(
        labels=labels,
        series=series,
        title=args.title,
        xlabel=args.xlabel,
        ylabel=args.ylabel,
        color=args.color,
        markers=args.markers,
        fill=args.fill,
        output_path=args.output,
        width=args.width,
        height=args.height
    )


if __name__ == "__main__":
    main()
