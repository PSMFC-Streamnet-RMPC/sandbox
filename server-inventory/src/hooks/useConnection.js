import { useState, useCallback, useEffect } from 'react';
import * as db from '../lib/turso';

export function useConnection() {
  const [status, setStatus] = useState('disconnected'); // disconnected, connecting, connected
  const [error, setError] = useState(null);
  const [config, setConfigState] = useState(db.getConfig());

  const connect = useCallback(async (newConfig = null) => {
    setStatus('connecting');
    setError(null);

    try {
      if (newConfig) {
        db.setConfig(newConfig);
        setConfigState(newConfig);
      }

      const result = await db.testConnection();

      if (result.success) {
        await db.initializeSchema();
        setStatus('connected');
        return { success: true };
      } else {
        setStatus('disconnected');
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setStatus('disconnected');
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  // Auto-connect if configured
  useEffect(() => {
    if (db.isConfigured()) {
      connect();
    }
  }, [connect]);

  return {
    status,
    error,
    config,
    isConnected: status === 'connected',
    connect
  };
}
