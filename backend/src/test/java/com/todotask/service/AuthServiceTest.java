package com.todotask.service;

import com.todotask.dto.AuthResponse;
import com.todotask.dto.LoginRequest;
import com.todotask.dto.SignupRequest;
import com.todotask.entity.User;
import com.todotask.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@DisplayName("AuthService Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ==================== SIGNUP TESTS ====================

    @Test
    @DisplayName("Signup - should successfully create new user")
    void testSignupSuccess() {
        // Arrange
        SignupRequest request = new SignupRequest();
        request.setUsername("newuser");
        request.setEmail("newuser@example.com");
        request.setPassword("password123");
        request.setConfirmPassword("password123");

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("newuser@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });

        // Act
        AuthResponse response = authService.signup(request);

        // Assert
        assertTrue(response.isSuccess());
        assertEquals("User registered successfully", response.getMessage());
        assertEquals("newuser", response.getUsername());
        assertEquals("newuser@example.com", response.getEmail());
        assertNotNull(response.getId());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Signup - should fail when username already exists")
    void testSignupUsernameExists() {
        // Arrange
        SignupRequest request = new SignupRequest();
        request.setUsername("existinguser");
        request.setEmail("newemail@example.com");
        request.setPassword("password123");
        request.setConfirmPassword("password123");

        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        // Act
        AuthResponse response = authService.signup(request);

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("Username already exists", response.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Signup - should fail when email already exists")
    void testSignupEmailExists() {
        // Arrange
        SignupRequest request = new SignupRequest();
        request.setUsername("newuser");
        request.setEmail("existing@example.com");
        request.setPassword("password123");
        request.setConfirmPassword("password123");

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // Act
        AuthResponse response = authService.signup(request);

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("Email already exists", response.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Signup - should fail when passwords don't match")
    void testSignupPasswordMismatch() {
        // Arrange
        SignupRequest request = new SignupRequest();
        request.setUsername("newuser");
        request.setEmail("newuser@example.com");
        request.setPassword("password123");
        request.setConfirmPassword("password456");

        // Act
        AuthResponse response = authService.signup(request);

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("Passwords do not match", response.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Signup - should fail when username is empty")
    void testSignupEmptyUsername() {
        // Arrange
        SignupRequest request = new SignupRequest();
        request.setUsername("");
        request.setEmail("newuser@example.com");
        request.setPassword("password123");
        request.setConfirmPassword("password123");

        // Act
        AuthResponse response = authService.signup(request);

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("Username is required", response.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Signup - should fail when email is empty")
    void testSignupEmptyEmail() {
        // Arrange
        SignupRequest request = new SignupRequest();
        request.setUsername("newuser");
        request.setEmail("");
        request.setPassword("password123");
        request.setConfirmPassword("password123");

        // Act
        AuthResponse response = authService.signup(request);

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("Email is required", response.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    // ==================== LOGIN TESTS ====================

    @Test
    @DisplayName("Login - should successfully login user")
    void testLoginSuccess() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("existinguser");
        request.setPassword("password123");

        User user = new User();
        user.setId(1L);
        user.setUsername("existinguser");
        user.setEmail("user@example.com");
        user.setPassword("password123");

        when(userRepository.findByUsername("existinguser")).thenReturn(Optional.of(user));

        // Act
        AuthResponse response = authService.login(request);

        // Assert
        assertTrue(response.isSuccess());
        assertEquals("Login successful", response.getMessage());
        assertEquals("existinguser", response.getUsername());
        assertEquals("user@example.com", response.getEmail());
        assertEquals(1L, response.getId());
        verify(userRepository, times(1)).findByUsername("existinguser");
    }

    @Test
    @DisplayName("Login - should fail when user not found")
    void testLoginUserNotFound() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("nonexistent");
        request.setPassword("password123");

        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // Act
        AuthResponse response = authService.login(request);

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("Invalid username or password", response.getMessage());
        verify(userRepository, times(1)).findByUsername("nonexistent");
    }

    @Test
    @DisplayName("Login - should fail when password is incorrect")
    void testLoginIncorrectPassword() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("existinguser");
        request.setPassword("wrongpassword");

        User user = new User();
        user.setId(1L);
        user.setUsername("existinguser");
        user.setEmail("user@example.com");
        user.setPassword("password123");

        when(userRepository.findByUsername("existinguser")).thenReturn(Optional.of(user));

        // Act
        AuthResponse response = authService.login(request);

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("Invalid username or password", response.getMessage());
        verify(userRepository, times(1)).findByUsername("existinguser");
    }

    @Test
    @DisplayName("Login - should fail when username is empty")
    void testLoginEmptyUsername() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("");
        request.setPassword("password123");

        // Act
        AuthResponse response = authService.login(request);

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("Username is required", response.getMessage());
        verify(userRepository, never()).findByUsername(any());
    }

    @Test
    @DisplayName("Login - should fail when password is empty")
    void testLoginEmptyPassword() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("existinguser");
        request.setPassword("");

        // Act
        AuthResponse response = authService.login(request);

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("Password is required", response.getMessage());
        verify(userRepository, never()).findByUsername(any());
    }
}
