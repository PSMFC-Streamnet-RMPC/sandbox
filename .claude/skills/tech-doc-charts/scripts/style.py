"""
Shared styling module for tech-doc-charts skill.

Provides consistent colors, fonts, and matplotlib style settings
that complement the tech-doc-illustrator hand-drawn aesthetic
while being precise and data-accurate.
"""

import matplotlib.pyplot as plt
import matplotlib.font_manager as fm

# Brand color palette (matches tech-doc-illustrator)
COLORS = {
    "coral": {
        "primary": "#e85d3b",
        "light": "#f5a894",
        "dark": "#c44a2d",
        "usage": "Energy, action, important highlights"
    },
    "teal": {
        "primary": "#0d9488",
        "light": "#5eead4",
        "dark": "#0a756b",
        "usage": "Technology, connectivity, data flow"
    },
    "indigo": {
        "primary": "#6366f1",
        "light": "#a5b4fc",
        "dark": "#4f46e5",
        "usage": "Intelligence, depth, advanced concepts"
    },
    "amber": {
        "primary": "#eab308",
        "light": "#fde047",
        "dark": "#ca8a04",
        "usage": "Warnings, attention, configuration"
    }
}

# Neutral colors for backgrounds, text, grids
NEUTRALS = {
    "background": "#fafaf9",      # Warm off-white (matches illustrations)
    "background_alt": "#f5f5f4",  # Slightly darker for alternating rows
    "text": "#1c1917",            # Near black
    "text_secondary": "#57534e",  # Gray for secondary text
    "grid": "#e7e5e4",            # Light gray for grid lines
    "border": "#d6d3d1",          # Border color
}

# Typography
FONT_FAMILY = "sans-serif"  # Will use system sans-serif
FONT_SIZES = {
    "title": 16,
    "subtitle": 12,
    "label": 10,
    "tick": 9,
    "annotation": 8,
}


def get_color(name: str, variant: str = "primary") -> str:
    """Get a color by name and variant (primary, light, dark)."""
    if name.lower() in COLORS:
        return COLORS[name.lower()].get(variant, COLORS[name.lower()]["primary"])
    return COLORS["teal"]["primary"]  # Default


def get_color_sequence(base_color: str, count: int) -> list:
    """Generate a sequence of colors for multi-series charts."""
    color_order = ["teal", "coral", "indigo", "amber"]

    # Start with the requested color
    if base_color.lower() in color_order:
        color_order.remove(base_color.lower())
        color_order.insert(0, base_color.lower())

    # Build sequence
    sequence = []
    for i in range(count):
        color_name = color_order[i % len(color_order)]
        sequence.append(COLORS[color_name]["primary"])

    return sequence


def apply_chart_style():
    """Apply consistent matplotlib style for all charts."""

    plt.rcParams.update({
        # Figure
        'figure.facecolor': NEUTRALS["background"],
        'figure.edgecolor': NEUTRALS["background"],
        'figure.dpi': 150,

        # Axes
        'axes.facecolor': NEUTRALS["background"],
        'axes.edgecolor': NEUTRALS["border"],
        'axes.linewidth': 0.8,
        'axes.grid': True,
        'axes.axisbelow': True,  # Grid behind data
        'axes.titlesize': FONT_SIZES["title"],
        'axes.titleweight': 'medium',
        'axes.titlepad': 12,
        'axes.labelsize': FONT_SIZES["label"],
        'axes.labelcolor': NEUTRALS["text"],
        'axes.labelpad': 8,

        # Grid
        'grid.color': NEUTRALS["grid"],
        'grid.linewidth': 0.5,
        'grid.alpha': 1.0,

        # Ticks
        'xtick.labelsize': FONT_SIZES["tick"],
        'ytick.labelsize': FONT_SIZES["tick"],
        'xtick.color': NEUTRALS["text_secondary"],
        'ytick.color': NEUTRALS["text_secondary"],
        'xtick.major.width': 0,
        'ytick.major.width': 0,

        # Legend
        'legend.fontsize': FONT_SIZES["label"],
        'legend.frameon': False,
        'legend.loc': 'upper right',

        # Font
        'font.family': FONT_FAMILY,
        'font.size': FONT_SIZES["label"],

        # Lines
        'lines.linewidth': 2,
        'lines.markersize': 6,

        # Patches (bars, etc)
        'patch.linewidth': 0,
    })


def create_figure(width: float = 10, height: float = 6, dpi: int = 150):
    """Create a styled figure with the standard background."""
    apply_chart_style()
    fig, ax = plt.subplots(figsize=(width, height), dpi=dpi)
    return fig, ax


def style_axis(ax, title: str = None, xlabel: str = None, ylabel: str = None,
               show_top_spine: bool = False, show_right_spine: bool = False):
    """Apply consistent styling to an axis."""

    # Remove top and right spines by default
    ax.spines['top'].set_visible(show_top_spine)
    ax.spines['right'].set_visible(show_right_spine)

    # Style remaining spines
    ax.spines['bottom'].set_color(NEUTRALS["border"])
    ax.spines['left'].set_color(NEUTRALS["border"])

    # Set labels
    if title:
        ax.set_title(title, color=NEUTRALS["text"], fontweight='medium')
    if xlabel:
        ax.set_xlabel(xlabel, color=NEUTRALS["text_secondary"])
    if ylabel:
        ax.set_ylabel(ylabel, color=NEUTRALS["text_secondary"])

    # Subtle grid - only horizontal for bar charts typically
    ax.yaxis.grid(True, linestyle='-', alpha=0.7)
    ax.xaxis.grid(False)

    return ax


def save_figure(fig, output_path: str, tight: bool = True):
    """Save figure with consistent settings."""
    if tight:
        fig.tight_layout()
    fig.savefig(
        output_path,
        facecolor=NEUTRALS["background"],
        edgecolor='none',
        bbox_inches='tight',
        pad_inches=0.2
    )
    plt.close(fig)
    print(f"Chart saved to: {output_path}")
