import { syncAPI } from '../api/axiosConfig';
import { getSyncQueue, markSyncQueueItemAsSynced, incrementRetryCount, addSyncLog } from '../database/sqlite';
import { ChangeTracker } from './changeTracker';
import { ConflictResolver } from './conflictResolver';

/**
 * Sync Engine Orchestrator
 * Manages the push/pull cycle with exponential backoff retry logic
 */
export class SyncEngine {
  constructor(dispatch, getState) {
    this.dispatch = dispatch;
    this.getState = getState;
    this.changeTracker = new ChangeTracker();
    this.isSyncing = false;
    this.retryQueue = [];
    this.maxRetries = 3;
    this.baseRetryDelay = 1000; // 1 second
  }

  /**
   * Start full sync cycle: push local changes, then pull server changes
   */
  async performSync() {
    if (this.isSyncing) {
      console.log('⏳ Sync already in progress');
      return { success: false, reason: 'Sync in progress' };
    }

    this.isSyncing = true;
    const syncStartTime = new Date();

    try {
      console.log('🔄 Starting sync cycle...');

      // Step 1: Push local changes to server
      await this.pushChanges();

      // Step 2: Pull latest from server
      await this.pullChanges();

      // Step 3: Log successful sync
      const syncEndTime = new Date();
      await addSyncLog('success', this.changeTracker.changes.length, null);

      console.log('✅ Sync completed successfully');
      return {
        success: true,
        duration: syncEndTime - syncStartTime,
        changeCount: this.changeTracker.changes.length,
      };
    } catch (error) {
      console.error('❌ Sync error:', error);
      await addSyncLog('error', 0, error.message);
      return { success: false, error: error.message };
    } finally {
      this.isSyncing = false;
      this.changeTracker.clearChanges();
    }
  }

  /**
   * Push local changes to server
   * POST /api/sync/push
   */
  async pushChanges() {
    try {
      console.log('📤 Pushing local changes...');

      // Load pending changes from queue
      await this.changeTracker.loadFromQueue();
      const changes = this.changeTracker.getPendingChanges();

      if (changes.length === 0) {
        console.log('✓ No changes to push');
        return;
      }

      // Prepare sync payload
      const syncPayload = {
        changes: changes.map((change) => ({
          operation: change.operation,
          todoId: change.entityId,
          todo: change.data,
          version: change.version,
          timestamp: change.timestamp,
        })),
      };

      // Send to server
      const response = await syncAPI.pushChanges(syncPayload);
      const { processedCount, conflicts } = response.data;

      console.log(`✓ Pushed ${processedCount} changes`);
      if (conflicts.length > 0) {
        console.warn(`⚠️ ${conflicts.length} conflicts detected (client-wins applied)`);
      }

      // Mark queue items as synced
      const queueItems = await getSyncQueue();
      for (const item of queueItems) {
        await markSyncQueueItemAsSynced(item.id);
      }

      return { processedCount, conflicts };
    } catch (error) {
      console.error('Push error:', error);
      // Keep items in queue for retry
      throw error;
    }
  }

  /**
   * Pull latest changes from server
   * POST /api/sync/pull
   */
  async pullChanges() {
    try {
      console.log('📥 Pulling server changes...');

      const state = this.getState();
      const lastSyncTime = state.sync.lastSyncTime;

      // Request todos modified since last sync
      const response = await syncAPI.pullChanges(lastSyncTime);
      const { todos: serverTodos } = response.data;

      console.log(`✓ Received ${serverTodos.length} server changes`);

      // TODO: Update local database with server changes
      // Merge with local state using ConflictResolver
      // Update lastSyncTime in Redux

      return { receivedCount: serverTodos.length };
    } catch (error) {
      console.error('Pull error:', error);
      throw error;
    }
  }

  /**
   * Sync with exponential backoff retry
   */
  async syncWithRetry(maxAttempts = this.maxRetries) {
    let attempt = 0;

    while (attempt < maxAttempts) {
      try {
        const result = await this.performSync();
        if (result.success) {
          return result;
        }
      } catch (error) {
        attempt++;
        if (attempt >= maxAttempts) {
          console.error('❌ Max retries reached');
          throw error;
        }

        const delay = this.baseRetryDelay * Math.pow(2, attempt - 1);
        console.log(`⏳ Retry ${attempt}/${maxAttempts} in ${delay}ms`);
        await this.sleep(delay);
      }
    }
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get sync status
   */
  getStatus() {
    return {
      isSyncing: this.isSyncing,
      pendingChanges: this.changeTracker.changes.length,
    };
  }
}
