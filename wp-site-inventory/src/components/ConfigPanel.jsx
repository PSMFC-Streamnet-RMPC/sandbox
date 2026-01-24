import { useState } from 'react';

export function ConfigPanel({ config, status, error, onConnect }) {
  const [url, setUrl] = useState(config.url || '');
  const [authToken, setAuthToken] = useState(config.authToken || '');
  const [connecting, setConnecting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setConnecting(true);
    await onConnect({ url, authToken });
    setConnecting(false);
  };

  const isConnected = status === 'connected';

  return (
    <div className="config-panel">
      <h2>🔌 Database Connection</h2>
      <p>
        Connect to your Turso database to store and manage your WordPress site inventory.
      </p>

      {error && (
        <div className="error-banner">
          <h3>Connection Failed</h3>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="db-url">Database URL</label>
          <input
            id="db-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="libsql://your-database.turso.io"
            disabled={isConnected}
          />
        </div>

        <div className="form-group">
          <label htmlFor="db-token">Auth Token</label>
          <input
            id="db-token"
            type="password"
            value={authToken}
            onChange={(e) => setAuthToken(e.target.value)}
            placeholder="Your Turso auth token"
            disabled={isConnected}
          />
        </div>

        <div className="config-actions">
          {!isConnected ? (
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!url || !authToken || connecting}
            >
              {connecting ? 'Connecting...' : 'Connect'}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                localStorage.removeItem('turso_config');
                window.location.reload();
              }}
            >
              Disconnect
            </button>
          )}
        </div>
      </form>

      <details className="setup-help">
        <summary>Need help setting up Turso?</summary>
        <div className="help-content">
          <ol>
            <li>
              <strong>Install Turso CLI:</strong>
              <code>curl -sSfL https://get.tur.so/install.sh | bash</code>
            </li>
            <li>
              <strong>Login:</strong>
              <code>turso auth login</code>
            </li>
            <li>
              <strong>Create database:</strong>
              <code>turso db create wp-inventory</code>
            </li>
            <li>
              <strong>Get URL:</strong>
              <code>turso db show wp-inventory --url</code>
            </li>
            <li>
              <strong>Get token:</strong>
              <code>turso db tokens create wp-inventory</code>
            </li>
          </ol>
        </div>
      </details>
    </div>
  );
}
