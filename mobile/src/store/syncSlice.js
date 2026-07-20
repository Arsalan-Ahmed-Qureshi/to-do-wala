import { createSlice } from '@reduxjs/toolkit';

const syncSlice = createSlice({
  name: 'sync',
  initialState: {
    isSyncing: false,
    lastSyncTime: null,
    syncStatus: 'idle', // 'idle', 'syncing', 'success', 'error'
    failedOperations: [],
    syncError: null,
    pendingChangeCount: 0,
  },
  reducers: {
    setSyncing: (state, action) => {
      state.isSyncing = action.payload;
    },
    setSyncStatus: (state, action) => {
      state.syncStatus = action.payload;
    },
    setLastSyncTime: (state, action) => {
      state.lastSyncTime = action.payload;
    },
    setFailedOperations: (state, action) => {
      state.failedOperations = action.payload;
    },
    setSyncError: (state, action) => {
      state.syncError = action.payload;
    },
    setPendingChangeCount: (state, action) => {
      state.pendingChangeCount = action.payload;
    },
  },
});

export const {
  setSyncing,
  setSyncStatus,
  setLastSyncTime,
  setFailedOperations,
  setSyncError,
  setPendingChangeCount,
} = syncSlice.actions;
export default syncSlice.reducer;
