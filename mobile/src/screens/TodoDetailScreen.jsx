import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTodos } from '../hooks/useTodos';
import { TASK_STATUS, PRIORITY_LEVELS, STATUS_LABELS, PRIORITY_COLORS } from '../utils/constants';

const TodoDetailScreen = ({ route, navigation }) => {
  const { todo } = route.params;
  const { updateTodoLocal, deleteTodoLocal } = useTodos();
  
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [status, setStatus] = useState(todo.status);
  const [priority, setPriority] = useState(todo.priority);
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleFieldChange = (field, value) => {
    setIsDirty(true);
    switch (field) {
      case 'title':
        setTitle(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'status':
        setStatus(value);
        break;
      case 'priority':
        setPriority(value);
        break;
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await updateTodoLocal(todo.id, {
        title,
        description,
        status,
        priority,
      });
      setIsDirty(false);
      Alert.alert('Success', 'Todo updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Todo', 'Are you sure?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          await deleteTodoLocal(todo.id);
          navigation.goBack();
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          {/* Title */}
          <View style={styles.field}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={(val) => handleFieldChange('title', val)}
              editable={!loading}
            />
          </View>

          {/* Description */}
          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={(val) => handleFieldChange('description', val)}
              multiline
              numberOfLines={4}
              editable={!loading}
            />
          </View>

          {/* Status */}
          <View style={styles.field}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusOptions}>
              {Object.values(TASK_STATUS).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.statusOption,
                    status === s && styles.statusOptionActive,
                  ]}
                  onPress={() => handleFieldChange('status', s)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      status === s && styles.statusOptionTextActive,
                    ]}
                  >
                    {STATUS_LABELS[s]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Priority */}
          <View style={styles.field}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityOptions}>
              {Object.values(PRIORITY_LEVELS).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityOption,
                    { backgroundColor: PRIORITY_COLORS[p] },
                    priority === p && styles.priorityOptionActive,
                  ]}
                  onPress={() => handleFieldChange('priority', p)}
                  disabled={loading}
                >
                  <Text style={styles.priorityOptionText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Metadata */}
          <View style={styles.metadata}>
            <Text style={styles.metadataText}>
              Created: {new Date(todo.createdAt).toLocaleDateString()}
            </Text>
            <Text style={styles.metadataText}>
              Updated: {new Date(todo.updatedAt).toLocaleDateString()}
            </Text>
            {todo.version !== undefined && (
              <Text style={styles.metadataText}>Version: {todo.version}</Text>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
            {isDirty && (
              <TouchableOpacity
                style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={loading}
              >
                <Text style={styles.saveButtonText}>
                  {loading ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
              disabled={loading}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 100,
  },
  statusOptions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#eee',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  statusOptionActive: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  statusOptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  statusOptionTextActive: {
    color: '#2196F3',
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  priorityOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    opacity: 0.6,
  },
  priorityOptionActive: {
    opacity: 1,
    borderWidth: 3,
    borderColor: '#333',
  },
  priorityOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  metadata: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  metadataText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default TodoDetailScreen;
