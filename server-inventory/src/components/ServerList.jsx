import { useState } from 'react';
import { OS_TYPES, ENVIRONMENTS } from '../lib/serverChecker';

export function ServerList({
  servers,
  loading,
  error,
  filter,
  stats,
  onFilterChange,
  onCheckStatus,
  onCheckAllStatuses,
  onEdit,
  onDelete
}) {
  const [checkingId, setCheckingId] = useState(null);

  const handleCheckStatus = async (id) => {
    setCheckingId(id);
    await onCheckStatus(id);
    setCheckingId(null);
  };

  const handleSearchChange = (e) => {
    onFilterChange({ ...filter, search: e.target.value });
  };

  const handleStatusFilter = (status) => {
    onFilterChange({ ...filter, status });
  };

  const handleOsFilter = (os_type) => {
    onFilterChange({ ...filter, os_type });
  };

  const handleEnvFilter = (environment) => {
    onFilterChange({ ...filter, environment });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return '🟢';
      case 'offline': return '🔴';
      case 'maintenance': return '🟡';
      default: return '⚪';
    }
  };

  const getOsIcon = (osType) => {
    if (!osType) return '💻';
    if (osType.startsWith('windows')) return '🪟';
    if (osType === 'ubuntu' || osType === 'debian') return '🐧';
    if (['centos', 'rhel', 'rocky', 'alma'].includes(osType)) return '🎩';
    if (osType === 'esxi' || osType === 'proxmox') return '🖥️';
    return '💻';
  };

  const getEnvBadgeClass = (env) => {
    switch (env) {
      case 'production': return 'env-prod';
      case 'staging': return 'env-staging';
      case 'development': return 'env-dev';
      case 'testing': return 'env-test';
      case 'dr': return 'env-dr';
      default: return '';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleString();
  };

  const getOsLabel = (osType) => {
    const os = OS_TYPES.find(o => o.value === osType);
    return os ? os.label : osType || '-';
  };

  if (loading) {
    return (
      <div className="server-list">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="server-list">
        <div className="error-banner">
          <h3>Error loading servers</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="server-list">
      <div className="server-list-header">
        <div className="header-top">
          <h2>Servers</h2>
          <div className="stats">
            <span className="stat total">{stats.total} total</span>
            <span className="stat online">{stats.online} online</span>
            <span className="stat offline">{stats.offline} offline</span>
            <span className="stat unknown">{stats.unknown} unknown</span>
          </div>
        </div>

        <div className="server-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search servers..."
              value={filter.search}
              onChange={handleSearchChange}
            />
          </div>

          <div className="filter-group">
            <span className="filter-label">Status:</span>
            <div className="filter-buttons">
              {['all', 'online', 'offline', 'maintenance', 'unknown'].map(status => (
                <button
                  key={status}
                  className={`filter-btn ${filter.status === status ? 'active' : ''}`}
                  onClick={() => handleStatusFilter(status)}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Environment:</span>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter.environment === 'all' ? 'active' : ''}`}
                onClick={() => handleEnvFilter('all')}
              >
                All
              </button>
              {ENVIRONMENTS.map(env => (
                <button
                  key={env.value}
                  className={`filter-btn ${filter.environment === env.value ? 'active' : ''}`}
                  onClick={() => handleEnvFilter(env.value)}
                >
                  {env.label}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn btn-secondary"
            onClick={onCheckAllStatuses}
          >
            Check All Status
          </button>
        </div>
      </div>

      {servers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🖥️</div>
          <h3>No servers found</h3>
          <p>Add your first server to get started.</p>
        </div>
      ) : (
        <div className="server-table-wrapper">
          <table className="server-table">
            <thead>
              <tr>
                <th className="col-status">Status</th>
                <th className="col-hostname">Hostname</th>
                <th className="col-ip">IP Address</th>
                <th className="col-os">OS</th>
                <th className="col-role">Role</th>
                <th className="col-env">Env</th>
                <th className="col-resources">Resources</th>
                <th className="col-checked">Last Checked</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {servers.map(server => (
                <tr key={server.id} className={`server-row ${server.status}`}>
                  <td className="col-status">
                    <span className="status-indicator" title={server.status}>
                      {getStatusIcon(server.status)}
                    </span>
                  </td>
                  <td className="col-hostname">
                    <div className="hostname-cell">
                      <strong>{server.hostname}</strong>
                      {server.fqdn && (
                        <span className="fqdn">{server.fqdn}</span>
                      )}
                      {server.description && (
                        <span className="server-desc">{server.description}</span>
                      )}
                    </div>
                  </td>
                  <td className="col-ip">
                    {server.ip_internal && (
                      <div className="ip-addr">
                        <span className="ip-label">Int:</span> {server.ip_internal}
                      </div>
                    )}
                    {server.ip_external && (
                      <div className="ip-addr">
                        <span className="ip-label">Ext:</span> {server.ip_external}
                      </div>
                    )}
                    {!server.ip_internal && !server.ip_external && '-'}
                  </td>
                  <td className="col-os">
                    <span className="os-info">
                      {getOsIcon(server.os_type)} {getOsLabel(server.os_type)}
                      {server.os_version && <span className="os-version"> {server.os_version}</span>}
                    </span>
                  </td>
                  <td className="col-role">
                    {server.server_role || '-'}
                  </td>
                  <td className="col-env">
                    <span className={`env-badge ${getEnvBadgeClass(server.environment)}`}>
                      {server.environment || '-'}
                    </span>
                  </td>
                  <td className="col-resources">
                    {(server.cpu_cores || server.ram_gb) ? (
                      <div className="resources-info">
                        {server.cpu_cores && <span>{server.cpu_cores} CPU</span>}
                        {server.ram_gb && <span>{server.ram_gb} GB</span>}
                        {server.storage_gb && <span>{server.storage_gb} GB {server.storage_type || ''}</span>}
                      </div>
                    ) : '-'}
                  </td>
                  <td className="col-checked">
                    {formatDate(server.last_checked)}
                  </td>
                  <td className="col-actions">
                    <div className="action-buttons">
                      <button
                        className="btn btn-icon"
                        onClick={() => handleCheckStatus(server.id)}
                        disabled={checkingId === server.id}
                        title="Check status"
                      >
                        {checkingId === server.id ? '⏳' : '🔄'}
                      </button>
                      <button
                        className="btn btn-icon"
                        onClick={() => onEdit(server)}
                        title="Edit server"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-icon btn-danger-icon"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${server.hostname}"?`)) {
                            onDelete(server.id);
                          }
                        }}
                        title="Delete server"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
