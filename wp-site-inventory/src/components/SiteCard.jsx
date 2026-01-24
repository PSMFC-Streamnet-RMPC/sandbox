import { useState } from 'react';

export function SiteCard({ site, onCheckStatus, onScan, onEdit, onDelete }) {
  const [checking, setChecking] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleCheckStatus = async () => {
    setChecking(true);
    await onCheckStatus(site.id);
    setChecking(false);
  };

  const handleScan = async () => {
    setScanning(true);
    await onScan(site.id);
    setScanning(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'status-online';
      case 'offline': return 'status-offline';
      default: return 'status-unknown';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return '🟢';
      case 'offline': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className={`site-card ${site.status}`}>
      <div className="site-card-header">
        <div className="site-info">
          <h3 className="site-name">
            <a href={site.url} target="_blank" rel="noopener noreferrer">
              {site.name}
            </a>
          </h3>
          <span className={`status-badge ${getStatusColor(site.status)}`}>
            {getStatusIcon(site.status)} {site.status}
          </span>
        </div>
        <div className="site-actions">
          <button
            className="btn btn-icon"
            onClick={handleCheckStatus}
            disabled={checking}
            title="Check status"
          >
            {checking ? '⏳' : '🔄'}
          </button>
          <button
            className="btn btn-icon"
            onClick={handleScan}
            disabled={scanning}
            title="Scan for WordPress info"
          >
            {scanning ? '⏳' : '🔍'}
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
      </div>

      <div className="site-url">
        <a href={site.url} target="_blank" rel="noopener noreferrer">
          {site.url}
        </a>
      </div>

      {site.description && (
        <p className="site-description">{site.description}</p>
      )}

      <div className="site-details">
        <div className="detail-grid">
          {site.wp_version && (
            <div className="detail-item">
              <span className="detail-label">WordPress</span>
              <span className="detail-value">{site.wp_version}</span>
            </div>
          )}
          {site.php_version && (
            <div className="detail-item">
              <span className="detail-label">PHP</span>
              <span className="detail-value">{site.php_version}</span>
            </div>
          )}
          {site.theme_name && (
            <div className="detail-item">
              <span className="detail-label">Theme</span>
              <span className="detail-value">{site.theme_name}</span>
            </div>
          )}
          {site.hosting_provider && (
            <div className="detail-item">
              <span className="detail-label">Hosting</span>
              <span className="detail-value">{site.hosting_provider}</span>
            </div>
          )}
        </div>

        {site.detected_plugins && site.detected_plugins.length > 0 && (
          <div className="site-plugins">
            <span className="detail-label">Detected Plugins:</span>
            <div className="plugin-tags">
              {site.detected_plugins.slice(0, 5).map((plugin, i) => (
                <span key={i} className="plugin-tag">{plugin}</span>
              ))}
              {site.detected_plugins.length > 5 && (
                <span className="plugin-tag more">+{site.detected_plugins.length - 5} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      {(site.contact_name || site.contact_email) && (
        <div className="site-contact">
          <span className="detail-label">Contact:</span>
          <span className="detail-value">
            {site.contact_name}
            {site.contact_email && (
              <a href={`mailto:${site.contact_email}`}> ({site.contact_email})</a>
            )}
          </span>
        </div>
      )}

      {site.maintenance_window && (
        <div className="site-maintenance">
          <span className="detail-label">Maintenance Window:</span>
          <span className="detail-value">{site.maintenance_window}</span>
        </div>
      )}

      {site.tags && site.tags.length > 0 && (
        <div className="site-tags">
          {site.tags.map((tag, i) => (
            <span key={i} className="tag">{tag}</span>
          ))}
        </div>
      )}

      {site.notes && (
        <div className="site-notes">
          <span className="detail-label">Notes:</span>
          <p>{site.notes}</p>
        </div>
      )}

      <div className="site-meta">
        <span>Last checked: {formatDate(site.last_checked)}</span>
      </div>
    </div>
  );
}
