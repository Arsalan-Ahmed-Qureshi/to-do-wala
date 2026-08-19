import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSyncing, setSyncStatus, setSyncError, setLastSyncTime } from '../../store/syncSlice';
import { SyncEngine } from './syncEngine';
import NetInfo from '@react-native-community/netinfo';

let syncEngine = null;
let syncInterval = null;

/**
 * useSyncEngine Hook
 * Manages automatic sync when online, manual sync trigger
 */
export const useSyncEngine = () => {
  const dispatch = useDispatch();
  const isOnline = useSelector((state) => state.network.isOnline);
  const syncStatus = useSelector((state) => state.sync.syncStatus);

  useEffect(() => {
    // Initialize sync engine
    syncEngine = new SyncEngine(dispatch, () => ({
      sync: { lastSyncTime: null, isSyncing: false },
      network: { isOnline },
    }));

    return () => {
      if (syncInterval) {
        clearInterval(syncInterval);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      console.log('⚪ App is offline - sync paused');
      if (syncInterval) clearInterval(syncInterval);
      return;
    }

    console.log('🟢 App is online - starting sync loop');

    // Perform immediate sync
    performSync();

    // Schedule periodic sync every 5 minutes
    syncInterval = setInterval(performSync, 5 * 60 * 1000);

    return () => {
      if (syncInterval) clearInterval(syncInterval);
    };
  }, [isOnline]);

  const performSync = async () => {
    if (syncStatus === 'syncing') return;

    dispatch(setSyncing(true));
    dispatch(setSyncStatus('syncing'));

    try {
      const result = await syncEngine.performSync();

      if (result.success) {
        dispatch(setSyncStatus('success'));
        dispatch(setLastSyncTime(new Date().toISOString()));
        console.log('✅ Sync successful');
      } else {
        dispatch(setSyncStatus('error'));
        dispatch(setSyncError(result.error));
        console.error('❌ Sync failed:', result.error);
      }
    } catch (error) {
      dispatch(setSyncStatus('error'));
      dispatch(setSyncError(error.message));
      console.error('Sync error:', error);
    } finally {
      dispatch(setSyncing(false));
    }
  };

  return {
    performSync,
    syncStatus,
    syncEngine,
  };
};
