# 🚀 Quick Start Guide - ToDoTask Mobile App

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│         React Native Mobile App (Offline-First)         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │       React Navigation (Auth/Todo/Settings)     │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Redux Store (Auth, Todos, Sync, Network)      │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Custom Hooks (useAuth, useTodos, useSyncEngine)    │
│  └─────────────────────────────────────────────────┘   │
│                          │                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Services:                                      │   │
│  │  • SQLite Database (users, todos, sync_queue)  │   │
│  │  • Axios API Client (/api/sync/push|pull)     │   │
│  │  • Sync Engine (ChangeTracker, Resolver)       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
        ┌─────▼─────┐          ┌─────▼─────┐
        │  Backend  │          │  AsyncStorage
        │  Spring   │          │  (Redux Persist)
        │  Boot API │          │
        └───────────┘          └───────────┘
```

## 5-Minute Quick Start

### 1. Backend Ready? ✅
```bash
cd backend
java -jar target/todotask-api-1.0.0.jar
# http://localhost:8080 ready for sync
```

### 2. Start Mobile App
```bash
cd mobile
npm install
npm start
# Follow prompts: press 'i' for iOS or 'a' for Android
```

### 3. Test the Flow
```
1. Tap "Sign Up" → Create account (jane@example.com / password123)
2. Create a todo (title: "Learn React Native")
3. Go Airplane Mode (simulate offline)
4. Edit todo → Description added
5. Turn off Airplane Mode
6. Watch auto-sync happen (bar shows "Synced 2m ago")
7. Refresh browser → Server has changes
```

## File Structure

```
mobile/
├── App.jsx                          # Main entry point
├── package.json                     # All deps configured
├── .env.example                     # Config template
│
├── src/
│   ├── screens/                     # UI Screens
│   │   ├── LoginScreen.jsx
│   │   ├── SignupScreen.jsx
│   │   ├── TodoListScreen.jsx
│   │   ├── CreateTodoScreen.jsx
│   │   └── TodoDetailScreen.jsx
│   │
│   ├── components/                  # Reusable components
│   │   └── NetworkStatusBar.jsx    # Online/offline indicator
│   │
│   ├── services/                    # Business logic
│   │   ├── database/sqlite.js       # SQLite CRUD
│   │   ├── api/axiosConfig.js       # API client
│   │   └── sync/
│   │       ├── changeTracker.js     # Track changes
│   │       ├── conflictResolver.js  # Resolve conflicts
│   │       └── syncEngine.js        # Orchestrate sync
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.js              # Auth logic
│   │   ├── useTodos.js             # Todo CRUD
│   │   ├── useNetworkStatus.js     # Network detect
│   │   └── useSyncEngine.js        # Auto-sync
│   │
│   ├── store/                       # Redux state
│   │   ├── store.js                # Store config + persist
│   │   ├── authSlice.js            # Auth state
│   │   ├── todoSlice.js            # Todo state
│   │   ├── syncSlice.js            # Sync state
│   │   └── networkSlice.js         # Network state
│   │
│   └── utils/                       # Helpers
│       ├── constants.js             # Status, priority, colors
│       └── validators.js            # Input validation
```

## Key Concepts

### 🔄 Offline-First Sync Flow

```
Local Change Created
        │
        ▼
    SQLite Save
        │
        ▼
Add to sync_queue
        │
    ┌───┴───┐
    │       │
 ONLINE  OFFLINE
    │       │
    │   Queued for
    │   later sync
    │       │
    └───┬───┘
        │
        ▼
    SyncEngine
        │
    ┌───┴────┐
    ▼        ▼
  PUSH    PULL
  (send)  (receive)
    │        │
    └───┬────┘
        │
        ▼
    Success or Retry
    (exponential backoff)
```

### 📊 Redux State Map

```javascript
auth: {
  user: { id, username, email },
  token: string,
  isAuthenticated: boolean
}

