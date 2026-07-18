import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { authAPI, todoAPI } from '../services/api';
import '@testing-library/jest-dom';

jest.mock('../services/api');

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Complete Signup and Login Flow', () => {
    test('should complete signup and then login flow successfully', async () => {
      const user = userEvent.setup();

      const signupResponse = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        success: true,
        message: 'User registered successfully',
      };

      const loginResponse = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        success: true,
        message: 'Login successful',
      };

      authAPI.signup.mockResolvedValueOnce(signupResponse);
      authAPI.login.mockResolvedValueOnce(loginResponse);
      todoAPI.getTodos.mockResolvedValueOnce([]);

      render(<App />);

      // Should show login page initially
      expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
      
      // Switch to signup mode
      const signupLink = screen.getByText(/sign up/i);
      await user.click(signupLink);

      // Fill signup form
      const usernameInputs = screen.getAllByPlaceholderText('Username');
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInputs = screen.getAllByPlaceholderText('Password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');

      await user.type(usernameInputs[0], 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInputs[0], 'password123');
      await user.type(confirmPasswordInput, 'password123');

      // Submit signup
      const signupButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signupButton);

      // Verify signup was called
      await waitFor(() => {
        expect(authAPI.signup).toHaveBeenCalledWith(
          'testuser',
          'test@example.com',
          'password123',
          'password123'
        );
      });

      // After successful signup, should show todo app
      await waitFor(() => {
        expect(screen.getByText(/todotask/i)).toBeInTheDocument();
      });
    });

    test('should persist user session in localStorage', async () => {
      const user = userEvent.setup();

      const loginResponse = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        success: true,
        message: 'Login successful',
      };

      authAPI.login.mockResolvedValueOnce(loginResponse);
      todoAPI.getTodos.mockResolvedValueOnce([]);

      render(<App />);

      // Perform login
      const usernameInput = screen.getByPlaceholderText('Username');
      const passwordInput = screen.getByPlaceholderText('Password');
      const loginButton = screen.getByRole('button', { name: /login/i });

      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'password123');
      await user.click(loginButton);

      // Verify localStorage is updated
      await waitFor(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        expect(storedUser).toEqual({
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
        });
      });
    });

    test('should restore session from localStorage on app load', async () => {
      // Set up localStorage with existing user
      const existingUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      };
      localStorage.setItem('user', JSON.stringify(existingUser));

      todoAPI.getTodos.mockResolvedValueOnce([]);

      render(<App />);

      // Should show todo app instead of login
      await waitFor(() => {
        expect(screen.getByText(/todotask/i)).toBeInTheDocument();
        expect(screen.getByText('testuser')).toBeInTheDocument();
      });
    });
  });

  describe('Login Error Scenarios', () => {
    test('should display error on invalid login credentials', async () => {
      const user = userEvent.setup();

      const loginError = {
        success: false,
        message: 'Invalid username or password',
      };

      authAPI.login.mockResolvedValueOnce(loginError);

      render(<App />);

      const usernameInput = screen.getByPlaceholderText('Username');
      const passwordInput = screen.getByPlaceholderText('Password');
      const loginButton = screen.getByRole('button', { name: /login/i });

      await user.type(usernameInput, 'wronguser');
      await user.type(passwordInput, 'wrongpass');
      await user.click(loginButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
      });

      // Should still be on login page
      expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    });
  });

  describe('Signup Error Scenarios', () => {
    test('should display error when username already exists', async () => {
      const user = userEvent.setup();

      const signupError = {
        success: false,
        message: 'Username already exists',
      };

      authAPI.signup.mockResolvedValueOnce(signupError);

      render(<App />);

      // Switch to signup
      const signupLink = screen.getByText(/sign up/i);
      await user.click(signupLink);

      // Fill signup form
      const usernameInputs = screen.getAllByPlaceholderText('Username');
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInputs = screen.getAllByPlaceholderText('Password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');

      await user.type(usernameInputs[0], 'existinguser');
      await user.type(emailInput, 'new@example.com');
      await user.type(passwordInputs[0], 'password123');
      await user.type(confirmPasswordInput, 'password123');

      const signupButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signupButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText('Username already exists')).toBeInTheDocument();
      });
    });

    test('should display error when email already registered', async () => {
      const user = userEvent.setup();

      const signupError = {
        success: false,
        message: 'Email already registered',
      };

      authAPI.signup.mockResolvedValueOnce(signupError);

      render(<App />);

      // Switch to signup
      const signupLink = screen.getByText(/sign up/i);
      await user.click(signupLink);

      // Fill signup form
      const usernameInputs = screen.getAllByPlaceholderText('Username');
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInputs = screen.getAllByPlaceholderText('Password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');

      await user.type(usernameInputs[0], 'newuser');
      await user.type(emailInput, 'existing@example.com');
      await user.type(passwordInputs[0], 'password123');
      await user.type(confirmPasswordInput, 'password123');

      const signupButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signupButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText('Email already registered')).toBeInTheDocument();
      });
    });
  });

  describe('Logout Functionality', () => {
    test('should logout user and return to login screen', async () => {
      const user = userEvent.setup();

      const existingUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      };
      localStorage.setItem('user', JSON.stringify(existingUser));

      todoAPI.getTodos.mockResolvedValueOnce([]);

      render(<App />);

      // Should show todo app
      await waitFor(() => {
        expect(screen.getByText(/todotask/i)).toBeInTheDocument();
      });

      // Click logout button
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      await user.click(logoutButton);

      // Should return to login screen
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.queryByText('testuser')).not.toBeInTheDocument();
      });

      // localStorage should be cleared
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('Mode Switching', () => {
    test('should switch between login and signup modes', async () => {
      const user = userEvent.setup();

      render(<App />);

      // Initially on login page
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Email')).not.toBeInTheDocument();

      // Click to switch to signup
      const signupLink = screen.getByText(/sign up/i);
      await user.click(signupLink);

      // Should now show signup form
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();

      // Click to switch back to login
      const loginLink = screen.getByText(/already have an account/i);
      await user.click(loginLink);

      // Should be back to login form
      expect(screen.queryByPlaceholderText('Email')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });
  });
});
