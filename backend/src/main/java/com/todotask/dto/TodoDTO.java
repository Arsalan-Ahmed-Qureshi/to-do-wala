package com.todotask.dto;

import com.todotask.entity.Todo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TodoDTO {
    
    private Long id;
    
    private String title;
    
    private String description;
    
    private String status = "TO_BE_START";
    
    private String priority = "MEDIUM";
    
    private LocalDateTime dueDate;
    
    private Long userId;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    public static TodoDTO fromEntity(Todo todo) {
        return TodoDTO.builder()
            .id(todo.getId())
            .title(todo.getTitle())
            .description(todo.getDescription())
            .status(todo.getStatus().toString())
            .priority(todo.getPriority().toString())
            .dueDate(todo.getDueDate())
            .userId(todo.getUserId())
            .createdAt(todo.getCreatedAt())
            .updatedAt(todo.getUpdatedAt())
            .build();
    }
    
    public Todo toEntity() {
        Todo.TaskStatus taskStatus = Todo.TaskStatus.valueOf(this.status != null ? this.status : "TO_BE_START");
        return Todo.builder()
            .title(this.title)
            .description(this.description)
            .status(taskStatus)
            .priority(Todo.Priority.valueOf(this.priority))
            .dueDate(this.dueDate)
            .userId(this.userId)
            .build();
    }
}
