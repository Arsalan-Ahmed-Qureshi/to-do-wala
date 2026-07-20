package com.todotask.dto;

import java.time.LocalDateTime;

public class SyncPullRequest {
    private LocalDateTime lastSyncTime;

    public LocalDateTime getLastSyncTime() {
        return lastSyncTime;
    }

    public void setLastSyncTime(LocalDateTime lastSyncTime) {
        this.lastSyncTime = lastSyncTime;
    }
}
