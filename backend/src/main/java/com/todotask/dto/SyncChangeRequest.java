package com.todotask.dto;

import java.time.LocalDateTime;

public class SyncChangeRequest {
    private String operation; // CREATE, UPDATE, DELETE
    private Long todoId; // Only for UPDATE/DELETE
    private TodoDTO todo; // Complete todo data
    private Long version; // Client version
    private LocalDateTime timestamp;

    public SyncChangeRequest() {}

    public SyncChangeRequest(String operation, Long todoId, TodoDTO todo, Long version, LocalDateTime timestamp) {
        this.operation = operation;
        this.todoId = todoId;
        this.todo = todo;
        this.version = version;
        this.timestamp = timestamp;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public Long getTodoId() {
        return todoId;
    }

    public void setTodoId(Long todoId) {
        this.todoId = todoId;
    }

    public TodoDTO getTodo() {
        return todo;
    }

    public void setTodo(TodoDTO todo) {
        this.todo = todo;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
