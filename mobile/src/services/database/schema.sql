-- Users table (synced from backend)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  createdAt TEXT NOT NULL
);

-- Todos table (main application data)
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

-- Sync queue (pending operations)
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

-- Sync log (audit trail)
CREATE TABLE IF NOT EXISTS sync_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  syncStartTime TEXT NOT NULL,
  syncEndTime TEXT,
  status TEXT NOT NULL,
  changesCount INTEGER,
  errorMessage TEXT,
  createdAt TEXT NOT NULL
);
