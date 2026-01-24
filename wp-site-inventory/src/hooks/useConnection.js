import { useState, useEffect, useCallback } from 'react';
import * as db from '../lib/turso';

export function useConnection() {
  const [status, setStatus] = useState('disconnected'); // 'connected', 'disconnected', 'connecting'
  const [config, setConfigState] = useState(db.getConfig());
  const [error, setError] = useState(null);

  const testConnection = useCallback(async () => {
    if (!config.url || !config.authToken) {
      setStatus('disconnected');
      return false;
    }

    setStatus('connecting');
    setError(null);

    const result = await db.testConnection();

    if (result.success) {
      setStatus('connected');
      // Initialize schema on successful connection
      try {
        await db.initializeSchema();
      } catch (err) {
        console.warn('Schema initialization warning:', err.message);
      }
      return true;
    } else {
      setStatus('disconnected');
      setError(result.error);
      return false;
    }
  }, [config.url, config.authToken]);

  const updateConfig = useCallback(async (newConfig) => {
    db.setConfig(newConfig);
    setConfigState({ ...config, ...newConfig });
  }, [config]);

  const connect = useCallback(async (newConfig) => {
    if (newConfig) {
      db.setConfig(newConfig);
      setConfigState({ ...config, ...newConfig });
    }
    return testConnection();
  }, [config, testConnection]);

  const isConfigured = config.url && config.authToken;

  // Test connection on mount if configured
  useEffect(() => {
    if (isConfigured) {
      testConnection();
    }
  }, []);

  return {
    status,
    config,
    error,
    isConfigured,
    isConnected: status === 'connected',
    updateConfig,
    connect,
    testConnection
  };
}
