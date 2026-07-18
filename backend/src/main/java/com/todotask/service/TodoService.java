package com.todotask.service;

import com.todotask.dto.TodoDTO;
import com.todotask.entity.Todo;
import com.todotask.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TodoService {
    
    private final TodoRepository todoRepository;
    
    private void validateTodoOwnership(Long todoId, Long userId) {
        Todo todo = todoRepository.findById(todoId)
            .orElseThrow(() -> new RuntimeException("Todo not found with id: " + todoId));
        if (!todo.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Todo does not belong to this user");
        }
    }
    
    public List<TodoDTO> getAllTodos(Long userId) {
        return todoRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream()
            .map(TodoDTO::fromEntity)
            .collect(Collectors.toList());
    }
    
    public List<TodoDTO> getActiveTodos(Long userId) {
        return todoRepository.findActiveUserTodosSorted(userId)
            .stream()
            .map(TodoDTO::fromEntity)
            .collect(Collectors.toList());
    }
    
    public List<TodoDTO> getCompletedTodos(Long userId) {
        return todoRepository.findByUserIdAndStatusOrderByUpdatedAtDesc(userId, Todo.TaskStatus.COMPLETED)
            .stream()
            .map(TodoDTO::fromEntity)
            .collect(Collectors.toList());
    }
    
    public TodoDTO getTodoById(Long id, Long userId) {
        validateTodoOwnership(id, userId);
        return todoRepository.findById(id)
            .map(TodoDTO::fromEntity)
            .orElseThrow(() -> new RuntimeException("Todo not found with id: " + id));
    }
    
    public TodoDTO createTodo(TodoDTO todoDTO, Long userId) {
        if (todoDTO.getTitle() == null || todoDTO.getTitle().isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }
        todoDTO.setUserId(userId);
        if (todoDTO.getStatus() == null) {
            todoDTO.setStatus("TO_BE_START");
        }
        Todo todo = todoDTO.toEntity();
        Todo savedTodo = todoRepository.save(todo);
        return TodoDTO.fromEntity(savedTodo);
    }
    
    public TodoDTO updateTodo(Long id, TodoDTO todoDTO, Long userId) {
        validateTodoOwnership(id, userId);
        Todo todo = todoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Todo not found with id: " + id));
        
        if (todoDTO.getTitle() != null) {
            todo.setTitle(todoDTO.getTitle());
        }
        if (todoDTO.getDescription() != null) {
            todo.setDescription(todoDTO.getDescription());
        }
        if (todoDTO.getStatus() != null) {
            todo.setStatus(Todo.TaskStatus.valueOf(todoDTO.getStatus()));
        }
        if (todoDTO.getPriority() != null) {
            todo.setPriority(Todo.Priority.valueOf(todoDTO.getPriority()));
        }
        if (todoDTO.getDueDate() != null) {
            todo.setDueDate(todoDTO.getDueDate());
        }
        
        Todo updatedTodo = todoRepository.save(todo);
        return TodoDTO.fromEntity(updatedTodo);
    }
    
    public void deleteTodo(Long id, Long userId) {
        validateTodoOwnership(id, userId);
        if (!todoRepository.existsById(id)) {
            throw new RuntimeException("Todo not found with id: " + id);
        }
        todoRepository.deleteById(id);
    }
    
    public void deleteAllUserTodos(Long userId) {
        List<Todo> userTodos = todoRepository.findByUserIdOrderByCreatedAtDesc(userId);
        todoRepository.deleteAll(userTodos);
    }
    
    public void deleteAll() {
        todoRepository.deleteAll();
    }
}
