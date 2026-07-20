package com.todotask.dto;

public class SyncConflict {
    private Long todoId;
    private String message;
    private String code;

    public SyncConflict() {}

    public SyncConflict(Long todoId, String message, String code) {
        this.todoId = todoId;
        this.message = message;
        this.code = code;
    }

    public Long getTodoId() {
        return todoId;
    }

    public void setTodoId(Long todoId) {
        this.todoId = todoId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
