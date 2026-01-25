import { useState } from 'react';

export function ConfigPanel({ config, status, error, onConnect }) {
  const [url, setUrl] = useState(config.url || '');
  const [authToken, setAuthToken] = useState(config.authToken || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onConnect({ url, authToken });
  };

  return (
    <div className="config-panel">
      <h2>Database Configuration</h2>
      <p>Connect to your Turso database to manage server inventory.</p>

      {error && (
        <div className="error-banner">
          <h3>Connection Error</h3>
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
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="auth-token">Auth Token</label>
          <input
            id="auth-token"
            type="password"
            value={authToken}
            onChange={(e) => setAuthToken(e.target.value)}
            placeholder="Your database auth token"
            required
          />
        </div>

        <div className="config-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={status === 'connecting'}
          >
            {status === 'connecting' ? 'Connecting...' : 'Connect'}
          </button>
        </div>
      </form>

      <details className="setup-help">
        <summary>Need help setting up Turso?</summary>
        <div className="help-content">
          <ol>
            <li>
              Create a free Turso account at <a href="https://turso.tech" target="_blank" rel="noopener noreferrer">turso.tech</a>
            </li>
            <li>
              Install the Turso CLI:
              <code>curl -sSfL https://get.tur.so/install.sh | bash</code>
            </li>
            <li>
              Create a new database:
              <code>turso db create server-inventory</code>
            </li>
            <li>
              Get your database URL:
              <code>turso db show server-inventory --url</code>
            </li>
            <li>
              Create an auth token:
              <code>turso db tokens create server-inventory</code>
            </li>
          </ol>
        </div>
      </details>
    </div>
  );
}
