import styles from './Header.module.css';

export default function Header({ filter, onFilterChange, activeTodoCount, user, onLogout }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>📋 ToDoTask</h1>
            <p className={styles.subtitle}>Stay organized and productive</p>
          </div>
          
          <div className={styles.filters}>
            <button
              className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
              onClick={() => onFilterChange('all')}
            >
              All Tasks
            </button>
            <button
              className={`${styles.filterBtn} ${filter === 'active' ? styles.active : ''}`}
              onClick={() => onFilterChange('active')}
            >
              Active ({activeTodoCount})
            </button>
            <button
              className={`${styles.filterBtn} ${filter === 'completed' ? styles.active : ''}`}
              onClick={() => onFilterChange('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        {user && (
          <div className={styles.userSection}>
            <span className={styles.username}>👤 {user.username}</span>
            <button className={styles.logoutBtn} onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
