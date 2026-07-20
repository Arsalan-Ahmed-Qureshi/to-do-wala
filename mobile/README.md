# ToDoTask Mobile App

React Native mobile application with offline-first architecture and real-time sync capabilities.

## Features

- ✅ Full offline support (SQLite local storage)
- ✅ Real-time sync with backend (push/pull model)
- ✅ Client-wins conflict resolution
- ✅ All web features: auth, CRUD todos, filtering, priorities, status tracking
- ✅ Automatic retry on network reconnect
- ✅ Secure token-based authentication

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Project Structure

```
src/
├── services/          # Business logic layers
│   ├── database/      # SQLite initialization & queries
│   ├── api/           # HTTP client & interceptors
│   ├── sync/          # Sync engine & conflict resolution
│   └── auth/          # Authentication logic
├── hooks/             # React hooks (network, sync, todos, auth)
├── store/             # Redux store & slices
├── screens/           # App screens (auth, todos, settings)
├── components/        # Reusable UI components
└── utils/             # Helper functions & constants
```

## Architecture

**Offline-First Approach:**
1. All operations performed locally on SQLite first
2. Changes tracked in sync_queue table
3. When online: push changes → pull latest → apply conflict resolution
4. Network drop: queued for retry (exponential backoff)

**Sync Flow:**
- User creates todo → stored in SQLite + sync_queue
- Network available → SyncEngine pushes changes to `/api/sync/push`
- Server reconciles with client-wins logic → returns conflicts
- Mobile pulls latest with `/api/sync/pull` → merges with local DB
- LastSyncTime updated → offline queue cleared

## Testing

```bash
npm test              # Run tests
npm run test:coverage # Coverage report
```

## Documentation

See `/memories/session/plan.md` for detailed architecture and implementation phases.
