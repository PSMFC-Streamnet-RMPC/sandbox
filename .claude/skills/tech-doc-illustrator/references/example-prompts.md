# Example Prompts Reference

Proven prompts that generate consistent, high-quality technical documentation illustrations.

## Architecture & Infrastructure

### Cloud Architecture
```
A simplified cloud architecture diagram showing a load balancer distributing
traffic to three server boxes, with a database cylinder below. Teal accent
color highlights the data flow arrows.
```
**Settings:** `--color teal --type architecture --aspect-ratio 16:9`

### Microservices
```
Five small connected boxes representing microservices, arranged in a loose
cluster with thin lines showing communication between them. One central
box is highlighted as the API gateway.
```
**Settings:** `--color indigo --type architecture --aspect-ratio 4:3`

### Container Deployment
```
A shipping container metaphor showing three containers on a platform, each
labeled with simple icons representing different services. Deployment
arrows coming from above.
```
**Settings:** `--color teal --type diagram --aspect-ratio 16:9`

## Data & Pipelines

### ETL Pipeline
```
A three-stage funnel diagram: raw data entering on the left, transformation
gears in the middle, clean data exiting to a database on the right. Arrows
show directional flow.
```
**Settings:** `--color teal --type process --aspect-ratio 16:9`

### Data Synchronization
```
Two database cylinders facing each other with bidirectional arrows between
them. Small checkmarks above each cylinder indicate synchronized state.
```
**Settings:** `--color teal --type diagram --aspect-ratio 4:3`

### Message Queue
```
A line of small envelopes waiting in sequence, entering a processing box
one at a time. Some envelopes have checkmarks showing completion.
```
**Settings:** `--color indigo --type process --aspect-ratio 16:9`

## Security & Authentication

### Authentication Flow
```
A user icon on the left, an arrow pointing to a key entering a lock in the
center, and a checkmark gate opening on the right. Simple left-to-right flow.
```
**Settings:** `--color teal --type process --aspect-ratio 16:9`

### API Key Security
```
A key icon with a shield around it, connected by a dotted line to an API
endpoint box. The connection line is protected by a tube/tunnel.
```
**Settings:** `--color indigo --type diagram --aspect-ratio 4:3`

### Firewall Concept
```
A simplified brick wall with selective openings, arrows bouncing off blocked
sections and passing through allowed openings. Bad traffic marked with X.
```
**Settings:** `--color coral --type concept --aspect-ratio 16:9`

## Development Workflow

### CI/CD Pipeline
```
A horizontal assembly line with four stages: code commit, build, test
(checkmark), deploy. Each stage is a simple box with an icon, connected
by arrows.
```
**Settings:** `--color teal --type process --aspect-ratio 16:9`

### Git Branching
```
A main horizontal line with two branches splitting off and one merging back.
Small circles represent commits. Simple tree-like structure.
```
**Settings:** `--color indigo --type diagram --aspect-ratio 16:9`

### Code Review
```
A document with lines representing code, a magnifying glass hovering over it,
and speech bubbles indicating comments. Simple and clean.
```
**Settings:** `--color indigo --type concept --aspect-ratio 4:3`

## Configuration & Settings

### Configuration Panel
```
A control panel with three sliders and two toggle switches, each labeled
with simple text. One slider is highlighted showing an adjustment being made.
```
**Settings:** `--color amber --type diagram --aspect-ratio 4:3`

### Environment Variables
```
Three stacked tags or labels (DEV, STAGING, PROD) with an arrow pointing to
the active one. Simple key-value pairs shown as connected boxes.
```
**Settings:** `--color amber --type diagram --aspect-ratio 4:3`

### Feature Flags
```
A row of three toggle switches, one turned on and highlighted, others off.
Simple on/off visual metaphor.
```
**Settings:** `--color amber --type icon --aspect-ratio 4:3`

## Error & Troubleshooting

### Error State
```
A broken chain link or disconnected wire between two components, with an
X mark indicating the failure point. Coral highlights the problem area.
```
**Settings:** `--color coral --type diagram --aspect-ratio 4:3`

### Debugging Process
```
A magnifying glass examining a bug icon, with a checklist nearby showing
steps being checked off. Detective/investigation metaphor.
```
**Settings:** `--color coral --type concept --aspect-ratio 4:3`

### Before/After Fix
```
Two side-by-side panels: left showing broken state (X mark, red), right
showing fixed state (checkmark, different highlight). Arrow between them.
```
**Settings:** `--color coral --type diagram --aspect-ratio 16:9`

## Status & States

### Success State
```
A large checkmark inside a circle, simple and bold. Clean iconographic style.
```
**Settings:** `--color teal --type icon --aspect-ratio 1:1`

### Warning State
```
A triangle with an exclamation mark inside, simple alert icon style.
```
**Settings:** `--color amber --type icon --aspect-ratio 1:1`

### Error State
```
A circle with an X inside, or a broken/cracked element. Bold and clear.
```
**Settings:** `--color coral --type icon --aspect-ratio 1:1`

### Loading/Processing
```
A circular progress indicator or hourglass, suggesting ongoing work.
```
**Settings:** `--color indigo --type icon --aspect-ratio 1:1`

## Scaling & Performance

### Horizontal Scaling
```
Three server boxes side by side, with a plus sign and dotted outline
showing a fourth being added. Growth concept.
```
**Settings:** `--color teal --type diagram --aspect-ratio 16:9`

### Bottleneck
```
A flow diagram where multiple streams converge into a narrow point before
expanding again. The narrow point is highlighted as the bottleneck.
```
**Settings:** `--color coral --type diagram --aspect-ratio 16:9`

### High Availability
```
Two server paths with a failover arrow, one server with a checkmark, the
other as backup with a standby indicator.
```
**Settings:** `--color teal --type architecture --aspect-ratio 16:9`

## Prompt Writing Tips

### Structure
1. Start with the main subject
2. Describe the visual metaphor
3. Specify spatial arrangement
4. Mention accent color purpose
5. Keep it concise (1-3 sentences)

### Keywords That Work Well
- "simplified", "clean", "minimal"
- "connected", "flowing", "sequential"
- "highlighted", "emphasized", "indicated"
- "boxes", "arrows", "circles", "lines"
- "left-to-right", "top-to-bottom", "centered"

### Avoid
- Overly detailed descriptions
- Multiple concepts in one illustration
- Photorealistic requests
- Complex animations or interactions
- Text-heavy illustrations (keep labels minimal)
