#!/usr/bin/env python3
"""
Tech Documentation Illustrator - Nano Banana Image Generator

Generates consistent, thematic illustrations for technical documentation
using Google's Nano Banana (Gemini) image generation API.

Usage:
    python3 generate.py --prompt "PROMPT" --color COLOR [OPTIONS]

Examples:
    python3 generate.py \
        --prompt "A flowchart showing data moving between three connected boxes" \
        --color coral \
        --type diagram \
        --aspect-ratio 16:9 \
        --output ./output/flowchart-v1.png

    python3 generate.py \
        --prompt "A server rack with glowing connection lines" \
        --color teal \
        --type scene \
        --resolution 2K \
        --output ./output/server-v1.png
"""

import argparse
import os
import sys
from pathlib import Path

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("Error: google-genai package not installed.")
    print("Install with: pip install google-genai")
    sys.exit(1)

# Optional: rembg for background removal
REMBG_AVAILABLE = False
try:
    from rembg import remove as remove_bg
    from PIL import Image
    REMBG_AVAILABLE = True
except ImportError:
    pass  # rembg not installed, --transparent won't work


# Brand color palette (matching Builder Methods aesthetic)
COLORS = {
    "coral": {
        "hex": "#e85d3b",
        "rgb": "232, 93, 59",
        "usage": "Energy, action, important highlights"
    },
    "teal": {
        "hex": "#0d9488",
        "rgb": "13, 148, 136",
        "usage": "Technology, connectivity, data flow"
    },
    "indigo": {
        "hex": "#6366f1",
        "rgb": "99, 102, 241",
        "usage": "Intelligence, depth, advanced concepts"
    },
    "amber": {
        "hex": "#eab308",
        "rgb": "234, 179, 8",
        "usage": "Warnings, attention, configuration"
    }
}

# Illustration types with style modifiers
ILLUSTRATION_TYPES = {
    "diagram": "clean technical diagram style, simplified shapes, clear labels",
    "scene": "minimalist scene illustration, contextual environment",
    "icon": "simple icon style, bold and recognizable, centered composition",
    "process": "step-by-step process visualization, sequential flow",
    "architecture": "system architecture diagram, layered components",
    "concept": "abstract concept visualization, metaphorical representation"
}

# Base styles - different aesthetics
STYLES = {
    "hand-drawn": """
Hand-drawn illustration style with confident black lines on warm off-white background.
Minimalist and clean. Professional but approachable.
Imperfect on purpose - slight wobble to lines suggests human touch.
White space is intentional and valued.
ONE accent color used sparingly for highlights and emphasis.
No gradients. Flat colors only.
Simple, clear, immediately understandable.
Technical documentation aesthetic - informative not decorative.
""",
    "corporate-flat": """
Flat illustration style with soft, rounded shapes. No outlines or very subtle gray outlines only.
Muted, friendly color palette with soft shadows.
Geometric, simplified human figures when needed.
Lots of white space, floating elements with no ground line.
Modern tech company aesthetic like Notion or Slack illustrations.
Clean and professional but approachable and friendly.
ONE accent color used as the primary fill color.
White or very light gray background.
""",
    "blueprint": """
Technical blueprint style with white lines on dark blue background (#1a365d).
Precise, mechanical line work with consistent weight.
Subtle grid overlay suggesting engineering graph paper.
Minimal color - only white and light cyan accents.
Engineering drawing aesthetic with technical precision.
Measurements, annotations, and callouts when relevant.
The accent color should be used for highlights and key elements only.
"""
}

# Default style
DEFAULT_STYLE = "hand-drawn"


def build_full_prompt(user_prompt: str, color: str, illustration_type: str, style: str = DEFAULT_STYLE) -> str:
    """Construct the complete prompt with style guidelines."""

    color_info = COLORS.get(color.lower(), COLORS["coral"])
    type_modifier = ILLUSTRATION_TYPES.get(illustration_type.lower(), ILLUSTRATION_TYPES["diagram"])
    base_style = STYLES.get(style.lower(), STYLES[DEFAULT_STYLE])

    full_prompt = f"""
{base_style}

Accent color: {color.capitalize()} ({color_info['hex']}) - use sparingly for {color_info['usage'].lower()}

Style: {type_modifier}

Subject: {user_prompt}

Important: Keep it simple and clear. This is for technical documentation.
The illustration should explain a concept, not just decorate a page.
""".strip()

    return full_prompt


