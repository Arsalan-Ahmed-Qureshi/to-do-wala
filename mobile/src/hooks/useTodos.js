import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setTodos,
  addTodo,
  updateTodo,
  removeTodo,
  setFilteredTodos,
  setLastFilter,
  trackLocalChange,
  clearLocalChange,
  setError,
} from '../store/todoSlice';
import {
  saveTodo,
  getTodosByUserId,
  getTodosByStatus,
  deleteTodo,
  addToSyncQueue,
} from '../services/database/sqlite';
import { TASK_STATUS } from '../utils/constants';

export const useTodos = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.todos);
  const filteredTodos = useSelector((state) => state.todos.filteredTodos);
  const lastFilter = useSelector((state) => state.todos.lastFilter);
  const user = useSelector((state) => state.auth.user);

  // Load todos from database on mount
  useEffect(() => {
    if (user) {
      loadTodos();
    }
  }, [user]);

  const loadTodos = useCallback(async () => {
    if (!user) return;
    try {
      const dbTodos = await getTodosByUserId(user.id);
      dispatch(setTodos(dbTodos));
      applyFilter(lastFilter, dbTodos);
    } catch (error) {
      console.error('Error loading todos:', error);
      dispatch(setError('Failed to load todos'));
    }
  }, [user, lastFilter, dispatch]);

  const applyFilter = useCallback((filter, todosToFilter = todos) => {
    let filtered = [];
    switch (filter) {
      case 'active':
        filtered = todosToFilter.filter(
          (t) => t.status !== TASK_STATUS.COMPLETED && !t.isDeleted
        );
        break;
      case 'completed':
        filtered = todosToFilter.filter(
          (t) => t.status === TASK_STATUS.COMPLETED && !t.isDeleted
        );
        break;
      default:
        filtered = todosToFilter.filter((t) => !t.isDeleted);
    }
    dispatch(setFilteredTodos(filtered));
    dispatch(setLastFilter(filter));
  }, [todos, dispatch]);

  const createTodo = useCallback(
    async (title, description = '', priority = 'MEDIUM', dueDate = null) => {
      if (!user) return;
      try {
        // Create temp todo with local ID
        const tempTodo = {
          id: Math.floor(Math.random() * -1000000), // Negative for temp IDs
          title,
          description,
          status: TASK_STATUS.TO_BE_START,
          priority,
          dueDate,
          userId: user.id,
          version: 0,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Save to local DB
        await saveTodo(tempTodo);
        dispatch(addTodo(tempTodo));

        // Add to sync queue for later sync
        await addToSyncQueue(
          'CREATE',
          'TODO',
          tempTodo.id,
          tempTodo
        );

        applyFilter(lastFilter);
      } catch (error) {
        console.error('Error creating todo:', error);
        dispatch(setError('Failed to create todo'));
      }
    },
    [user, lastFilter, dispatch, applyFilter]
  );

  const updateTodoLocal = useCallback(
    async (todoId, updates) => {
      if (!user) return;
      try {
        // Find the todo
        const todo = todos.find((t) => t.id === todoId);
        if (!todo) throw new Error('Todo not found');

        // Create updated todo
        const updatedTodo = {
          ...todo,
          ...updates,
          updatedAt: new Date().toISOString(),
          version: (todo.version || 0) + 1,
        };

        // Save to DB
        await saveTodo(updatedTodo);
        dispatch(updateTodo(updatedTodo));

        // Add to sync queue
        await addToSyncQueue(
          'UPDATE',
          'TODO',
          todoId,
          updatedTodo
        );

        applyFilter(lastFilter);
      } catch (error) {
        console.error('Error updating todo:', error);
        dispatch(setError('Failed to update todo'));
      }
    },
    [user, todos, lastFilter, dispatch, applyFilter]
  );

  const deleteTodoLocal = useCallback(
    async (todoId, softDelete = true) => {
      if (!user) return;
      try {
        if (softDelete) {
          // Soft delete: mark as deleted
          const todo = todos.find((t) => t.id === todoId);
          if (todo) {
            const deletedTodo = {
              ...todo,
              isDeleted: true,
              updatedAt: new Date().toISOString(),
            };
            await saveTodo(deletedTodo);
            dispatch(removeTodo(todoId));
            
            // Add to sync queue
            await addToSyncQueue(
              'DELETE',
              'TODO',
              todoId,
              deletedTodo
            );
          }
        } else {
          // Hard delete (for temp local todos not yet synced)
          await deleteTodo(todoId, false);
          dispatch(removeTodo(todoId));
        }

        applyFilter(lastFilter);
      } catch (error) {
        console.error('Error deleting todo:', error);
        dispatch(setError('Failed to delete todo'));
      }
    },
    [user, todos, lastFilter, dispatch, applyFilter]
  );

  const updateStatus = useCallback(
    (todoId, status) => {
      updateTodoLocal(todoId, { status });
    },
    [updateTodoLocal]
  );

  const updatePriority = useCallback(
    (todoId, priority) => {
      updateTodoLocal(todoId, { priority });
    },
    [updateTodoLocal]
  );

  const filterTodos = useCallback(
    (filter) => {
      applyFilter(filter);
    },
    [applyFilter]
  );

  return {
    todos,
    filteredTodos,
    lastFilter,
    createTodo,
    updateTodoLocal,
    deleteTodoLocal,
    updateStatus,
    updatePriority,
    filterTodos,
    reload: loadTodos,
  };
};
