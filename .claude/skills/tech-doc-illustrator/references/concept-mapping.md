# Concept-to-Illustration Mapping

Visual metaphors for common technical documentation concepts.

## Infrastructure & Systems

| Concept                | Visual Metaphor                                                    |
|------------------------|--------------------------------------------------------------------|
| Server                 | Simple box with small indicator lights                             |
| Database               | Cylinder or stacked discs                                          |
| Cloud service          | Simplified cloud shape with service icon inside                    |
| Load balancer          | Funnel or traffic director with multiple output arrows             |
| Container              | Box within a box, or shipping container                            |
| Microservice           | Small connected boxes in a cluster                                 |
| Monolith               | Single large solid block                                           |
| API Gateway            | Door or gate with arrows passing through                           |
| Message queue          | Line of envelopes or conveyor belt                                 |
| Cache                  | Fast-access box with lightning bolt                                |

## Data & Flow

| Concept                | Visual Metaphor                                                    |
|------------------------|--------------------------------------------------------------------|
| Data flow              | Arrows connecting nodes, river-like paths                          |
| ETL pipeline           | Funnel with stages: extract (in) → transform (middle) → load (out) |
| Data transformation    | Shape morphing: square entering, circle exiting                    |
| Synchronization        | Two elements with bidirectional arrows, matching state             |
| Backup                 | Original with a ghost/copy behind it                               |
| Replication            | One source with multiple identical copies branching out            |
| Data lake              | Pool or reservoir shape                                            |
| Data warehouse         | Organized shelving or filing system                                |

## Security & Access

| Concept                | Visual Metaphor                                                    |
|------------------------|--------------------------------------------------------------------|
| Authentication         | Key and lock, or ID badge                                          |
| Authorization          | Checklist with checkmarks, or bouncer at door                      |
| Encryption             | Scrambled text in a locked box                                     |
| Firewall               | Brick wall with selective openings                                 |
| VPN                    | Tunnel or protected tube between points                            |
| Certificate            | Stamped/sealed document                                            |
| Token                  | Coin or ticket                                                     |
| Secret/credential      | Eye with slash (hidden), or safe                                   |

## Development & Deployment

| Concept                | Visual Metaphor                                                    |
|------------------------|--------------------------------------------------------------------|
| Version control        | Branching tree or timeline with nodes                              |
| CI/CD pipeline         | Assembly line with stages                                          |
| Deployment             | Package being placed onto a server                                 |
| Rollback               | Curved arrow going backward                                        |
| Feature flag           | Toggle switch or flag pole                                         |
| Environment            | Labeled boxes (dev/staging/prod) in progression                    |
| Code review            | Magnifying glass over document                                     |
| Testing                | Checkbox list or quality stamp                                     |

## Configuration & Settings

| Concept                | Visual Metaphor                                                    |
|------------------------|--------------------------------------------------------------------|
| Configuration          | Sliders, dials, or control panel                                   |
| Environment variable   | Labeled tag or sticky note                                         |
| Settings file          | Document with gear icon                                            |
| Default value          | Grayed or outlined element (not filled)                            |
| Override               | Layered elements with top one highlighted                          |
| Dependency             | Chain links or connected puzzle pieces                             |

## States & Conditions

| Concept                | Visual Metaphor                                                    |
|------------------------|--------------------------------------------------------------------|
| Success                | Checkmark, thumbs up, green light                                  |
| Error/failure          | X mark, broken element, red light                                  |
| Warning                | Triangle with exclamation, yellow light                            |
| Pending/processing     | Spinning circle, hourglass, dots                                   |
| Idle/inactive          | Zzz, dimmed element, pause symbol                                  |
| Active                 | Glowing/highlighted element, play symbol                           |
| Locked                 | Padlock closed                                                     |
| Unlocked               | Padlock open                                                       |

## Scaling & Performance

| Concept                | Visual Metaphor                                                    |
|------------------------|--------------------------------------------------------------------|
| Horizontal scaling     | Adding more boxes side by side                                     |
| Vertical scaling       | Making a box taller/larger                                         |
| Auto-scaling           | Boxes with +/- appearing dynamically                               |
| Rate limiting          | Funnel with measured drips, speedometer                            |
| Throttling             | Hand on a valve/faucet                                             |
| Performance            | Speedometer, rocket, or stopwatch                                  |
| Bottleneck             | Narrow point in a flow, hourglass neck                             |
| High availability      | Multiple redundant paths, failover arrows                          |

## Common Technical Document Types

### Architecture Overview
**Concept Options:**
- Bird's eye view of connected components
- Layered stack showing tiers
- Hub and spoke showing central service

### API Reference
**Concept Options:**
- Request/response arrows between client and server
- Endpoint as a mailbox or door
- Data packet traveling through wire

### Configuration Guide
**Concept Options:**
- Control panel with labeled dials
- Recipe card with ingredients (settings)
- Dashboard with adjustable elements

### Troubleshooting Guide
**Concept Options:**
- Magnifying glass finding problem
- Before/after comparison
- Detective following clues (arrows)

### Getting Started
**Concept Options:**
- Stepping stones or path
- Numbered checklist being checked off
- Rocket launching (liftoff metaphor)

### Migration Guide
**Concept Options:**
- Moving truck between locations
- Bridge connecting old and new
- Transformation: caterpillar to butterfly

## Prompt Construction Pattern

When constructing prompts, combine:
1. **Subject**: What is being illustrated
2. **Metaphor**: Visual representation from tables above
3. **Context**: Where it appears in the document
4. **Action**: What is happening (if applicable)

**Example pattern:**
"A [metaphor] representing [subject], showing [action], in the context of [document type]"

**Example prompts:**
- "A funnel with three labeled stages representing an ETL pipeline, showing data flowing from raw to processed"
- "A key entering a lock representing authentication, with a checkmark appearing to show success"
- "Three connected boxes scaling horizontally, with a plus sign adding a fourth box"
