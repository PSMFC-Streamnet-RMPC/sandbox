import { useState } from 'react';
import { scanSite } from '../lib/siteChecker';

export function SiteForm({ onSubmit, onCancel, initialData = null, disabled }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    url: initialData?.url || '',
    description: initialData?.description || '',
    wp_version: initialData?.wp_version || '',
    theme_name: initialData?.theme_name || '',
    server: initialData?.server || '',
    hosting_provider: initialData?.hosting_provider || '',
    contact_name: initialData?.contact_name ?? 'Dan Webb',
    contact_email: initialData?.contact_email ?? 'dwebb@psmfc.org',
    maintenance_window: initialData?.maintenance_window || '',
    notes: initialData?.notes || '',
    tags: initialData?.tags?.join(', ') ?? 'psmfc, fisheries',
    detected_plugins: initialData?.detected_plugins || []
  });
  const [submitting, setSubmitting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScan = async () => {
    if (!formData.url.trim()) return;

    setScanning(true);
    setScanStatus('Scanning site...');

    try {
      let url = formData.url.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const results = await scanSite(url);

      // Update form with detected info
      // Prefer meta description, then wp-json description
      const detectedDescription = results.wpInfo?.metaDescription
        || results.wpInfo?.siteDescription
        || '';

      setFormData(prev => ({
        ...prev,
        url, // Use normalized URL
        wp_version: results.wpInfo?.wpVersion || prev.wp_version,
        theme_name: results.wpInfo?.themeName || prev.theme_name,
        hosting_provider: results.hostingProvider || prev.hosting_provider,
        detected_plugins: results.wpInfo?.plugins || prev.detected_plugins,
        // Auto-fill description if empty
        description: prev.description || detectedDescription,
      }));

      if (results.wpInfo?.isWordPress) {
        setScanStatus('WordPress site detected!');
      } else if (results.status === 'online') {
        setScanStatus('Site is online (WordPress not detected)');
      } else {
        setScanStatus('Could not reach site');
      }
    } catch (err) {
      setScanStatus('Scan failed: ' + err.message);
    } finally {
      setScanning(false);
      // Clear status after 3 seconds
      setTimeout(() => setScanStatus(null), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.url.trim() || submitting) return;

    setSubmitting(true);
    try {
      // Normalize URL
      let url = formData.url.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      // Parse tags
      const tags = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        url,
        tags
      });

      // Reset form if not editing
      if (!initialData) {
        setFormData({
          name: '',
          url: '',
          description: '',
          wp_version: '',
          theme_name: '',
          server: '',
          hosting_provider: '',
          contact_name: 'Dan Webb',
          contact_email: 'dwebb@psmfc.org',
          maintenance_window: '',
          notes: '',
          tags: 'psmfc, fisheries',
          detected_plugins: []
        });
      }
    } catch (err) {
      console.error('Failed to save site:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = !!initialData;

  return (
    <form className="site-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Edit Site' : 'Add New Site'}</h2>

      <div className="form-section">
        <h3>Basic Information</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="site-name">Site Name *</label>
            <input
              id="site-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Corporate Blog"
              disabled={disabled}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="site-url">URL *</label>
            <div className="url-input-group">
              <input
                id="site-url"
                name="url"
                type="text"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://blog.example.com"
                disabled={disabled}
                required
              />
              <button
                type="button"
                className="btn btn-secondary btn-scan"
                onClick={handleScan}
                disabled={disabled || scanning || !formData.url.trim()}
              >
                {scanning ? 'Scanning...' : 'Auto-Detect'}
              </button>
            </div>
            {scanStatus && (
              <span className="scan-status">{scanStatus}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="site-description">Description</label>
          <textarea
            id="site-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What is this site for?"
            disabled={disabled}
            rows={2}
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Technical Details (auto-detected)</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="site-wp-version">WordPress Version</label>
            <input
              id="site-wp-version"
              name="wp_version"
              type="text"
              value={formData.wp_version}
              onChange={handleChange}
              placeholder="6.4.2"
              disabled={disabled}
            />
          </div>

          <div className="form-group">
            <label htmlFor="site-theme">Theme</label>
            <input
              id="site-theme"
              name="theme_name"
              type="text"
              value={formData.theme_name}
              onChange={handleChange}
              placeholder="twentytwentyfour"
              disabled={disabled}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="site-server">Server</label>
          <input
            id="site-server"
            name="server"
            type="text"
            value={formData.server}
            onChange={handleChange}
            placeholder="PERCIWEB, perciweb.psmfc.org"
            disabled={disabled}
          />
        </div>

        {formData.detected_plugins.length > 0 && (
          <div className="form-group">
            <label>Detected Plugins</label>
            <div className="detected-plugins">
              {formData.detected_plugins.map((plugin, i) => (
                <span key={i} className="plugin-tag">{plugin}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="form-section">
        <h3>Contact Information</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="site-contact-name">Contact Name</label>
            <input
              id="site-contact-name"
              name="contact_name"
              type="text"
              value={formData.contact_name}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={disabled}
            />
          </div>

          <div className="form-group">
            <label htmlFor="site-contact-email">Contact Email</label>
            <input
              id="site-contact-email"
              name="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={handleChange}
              placeholder="john@example.com"
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Additional Info</h3>

        <div className="form-group">
          <label htmlFor="site-tags">Tags (comma separated)</label>
          <input
            id="site-tags"
            name="tags"
            type="text"
            value={formData.tags}
            onChange={handleChange}
            placeholder="production, marketing, blog"
            disabled={disabled}
          />
        </div>

        <div className="form-group">
          <label htmlFor="site-notes">Notes</label>
          <textarea
            id="site-notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional notes about this site..."
            disabled={disabled}
            rows={3}
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={disabled || !formData.name.trim() || !formData.url.trim() || submitting}
        >
          {submitting ? 'Saving...' : (isEditing ? 'Update Site' : 'Add Site')}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
