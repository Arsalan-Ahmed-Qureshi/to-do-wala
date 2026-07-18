import { useEffect, useState } from 'react';
import Header from './components/Header';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Login from './components/Login';
import Signup from './components/Signup';
import { todoAPI } from './services/api';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  // Listen to hash changes for auth mode switching
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#signup') {
        setAuthMode('signup');
      } else {
        setAuthMode('login');
      }
    };

    // Set initial auth mode based on current hash
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch todos when user logs in
  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await todoAPI.getAll(user.id);
      setTodos(response.data);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (formData) => {
    try {
      const response = await todoAPI.create(formData, user.id);
      setTodos([...todos, response.data]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error('Error creating todo:', err);
      setError('Failed to create task. Please try again.');
    }
  };

  const handleUpdateTodo = async (formData) => {
    try {
      const response = await todoAPI.update(editingTodo.id, formData, user.id);
      setTodos(todos.map(todo => todo.id === editingTodo.id ? response.data : todo));
      setEditingTodo(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error('Error updating todo:', err);
      setError('Failed to update task. Please try again.');
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      await todoAPI.delete(id, user.id);
      setTodos(todos.filter(todo => todo.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete task. Please try again.');
    }
  };

  const handleToggleTodo = async (id, newStatus) => {
    try {
      const response = await todoAPI.update(id, { status: newStatus }, user.id);
      setTodos(todos.map(t => t.id === id ? response.data : t));
      setError(null);
    } catch (err) {
      console.error('Error updating todo:', err);
      setError('Failed to update task. Please try again.');
    }
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setEditingTodo(null);
    setShowForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setTodos([]);
    setAuthMode('login');
  };

  const handleLoginSuccess = (response) => {
    setUser({
      id: response.id,
      username: response.username,
      email: response.email,
    });
  };

  const handleSignupSuccess = (response) => {
    setUser({
      id: response.id,
      username: response.username,
      email: response.email,
    });
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return todo.status !== 'COMPLETED';
    if (filter === 'completed') return todo.status === 'COMPLETED';
    return true;
  });

  const activeTodoCount = todos.filter(todo => todo.status !== 'COMPLETED').length;

  // If not logged in, show authentication pages
  if (!user) {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }
    return (
      <>
        {authMode === 'login' ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : (
          <Signup onSignupSuccess={handleSignupSuccess} />
        )}
        <style>{`
          body {
            margin: 0;
            padding: 0;
          }
        `}</style>
      </>
    );
  }

  // User is logged in, show todo app
  return (
    <div className="app">
      <Header 
        filter={filter} 
        onFilterChange={setFilter}
        activeTodoCount={activeTodoCount}
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="app-container">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)} className="close-error">✕</button>
          </div>
        )}

        {showForm ? (
          <div className="form-container card">
            <h2>{editingTodo ? 'Edit Task' : 'Create New Task'}</h2>
            <TodoForm
              onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo}
              initialData={editingTodo}
              onCancel={handleFormCancel}
            />
          </div>
        ) : (
          <button className="create-btn" onClick={() => setShowForm(true)}>
            + Create New Task
          </button>
        )}

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <div className="todos-container">
            <TodoList
              todos={filteredTodos}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
              onEdit={handleEditTodo}
            />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>ToDoTask v1.0.0 • Stay productive and organized</p>
      </footer>
    </div>
  );
}

export default App;
