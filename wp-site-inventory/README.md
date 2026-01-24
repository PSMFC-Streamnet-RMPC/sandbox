# WordPress Site Inventory

A React-based dashboard for tracking and monitoring your team's WordPress websites. Built with Vite and Turso (libSQL) database, deployable to GitHub Pages.

## Features

- **Site Management**: Add, edit, and delete WordPress sites
- **Status Monitoring**: Check if sites are online/offline (manual or bulk check)
- **WordPress Detection**: Auto-detect WP version, theme, plugins, and hosting provider
- **Full Inventory Tracking**:
  - Basic info (name, URL, description)
  - Technical details (WP version, PHP version, theme, plugins)
  - Operational info (contact person, maintenance window, notes, tags)
- **Search & Filter**: Find sites by name, URL, or filter by status
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: React 18 + Vite
- **Database**: [Turso](https://turso.tech/) (libSQL - SQLite for the edge)
- **Hosting**: GitHub Pages (static)
- **Styling**: Custom CSS (no framework)

## Quick Start

### 1. Set Up Turso Database

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login (opens browser)
turso auth login

# Create database
turso db create wp-inventory

# Get your credentials
turso db show wp-inventory --url
turso db tokens create wp-inventory
```

### 2. Local Development

```bash
# Clone and install
cd wp-site-inventory
npm install

# Start dev server
npm run dev
```

Open http://localhost:5173 and enter your Turso credentials.

### 3. Deploy to GitHub Pages

1. Push this folder to your GitHub repo (e.g., `sandbox`)

2. Update `vite.config.js` with your repo name:
   ```js
   base: '/your-repo-name/',
   ```

3. Enable GitHub Pages:
   - Go to repo Settings → Pages
   - Source: "GitHub Actions"

4. Push to `main` branch - the workflow will auto-deploy

## Project Structure

```
wp-site-inventory/
├── src/
│   ├── components/       # React components
│   │   ├── ConfigPanel.jsx   # Database connection form
│   │   ├── SiteForm.jsx      # Add/edit site form
│   │   ├── SiteCard.jsx      # Individual site display
│   │   └── SiteList.jsx      # Site grid with filters
│   ├── hooks/            # Custom React hooks
│   │   ├── useConnection.js  # Turso connection state
│   │   └── useSites.js       # Site CRUD operations
│   ├── lib/              # Utilities
│   │   ├── turso.js          # Database client
│   │   └── siteChecker.js    # Status & WP detection
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Styles
├── .github/workflows/    # GitHub Actions
│   └── deploy.yml        # Auto-deploy to Pages
├── package.json
├── vite.config.js
└── README.md
```

## Database Schema

```sql
CREATE TABLE sites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  description TEXT,
  status TEXT DEFAULT 'unknown',    -- 'online', 'offline', 'unknown'
  last_checked TEXT,
  wp_version TEXT,
  php_version TEXT,
  theme_name TEXT,
  hosting_provider TEXT,
  detected_plugins TEXT,            -- JSON array
  contact_name TEXT,
  contact_email TEXT,
  notes TEXT,
  maintenance_window TEXT,
  ssl_expiry TEXT,
  tags TEXT,                        -- JSON array
  created_at TEXT,
  updated_at TEXT
);
```

## Security Note

This prototype stores Turso credentials in browser localStorage for convenience. For production use, consider:

1. **Serverless Backend**: Use Cloudflare Workers, Vercel Edge Functions, or similar to proxy database requests
2. **Environment Variables**: Don't expose auth tokens in client-side code
3. **Read-Only Tokens**: Use Turso's read-only tokens for public dashboards

## Customization Ideas

- Add SSL certificate expiry tracking and alerts
- Integrate with uptime monitoring services
- Add site screenshots via API
- Export inventory to CSV/Excel
- Add user authentication
- Set up email alerts for offline sites

## License

MIT
