import styles from './TodoItem.module.css';

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const getPriorityColor = (priority) => {
    const colors = {
      LOW: '#10b981',
      MEDIUM: '#f59e0b',
      HIGH: '#ef4444',
      URGENT: '#991b1b',
    };
    return colors[priority] || '#6b7280';
  };

  const getStatusColor = (status) => {
    const colors = {
      'TO_BE_START': '#6b7280',
      'IN_PROGRESS': '#3b82f6',
      'HALTED': '#f87171',
      'COMPLETED': '#10b981',
    };
    return colors[status] || '#6b7280';
  };

  const handleStatusChange = (e) => {
    onToggle(todo.id, e.target.value);
  };

  return (
    <div className={`${styles.todoItem} ${todo.status === 'COMPLETED' ? styles.completed : ''}`}>
      <div className={styles.content}>
        <h3 className={styles.title}>{todo.title}</h3>
        {todo.description && (
          <p className={styles.description}>{todo.description}</p>
        )}
        <div className={styles.meta}>
          <select 
            className={styles.status} 
            value={todo.status}
            onChange={handleStatusChange}
            style={{ backgroundColor: getStatusColor(todo.status), color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
          >
            <option value="TO_BE_START">To Be Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="HALTED">Halted</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <span
            className={styles.priority}
            style={{ backgroundColor: getPriorityColor(todo.priority) }}
          >
            {todo.priority}
          </span>
          {todo.dueDate && (
            <span className={styles.dueDate}>
              Due: {new Date(todo.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={() => onEdit(todo)}>
          ✎
        </button>
        <button className={styles.deleteBtn} onClick={() => onDelete(todo.id)}>
          ✕
        </button>
      </div>
    </div>
  );
}
