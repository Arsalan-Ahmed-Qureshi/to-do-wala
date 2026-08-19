import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSelector } from 'react-redux';

const NetworkStatusBar = () => {
  const isOnline = useSelector((state) => state.network.isOnline);
  const syncStatus = useSelector((state) => state.sync.syncStatus);
  const lastSyncTime = useSelector((state) => state.sync.lastSyncTime);

  if (isOnline) {
    return (
      <View style={styles.onlineContainer}>
        <View style={styles.onlineBadge}>
          <Text style={styles.onlineIndicator}>●</Text>
          <Text style={styles.onlineText}>Online</Text>
          {syncStatus === 'syncing' && <Text style={styles.syncText}> • Syncing...</Text>}
          {syncStatus === 'success' && lastSyncTime && (
            <Text style={styles.syncText}>
              {' '}
              • Synced{' '}
              {formatTimeAgo(new Date(lastSyncTime))}
            </Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineIndicator}>●</Text>
      <Text style={styles.offlineText}>Offline</Text>
      <Text style={styles.offlineSubtext}>• Changes will sync when online</Text>
    </View>
  );
};

const formatTimeAgo = (date) => {
  const now = new Date();
  const secondsAgo = Math.floor((now - date) / 1000);

  if (secondsAgo < 60) return 'just now';
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`;
  return date.toLocaleDateString();
};

const styles = StyleSheet.create({
  onlineContainer: {
    backgroundColor: '#E8F5E9',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#4CAF50',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    color: '#4CAF50',
    fontSize: 12,
    marginRight: 4,
  },
  onlineText: {
    color: '#2E7D32',
    fontSize: 13,
    fontWeight: '500',
  },
  syncText: {
    color: '#558B2F',
    fontSize: 12,
  },
  offlineContainer: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f44336',
  },
  offlineIndicator: {
    color: '#f44336',
    fontSize: 12,
    marginRight: 6,
  },
  offlineText: {
    color: '#C62828',
    fontSize: 13,
    fontWeight: '600',
  },
  offlineSubtext: {
    color: '#E53935',
    fontSize: 11,
    marginLeft: 12,
  },
});

export default NetworkStatusBar;
