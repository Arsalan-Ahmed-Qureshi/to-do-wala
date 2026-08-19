import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DATABASE_NAME = 'todotask.db';

let db = null;

export const initializeDatabase = async () => {
  try {
    db = await SQLite.openDatabase({
      name: DATABASE_NAME,
      location: 'default',
    });
    
    // Create tables
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        backendId INTEGER UNIQUE,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'TO_BE_START',
        priority TEXT NOT NULL DEFAULT 'MEDIUM',
        dueDate TEXT,
        userId INTEGER NOT NULL,
        version INTEGER DEFAULT 0,
        isDeleted INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        syncedAt TEXT,
        FOREIGN KEY(userId) REFERENCES users(id)
      );
    `);

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        operationType TEXT NOT NULL,
        entityType TEXT NOT NULL,
        entityId INTEGER NOT NULL,
        payload TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        synced INTEGER DEFAULT 0,
        retryCount INTEGER DEFAULT 0
      );
    `);

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS sync_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        syncStartTime TEXT NOT NULL,
        syncEndTime TEXT,
        status TEXT NOT NULL,
        changesCount INTEGER,
        errorMessage TEXT,
        createdAt TEXT NOT NULL
      );
    `);

    await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_todos_userId ON todos(userId);`);
    await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_todos_isDeleted ON todos(isDeleted);`);
    await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_sync_queue_synced ON sync_queue(synced);`);

    console.log('✅ Database initialized successfully');
    return db;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

export const getDatabase = () => db;

// User operations
export const saveUser = async (user) => {
  if (!db) throw new Error('Database not initialized');
  try {
    await db.executeSql(
      `INSERT OR REPLACE INTO users (id, username, email, createdAt) 
       VALUES (?, ?, ?, ?)`,
      [user.id, user.username, user.email, new Date().toISOString()]
    );
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

export const getUser = async (userId) => {
  if (!db) throw new Error('Database not initialized');
  try {
    const [results] = await db.executeSql(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    if (results.rows.length > 0) {
      return results.rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Todo operations
export const saveTodo = async (todo) => {
  if (!db) throw new Error('Database not initialized');
  try {
    await db.executeSql(
      `INSERT OR REPLACE INTO todos 
       (id, backendId, title, description, status, priority, dueDate, userId, version, isDeleted, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        todo.id,
        todo.backendId,
        todo.title,
        todo.description,
        todo.status,
        todo.priority,
        todo.dueDate,
        todo.userId,
        todo.version,
        todo.isDeleted ? 1 : 0,
        todo.createdAt,
        todo.updatedAt,
      ]
    );
  } catch (error) {
    console.error('Error saving todo:', error);
    throw error;
  }
};

export const getTodosByUserId = async (userId) => {
  if (!db) throw new Error('Database not initialized');
  try {
    const [results] = await db.executeSql(
      'SELECT * FROM todos WHERE userId = ? AND isDeleted = 0 ORDER BY updatedAt DESC',
      [userId]
    );
    const todos = [];
    for (let i = 0; i < results.rows.length; i++) {
      todos.push(results.rows.item(i));
    }
    return todos;
  } catch (error) {
    console.error('Error getting todos:', error);
    throw error;
  }
};

export const getTodosByStatus = async (userId, status) => {
  if (!db) throw new Error('Database not initialized');
  try {
    const [results] = await db.executeSql(
      'SELECT * FROM todos WHERE userId = ? AND status = ? AND isDeleted = 0 ORDER BY updatedAt DESC',
      [userId, status]
    );
    const todos = [];
    for (let i = 0; i < results.rows.length; i++) {
      todos.push(results.rows.item(i));
    }
    return todos;
  } catch (error) {
    console.error('Error getting todos by status:', error);
    throw error;
  }
};

export const deleteTodo = async (todoId, soft = true) => {
  if (!db) throw new Error('Database not initialized');
  try {
    if (soft) {
      await db.executeSql(
        'UPDATE todos SET isDeleted = 1, updatedAt = ? WHERE id = ?',
        [new Date().toISOString(), todoId]
      );
    } else {
      await db.executeSql('DELETE FROM todos WHERE id = ?', [todoId]);
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

// Sync queue operations
export const addToSyncQueue = async (operation, entityType, entityId, payload) => {
  if (!db) throw new Error('Database not initialized');
  try {
    await db.executeSql(
      `INSERT INTO sync_queue (operationType, entityType, entityId, payload, createdAt, synced, retryCount) 
       VALUES (?, ?, ?, ?, ?, 0, 0)`,
      [operation, entityType, entityId, JSON.stringify(payload), new Date().toISOString()]
    );
  } catch (error) {
    console.error('Error adding to sync queue:', error);
    throw error;
  }
};

export const getSyncQueue = async () => {
  if (!db) throw new Error('Database not initialized');
  try {
    const [results] = await db.executeSql(
      `SELECT * FROM sync_queue WHERE synced = 0 ORDER BY createdAt ASC`
    );
    const queue = [];
    for (let i = 0; i < results.rows.length; i++) {
      queue.push(results.rows.item(i));
    }
    return queue;
  } catch (error) {
    console.error('Error getting sync queue:', error);
    throw error;
  }
};

export const markSyncQueueItemAsSynced = async (queueItemId) => {
  if (!db) throw new Error('Database not initialized');
  try {
    await db.executeSql(
      'UPDATE sync_queue SET synced = 1 WHERE id = ?',
      [queueItemId]
    );
  } catch (error) {
    console.error('Error marking sync queue item as synced:', error);
    throw error;
  }
};

export const incrementRetryCount = async (queueItemId) => {
  if (!db) throw new Error('Database not initialized');
  try {
    await db.executeSql(
      'UPDATE sync_queue SET retryCount = retryCount + 1 WHERE id = ?',
      [queueItemId]
    );
  } catch (error) {
    console.error('Error incrementing retry count:', error);
    throw error;
  }
};

export const clearSyncQueue = async () => {
  if (!db) throw new Error('Database not initialized');
  try {
    await db.executeSql('DELETE FROM sync_queue WHERE synced = 1');
  } catch (error) {
    console.error('Error clearing sync queue:', error);
    throw error;
  }
};

// Sync log operations
export const addSyncLog = async (status, changesCount, errorMessage = null) => {
  if (!db) throw new Error('Database not initialized');
  try {
    await db.executeSql(
      `INSERT INTO sync_log (syncStartTime, status, changesCount, errorMessage, createdAt) 
       VALUES (?, ?, ?, ?, ?)`,
      [new Date().toISOString(), status, changesCount, errorMessage, new Date().toISOString()]
    );
  } catch (error) {
    console.error('Error adding sync log:', error);
    throw error;
  }
};
