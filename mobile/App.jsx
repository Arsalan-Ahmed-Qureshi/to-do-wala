import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector, useDispatch } from 'react-redux';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from './src/store/authSlice';
import { initializeDatabase } from './src/services/database/sqlite';
import { useNetworkStatus } from './src/hooks/useNetworkStatus';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import TodoListScreen from './src/screens/TodoListScreen';
import CreateTodoScreen from './src/screens/CreateTodoScreen';
import TodoDetailScreen from './src/screens/TodoDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

// Todo Stack
const TodoStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#2196F3',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}
  >
    <Stack.Screen
      name="TodoList"
      component={TodoListScreen}
      options={{ title: 'My Todos' }}
    />
    <Stack.Screen
      name="CreateTodo"
      component={CreateTodoScreen}
      options={{ title: 'New Todo' }}
    />
    <Stack.Screen
      name="TodoDetail"
      component={TodoDetailScreen}
      options={({ route }) => ({
        title: route.params?.todo?.title || 'Todo Details',
      })}
    />
  </Stack.Navigator>
);

// Settings Stack
const SettingsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#2196F3',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}
  >
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: 'Settings' }}
    />
  </Stack.Navigator>
);

// Settings Screen (placeholder)
const SettingsScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isOnline = useSelector((state) => state.network.isOnline);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
      <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 12 }}>
        <Text style={{ fontSize: 14, color: '#999' }}>User</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginTop: 4 }}>
          {user?.username || 'Guest'}
        </Text>
      </View>

      <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 12 }}>
        <Text style={{ fontSize: 14, color: '#999' }}>Email</Text>
        <Text style={{ fontSize: 16, color: '#333', marginTop: 4 }}>
          {user?.email || '-'}
        </Text>
      </View>

      <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 12 }}>
        <Text style={{ fontSize: 14, color: '#999' }}>Status</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: isOnline ? '#4CAF50' : '#f44336',
              marginRight: 8,
            }}
          />
          <Text style={{ fontSize: 16, color: isOnline ? '#4CAF50' : '#f44336' }}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={{ marginTop: 20, backgroundColor: '#f44336', padding: 14, borderRadius: 8 }}
        onPress={() => {
          AsyncStorage.removeItem('user');
          dispatch(require('./src/store/authSlice').logout());
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// App Navigation
const AppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarLabel: '',
      tabBarIcon: ({ color, size }) => {
        let icon = '📝';
        if (route.name === 'Settings') icon = '⚙️';
        return <Text style={{ fontSize: 24 }}>{icon}</Text>;
      },
      tabBarActiveTintColor: '#2196F3',
      tabBarInactiveTintColor: '#ccc',
      tabBarStyle: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingBottom: 8,
        paddingTop: 8,
      },
    })}
  >
    <Tab.Screen name="Todos" component={TodoStack} />
    <Tab.Screen name="Settings" component={SettingsStack} />
  </Tab.Navigator>
);

// Root Navigator
const RootNavigator = () => {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated && user) {
    return <AppTabs />;
  }
  return <AuthStack />;
};

// Main App Component
const App = () => {
  const dispatch = useDispatch();
  const [isAppReady, setIsAppReady] = React.useState(false);

  // Initialize app on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize database
        await initializeDatabase();

        // Restore user from storage if available
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          dispatch(setUser(user));
        }

        // Monitor network status
        useNetworkStatus();
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsAppReady(true);
      }
    };

    initializeApp();
  }, [dispatch]);

  if (!isAppReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

// Missing imports
import { Text, TouchableOpacity } from 'react-native';

export default App;
