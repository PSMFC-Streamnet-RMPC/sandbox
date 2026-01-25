import { useState, useEffect, useCallback } from 'react';
import * as db from '../lib/turso';
import { pingServer } from '../lib/serverChecker';

export function useServers(isConnected) {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    status: 'all',
    os_type: 'all',
    environment: 'all',
    search: ''
  });

  // Fetch all servers
  const fetchServers = useCallback(async () => {
    if (!isConnected) return;

    setLoading(true);
    setError(null);

    try {
      const data = await db.getServers(filter);
      setServers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isConnected, filter]);

  // Add a new server
  const addServer = useCallback(async (serverData) => {
    try {
      await db.createServer(serverData);
      await fetchServers();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchServers]);

  // Update a server
  const updateServer = useCallback(async (id, updates) => {
    try {
      await db.updateServer(id, updates);
      await fetchServers();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchServers]);

  // Delete a server
  const deleteServer = useCallback(async (id) => {
    try {
      await db.deleteServer(id);
      await fetchServers();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchServers]);

  // Check status of a single server
  const checkStatus = useCallback(async (id) => {
    const server = servers.find(s => s.id === id);
    if (!server) return;

    try {
      const result = await pingServer(server);
      const status = result.online ? 'online' : 'offline';
      const lastChecked = result.checkedAt;

      await db.updateServerStatus(id, status, lastChecked);
      await fetchServers();

      return { success: true, status };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [servers, fetchServers]);

  // Check status of all servers
  const checkAllStatuses = useCallback(async () => {
    const results = [];

    for (const server of servers) {
      try {
        const result = await pingServer(server);
        const status = result.online ? 'online' : 'offline';
        const lastChecked = result.checkedAt;

        await db.updateServerStatus(server.id, status, lastChecked);
        results.push({ id: server.id, status, success: true });
      } catch (err) {
        results.push({ id: server.id, success: false, error: err.message });
      }
    }

    await fetchServers();
    return results;
  }, [servers, fetchServers]);

  // Fetch servers when connection status changes
  useEffect(() => {
    if (isConnected) {
      fetchServers();
    }
  }, [isConnected, fetchServers]);

  // Stats calculation
  const stats = {
    total: servers.length,
    online: servers.filter(s => s.status === 'online').length,
    offline: servers.filter(s => s.status === 'offline').length,
    maintenance: servers.filter(s => s.status === 'maintenance').length,
    unknown: servers.filter(s => s.status === 'unknown').length,
    ubuntu: servers.filter(s => s.os_type === 'ubuntu').length,
    windows: servers.filter(s => s.os_type?.startsWith('windows')).length,
    production: servers.filter(s => s.environment === 'production').length
  };

  return {
    servers,
    loading,
    error,
    filter,
    setFilter,
    stats,
    fetchServers,
    addServer,
    updateServer,
    deleteServer,
    checkStatus,
    checkAllStatuses
  };
}
