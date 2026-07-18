import styles from './TodoList.module.css';

export default function TodoList({ todos, onToggle, onDelete, onEdit }) {
  const getStatusColor = (status) => {
    const colors = {
      'TO_BE_START': '#6b7280',
      'IN_PROGRESS': '#3b82f6',
      'HALTED': '#f87171',
      'COMPLETED': '#10b981',
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      LOW: '#10b981',
      MEDIUM: '#f59e0b',
      HIGH: '#ef4444',
      URGENT: '#991b1b',
    };
    return colors[priority] || '#6b7280';
  };

  const handleStatusChange = (id, newStatus) => {
    onToggle(id, newStatus);
  };

  if (todos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>No tasks yet</h3>
        <p>Create a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className={styles.todoList}>
      {todos.map(todo => (
        <div key={todo.id} className={`${styles.todoItemWrapper} ${todo.status === 'COMPLETED' ? styles.completed : ''}`}>
          <div className={styles.todoContent}>
            <h3 className={`${styles.title} ${todo.status === 'COMPLETED' ? styles.completed : ''}`}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className={styles.description}>{todo.description}</p>
            )}
            <div className={styles.meta}>
              <select 
                className={styles.status}
                value={todo.status}
                onChange={(e) => handleStatusChange(todo.id, e.target.value)}
                style={{ 
                  backgroundColor: getStatusColor(todo.status), 
                  color: 'white', 
                  border: 'none', 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                <option value="TO_BE_START">To Be Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="HALTED">Halted</option>
                <option value="COMPLETED">Completed</option>
              </select>
              {todo.priority && (
                <span className={`${styles.priority} ${styles[`priority-${todo.priority.toLowerCase()}`]}`}
                  style={{ backgroundColor: getPriorityColor(todo.priority) }}>
                  {todo.priority}
                </span>
              )}
              {todo.dueDate && (
                <span className={styles.dueDate}>
                  {new Date(todo.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.editBtn}
              onClick={() => onEdit(todo)}
              title="Edit"
            >
              ✎
            </button>
            <button
              className={styles.deleteBtn}
              onClick={() => onDelete(todo.id)}
              title="Delete"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
