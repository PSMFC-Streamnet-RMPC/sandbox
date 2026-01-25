import { useState, useEffect } from 'react';
import { useConnection } from './hooks/useConnection';
import { useSites } from './hooks/useSites';
import { ConfigPanel } from './components/ConfigPanel';
import { SiteForm } from './components/SiteForm';
import { SiteList } from './components/SiteList';

const TEAM_PASSWORD = 'HAL9000';

function PasswordGate({ onAuthenticate }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === TEAM_PASSWORD) {
      sessionStorage.setItem('wp_inventory_auth', 'true');
      onAuthenticate();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="password-gate">
      <div className="password-modal">
        <h2>Team Access Required</h2>
        <p>Enter the team password to continue.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Enter password"
            autoFocus
          />
          {error && <span className="password-error">I'm sorry, Dave. I'm afraid I can't do that.</span>}
          <button type="submit" className="btn btn-primary">
            Enter
          </button>
        </form>
        <a href="/sandbox/" className="back-link">← Back to Sandbox</a>
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('wp_inventory_auth') === 'true';
  });

  const connection = useConnection();
  const sites = useSites(connection.isConnected);
  const [showForm, setShowForm] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [checkingAll, setCheckingAll] = useState(false);

  // Don't render main app until authenticated
  if (!isAuthenticated) {
    return <PasswordGate onAuthenticate={() => setIsAuthenticated(true)} />;
  }

  const handleAddSite = async (siteData) => {
    const result = await sites.addSite(siteData);
    if (result.success) {
      setShowForm(false);
    }
    return result;
  };

  const handleEditSite = async (siteData) => {
    const result = await sites.updateSite(editingSite.id, siteData);
    if (result.success) {
      setEditingSite(null);
    }
    return result;
  };

  const handleStartEdit = (site) => {
    setEditingSite(site);
    setShowForm(false);
  };

  const handleCheckAllStatuses = async () => {
    setCheckingAll(true);
    await sites.checkAllStatuses();
    setCheckingAll(false);
  };

  return (
    <div className="app">
      <header className="header">
        <a href="/sandbox/" className="back-link">← Sandbox</a>
        <h1>Team Nancy WordPress Site Inventory</h1>

        <div className={`connection-status ${connection.status}`}>
          <span className="status-dot"></span>
          {connection.status === 'connected' && 'Connected to database'}
          {connection.status === 'connecting' && 'Connecting...'}
          {connection.status === 'disconnected' && 'Not connected'}
        </div>
      </header>

      {!connection.isConnected && (
        <ConfigPanel
          config={connection.config}
          status={connection.status}
          error={connection.error}
          onConnect={connection.connect}
        />
      )}

      {connection.isConnected && (
        <>
          {/* Edit form */}
          {editingSite && (
            <SiteForm
              initialData={editingSite}
              onSubmit={handleEditSite}
              onCancel={() => setEditingSite(null)}
              disabled={false}
            />
          )}

          {/* Add form toggle */}
          {!editingSite && (
            <div className="add-site-section">
              {showForm ? (
                <SiteForm
                  onSubmit={handleAddSite}
                  onCancel={() => setShowForm(false)}
                  disabled={false}
                />
              ) : (
                <button
                  className="btn btn-primary btn-large"
                  onClick={() => setShowForm(true)}
                >
                  Add New Site
                </button>
              )}
            </div>
          )}

          {/* Site list */}
          <SiteList
            sites={sites.sites}
            loading={sites.loading}
            error={sites.error}
            filter={sites.filter}
            stats={sites.stats}
            onFilterChange={sites.setFilter}
            onCheckStatus={sites.checkStatus}
            onCheckAllStatuses={handleCheckAllStatuses}
            onScan={sites.scanSiteInfo}
            onEdit={handleStartEdit}
            onDelete={sites.deleteSite}
          />

          {checkingAll && (
            <div className="checking-overlay">
              <div className="checking-modal">
                <div className="spinner"></div>
                <p>Checking all sites...</p>
              </div>
            </div>
          )}
        </>
      )}

      <footer className="footer">
        <p>WordPress Site Inventory Prototype</p>
      </footer>
    </div>
  );
}

export default App;
