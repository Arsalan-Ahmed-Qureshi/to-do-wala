import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './authSlice';
import todoReducer from './todoSlice';
import syncReducer from './syncSlice';
import networkReducer from './networkSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'todos'], // Persist these slices
  blacklist: ['sync', 'network'], // Don't persist sync/network state
};

const persistedAuthReducer = persistReducer(
  { key: 'auth', storage: AsyncStorage },
  authReducer
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    todos: todoReducer,
    sync: syncReducer,
    network: networkReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
