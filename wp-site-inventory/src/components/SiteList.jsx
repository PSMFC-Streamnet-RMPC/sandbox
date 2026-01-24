import { useState } from 'react';

export function SiteList({
  sites,
  loading,
  error,
  filter,
  stats,
  onFilterChange,
  onCheckStatus,
  onCheckAllStatuses,
  onScan,
  onEdit,
  onDelete
}) {
  const [checkingId, setCheckingId] = useState(null);
  const [scanningId, setScanningId] = useState(null);

  const handleSearchChange = (e) => {
    onFilterChange({ ...filter, search: e.target.value });
  };

  const handleStatusFilter = (status) => {
    onFilterChange({ ...filter, status });
  };

  const handleCheckStatus = async (id) => {
    setCheckingId(id);
    await onCheckStatus(id);
    setCheckingId(null);
  };

  const handleScan = async (id) => {
    setScanningId(id);
    await onScan(id);
    setScanningId(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return '🟢';
      case 'offline': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="site-list">
      <div className="site-list-header">
        <div className="header-top">
          <h2>Sites</h2>
          <div className="stats">
            <span className="stat total">{stats.total} total</span>
            <span className="stat online">{stats.online} online</span>
            <span className="stat offline">{stats.offline} offline</span>
            <span className="stat unknown">{stats.unknown} unknown</span>
          </div>
        </div>

        <div className="site-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search sites..."
              value={filter.search}
              onChange={handleSearchChange}
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter.status === 'all' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter.status === 'online' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('online')}
            >
              Online
            </button>
            <button
              className={`filter-btn ${filter.status === 'offline' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('offline')}
            >
              Offline
            </button>
            <button
              className={`filter-btn ${filter.status === 'unknown' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('unknown')}
            >
              Unknown
            </button>
          </div>

          <button
            className="btn btn-secondary"
            onClick={onCheckAllStatuses}
            disabled={sites.length === 0}
          >
            Check All
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <h3>Error Loading Sites</h3>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : sites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌐</div>
          <h3>No sites found</h3>
          <p>
            {filter.search || filter.status !== 'all'
              ? 'Try adjusting your filters'
              : 'Add your first WordPress site to get started'}
          </p>
        </div>
      ) : (
        <div className="site-table-wrapper">
          <table className="site-table">
            <thead>
              <tr>
                <th className="col-status">Status</th>
                <th className="col-name">Name</th>
                <th className="col-url">URL</th>
                <th className="col-server">Server</th>
                <th className="col-wp">WP Version</th>
                <th className="col-theme">Theme</th>
                <th className="col-checked">Last Checked</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sites.map(site => (
                <tr key={site.id} className={`site-row ${site.status}`}>
                  <td className="col-status">
                    <span className={`status-indicator ${site.status}`} title={site.status}>
                      {getStatusIcon(site.status)}
                    </span>
                  </td>
                  <td className="col-name">
                    <a href={site.url} target="_blank" rel="noopener noreferrer">
                      {site.name}
                    </a>
                  </td>
                  <td className="col-url">
                    <a href={site.url} target="_blank" rel="noopener noreferrer">
                      {site.url.replace(/^https?:\/\//, '')}
                    </a>
                  </td>
                  <td className="col-server">{site.server || '—'}</td>
                  <td className="col-wp">{site.wp_version || '—'}</td>
                  <td className="col-theme">{site.theme_name || '—'}</td>
                  <td className="col-checked">{formatDate(site.last_checked)}</td>
                  <td className="col-actions">
                    <div className="action-buttons">
                      <button
                        className="btn btn-icon"
                        onClick={() => handleCheckStatus(site.id)}
                        disabled={checkingId === site.id}
                        title="Check status"
                      >
                        {checkingId === site.id ? '⏳' : '🔄'}
                      </button>
                      <button
                        className="btn btn-icon"
                        onClick={() => handleScan(site.id)}
                        disabled={scanningId === site.id}
                        title="Scan for WordPress info"
                      >
                        {scanningId === site.id ? '⏳' : '🔍'}
                      </button>
                      <button
                        className="btn btn-icon"
                        onClick={() => onEdit(site)}
                        title="Edit site"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-icon btn-danger-icon"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${site.name}"?`)) {
                            onDelete(site.id);
                          }
                        }}
                        title="Delete site"
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
