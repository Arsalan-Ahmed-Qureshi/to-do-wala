import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    todos: [],
    filteredTodos: [],
    isLoading: false,
    error: null,
    lastFilter: 'all', // 'all', 'active', 'completed'
    localChanges: {}, // Track local edits before sync
  },
  reducers: {
    setTodos: (state, action) => {
      state.todos = action.payload;
    },
    addTodo: (state, action) => {
      state.todos.push(action.payload);
    },
    updateTodo: (state, action) => {
      const index = state.todos.findIndex(t => t.id === action.payload.id);
      if (index >= 0) {
        state.todos[index] = action.payload;
      }
    },
    removeTodo: (state, action) => {
      state.todos = state.todos.filter(t => t.id !== action.payload);
    },
    setFilteredTodos: (state, action) => {
      state.filteredTodos = action.payload;
    },
    setLastFilter: (state, action) => {
      state.lastFilter = action.payload;
    },
    trackLocalChange: (state, action) => {
      const { todoId, change } = action.payload;
      state.localChanges[todoId] = change;
    },
    clearLocalChange: (state, action) => {
      delete state.localChanges[action.payload];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTodos,
  addTodo,
  updateTodo,
  removeTodo,
  setFilteredTodos,
  setLastFilter,
  trackLocalChange,
  clearLocalChange,
  setLoading,
  setError,
} = todoSlice.actions;
export default todoSlice.reducer;
