# 🧪 Sandbox

A monorepo for rapid prototypes and experiments, hosted via GitHub Pages.

## Structure

```
sandbox/
├── index.html              # Landing page listing all prototypes
├── prototype-name/         # Each prototype in its own folder
│   └── index.html
└── ...
```

## Usage

1. Create a new folder for your prototype
2. Add an `index.html` (and any CSS/JS files)
3. Update the landing page `index.html` to include a card linking to it
4. Commit and push

## Viewing Prototypes

- **Locally**: Open any `index.html` in your browser
- **Live**: Once pushed, visit `https://[username].github.io/sandbox/[prototype-name]/`

## Setup GitHub Pages

1. Push this repo to GitHub
2. Go to Settings → Pages
3. Set Source to "Deploy from a branch"
4. Select `main` branch and `/ (root)` folder
5. Save

Your prototypes will be live at `https://[username].github.io/sandbox/`
