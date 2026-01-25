import { createClient } from '@libsql/client/web';

// Turso database client instance
let client = null;

// Default credentials (prototype only - do not use in production)
const DEFAULT_URL = 'libsql://server-inventory-gregwilke.aws-us-west-2.turso.io';
const DEFAULT_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjkzMTUzMzAsImlkIjoiMWEzZmJiYjEtMTg1Ny00MTViLWJmMTctZmJlMzhlNjk0OGUwIiwicmlkIjoiNGRmZDZmYWMtOGM1Ni00NTI5LTkxNTYtYTk2NmI1ZTk2YjJkIn0.KLwtipm9W0fh74HdKSr4c1CV_ClE92fi5supsvlEEuo3vj17_eV8aT8y97CaUT_E5bSrHKWZP7m50QIgVc0_BQ';

let config = {
  url: DEFAULT_URL,
  authToken: DEFAULT_TOKEN
};

// Load config from localStorage (falls back to defaults)
const loadConfig = () => {
  try {
    const saved = localStorage.getItem('server_inventory_config');
    if (saved) {
      const parsed = JSON.parse(saved);
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
  localStorage.setItem('server_inventory_config', JSON.stringify(config));
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
    CREATE TABLE IF NOT EXISTS servers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      -- Basic Info
      hostname TEXT NOT NULL,
      description TEXT,
      fqdn TEXT,

      -- Network
      ip_internal TEXT,
      ip_external TEXT,
      vlan TEXT,
      ssh_port INTEGER DEFAULT 22,

      -- Operating System
      os_type TEXT,
      os_version TEXT,
      architecture TEXT DEFAULT 'x64',

      -- Hardware/Resources
      cpu_cores INTEGER,
      ram_gb INTEGER,
      storage_gb INTEGER,
      storage_type TEXT,

      -- Role & Environment
      server_role TEXT,
      environment TEXT DEFAULT 'production',
      services TEXT,

      -- Status
      status TEXT DEFAULT 'unknown',
      last_checked TEXT,

      -- Management
      management_url TEXT,
      responsible_team TEXT,
      contact_name TEXT,
      contact_email TEXT,

      -- Operational
      maintenance_window TEXT,
      backup_schedule TEXT,
      patching_schedule TEXT,
      notes TEXT,
      tags TEXT,

      -- Metadata
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
};

// ============ SERVER CRUD OPERATIONS ============

export const getServers = async (filter = {}) => {
  const db = getClient();
  let sql = 'SELECT * FROM servers';
  const conditions = [];
  const args = [];

  if (filter.status && filter.status !== 'all') {
    conditions.push('status = ?');
    args.push(filter.status);
  }

  if (filter.os_type && filter.os_type !== 'all') {
    conditions.push('os_type = ?');
    args.push(filter.os_type);
  }

  if (filter.environment && filter.environment !== 'all') {
    conditions.push('environment = ?');
    args.push(filter.environment);
  }

  if (filter.search) {
    conditions.push('(hostname LIKE ? OR description LIKE ? OR ip_internal LIKE ? OR fqdn LIKE ?)');
    const searchTerm = `%${filter.search}%`;
    args.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY hostname ASC';

  const result = await db.execute({ sql, args });

  // Parse JSON fields
  return result.rows.map(row => ({
    ...row,
    services: row.services ? JSON.parse(row.services) : [],
    tags: row.tags ? JSON.parse(row.tags) : []
  }));
};

export const getServerById = async (id) => {
  const db = getClient();
  const result = await db.execute({
    sql: 'SELECT * FROM servers WHERE id = ?',
    args: [id]
  });

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    ...row,
    services: row.services ? JSON.parse(row.services) : [],
    tags: row.tags ? JSON.parse(row.tags) : []
  };
};

export const createServer = async (server) => {
  const db = getClient();
  const result = await db.execute({
    sql: `INSERT INTO servers (
      hostname, description, fqdn,
      ip_internal, ip_external, vlan, ssh_port,
      os_type, os_version, architecture,
      cpu_cores, ram_gb, storage_gb, storage_type,
      server_role, environment, services,
      status, management_url, responsible_team,
      contact_name, contact_email,
      maintenance_window, backup_schedule, patching_schedule,
      notes, tags
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      server.hostname,
      server.description || '',
      server.fqdn || null,
      server.ip_internal || null,
      server.ip_external || null,
      server.vlan || null,
      server.ssh_port || 22,
      server.os_type || null,
      server.os_version || null,
      server.architecture || 'x64',
      server.cpu_cores || null,
      server.ram_gb || null,
      server.storage_gb || null,
      server.storage_type || null,
      server.server_role || null,
      server.environment || 'production',
      server.services ? JSON.stringify(server.services) : null,
      server.status || 'unknown',
      server.management_url || null,
      server.responsible_team || null,
      server.contact_name || null,
      server.contact_email || null,
      server.maintenance_window || null,
      server.backup_schedule || null,
      server.patching_schedule || null,
      server.notes || null,
      server.tags ? JSON.stringify(server.tags) : null
    ]
  });
  return result.lastInsertRowid;
};

export const updateServer = async (id, updates) => {
  const db = getClient();
  const fields = [];
  const args = [];

  const fieldMap = {
    hostname: 'hostname',
    description: 'description',
    fqdn: 'fqdn',
    ip_internal: 'ip_internal',
    ip_external: 'ip_external',
    vlan: 'vlan',
    ssh_port: 'ssh_port',
    os_type: 'os_type',
    os_version: 'os_version',
    architecture: 'architecture',
    cpu_cores: 'cpu_cores',
    ram_gb: 'ram_gb',
    storage_gb: 'storage_gb',
    storage_type: 'storage_type',
    server_role: 'server_role',
    environment: 'environment',
    status: 'status',
    last_checked: 'last_checked',
    management_url: 'management_url',
    responsible_team: 'responsible_team',
    contact_name: 'contact_name',
    contact_email: 'contact_email',
    maintenance_window: 'maintenance_window',
    backup_schedule: 'backup_schedule',
    patching_schedule: 'patching_schedule',
    notes: 'notes'
  };

  for (const [key, dbField] of Object.entries(fieldMap)) {
    if (updates[key] !== undefined) {
      fields.push(`${dbField} = ?`);
      args.push(updates[key]);
    }
  }

  // Handle JSON fields
  if (updates.services !== undefined) {
    fields.push('services = ?');
    args.push(JSON.stringify(updates.services));
  }
  if (updates.tags !== undefined) {
    fields.push('tags = ?');
    args.push(JSON.stringify(updates.tags));
  }

  fields.push("updated_at = datetime('now')");
  args.push(id);

  await db.execute({
    sql: `UPDATE servers SET ${fields.join(', ')} WHERE id = ?`,
    args
  });
};

export const deleteServer = async (id) => {
  const db = getClient();
  await db.execute({
    sql: 'DELETE FROM servers WHERE id = ?',
    args: [id]
  });
};

export const updateServerStatus = async (id, status, lastChecked) => {
  const db = getClient();
  await db.execute({
    sql: "UPDATE servers SET status = ?, last_checked = ?, updated_at = datetime('now') WHERE id = ?",
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
