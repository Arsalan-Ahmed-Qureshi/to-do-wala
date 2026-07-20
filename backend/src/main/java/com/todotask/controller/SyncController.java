package com.todotask.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.todotask.service.SyncService;
import com.todotask.dto.*;
import java.util.*;

@RestController
@RequestMapping("/api/sync")
public class SyncController {
    
    @Autowired
    private SyncService syncService;
    
    /**
     * Push client changes to server
     * Body: { "changes": [ { "operation": "CREATE|UPDATE|DELETE", "todo": {...}, "version": 1 } ] }
     */
    @PostMapping("/push")
    public ResponseEntity<?> pushChanges(
            @RequestBody SyncPushRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        
        if (request.getChanges() == null || request.getChanges().isEmpty()) {
            return ResponseEntity.ok(new SyncPushResponse(0, Collections.emptyList()));
        }
        
        SyncPushResponse response = syncService.reconcileChanges(userId, request.getChanges());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Pull latest todos from server
     * Body: { "lastSyncTime": "2025-01-15T10:30:00Z" }
     */
    @PostMapping("/pull")
    public ResponseEntity<?> pullChanges(
            @RequestBody SyncPullRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        
        List<TodoDTO> todos = syncService.getTodosModifiedSince(userId, request.getLastSyncTime());
        return ResponseEntity.ok(new SyncPullResponse(todos));
    }
}
