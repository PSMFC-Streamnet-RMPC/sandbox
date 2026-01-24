import { useState, useEffect, useCallback } from 'react';
import * as db from '../lib/turso';
import { scanSite, checkSiteStatus } from '../lib/siteChecker';

export function useSites(isConnected) {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ status: 'all', search: '' });

  // Fetch all sites
  const fetchSites = useCallback(async () => {
    if (!isConnected) return;

    setLoading(true);
    setError(null);

    try {
      const data = await db.getSites(filter);
      setSites(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isConnected, filter]);

  // Add a new site
  const addSite = useCallback(async (siteData) => {
    try {
      await db.createSite(siteData);
      await fetchSites();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchSites]);

  // Update a site
  const updateSite = useCallback(async (id, updates) => {
    try {
      await db.updateSite(id, updates);
      await fetchSites();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchSites]);

  // Delete a site
  const deleteSite = useCallback(async (id) => {
    try {
      await db.deleteSite(id);
      await fetchSites();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchSites]);

  // Check status of a single site
  const checkStatus = useCallback(async (id) => {
    const site = sites.find(s => s.id === id);
    if (!site) return;

    try {
      const result = await checkSiteStatus(site.url);
      const status = result.online ? 'online' : 'offline';
      const lastChecked = result.checkedAt;

      await db.updateSiteStatus(id, status, lastChecked);
      await fetchSites();

      return { success: true, status };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [sites, fetchSites]);

  // Check status of all sites
  const checkAllStatuses = useCallback(async () => {
    const results = [];

    for (const site of sites) {
      try {
        const result = await checkSiteStatus(site.url);
        const status = result.online ? 'online' : 'offline';
        const lastChecked = result.checkedAt;

        await db.updateSiteStatus(site.id, status, lastChecked);
        results.push({ id: site.id, status, success: true });
      } catch (err) {
        results.push({ id: site.id, success: false, error: err.message });
      }
    }

    await fetchSites();
    return results;
  }, [sites, fetchSites]);

  // Scan a site for WordPress info
  const scanSiteInfo = useCallback(async (id) => {
    const site = sites.find(s => s.id === id);
    if (!site) return { success: false, error: 'Site not found' };

    try {
      const scanResult = await scanSite(site.url);

      const updates = {
        status: scanResult.status,
        last_checked: scanResult.lastChecked
      };

      if (scanResult.wpInfo) {
        if (scanResult.wpInfo.wpVersion) {
          updates.wp_version = scanResult.wpInfo.wpVersion;
        }
        if (scanResult.wpInfo.themeName) {
          updates.theme_name = scanResult.wpInfo.themeName;
        }
        if (scanResult.wpInfo.plugins && scanResult.wpInfo.plugins.length > 0) {
          updates.detected_plugins = scanResult.wpInfo.plugins;
        }
      }

      if (scanResult.hostingProvider) {
        updates.hosting_provider = scanResult.hostingProvider;
      }

      await db.updateSite(id, updates);
      await fetchSites();

      return { success: true, data: scanResult };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [sites, fetchSites]);

  // Fetch sites when connection status changes
  useEffect(() => {
    if (isConnected) {
      fetchSites();
    }
  }, [isConnected, fetchSites]);

  // Stats calculation
  const stats = {
    total: sites.length,
    online: sites.filter(s => s.status === 'online').length,
    offline: sites.filter(s => s.status === 'offline').length,
    unknown: sites.filter(s => s.status === 'unknown').length
  };

  return {
    sites,
    loading,
    error,
    filter,
    setFilter,
    stats,
    fetchSites,
    addSite,
    updateSite,
    deleteSite,
    checkStatus,
    checkAllStatuses,
    scanSiteInfo
  };
}
