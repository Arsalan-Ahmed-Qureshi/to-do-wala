package com.todotask.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todotask.dto.AuthResponse;
import com.todotask.dto.LoginRequest;
import com.todotask.dto.SignupRequest;
import com.todotask.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@DisplayName("AuthController Tests")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    // ==================== SIGNUP ENDPOINT TESTS ====================

    @Test
    @DisplayName("POST /api/auth/signup - should return 201 on successful signup")
    void testSignupEndpointSuccess() throws Exception {
        // Arrange
        SignupRequest request = new SignupRequest();
        request.setUsername("newuser");
        request.setEmail("newuser@example.com");
        request.setPassword("password123");
        request.setConfirmPassword("password123");

        AuthResponse response = new AuthResponse();
        response.setId(1L);
        response.setUsername("newuser");
        response.setEmail("newuser@example.com");
        response.setSuccess(true);
        response.setMessage("User registered successfully");

        when(authService.signup(any(SignupRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("newuser"))
                .andExpect(jsonPath("$.email").value("newuser@example.com"))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User registered successfully"));
    }

    @Test
    @DisplayName("POST /api/auth/signup - should return 400 when username exists")
    void testSignupEndpointUsernameExists() throws Exception {
        // Arrange
        SignupRequest request = new SignupRequest();
        request.setUsername("existinguser");
        request.setEmail("newemail@example.com");
        request.setPassword("password123");
        request.setConfirmPassword("password123");

        AuthResponse response = new AuthResponse();
        response.setSuccess(false);
        response.setMessage("Username already exists");

        when(authService.signup(any(SignupRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Username already exists"));
    }

    @Test
    @DisplayName("POST /api/auth/signup - should return 400 when email exists")
    void testSignupEndpointEmailExists() throws Exception {
        // Arrange
        SignupRequest request = new SignupRequest();
        request.setUsername("newuser");
        request.setEmail("existing@example.com");
        request.setPassword("password123");
        request.setConfirmPassword("password123");

        AuthResponse response = new AuthResponse();
        response.setSuccess(false);
        response.setMessage("Email already registered");

        when(authService.signup(any(SignupRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Email already registered"));
    }

    @Test
    @DisplayName("POST /api/auth/signup - should return 400 when passwords don't match")
    void testSignupEndpointPasswordMismatch() throws Exception {
        // Arrange
        SignupRequest request = new SignupRequest();
        request.setUsername("newuser");
        request.setEmail("newuser@example.com");
        request.setPassword("password123");
        request.setConfirmPassword("password456");

        AuthResponse response = new AuthResponse();
        response.setSuccess(false);
        response.setMessage("Passwords do not match");

        when(authService.signup(any(SignupRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Passwords do not match"));
    }

    // ==================== LOGIN ENDPOINT TESTS ====================

    @Test
    @DisplayName("POST /api/auth/login - should return 200 on successful login")
    void testLoginEndpointSuccess() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("existinguser");
        request.setPassword("password123");

        AuthResponse response = new AuthResponse();
        response.setId(1L);
        response.setUsername("existinguser");
        response.setEmail("user@example.com");
        response.setSuccess(true);
        response.setMessage("Login successful");

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("existinguser"))
                .andExpect(jsonPath("$.email").value("user@example.com"))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Login successful"));
    }

    @Test
    @DisplayName("POST /api/auth/login - should return 401 when credentials invalid")
    void testLoginEndpointInvalidCredentials() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("wronguser");
        request.setPassword("wrongpassword");

        AuthResponse response = new AuthResponse();
        response.setSuccess(false);
        response.setMessage("Invalid username or password");

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid username or password"));
    }

    @Test
    @DisplayName("POST /api/auth/login - should return 401 when password incorrect")
    void testLoginEndpointWrongPassword() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("existinguser");
        request.setPassword("wrongpassword");

        AuthResponse response = new AuthResponse();
        response.setSuccess(false);
        response.setMessage("Invalid username or password");

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid username or password"));
    }

    @Test
    @DisplayName("POST /api/auth/login - should return 401 when user not found")
    void testLoginEndpointUserNotFound() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("nonexistent");
        request.setPassword("password123");

        AuthResponse response = new AuthResponse();
        response.setSuccess(false);
        response.setMessage("Invalid username or password");

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid username or password"));
    }

    @Test
    @DisplayName("POST /api/auth/login - should return 400 when username empty")
    void testLoginEndpointEmptyUsername() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("");
        request.setPassword("password123");

        AuthResponse response = new AuthResponse();
        response.setSuccess(false);
        response.setMessage("Username cannot be empty");

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("POST /api/auth/login - should return 400 when password empty")
    void testLoginEndpointEmptyPassword() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("existinguser");
        request.setPassword("");

        AuthResponse response = new AuthResponse();
        response.setSuccess(false);
        response.setMessage("Password cannot be empty");

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }
}