def generate_image(
    prompt: str,
    color: str = "coral",
    illustration_type: str = "diagram",
    style: str = DEFAULT_STYLE,
    aspect_ratio: str = "16:9",
    resolution: str = "1K",
    output_path: str = None,
    model: str = "imagen-4.0-generate-001",
    verbose: bool = False,
    transparent: bool = False
) -> str:
    """
    Generate an illustration using Nano Banana.

    Args:
        prompt: Description of the illustration to generate
        color: Accent color (coral, teal, indigo, amber)
        illustration_type: Type of illustration (diagram, scene, icon, process, architecture, concept)
        aspect_ratio: Image aspect ratio (1:1, 4:3, 16:9, 3:2, etc.)
        resolution: Image resolution (1K, 2K, 4K)
        output_path: Path to save the generated image
        model: Gemini model to use (gemini-2.5-flash-image or gemini-3-pro-image-preview)
        verbose: Print detailed output

    Returns:
        Path to the saved image file
    """

    # Validate color
    if color.lower() not in COLORS:
        print(f"Warning: Unknown color '{color}'. Using 'coral' instead.")
        print(f"Available colors: {', '.join(COLORS.keys())}")
        color = "coral"

    # Validate illustration type
    if illustration_type.lower() not in ILLUSTRATION_TYPES:
        print(f"Warning: Unknown type '{illustration_type}'. Using 'diagram' instead.")
        print(f"Available types: {', '.join(ILLUSTRATION_TYPES.keys())}")
        illustration_type = "diagram"

    # Validate style
    if style.lower() not in STYLES:
        print(f"Warning: Unknown style '{style}'. Using '{DEFAULT_STYLE}' instead.")
        print(f"Available styles: {', '.join(STYLES.keys())}")
        style = DEFAULT_STYLE

    # Build the full prompt
    full_prompt = build_full_prompt(prompt, color, illustration_type, style)

    if verbose:
        print(f"\n{'='*60}")
        print("FULL PROMPT:")
        print(f"{'='*60}")
        print(full_prompt)
        print(f"{'='*60}\n")

    # Initialize client
    client = genai.Client()

    # Generate the image
    print(f"Generating illustration with {model}...")
    print(f"  Style: {style}")
    print(f"  Color: {color}")
    print(f"  Type: {illustration_type}")
    print(f"  Aspect ratio: {aspect_ratio}")
    print(f"  Resolution: {resolution}")

    try:
        # Use Imagen API for image generation
        response = client.models.generate_images(
            model=model,
            prompt=full_prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio=aspect_ratio,
            ),
        )
    except Exception as e:
        print(f"Error generating image: {e}")
        sys.exit(1)

    # Process response
    image_saved = False

    if response.generated_images:
        for i, generated_image in enumerate(response.generated_images):
            # Determine output path
            if output_path is None:
                output_path = f"illustration-{color}-{illustration_type}.png"

            # Ensure directory exists
            output_dir = Path(output_path).parent
            if output_dir and str(output_dir) != '.':
                output_dir.mkdir(parents=True, exist_ok=True)

            # Save the image
            image_to_save = generated_image.image

            # Remove background if requested
            if transparent:
                if not REMBG_AVAILABLE:
                    print("Warning: --transparent requires rembg package.")
                    print("Install with: pip3 install 'rembg[cpu]'")
                    print("Saving without transparency...")
                else:
                    print("Removing background...")
                    # Convert Google image to PIL Image for rembg
                    # First save to a temp file, then open with PIL
                    import tempfile
                    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
                        tmp_path = tmp.name
                        image_to_save.save(tmp_path)
                    pil_image = Image.open(tmp_path)
                    # Remove background
                    image_to_save = remove_bg(pil_image)
                    # Clean up temp file
                    os.unlink(tmp_path)

            image_to_save.save(output_path)
            print(f"\nImage saved to: {output_path}")
            image_saved = True
            break  # Only save first image

    if not image_saved:
        print("Warning: No image was generated in the response.")
        return None

    return output_path


def main():
    parser = argparse.ArgumentParser(
        description="Generate technical documentation illustrations using Nano Banana",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s --prompt "A database with three tables connected by lines" --color teal
  %(prog)s --prompt "Cloud architecture with load balancer" --color indigo --type architecture
  %(prog)s --prompt "Warning sign for configuration error" --color amber --type icon
  %(prog)s --prompt "Team collaboration workflow" --style corporate-flat --color teal
  %(prog)s --prompt "Network topology diagram" --style blueprint --color teal

Available styles: hand-drawn (default), corporate-flat, blueprint
Available colors: coral, teal, indigo, amber
Available types: diagram, scene, icon, process, architecture, concept
        """
    )

    parser.add_argument(
        "--prompt", "-p",
        required=True,
        help="Description of the illustration to generate"
    )

    parser.add_argument(
        "--color", "-c",
        default="coral",
        choices=list(COLORS.keys()),
        help="Accent color for the illustration (default: coral)"
    )

    parser.add_argument(
        "--type", "-t",
        dest="illustration_type",
        default="diagram",
        choices=list(ILLUSTRATION_TYPES.keys()),
        help="Type of illustration (default: diagram)"
    )

    parser.add_argument(
        "--style", "-s",
        default=DEFAULT_STYLE,
        choices=list(STYLES.keys()),
        help=f"Visual style/aesthetic (default: {DEFAULT_STYLE})"
    )

    parser.add_argument(
        "--aspect-ratio", "-a",
        default="16:9",
        choices=["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"],
        help="Image aspect ratio (default: 16:9)"
    )

    parser.add_argument(
        "--resolution", "-r",
        default="1K",
        choices=["1K", "2K", "4K"],
        help="Image resolution (default: 1K)"
    )

    parser.add_argument(
        "--output", "-o",
        help="Output file path (default: auto-generated)"
    )

    parser.add_argument(
        "--model", "-m",
        default="imagen-4.0-generate-001",
        choices=["imagen-4.0-generate-001", "imagen-4.0-fast-generate-001"],
        help="Imagen model to use (default: imagen-4.0-generate-001)"
    )

    parser.add_argument(
        "--fast",
        action="store_true",
        help="Use Imagen 3 Fast for quicker generation"
    )

    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Print detailed output including full prompt"
    )

    parser.add_argument(
        "--transparent",
        action="store_true",
        help="Remove background to create transparent PNG (requires: pip3 install rembg)"
    )

    args = parser.parse_args()

    # Use Fast model if requested
    model = args.model
    if args.fast:
        model = "imagen-4.0-fast-generate-001"

    # Generate the image
    generate_image(
        prompt=args.prompt,
        color=args.color,
        illustration_type=args.illustration_type,
        style=args.style,
        aspect_ratio=args.aspect_ratio,
        resolution=args.resolution,
        output_path=args.output,
        model=model,
        verbose=args.verbose,
        transparent=args.transparent
    )


if __name__ == "__main__":
    main()
