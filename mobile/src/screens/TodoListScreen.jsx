import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTodos } from '../hooks/useTodos';
import { TASK_STATUS, PRIORITY_COLORS, STATUS_LABELS } from '../utils/constants';

const TodoItem = ({ todo, onPress, onDelete, onStatusChange }) => {
  return (
    <TouchableOpacity style={styles.todoCard} onPress={() => onPress(todo)}>
      <View style={styles.todoHeader}>
        <Text
          style={[
            styles.todoTitle,
            todo.status === TASK_STATUS.COMPLETED && styles.completedText,
          ]}
          numberOfLines={1}
        >
          {todo.title}
        </Text>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: PRIORITY_COLORS[todo.priority] || '#999' },
          ]}
        >
          <Text style={styles.priorityText}>{todo.priority}</Text>
        </View>
      </View>

      {todo.description ? (
        <Text style={styles.todoDescription} numberOfLines={2}>
          {todo.description}
        </Text>
      ) : null}

      <View style={styles.todoFooter}>
        <Text style={styles.statusBadge}>{STATUS_LABELS[todo.status]}</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              const nextStatus =
                todo.status === TASK_STATUS.COMPLETED
                  ? TASK_STATUS.TO_BE_START
                  : TASK_STATUS.COMPLETED;
              onStatusChange(todo.id, nextStatus);
            }}
          >
            <Text style={styles.actionText}>
              {todo.status === TASK_STATUS.COMPLETED ? '↩' : '✓'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(todo.id)}
          >
            <Text style={styles.deleteText}>🗑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TodoListScreen = ({ navigation }) => {
  const { filteredTodos, filterTodos, lastFilter, deleteTodoLocal, updateStatus, reload } =
    useTodos();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      reload();
    }, [reload])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  const handleDeleteTodo = (todoId) => {
    Alert.alert('Delete Todo', 'Are you sure?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: () => deleteTodoLocal(todoId),
        style: 'destructive',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Filters */}
      <View style={styles.filterBar}>
        {['all', 'active', 'completed'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              lastFilter === filter && styles.filterButtonActive,
            ]}
            onPress={() => filterTodos(filter)}
          >
            <Text
              style={[
                styles.filterText,
                lastFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Todos List */}
      {filteredTodos.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No todos yet</Text>
          <Text style={styles.emptySubtext}>
            {lastFilter === 'completed'
              ? 'You have no completed tasks'
              : 'Create one to get started'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTodos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TodoItem
              todo={item}
              onPress={() => navigation.navigate('TodoDetail', { todo: item })}
              onDelete={handleDeleteTodo}
              onStatusChange={updateStatus}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* FAB - Create Todo */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateTodo')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
  },
  filterText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 12,
  },
  todoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  todoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  priorityText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  todoDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  todoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 6,
    fontSize: 18,
  },
  actionText: {
    fontSize: 16,
  },
  deleteButton: {
    padding: 6,
  },
  deleteText: {
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
});

export default TodoListScreen;
