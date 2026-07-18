import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Signup from './Signup';
import * as authModule from '../services/authAPI';
import '@testing-library/jest-dom';

jest.mock('../services/authAPI');

describe('Signup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Rendering', () => {
    test('should render signup form with all fields', () => {
      const mockOnSignupSuccess = jest.fn();
      render(<Signup onSignupSuccess={mockOnSignupSuccess} />);

      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Choose a username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter a password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    test('should render with correct styling classes', () => {
      const mockOnSignupSuccess = jest.fn();
      render(<Signup onSignupSuccess={mockOnSignupSuccess} />);

      const container = screen.getByText('Create Account').closest('div');
      expect(container).toHaveClass('signupBox');
    });
  });

  describe('Form Input Handling', () => {
    test('should update username input value on change', async () => {
      const user = userEvent.setup();
      const mockOnSignupSuccess = jest.fn();
      render(<Signup onSignupSuccess={mockOnSignupSuccess} />);

      const usernameInput = screen.getByPlaceholderText('Choose a username');
      await user.type(usernameInput, 'newuser');

      expect(usernameInput.value).toBe('newuser');
    });

    test('should update email input value on change', async () => {
      const user = userEvent.setup();
      const mockOnSignupSuccess = jest.fn();
      render(<Signup onSignupSuccess={mockOnSignupSuccess} />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      await user.type(emailInput, 'user@example.com');

      expect(emailInput.value).toBe('user@example.com');
    });

    test('should update password input value on change', async () => {
      const user = userEvent.setup();
      const mockOnSignupSuccess = jest.fn();
      render(<Signup onSignupSuccess={mockOnSignupSuccess} />);

      const passwordInput = screen.getByPlaceholderText('Enter a password');
      await user.type(passwordInput, 'password123');

      expect(passwordInput.value).toBe('password123');
    });

    test('should update confirm password input value on change', async () => {
      const user = userEvent.setup();
      const mockOnSignupSuccess = jest.fn();
      render(<Signup onSignupSuccess={mockOnSignupSuccess} />);

      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      await user.type(confirmPasswordInput, 'password123');

      expect(confirmPasswordInput.value).toBe('password123');
    });
  });

  describe('Form Submission', () => {
    test('should call authAPI.signup with correct data', async () => {
      const user = userEvent.setup();
      const mockOnSignupSuccess = jest.fn();
      const mockResponse = {
        id: 1,
        username: 'newuser',
        email: 'newuser@example.com',
        success: true,
      };

      authModule.authAPI.signup = jest.fn().mockResolvedValueOnce(mockResponse);

      render(<Signup onSignupSuccess={mockOnSignupSuccess} />);

      await user.type(screen.getByPlaceholderText('Choose a username'), 'newuser');
      await user.type(screen.getByPlaceholderText('Enter your email'), 'newuser@example.com');
      await user.type(screen.getByPlaceholderText('Enter a password'), 'password123');
      await user.type(screen.getByPlaceholderText('Confirm your password'), 'password123');
      await user.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(authModule.authAPI.signup).toHaveBeenCalledWith(
          'newuser',
          'newuser@example.com',
          'password123',
          'password123'
        );
      });
    });

    test('should call onSignupSuccess callback on successful signup', async () => {
      const user = userEvent.setup();
      const mockOnSignupSuccess = jest.fn();
      const mockResponse = {
        id: 1,
        username: 'newuser',
        email: 'newuser@example.com',
        success: true,
      };

      authModule.authAPI.signup = jest.fn().mockResolvedValueOnce(mockResponse);

      render(<Signup onSignupSuccess={mockOnSignupSuccess} />);

      await user.type(screen.getByPlaceholderText('Choose a username'), 'newuser');
      await user.type(screen.getByPlaceholderText('Enter your email'), 'newuser@example.com');
      await user.type(screen.getByPlaceholderText('Enter a password'), 'password123');
      await user.type(screen.getByPlaceholderText('Confirm your password'), 'password123');
      await user.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(mockOnSignupSuccess).toHaveBeenCalledWith(mockResponse);
      });
    });
  });

  describe('Error Handling', () => {
    test('should display error message on signup failure', async () => {
      const user = userEvent.setup();
      const mockOnSignupSuccess = jest.fn();
      const mockError = {
        success: false,
        message: 'Username already exists',
      };

      authModule.authAPI.signup = jest.fn().mockResolvedValueOnce(mockError);

      render(<Signup onSignupSuccess={mockOnSignupSuccess} />);

      await user.type(screen.getByPlaceholderText('Choose a username'), 'existinguser');
      await user.type(screen.getByPlaceholderText('Enter your email'), 'new@example.com');
      await user.type(screen.getByPlaceholderText('Enter a password'), 'password123');
      await user.type(screen.getByPlaceholderText('Confirm your password'), 'password123');
      await user.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(screen.getByText('Username already exists')).toBeInTheDocument();
      });
    });
  });

  describe('LocalStorage', () => {
    test('should store user data in localStorage on successful signup', async () => {
      const user = userEvent.setup();
      const mockOnSignupSuccess = jest.fn();
      const mockResponse = {
        id: 1,
        username: 'newuser',
        email: 'newuser@example.com',
        success: true,
      };

      authModule.authAPI.signup = jest.fn().mockResolvedValueOnce(mockResponse);

      render(<Signup onSignupSuccess={mockOnSignupSuccess} />);

      await user.type(screen.getByPlaceholderText('Choose a username'), 'newuser');
      await user.type(screen.getByPlaceholderText('Enter your email'), 'newuser@example.com');
      await user.type(screen.getByPlaceholderText('Enter a password'), 'password123');
      await user.type(screen.getByPlaceholderText('Confirm your password'), 'password123');
      await user.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        expect(storedUser).toEqual({
          id: 1,
          username: 'newuser',
          email: 'newuser@example.com',
        });
      });
    });
  });
});
