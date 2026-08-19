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
import { TASK_STATUS, PRIORITY_LEVELS } from '../utils/constants';
import { validateTodoTitle } from '../utils/validators';

const CreateTodoScreen = ({ navigation }) => {
  const { createTodo } = useTodos();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(PRIORITY_LEVELS.MEDIUM);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!validateTodoTitle(title)) {
      Alert.alert('Error', 'Please enter a valid todo title (1-200 characters)');
      return;
    }

    setLoading(true);
    try {
      await createTodo(title, description, priority);
      Alert.alert('Success', 'Todo created!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create todo');
    } finally {
      setLoading(false);
    }
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
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter todo title"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
              editable={!loading}
              maxLength={200}
            />
          </View>

          {/* Description */}
          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description (optional)"
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              editable={!loading}
              maxLength={500}
            />
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
                    priority === p && styles.priorityOptionActive,
                  ]}
                  onPress={() => setPriority(p)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.priorityOptionText,
                      priority === p && styles.priorityOptionTextActive,
                    ]}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.createButton, loading && styles.buttonDisabled]}
              onPress={handleCreate}
              disabled={loading}
            >
              <Text style={styles.createButtonText}>
                {loading ? 'Creating...' : 'Create'}
              </Text>
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
  priorityOptions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  priorityOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#eee',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  priorityOptionActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  priorityOptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  priorityOptionTextActive: {
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  createButton: {
    backgroundColor: '#4CAF50',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default CreateTodoScreen;
