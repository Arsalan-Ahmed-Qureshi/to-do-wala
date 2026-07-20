package com.todotask.dto;

import java.util.List;

public class SyncPushRequest {
    private List<SyncChangeRequest> changes;

    public List<SyncChangeRequest> getChanges() {
        return changes;
    }

    public void setChanges(List<SyncChangeRequest> changes) {
        this.changes = changes;
    }
}
