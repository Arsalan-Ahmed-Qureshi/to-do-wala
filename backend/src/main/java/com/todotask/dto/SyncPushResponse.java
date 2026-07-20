package com.todotask.dto;

import java.util.List;

public class SyncPushResponse {
    private int processedCount;
    private List<SyncConflict> conflicts;

    public SyncPushResponse(int processedCount, List<SyncConflict> conflicts) {
        this.processedCount = processedCount;
        this.conflicts = conflicts;
    }

    public int getProcessedCount() {
        return processedCount;
    }

    public void setProcessedCount(int processedCount) {
        this.processedCount = processedCount;
    }

    public List<SyncConflict> getConflicts() {
        return conflicts;
    }

    public void setConflicts(List<SyncConflict> conflicts) {
        this.conflicts = conflicts;
    }
}
