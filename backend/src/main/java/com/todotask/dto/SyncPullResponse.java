package com.todotask.dto;

import java.util.List;

public class SyncPullResponse {
    private List<TodoDTO> todos;

    public SyncPullResponse() {}

    public SyncPullResponse(List<TodoDTO> todos) {
        this.todos = todos;
    }

    public List<TodoDTO> getTodos() {
        return todos;
    }

    public void setTodos(List<TodoDTO> todos) {
        this.todos = todos;
    }
}
