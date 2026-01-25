import { useState } from 'react';
import {
  OS_TYPES,
  ENVIRONMENTS,
  SERVER_ROLES,
  STORAGE_TYPES,
  ARCHITECTURES
} from '../lib/serverChecker';

export function ServerForm({ initialData, onSubmit, onCancel, disabled }) {
  const [formData, setFormData] = useState({
    hostname: initialData?.hostname || '',
    description: initialData?.description || '',
    fqdn: initialData?.fqdn || '',
    ip_internal: initialData?.ip_internal || '',
    ip_external: initialData?.ip_external || '',
    vlan: initialData?.vlan || '',
    ssh_port: initialData?.ssh_port || 22,
    os_type: initialData?.os_type || '',
    os_version: initialData?.os_version || '',
    architecture: initialData?.architecture || 'x64',
    cpu_cores: initialData?.cpu_cores || '',
    ram_gb: initialData?.ram_gb || '',
    storage_gb: initialData?.storage_gb || '',
    storage_type: initialData?.storage_type || '',
    server_role: initialData?.server_role || '',
    environment: initialData?.environment || 'production',
    services: initialData?.services?.join(', ') || '',
    management_url: initialData?.management_url || '',
    responsible_team: initialData?.responsible_team || '',
    contact_name: initialData?.contact_name || '',
    contact_email: initialData?.contact_email || '',
    maintenance_window: initialData?.maintenance_window || '',
    backup_schedule: initialData?.backup_schedule || '',
    patching_schedule: initialData?.patching_schedule || '',
    notes: initialData?.notes || '',
    tags: initialData?.tags?.join(', ') || ''
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // Parse comma-separated fields into arrays
    const serverData = {
      ...formData,
      ssh_port: parseInt(formData.ssh_port) || 22,
      cpu_cores: formData.cpu_cores ? parseInt(formData.cpu_cores) : null,
      ram_gb: formData.ram_gb ? parseInt(formData.ram_gb) : null,
      storage_gb: formData.storage_gb ? parseInt(formData.storage_gb) : null,
      services: formData.services
        ? formData.services.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      tags: formData.tags
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : []
    };

    const result = await onSubmit(serverData);

    if (!result.success) {
      setError(result.error);
    }

    setSubmitting(false);
  };

  return (
    <form className="server-form" onSubmit={handleSubmit}>
      <h2>{initialData ? 'Edit Server' : 'Add New Server'}</h2>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      {/* Basic Info Section */}
      <div className="form-section">
        <h3>Basic Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="hostname">Hostname *</label>
            <input
              id="hostname"
              name="hostname"
              type="text"
              value={formData.hostname}
              onChange={handleChange}
              placeholder="e.g., web-prod-01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="fqdn">FQDN</label>
            <input
              id="fqdn"
              name="fqdn"
              type="text"
              value={formData.fqdn}
              onChange={handleChange}
              placeholder="e.g., web-prod-01.example.com"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            name="description"
            type="text"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of server purpose"
          />
        </div>
      </div>

      {/* Network Section */}
      <div className="form-section">
        <h3>Network</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ip_internal">Internal IP</label>
            <input
              id="ip_internal"
              name="ip_internal"
              type="text"
              value={formData.ip_internal}
              onChange={handleChange}
              placeholder="e.g., 10.0.1.50"
            />
          </div>
          <div className="form-group">
            <label htmlFor="ip_external">External IP</label>
            <input
              id="ip_external"
              name="ip_external"
              type="text"
              value={formData.ip_external}
              onChange={handleChange}
              placeholder="e.g., 203.0.113.50"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="vlan">VLAN</label>
            <input
              id="vlan"
              name="vlan"
              type="text"
              value={formData.vlan}
              onChange={handleChange}
              placeholder="e.g., VLAN 100"
            />
          </div>
          <div className="form-group">
            <label htmlFor="ssh_port">SSH Port</label>
            <input
              id="ssh_port"
              name="ssh_port"
              type="number"
              value={formData.ssh_port}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Operating System Section */}
      <div className="form-section">
        <h3>Operating System</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="os_type">OS Type</label>
            <select
              id="os_type"
              name="os_type"
              value={formData.os_type}
              onChange={handleChange}
            >
              <option value="">Select OS...</option>
              {OS_TYPES.map(os => (
                <option key={os.value} value={os.value}>{os.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="os_version">OS Version</label>
            <input
              id="os_version"
              name="os_version"
              type="text"
              value={formData.os_version}
              onChange={handleChange}
              placeholder="e.g., 22.04 LTS, 2022"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="architecture">Architecture</label>
          <select
            id="architecture"
            name="architecture"
            value={formData.architecture}
            onChange={handleChange}
          >
            {ARCHITECTURES.map(arch => (
              <option key={arch.value} value={arch.value}>{arch.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Hardware Section */}
      <div className="form-section">
        <h3>Hardware Resources</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cpu_cores">CPU Cores</label>
            <input
              id="cpu_cores"
              name="cpu_cores"
              type="number"
              value={formData.cpu_cores}
              onChange={handleChange}
              placeholder="e.g., 4"
            />
          </div>
          <div className="form-group">
            <label htmlFor="ram_gb">RAM (GB)</label>
            <input
              id="ram_gb"
              name="ram_gb"
              type="number"
              value={formData.ram_gb}
              onChange={handleChange}
              placeholder="e.g., 16"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="storage_gb">Storage (GB)</label>
            <input
              id="storage_gb"
              name="storage_gb"
              type="number"
              value={formData.storage_gb}
              onChange={handleChange}
              placeholder="e.g., 500"
            />
          </div>
          <div className="form-group">
            <label htmlFor="storage_type">Storage Type</label>
            <select
              id="storage_type"
              name="storage_type"
              value={formData.storage_type}
              onChange={handleChange}
            >
              <option value="">Select type...</option>
              {STORAGE_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Role & Environment Section */}
      <div className="form-section">
        <h3>Role & Environment</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="server_role">Server Role</label>
            <select
              id="server_role"
              name="server_role"
              value={formData.server_role}
              onChange={handleChange}
            >
              <option value="">Select role...</option>
              {SERVER_ROLES.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="environment">Environment</label>
            <select
              id="environment"
              name="environment"
              value={formData.environment}
              onChange={handleChange}
            >
              {ENVIRONMENTS.map(env => (
                <option key={env.value} value={env.value}>{env.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="services">Services (comma-separated)</label>
          <input
            id="services"
            name="services"
            type="text"
            value={formData.services}
            onChange={handleChange}
            placeholder="e.g., nginx, postgresql, redis"
          />
        </div>
      </div>

      {/* Management Section */}
      <div className="form-section">
        <h3>Management</h3>
        <div className="form-group">
          <label htmlFor="management_url">Management URL</label>
          <input
            id="management_url"
            name="management_url"
            type="text"
            value={formData.management_url}
            onChange={handleChange}
            placeholder="e.g., https://proxmox.example.com:8006"
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="responsible_team">Responsible Team</label>
            <input
              id="responsible_team"
              name="responsible_team"
              type="text"
              value={formData.responsible_team}
              onChange={handleChange}
              placeholder="e.g., Infrastructure Team"
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact_name">Contact Name</label>
            <input
              id="contact_name"
              name="contact_name"
              type="text"
              value={formData.contact_name}
              onChange={handleChange}
              placeholder="Primary contact"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="contact_email">Contact Email</label>
          <input
            id="contact_email"
            name="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={handleChange}
            placeholder="contact@example.com"
          />
        </div>
      </div>

      {/* Schedules Section */}
      <div className="form-section">
        <h3>Schedules</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="maintenance_window">Maintenance Window</label>
            <input
              id="maintenance_window"
              name="maintenance_window"
              type="text"
              value={formData.maintenance_window}
              onChange={handleChange}
              placeholder="e.g., Sundays 2-4 AM PST"
            />
          </div>
          <div className="form-group">
            <label htmlFor="backup_schedule">Backup Schedule</label>
            <input
              id="backup_schedule"
              name="backup_schedule"
              type="text"
              value={formData.backup_schedule}
              onChange={handleChange}
              placeholder="e.g., Daily at 3 AM"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="patching_schedule">Patching Schedule</label>
          <input
            id="patching_schedule"
            name="patching_schedule"
            type="text"
            value={formData.patching_schedule}
            onChange={handleChange}
            placeholder="e.g., Monthly, 2nd Tuesday"
          />
        </div>
      </div>

      {/* Notes & Tags Section */}
      <div className="form-section">
        <h3>Notes & Tags</h3>
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional notes about this server..."
            rows={3}
          />
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., critical, legacy, docker"
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={disabled || submitting}
        >
          {submitting ? 'Saving...' : (initialData ? 'Update Server' : 'Add Server')}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