todos: {
  todos: [{ id, title, status, version, isDeleted, ... }],
  filteredTodos: [...],
  lastFilter: 'all' | 'active' | 'completed'
}

sync: {
  isSyncing: boolean,
  lastSyncTime: ISO string,
  syncStatus: 'idle' | 'syncing' | 'success' | 'error'
}

network: {
  isOnline: boolean,
  connectionType: 'wifi' | '4g' | 'unknown'
}
```

### 🎯 Sync Lifecycle

```
Every 5 minutes OR when online status changes
        ↓
    Check network
        ↓
    Load pending changes from sync_queue
        ↓
    POST /api/sync/push (send local changes)
        ↓
    Server applies client-wins logic
        ↓
    Mark queue items as synced
        ↓
    POST /api/sync/pull (fetch server changes)
        ↓
    ConflictResolver merges changes
        ↓
    Update Redux + SQLite
        ↓
    Display "Synced 2m ago"
```

## Common Operations

### Create Todo
```javascript
const { createTodo } = useTodos();
await createTodo(
  'Buy groceries',           // title
  'Milk, eggs, bread',       // description
  'HIGH',                    // priority
  new Date('2025-01-22')     // dueDate
);
// Auto-tracked in sync_queue
```

### Update Todo
```javascript
const { updateTodoLocal } = useTodos();
await updateTodoLocal(todoId, {
  title: 'Updated title',
  status: 'COMPLETED'
});
// Changes queued for sync
```

### Trigger Manual Sync
```javascript
const { performSync } = useSyncEngine();
const result = await performSync();
// { success: true, duration: 1234, changeCount: 5 }
```

### Check Online Status
```javascript
const isOnline = useSelector(state => state.network.isOnline);
if (!isOnline) {
  // Show offline message
}
```

## Testing Scenarios

### Scenario 1: Offline Creates Todo
```
1. Set phone to Airplane Mode
2. Create todo "Learn Sync"
3. NetworkStatusBar shows "Offline"
4. Disable Airplane Mode
5. App auto-syncs in <5 seconds
6. Bar shows "Synced just now"
✅ Todo on server
```

### Scenario 2: Conflict Resolution
```
1. Create todo on mobile
2. Edit same todo on web portal
3. Edit mobile version too
4. Mobile goes online
5. Server receives both (client-wins)
6. Mobile version persists
✅ Client change kept
```

### Scenario 3: Network Drop During Sync
```
1. Create multiple todos
2. Start sync (show "Syncing...")
3. Kill network
4. Auto-retry triggered (exponential backoff)
5. Restore network
6. Successfully syncs
✅ Auto-recovery works
```

## Performance Tips

- **Lazy Load**: Todo lists load from SQLite first, then sync
- **Batch Operations**: Multiple edits sync together
- **Smart Retry**: Exponential backoff (1s, 2s, 4s, 8s, give up)
- **Persistent State**: Redux + AsyncStorage survives app restart
- **Efficient Queries**: SQLite indexed on userId, isDeleted

## Deployment Checklist

- [ ] Backend running on production URL
- [ ] Update `.env` with production API URL
- [ ] Test sync with prod backend
- [ ] Build release APK/IPA
- [ ] Test offline scenarios
- [ ] Verify conflict resolution
- [ ] Monitor sync logs
- [ ] Set up error tracking (Sentry, etc.)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Sync Failed" | Check backend running, API URL in .env |
| "Database Error" | Delete app, reinstall (SQLite issue) |
| "Can't Login" | Backend auth check, check email/password |
| "Offline Always" | Check NetInfo, test connectivity |
| "Changes Not Syncing" | Check network online, watch sync logs |

## Documentation Files

- [PHASE2_SUMMARY.md](./PHASE2_SUMMARY.md) - Full architecture details
- [backend/README.md](./backend/README.md) - Backend setup
- [mobile/README.md](./mobile/README.md) - Mobile setup
- [.env.example](./mobile/.env.example) - Configuration options

---

**Ready to sync! 🎉**
