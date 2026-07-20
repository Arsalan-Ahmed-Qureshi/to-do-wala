package com.todotask.repository;

import com.todotask.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    
    List<Todo> findByStatusNotOrderByDueDateAsc(Todo.TaskStatus status);
    
    List<Todo> findByStatusOrderByUpdatedAtDesc(Todo.TaskStatus status);
    
    @Query("SELECT t FROM Todo t WHERE t.status != 'COMPLETED' ORDER BY t.priority DESC, t.dueDate ASC")
    List<Todo> findActiveTodosSorted();
    
    List<Todo> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<Todo> findByUserIdAndStatusNotOrderByDueDateAsc(Long userId, Todo.TaskStatus status);
    
    List<Todo> findByUserIdAndStatusOrderByUpdatedAtDesc(Long userId, Todo.TaskStatus status);
    
    @Query("SELECT t FROM Todo t WHERE t.userId = :userId AND t.status != 'COMPLETED' ORDER BY t.priority DESC, t.dueDate ASC")
    List<Todo> findActiveUserTodosSorted(Long userId);
    
    @Query("SELECT t FROM Todo t WHERE t.userId = :userId AND t.isDeleted = false ORDER BY t.updatedAt DESC")
    List<Todo> findActiveUserTodos(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Todo t WHERE t.userId = :userId AND t.updatedAt > :lastSyncTime ORDER BY t.updatedAt ASC")
    List<Todo> findTodosModifiedSince(@Param("userId") Long userId, @Param("lastSyncTime") LocalDateTime lastSyncTime);
    
    @Query("SELECT t FROM Todo t WHERE t.userId = :userId AND t.isDeleted = true ORDER BY t.updatedAt DESC")
    List<Todo> findDeletedUserTodos(@Param("userId") Long userId);
}
