# Creating a Repeatable Aesthetic for AI Image Generation

## The Problem

AI image generation is inherently unpredictable. Ask for "a diagram" twice and you'll get two completely different styles, colors, and approaches. This makes it nearly impossible to create consistent visual documentation.

## The Solution: Encoded Style Language

The secret to consistent AI-generated illustrations isn't better prompts for individual images—it's **encoding your entire aesthetic into every prompt automatically**.

This skill achieves consistency by:

1. **Base Style Prompt** - A detailed description of the visual language that gets prepended to EVERY generation
2. **Constrained Color Palette** - Limited choices that map to semantic meaning
3. **Type Modifiers** - Predefined style adjustments for different illustration purposes
4. **Reference Documents** - Detailed guidelines the AI (Claude) uses when crafting prompts

## How It Works

### The Base Style (The Magic Glue)

In `scripts/generate.py`, there's a `BASE_STYLE` constant that describes the aesthetic:

```python
BASE_STYLE = """
Hand-drawn illustration style with confident black lines on warm off-white background.
Minimalist and clean. Professional but approachable.
Imperfect on purpose - slight wobble to lines suggests human touch.
White space is intentional and valued.
ONE accent color used sparingly for highlights and emphasis.
No gradients. Flat colors only.
Simple, clear, immediately understandable.
Technical documentation aesthetic - informative not decorative.
"""
```

**This gets added to EVERY prompt**, ensuring consistent:
- Line style (hand-drawn, confident, slightly imperfect)
- Background (warm off-white)
- Color approach (one accent, flat, sparse)
- Complexity level (minimalist, simple)
- Purpose (informative, not decorative)

### The Prompt Assembly

Every user prompt gets wrapped like this:

```
{BASE_STYLE}

Accent color: Teal (#0d9488) - use sparingly for technology, connectivity, data flow

Style: clean technical diagram style, simplified shapes, clear labels

Subject: {USER'S ACTUAL PROMPT}

Important: Keep it simple and clear. This is for technical documentation.
The illustration should explain a concept, not just decorate a page.
```

The user only writes the "Subject" part. Everything else is automatic.

### Constrained Choices

Instead of infinite options, the skill limits choices to:

**4 Colors** (each with semantic meaning):
| Color  | Hex       | Use For                           |
|--------|-----------|-----------------------------------|
| Coral  | #e85d3b   | Errors, action, important items   |
| Teal   | #0d9488   | Data flow, success, connectivity  |
| Indigo | #6366f1   | AI/ML, security, advanced topics  |
| Amber  | #eab308   | Warnings, config, attention       |

**6 Types** (each with style modifiers):
| Type         | Modifier Added to Prompt                              |
|--------------|-------------------------------------------------------|
| diagram      | "clean technical diagram style, simplified shapes"    |
| scene        | "minimalist scene illustration, contextual environment"|
| icon         | "simple icon style, bold and recognizable"            |
| process      | "step-by-step process visualization, sequential flow" |
| architecture | "system architecture diagram, layered components"     |
| concept      | "abstract concept visualization, metaphorical"        |

## Creating Your Own Aesthetic

To create a different visual style, you need to define:

### 1. Base Style Description

Write a detailed paragraph describing:
- **Line work**: Thick/thin? Sketchy/clean? Black/colored?
- **Background**: White? Colored? Textured?
- **Color approach**: Monochromatic? Gradient? Flat?
- **Level of detail**: Minimal? Moderate? Intricate?
- **Mood**: Playful? Serious? Technical? Warm?
- **What to avoid**: Gradients? Shadows? Complexity?

**Example - Corporate Flat Style:**
```
Flat illustration style with soft, rounded shapes.
No outlines or very subtle gray outlines only.
Muted, friendly color palette with soft shadows.
Geometric, simplified human figures when needed.
Lots of white space, floating elements.
Modern tech company aesthetic like Notion or Slack.
Clean and professional but approachable.
```

**Example - Technical Blueprint Style:**
```
Technical blueprint style with white lines on dark blue background.
Precise, mechanical line work with consistent weight.
Grid overlay suggesting graph paper.
Minimal color - only white and light blue accents.
Engineering drawing aesthetic.
Measurements and annotations when relevant.
```

### 2. Color Palette with Meaning

Choose 3-5 colors and assign semantic meaning:

```python
COLORS = {
    "primary": {
        "hex": "#0066CC",
        "usage": "Main elements, key concepts"
    },
    "success": {
        "hex": "#00AA55",
        "usage": "Positive states, completion"
    },
    "warning": {
        "hex": "#FFAA00",
        "usage": "Caution, attention needed"
    },
    "error": {
        "hex": "#DD3333",
        "usage": "Problems, errors, critical"
    }
}
```

### 3. Type Modifiers

Define how different illustration purposes should be handled:

```python
TYPES = {
    "hero": "large, impactful, centered composition",
    "inline": "small, simple, works at thumbnail size",
    "diagram": "technical accuracy, clear relationships",
    "decorative": "subtle, background element, low contrast"
}
```

### 4. Reference Documents

Create supporting files that help Claude craft better prompts:

- **style-guide.md**: Detailed do's and don'ts
- **colors.md**: When to use each color
- **concept-mapping.md**: How to visualize abstract concepts
- **example-prompts.md**: Proven prompts that work well

## File Structure

```
.claude/skills/your-illustrator/
├── SKILL.md              # Main instructions for Claude
├── README.md             # This file - explains the approach
├── scripts/
│   └── generate.py       # Image generation with embedded style
└── references/
    ├── style-guide.md    # Visual style rules
    ├── colors.md         # Color palette and usage
    ├── concept-mapping.md # Abstract → visual mappings
    └── example-prompts.md # Proven prompt examples
```

## Why This Works

1. **Consistency**: The base style is in every prompt, so every image shares DNA
2. **Simplicity**: Users just describe what they want, not how it should look
3. **Semantic Color**: Colors have meaning, not just aesthetics
4. **Constraints Enable Creativity**: Limited choices = cohesive output
5. **Documented Knowledge**: Reference files help Claude make good prompt decisions

## Key Insight

> The model can generate wildly different things each time, but by encoding a consistent style language into your prompts, you get coherent results across dozens of images.

You're not fighting the randomness—you're channeling it through a consistent filter.

## Adapting This Skill

1. **Fork this skill** to a new folder
2. **Rewrite `BASE_STYLE`** in generate.py with your aesthetic
3. **Update the color palette** with your colors and meanings
4. **Modify type modifiers** for your use cases
5. **Update reference docs** with your style guidelines
6. **Test and iterate** - generate 10-20 images to verify consistency

The time investment in defining your aesthetic pays off every time you generate an image.
