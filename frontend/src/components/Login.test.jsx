import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import * as authModule from '../services/authAPI';
import '@testing-library/jest-dom';

jest.mock('../services/authAPI');

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Rendering', () => {
    test('should render login form with all fields', () => {
      const mockOnLoginSuccess = jest.fn();
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);

      expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    test('should render with correct styling classes', () => {
      const mockOnLoginSuccess = jest.fn();
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);

      const heading = screen.getByRole('heading', { name: 'Login' });
      expect(heading.closest('div')).toHaveClass('loginBox');
    });
  });

  describe('Form Input Handling', () => {
    test('should update username input value on change', async () => {
      const user = userEvent.setup();
      const mockOnLoginSuccess = jest.fn();
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);

      const usernameInput = screen.getByPlaceholderText('Enter your username');
      await user.type(usernameInput, 'testuser');

      expect(usernameInput.value).toBe('testuser');
    });

    test('should update password input value on change', async () => {
      const user = userEvent.setup();
      const mockOnLoginSuccess = jest.fn();
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);

      const passwordInput = screen.getByPlaceholderText('Enter your password');
      await user.type(passwordInput, 'password123');

      expect(passwordInput.value).toBe('password123');
    });
  });

  describe('Form Submission', () => {
    test('should call authAPI.login with correct credentials', async () => {
      const user = userEvent.setup();
      const mockOnLoginSuccess = jest.fn();
      const mockResponse = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        success: true,
      };

      authModule.authAPI.login = jest.fn().mockResolvedValueOnce(mockResponse);

      render(<Login onLoginSuccess={mockOnLoginSuccess} />);

      await user.type(screen.getByPlaceholderText('Enter your username'), 'testuser');
      await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');
      await user.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(authModule.authAPI.login).toHaveBeenCalledWith('testuser', 'password123');
      });
    });

    test('should call onLoginSuccess callback on successful login', async () => {
      const user = userEvent.setup();
      const mockOnLoginSuccess = jest.fn();
      const mockResponse = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        success: true,
      };

      authModule.authAPI.login = jest.fn().mockResolvedValueOnce(mockResponse);

      render(<Login onLoginSuccess={mockOnLoginSuccess} />);

      await user.type(screen.getByPlaceholderText('Enter your username'), 'testuser');
      await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');
      await user.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(mockOnLoginSuccess).toHaveBeenCalledWith(mockResponse);
      });
    });
  });

  describe('Error Handling', () => {
    test('should display error message on login failure', async () => {
      const user = userEvent.setup();
      const mockOnLoginSuccess = jest.fn();
      const mockError = {
        success: false,
        message: 'Invalid username or password',
      };

      authModule.authAPI.login = jest.fn().mockResolvedValueOnce(mockError);

      render(<Login onLoginSuccess={mockOnLoginSuccess} />);

      await user.type(screen.getByPlaceholderText('Enter your username'), 'wronguser');
      await user.type(screen.getByPlaceholderText('Enter your password'), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
      });
    });
  });

  describe('LocalStorage', () => {
    test('should store user data in localStorage on successful login', async () => {
      const user = userEvent.setup();
      const mockOnLoginSuccess = jest.fn();
      const mockResponse = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        success: true,
      };

      authModule.authAPI.login = jest.fn().mockResolvedValueOnce(mockResponse);

      render(<Login onLoginSuccess={mockOnLoginSuccess} />);

      await user.type(screen.getByPlaceholderText('Enter your username'), 'testuser');
      await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');
      await user.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        expect(storedUser).toEqual({
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
        });
      });
    });
  });
});

