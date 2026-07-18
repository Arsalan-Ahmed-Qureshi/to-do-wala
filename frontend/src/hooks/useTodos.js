import { useState, useCallback } from 'react';

export const useTodos = (initialTodos = []) => {
  const [todos, setTodos] = useState(initialTodos);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filteredTodos = useCallback(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const addTodo = useCallback((todo) => {
    setTodos(prev => [...prev, { ...todo, id: Date.now() }]);
  }, []);

  const removeTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const updateTodo = useCallback((id, updates) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, ...updates } : todo
      )
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, []);

  return {
    todos: filteredTodos(),
    allTodos: todos,
    filter,
    setFilter,
    loading,
    setLoading,
    error,
    setError,
    addTodo,
    removeTodo,
    updateTodo,
    clearCompleted,
  };
};
