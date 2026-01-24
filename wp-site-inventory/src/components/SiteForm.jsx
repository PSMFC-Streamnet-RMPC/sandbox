import { useState } from 'react';

export function SiteForm({ onSubmit, onCancel, initialData = null, disabled }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    url: initialData?.url || '',
    description: initialData?.description || '',
    hosting_provider: initialData?.hosting_provider || '',
    contact_name: initialData?.contact_name || '',
    contact_email: initialData?.contact_email || '',
    maintenance_window: initialData?.maintenance_window || '',
    notes: initialData?.notes || '',
    tags: initialData?.tags?.join(', ') || ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          hosting_provider: '',
          contact_name: '',
          contact_email: '',
          maintenance_window: '',
          notes: '',
          tags: ''
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
      <h2>{isEditing ? '✏️ Edit Site' : '➕ Add New Site'}</h2>

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
        <h3>Technical Details</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="site-hosting">Hosting Provider</label>
            <input
              id="site-hosting"
              name="hosting_provider"
              type="text"
              value={formData.hosting_provider}
              onChange={handleChange}
              placeholder="WP Engine, Pantheon, etc."
              disabled={disabled}
            />
          </div>

          <div className="form-group">
            <label htmlFor="site-maintenance">Maintenance Window</label>
            <input
              id="site-maintenance"
              name="maintenance_window"
              type="text"
              value={formData.maintenance_window}
              onChange={handleChange}
              placeholder="Sundays 2-4am EST"
              disabled={disabled}
            />
          </div>
        </div>
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
