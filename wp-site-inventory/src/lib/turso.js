import { createClient } from '@libsql/client/web';

// Turso database client instance
let client = null;

// Default credentials (prototype only - do not use in production)
const DEFAULT_URL = 'libsql://wp-inventory-gregwilke.aws-us-west-2.turso.io';
const DEFAULT_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjkyOTMyNjYsImlkIjoiYTk4OGRhNmMtNGNiOS00OWNkLThhYTQtZDU0MTc3ZmUzMDQ5IiwicmlkIjoiOWE5NGRlZmYtYjY0Ni00ODQ1LThjZTYtZmM5ZjI2Y2RlOTFmIn0.x9NO0N-MDQ2YYh6N9i59NqhzKQoc1BgPYvSYn4vbP2OU-Z15ltyN7D-SYA0xzVBQf4VcB5c_B7D7jf2YySUZCg';

let config = {
  url: DEFAULT_URL,
  authToken: DEFAULT_TOKEN
};

// Load config from localStorage (falls back to defaults)
const loadConfig = () => {
  try {
    const saved = localStorage.getItem('turso_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Only override if values exist
      config = {
        url: parsed.url || DEFAULT_URL,
        authToken: parsed.authToken || DEFAULT_TOKEN
      };
    }
  } catch (e) {
    console.warn('Failed to load Turso config from localStorage');
  }
};

// Save config to localStorage
const saveConfig = (newConfig) => {
  config = { ...config, ...newConfig };
  localStorage.setItem('turso_config', JSON.stringify(config));
  client = null; // Reset client to reconnect with new config
};

// Get or create the Turso client
const getClient = () => {
  if (!config.url || !config.authToken) {
    throw new Error('Turso database not configured. Please enter your database URL and auth token.');
  }

  if (!client) {
    client = createClient({
      url: config.url,
      authToken: config.authToken,
    });
  }
  return client;
};

// Test database connection
export const testConnection = async () => {
  try {
    const db = getClient();
    await db.execute('SELECT 1');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Initialize the database schema
export const initializeSchema = async () => {
  const db = getClient();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      -- Basic Info
      name TEXT NOT NULL,
      url TEXT NOT NULL UNIQUE,
      description TEXT,

      -- Status
      status TEXT DEFAULT 'unknown',
      last_checked TEXT,

      -- Technical Info
      wp_version TEXT,
      php_version TEXT,
      theme_name TEXT,
      hosting_provider TEXT,
      detected_plugins TEXT,

      -- Operational Info
      contact_name TEXT,
      contact_email TEXT,
      notes TEXT,
      maintenance_window TEXT,
      ssl_expiry TEXT,
      tags TEXT,

      -- Metadata
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
};

// ============ SITE CRUD OPERATIONS ============

export const getSites = async (filter = {}) => {
  const db = getClient();
  let sql = 'SELECT * FROM sites';
  const conditions = [];
  const args = [];

  if (filter.status && filter.status !== 'all') {
    conditions.push('status = ?');
    args.push(filter.status);
  }

  if (filter.search) {
    conditions.push('(name LIKE ? OR url LIKE ? OR description LIKE ?)');
    const searchTerm = `%${filter.search}%`;
    args.push(searchTerm, searchTerm, searchTerm);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY name ASC';

  const result = await db.execute({ sql, args });

  // Parse JSON fields
  return result.rows.map(row => ({
    ...row,
    detected_plugins: row.detected_plugins ? JSON.parse(row.detected_plugins) : [],
    tags: row.tags ? JSON.parse(row.tags) : []
  }));
};

export const getSiteById = async (id) => {
  const db = getClient();
  const result = await db.execute({
    sql: 'SELECT * FROM sites WHERE id = ?',
    args: [id]
  });

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    ...row,
    detected_plugins: row.detected_plugins ? JSON.parse(row.detected_plugins) : [],
    tags: row.tags ? JSON.parse(row.tags) : []
  };
};

export const createSite = async (site) => {
  const db = getClient();
  const result = await db.execute({
    sql: `INSERT INTO sites (
      name, url, description, status,
      wp_version, php_version, theme_name, hosting_provider, detected_plugins,
      contact_name, contact_email, notes, maintenance_window, ssl_expiry, tags
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      site.name,
      site.url,
      site.description || '',
      site.status || 'unknown',
      site.wp_version || null,
      site.php_version || null,
      site.theme_name || null,
      site.hosting_provider || null,
      site.detected_plugins ? JSON.stringify(site.detected_plugins) : null,
      site.contact_name || null,
      site.contact_email || null,
      site.notes || null,
      site.maintenance_window || null,
      site.ssl_expiry || null,
      site.tags ? JSON.stringify(site.tags) : null
    ]
  });
  return result.lastInsertRowid;
};

export const updateSite = async (id, updates) => {
  const db = getClient();
  const fields = [];
  const args = [];

  const fieldMap = {
    name: 'name',
    url: 'url',
    description: 'description',
    status: 'status',
    last_checked: 'last_checked',
    wp_version: 'wp_version',
    php_version: 'php_version',
    theme_name: 'theme_name',
    hosting_provider: 'hosting_provider',
    contact_name: 'contact_name',
    contact_email: 'contact_email',
    notes: 'notes',
    maintenance_window: 'maintenance_window',
    ssl_expiry: 'ssl_expiry'
  };

  for (const [key, dbField] of Object.entries(fieldMap)) {
    if (updates[key] !== undefined) {
      fields.push(`${dbField} = ?`);
      args.push(updates[key]);
    }
  }

  // Handle JSON fields
  if (updates.detected_plugins !== undefined) {
    fields.push('detected_plugins = ?');
    args.push(JSON.stringify(updates.detected_plugins));
  }
  if (updates.tags !== undefined) {
    fields.push('tags = ?');
    args.push(JSON.stringify(updates.tags));
  }

  fields.push("updated_at = datetime('now')");
  args.push(id);

  await db.execute({
    sql: `UPDATE sites SET ${fields.join(', ')} WHERE id = ?`,
    args
  });
};

export const deleteSite = async (id) => {
  const db = getClient();
  await db.execute({
    sql: 'DELETE FROM sites WHERE id = ?',
    args: [id]
  });
};

export const updateSiteStatus = async (id, status, lastChecked) => {
  const db = getClient();
  await db.execute({
    sql: "UPDATE sites SET status = ?, last_checked = ?, updated_at = datetime('now') WHERE id = ?",
    args: [status, lastChecked, id]
  });
};

// ============ CONFIG EXPORTS ============

export const getConfig = () => {
  loadConfig();
  return { ...config };
};

export const setConfig = (newConfig) => {
  saveConfig(newConfig);
};

export const isConfigured = () => {
  loadConfig();
  return !!(config.url && config.authToken);
};

// Initialize on module load
loadConfig();
