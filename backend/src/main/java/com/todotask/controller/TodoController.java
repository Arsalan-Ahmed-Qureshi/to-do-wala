package com.todotask.controller;

import com.todotask.dto.TodoDTO;
import com.todotask.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class TodoController {
    
    private final TodoService todoService;
    
    @GetMapping
    public ResponseEntity<List<TodoDTO>> getAllTodos(@RequestHeader(value = "X-User-Id") Long userId) {
        return ResponseEntity.ok(todoService.getAllTodos(userId));
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<TodoDTO>> getActiveTodos(@RequestHeader(value = "X-User-Id") Long userId) {
        return ResponseEntity.ok(todoService.getActiveTodos(userId));
    }
    
    @GetMapping("/completed")
    public ResponseEntity<List<TodoDTO>> getCompletedTodos(@RequestHeader(value = "X-User-Id") Long userId) {
        return ResponseEntity.ok(todoService.getCompletedTodos(userId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TodoDTO> getTodoById(@PathVariable Long id, @RequestHeader(value = "X-User-Id") Long userId) {
        return ResponseEntity.ok(todoService.getTodoById(id, userId));
    }
    
    @PostMapping
    public ResponseEntity<TodoDTO> createTodo(@Valid @RequestBody TodoDTO todoDTO, @RequestHeader(value = "X-User-Id") Long userId) {
        TodoDTO created = todoService.createTodo(todoDTO, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TodoDTO> updateTodo(@PathVariable Long id, @Valid @RequestBody TodoDTO todoDTO, @RequestHeader(value = "X-User-Id") Long userId) {
        TodoDTO updated = todoService.updateTodo(id, todoDTO, userId);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id, @RequestHeader(value = "X-User-Id") Long userId) {
        todoService.deleteTodo(id, userId);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping
    public ResponseEntity<Void> deleteAllTodos() {
        todoService.deleteAll();
        return ResponseEntity.noContent().build();
    }
}
