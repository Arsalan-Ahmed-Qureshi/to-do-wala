/**
 * Conflict Resolver - Implements client-wins strategy
 * When server and client have conflicting changes, client version always wins
 */
export class ConflictResolver {
  /**
   * Resolve conflicts between local and server versions
   * Returns reconciled data and conflict list
   */
  static resolveConflicts(localTodo, serverTodo) {
    const conflicts = [];

    if (!serverTodo) {
      // Server doesn't have this todo - create it
      return { resolved: localTodo, conflicts };
    }

    // Check version - if server is newer, local still wins (client-wins)
    const hasVersionConflict = localTodo.version < serverTodo.version;

    const resolved = {
      ...localTodo,
      version: (serverTodo.version || 0) + 1, // Increment server version
      syncedAt: new Date().toISOString(),
    };

    if (hasVersionConflict) {
      conflicts.push({
        todoId: localTodo.id,
        field: 'version',
        localVersion: localTodo.version,
        serverVersion: serverTodo.version,
        resolution: 'client-wins',
        message: 'Local version was older but client-wins strategy applied',
      });
    }

    return { resolved, conflicts };
  }

  /**
   * Merge server changes into local state (for pull operations)
   * Only merge if local hasn't changed since last sync
   */
  static mergeServerChanges(localTodo, serverChanges, lastSyncTime) {
    // If local todo was modified after last sync, keep local version
    if (new Date(localTodo.updatedAt) > new Date(lastSyncTime || 0)) {
      return {
        merged: localTodo,
        conflict: true,
        reason: 'Local modification after sync time',
      };
    }

    // Otherwise, accept server version
    return {
      merged: {
        ...localTodo,
        ...serverChanges,
        syncedAt: new Date().toISOString(),
      },
      conflict: false,
    };
  }

  /**
   * Detect conflicts in a batch of todos
   */
  static detectBatchConflicts(localTodos, serverTodos) {
    const conflicts = [];

    localTodos.forEach((local) => {
      const server = serverTodos.find((s) => s.id === local.id);
      if (server && local.version < server.version) {
        conflicts.push({
          todoId: local.id,
          type: 'version_mismatch',
          local: local.version,
          server: server.version,
        });
      }
    });

    return conflicts;
  }
}
