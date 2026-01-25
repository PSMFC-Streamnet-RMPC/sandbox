import { useState } from 'react';
import { useConnection } from './hooks/useConnection';
import { useServers } from './hooks/useServers';
import { ConfigPanel } from './components/ConfigPanel';
import { ServerForm } from './components/ServerForm';
import { ServerList } from './components/ServerList';

const TEAM_PASSWORD = 'HAL9000';

function PasswordGate({ onAuthenticate }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === TEAM_PASSWORD) {
      sessionStorage.setItem('server_inventory_auth', 'true');
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
    return sessionStorage.getItem('server_inventory_auth') === 'true';
  });

  const connection = useConnection();
  const servers = useServers(connection.isConnected);
  const [showForm, setShowForm] = useState(false);
  const [editingServer, setEditingServer] = useState(null);
  const [checkingAll, setCheckingAll] = useState(false);

  // Don't render main app until authenticated
  if (!isAuthenticated) {
    return <PasswordGate onAuthenticate={() => setIsAuthenticated(true)} />;
  }

  const handleAddServer = async (serverData) => {
    const result = await servers.addServer(serverData);
    if (result.success) {
      setShowForm(false);
    }
    return result;
  };

  const handleEditServer = async (serverData) => {
    const result = await servers.updateServer(editingServer.id, serverData);
    if (result.success) {
      setEditingServer(null);
    }
    return result;
  };

  const handleStartEdit = (server) => {
    setEditingServer(server);
    setShowForm(false);
  };

  const handleCheckAllStatuses = async () => {
    setCheckingAll(true);
    await servers.checkAllStatuses();
    setCheckingAll(false);
  };

  return (
    <div className="app">
      <header className="header">
        <a href="/sandbox/" className="back-link">← Sandbox</a>
        <h1>Server Inventory</h1>
        <p className="subtitle">Technical Group Infrastructure</p>

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
          {editingServer && (
            <ServerForm
              initialData={editingServer}
              onSubmit={handleEditServer}
              onCancel={() => setEditingServer(null)}
              disabled={false}
            />
          )}

          {/* Add form toggle */}
          {!editingServer && (
            <div className="add-server-section">
              {showForm ? (
                <ServerForm
                  onSubmit={handleAddServer}
                  onCancel={() => setShowForm(false)}
                  disabled={false}
                />
              ) : (
                <button
                  className="btn btn-primary btn-large"
                  onClick={() => setShowForm(true)}
                >
                  Add New Server
                </button>
              )}
            </div>
          )}

          {/* Server list */}
          <ServerList
            servers={servers.servers}
            loading={servers.loading}
            error={servers.error}
            filter={servers.filter}
            stats={servers.stats}
            onFilterChange={servers.setFilter}
            onCheckStatus={servers.checkStatus}
            onCheckAllStatuses={handleCheckAllStatuses}
            onEdit={handleStartEdit}
            onDelete={servers.deleteServer}
          />

          {checkingAll && (
            <div className="checking-overlay">
              <div className="checking-modal">
                <div className="spinner"></div>
                <p>Checking all servers...</p>
              </div>
            </div>
          )}
        </>
      )}

      <footer className="footer">
        <p>Server Inventory Prototype</p>
      </footer>
    </div>
  );
}

export default App;
