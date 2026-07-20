import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser, logout, setLoading, setError } from '../store/authSlice';
import { authAPI } from '../services/api/axiosConfig';
import { saveUser } from '../services/database/sqlite';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [error, setErrorLocal] = useState(null);

  const signup = useCallback(
    async (username, email, password, confirmPassword) => {
      dispatch(setLoading(true));
      try {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const response = await authAPI.signup({
          username,
          email,
          password,
          confirmPassword,
        });

        const user = response.data;
        dispatch(setUser(user));
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await saveUser(user);
        setErrorLocal(null);
        return user;
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        setErrorLocal(errorMessage);
        dispatch(setError(errorMessage));
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const login = useCallback(
    async (username, password) => {
      dispatch(setLoading(true));
      try {
        const response = await authAPI.login({ username, password });
        const user = response.data;
        dispatch(setUser(user));
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await saveUser(user);
        setErrorLocal(null);
        return user;
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        setErrorLocal(errorMessage);
        dispatch(setError(errorMessage));
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const logoutUser = useCallback(async () => {
    dispatch(logout());
    await AsyncStorage.removeItem('user');
  }, [dispatch]);

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: error || auth.error,
    signup,
    login,
    logout: logoutUser,
  };
};
