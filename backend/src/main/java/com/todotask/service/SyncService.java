package com.todotask.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.todotask.entity.Todo;
import com.todotask.entity.User;
import com.todotask.repository.TodoRepository;
import com.todotask.repository.UserRepository;
import com.todotask.dto.*;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class SyncService {
    
    @Autowired
    private TodoRepository todoRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Reconcile client changes with server state
     * Implements: Client-wins conflict resolution
     */
    @Transactional
    public SyncPushResponse reconcileChanges(Long userId, List<SyncChangeRequest> changes) {
        
        // Verify user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        
        List<SyncConflict> conflicts = new ArrayList<>();
        int processedCount = 0;
        
        for (SyncChangeRequest change : changes) {
            try {
                switch (change.getOperation()) {
                    case "CREATE":
                        processCreate(userId, change);
                        processedCount++;
                        break;
                        
                    case "UPDATE":
                        boolean hasConflict = processUpdate(userId, change);
                        if (!hasConflict) {
                            processedCount++;
                        } else {
                            conflicts.add(new SyncConflict(
                                change.getTodoId(),
                                "Server version is newer. Client-wins applied.",
                                "conflict_version_mismatch"
                            ));
                        }
                        break;
                        
                    case "DELETE":
                        processDelete(userId, change);
                        processedCount++;
                        break;
                }
            } catch (Exception e) {
                System.err.println("Sync error for change: " + change + " - " + e.getMessage());
            }
        }
        
        // Update user's last sync time
        user.setLastSyncedAt(LocalDateTime.now());
        userRepository.save(user);
        
        return new SyncPushResponse(processedCount, conflicts);
    }
    
    private void processCreate(Long userId, SyncChangeRequest change) {
        Todo todo = new Todo();
        todo.setTitle(change.getTodo().getTitle());
        todo.setDescription(change.getTodo().getDescription());
        todo.setStatus(Todo.TaskStatus.valueOf(change.getTodo().getStatus()));
        todo.setPriority(Todo.Priority.valueOf(change.getTodo().getPriority()));
        todo.setDueDate(change.getTodo().getDueDate());
        todo.setUserId(userId);
        todo.setVersion(0L);
        todo.setIsDeleted(false);
        todoRepository.save(todo);
    }
    
    private boolean processUpdate(Long userId, SyncChangeRequest change) {
        Todo todo = todoRepository.findById(change.getTodoId())
                .orElseThrow(() -> new RuntimeException("Todo not found: " + change.getTodoId()));
        
        // Verify ownership
        if (!todo.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Todo doesn't belong to user");
        }
        
        // Check version for conflict detection
        Long clientVersion = change.getVersion() != null ? change.getVersion() : 0L;
        Long serverVersion = todo.getVersion() != null ? todo.getVersion() : 0L;
        
        // Apply client changes (Client-Wins)
        if (change.getTodo().getTitle() != null) {
            todo.setTitle(change.getTodo().getTitle());
        }
        if (change.getTodo().getDescription() != null) {
            todo.setDescription(change.getTodo().getDescription());
        }
        if (change.getTodo().getStatus() != null) {
            todo.setStatus(Todo.TaskStatus.valueOf(change.getTodo().getStatus()));
        }
        if (change.getTodo().getPriority() != null) {
            todo.setPriority(Todo.Priority.valueOf(change.getTodo().getPriority()));
        }
        if (change.getTodo().getDueDate() != null) {
            todo.setDueDate(change.getTodo().getDueDate());
        }
        
        // Increment version on server
        todo.setVersion(serverVersion + 1);
        todoRepository.save(todo);
        
        return clientVersion < serverVersion; // Return true if conflict
    }
    
    private void processDelete(Long userId, SyncChangeRequest change) {
        Todo todo = todoRepository.findById(change.getTodoId())
                .orElseThrow(() -> new RuntimeException("Todo not found: " + change.getTodoId()));
        
        // Verify ownership
        if (!todo.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Todo doesn't belong to user");
        }
        
        // Soft delete (client-wins: respect local delete)
        todo.setIsDeleted(true);
        todoRepository.save(todo);
    }
    
    /**
     * Get todos modified since lastSyncTime (for pull operations)
     */
    @Transactional(readOnly = true)
    public List<TodoDTO> getTodosModifiedSince(Long userId, LocalDateTime lastSyncTime) {
        List<Todo> todos;
        
        if (lastSyncTime == null) {
            // Full sync: return all non-deleted todos
            todos = todoRepository.findActiveUserTodos(userId);
        } else {
            // Incremental sync: return changed todos
            todos = todoRepository.findTodosModifiedSince(userId, lastSyncTime);
        }
        
        // Convert to DTOs
        List<TodoDTO> dtos = new ArrayList<>();
        for (Todo todo : todos) {
            dtos.add(TodoDTO.fromEntity(todo));
        }
        return dtos;
    }
}
