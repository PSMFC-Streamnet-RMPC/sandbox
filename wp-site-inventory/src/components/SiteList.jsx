import { SiteCard } from './SiteCard';

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
  const handleSearchChange = (e) => {
    onFilterChange({ ...filter, search: e.target.value });
  };

  const handleStatusFilter = (status) => {
    onFilterChange({ ...filter, status });
  };

  return (
    <div className="site-list">
      <div className="site-list-header">
        <div className="header-top">
          <h2>📋 WordPress Sites</h2>
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
              🟢 Online
            </button>
            <button
              className={`filter-btn ${filter.status === 'offline' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('offline')}
            >
              🔴 Offline
            </button>
            <button
              className={`filter-btn ${filter.status === 'unknown' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('unknown')}
            >
              ⚪ Unknown
            </button>
          </div>

          <button
            className="btn btn-secondary"
            onClick={onCheckAllStatuses}
            disabled={sites.length === 0}
          >
            🔄 Check All
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
        <div className="site-grid">
          {sites.map(site => (
            <SiteCard
              key={site.id}
              site={site}
              onCheckStatus={onCheckStatus}
              onScan={onScan}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
