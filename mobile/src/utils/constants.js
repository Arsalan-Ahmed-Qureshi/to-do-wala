export const TASK_STATUS = {
  TO_BE_START: 'TO_BE_START',
  IN_PROGRESS: 'IN_PROGRESS',
  HALTED: 'HALTED',
  COMPLETED: 'COMPLETED',
};

export const PRIORITY_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
};

export const PRIORITY_COLORS = {
  LOW: '#4CAF50',
  MEDIUM: '#2196F3',
  HIGH: '#FF9800',
  URGENT: '#F44336',
};

export const STATUS_LABELS = {
  [TASK_STATUS.TO_BE_START]: 'To Start',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.HALTED]: 'On Hold',
  [TASK_STATUS.COMPLETED]: 'Completed',
};

export const SYNC_STATUS = {
  IDLE: 'idle',
  SYNCING: 'syncing',
  SUCCESS: 'success',
  ERROR: 'error',
};
