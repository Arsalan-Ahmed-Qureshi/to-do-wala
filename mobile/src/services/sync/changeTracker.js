import { getSyncQueue } from '../database/sqlite';

/**
 * Change Tracker - Records all local changes for later sync
 * Monitors todo operations and builds a changeset
 */
export class ChangeTracker {
  constructor() {
    this.changes = [];
  }

  /**
   * Record a change to be synced
   */
  recordChange(operation, entityType, entityId, entityData, version = 0) {
    this.changes.push({
      operation, // CREATE, UPDATE, DELETE
      entityType, // TODO, USER
      entityId,
      data: entityData,
      version,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Get all pending changes
   */
  getPendingChanges() {
    return this.changes;
  }

  /**
   * Clear changes after successful sync
   */
  clearChanges() {
    this.changes = [];
  }

  /**
   * Load changes from sync queue
   */
  async loadFromQueue() {
    try {
      const queueItems = await getSyncQueue();
      this.changes = queueItems.map((item) => ({
        operation: item.operationType,
        entityType: item.entityType,
        entityId: item.entityId,
        data: JSON.parse(item.payload),
        version: item.retryCount,
        timestamp: item.createdAt,
      }));
    } catch (error) {
      console.error('Error loading changes from queue:', error);
    }
  }
}
