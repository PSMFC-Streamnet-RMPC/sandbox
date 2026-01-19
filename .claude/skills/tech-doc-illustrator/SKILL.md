---
name: tech-doc-illustrator
description: |
  Generate consistent, thematic illustrations for technical documentation using Nano Banana (Gemini image API). Creates hand-drawn style diagrams, icons, and concept visualizations with a cohesive visual language.

  TRIGGERS: When the user needs illustrations for technical docs, architecture diagrams, configuration guides, API documentation, troubleshooting visuals, process flows, or any visual content for technical writing. Also triggers when user mentions "illustration", "diagram", "visual", "image for docs", or requests consistent brand imagery for technical content.
---

# Tech Documentation Illustrator

Generate consistent hand-drawn style illustrations for technical documentation using Nano Banana.

## Quick Start

1. **Gather context** - Ask what document/concept needs illustration
2. **Generate concepts** - Propose 3 visual concepts using `references/concept-mapping.md`
3. **Get user choice** - Use AskUserQuestion for selection
4. **Generate image** - Run the script with chosen concept

## Workflow

### Step 1: Understand the Need

Ask the user:
- What technical concept needs illustration?
- What type of document is it for? (architecture, troubleshooting, config, API, etc.)
- What's the key message the illustration should convey?

### Step 2: Propose 3 Concepts

Reference `references/concept-mapping.md` to find appropriate visual metaphors.

Present three options with:
- **Option A**: [Name] - Description + why it works
- **Option B**: [Name] - Description + why it works
- **Option C**: [Name] - Description + why it works

Include recommended color from `references/colors.md` based on document type.

### Step 3: Get User Selection

Use AskUserQuestion tool:
```
Which concept would you like to generate?
- Option A: [Name]
- Option B: [Name]
- Option C: [Name]
```

### Step 4: Generate the Illustration

```bash
python3 scripts/generate.py \
  --prompt "DETAILED_PROMPT_HERE" \
  --color COLOR \
  --type TYPE \
  --aspect-ratio RATIO \
  --output OUTPUT_PATH
```

**Parameters:**
- `--color`: coral | teal | indigo | amber
- `--type`: diagram | scene | icon | process | architecture | concept
- `--aspect-ratio`: 16:9 | 4:3 | 1:1 | 3:2 | 9:16
- `--resolution`: 1K | 2K | 4K
- `--pro`: Use Nano Banana Pro for complex prompts

### Step 5: Review and Iterate

Show the generated image. If adjustments needed, modify prompt and regenerate.

## Color Quick Reference

| Color  | Hex       | Use For                           |
|--------|-----------|-----------------------------------|
| Coral  | #e85d3b   | Errors, action, important items   |
| Teal   | #0d9488   | Data flow, success, connectivity  |
| Indigo | #6366f1   | AI/ML, security, advanced topics  |
| Amber  | #eab308   | Warnings, config, attention       |

See `references/colors.md` for detailed guidance.

## Type Quick Reference

| Type         | Best For                              |
|--------------|---------------------------------------|
| diagram      | Technical diagrams, relationships     |
| scene        | Contextual environments               |
| icon         | Simple symbols, status indicators     |
| process      | Step-by-step flows                    |
| architecture | System overviews, infrastructure      |
| concept      | Abstract ideas, metaphors             |

## Document Type → Color Mapping

| Document Type        | Recommended Color |
|----------------------|-------------------|
| Error/troubleshooting| Coral             |
| API docs             | Teal              |
| Security guides      | Indigo            |
| Configuration        | Amber             |
| Architecture         | Teal or Indigo    |
| Getting started      | Coral             |

## References

- `references/colors.md` - Complete color palette and usage rules
- `references/style-guide.md` - Visual style guidelines
- `references/concept-mapping.md` - Technical concept → visual metaphor mapping
- `references/example-prompts.md` - Proven prompts for common scenarios

## Requirements

- Python 3.8+
- `google-genai` package: `pip install google-genai`
- `GOOGLE_API_KEY` environment variable set

## Example Session

**User**: I need an illustration for my API documentation showing how authentication works.

**Claude**:
Based on your need for an authentication flow illustration for API docs, here are three concepts:

**Option A: Key and Lock Flow**
A key entering a lock, then a gate opening. Simple left-to-right authentication visualization.
*Color: Teal (success/connectivity)*

**Option B: Checkpoint Sequence**
User badge → verification checkpoint → access granted checkmark. Sequential process.
*Color: Teal (success/connectivity)*

**Option C: Shield Handshake**
Two endpoints exchanging a protected token, with a shield indicating security.
*Color: Indigo (security concepts)*

Which concept would you like to generate?

**User**: Option A

**Claude**:
```bash
python3 scripts/generate.py \
  --prompt "A user icon on the left, an arrow pointing to a key entering a lock in the center, and a checkmark with an open gate on the right. Simple left-to-right authentication flow. Clean hand-drawn style." \
  --color teal \
  --type process \
  --aspect-ratio 16:9 \
  --output ./auth-flow-v1.png
```
