package com.todotask.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "todos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Todo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.TO_BE_START;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;
    
    private LocalDateTime dueDate;
    
    @Column
    private Long userId;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(nullable = true)
    private Long version = 0L;
    
    @Column(nullable = true)
    private Boolean isDeleted = false;
    
    @Column(nullable = true)
    private LocalDateTime syncedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum TaskStatus {
        TO_BE_START, IN_PROGRESS, HALTED, COMPLETED
    }
    
    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }
}
