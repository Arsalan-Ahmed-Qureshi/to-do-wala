package com.todotask.service;

import com.todotask.dto.AuthResponse;
import com.todotask.dto.LoginRequest;
import com.todotask.dto.SignupRequest;
import com.todotask.entity.User;
import com.todotask.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    public AuthResponse signup(SignupRequest request) {
        // Validate input
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Username is required")
                    .build();
        }
        
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email is required")
                    .build();
        }
        
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Password is required")
                    .build();
        }
        
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Passwords do not match")
                    .build();
        }
        
        // Check if username exists
        if (userRepository.existsByUsername(request.getUsername())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Username already exists")
                    .build();
        }
        
        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email already exists")
                    .build();
        }
        
        // Create new user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword()) // In production, hash the password!
                .build();
        
        User savedUser = userRepository.save(user);
        
        return AuthResponse.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .message("User registered successfully")
                .success(true)
                .build();
    }
    
    public AuthResponse login(LoginRequest request) {
        // Validate input
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Username is required")
                    .build();
        }
        
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Password is required")
                    .build();
        }
        
        // Find user by username
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());
        
        if (userOptional.isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Invalid username or password")
                    .build();
        }
        
        User user = userOptional.get();
        
        // Check password (in production, compare hashed passwords!)
        if (!user.getPassword().equals(request.getPassword())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Invalid username or password")
                    .build();
        }
        
        // Login successful
        return AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .message("Login successful")
                .success(true)
                .build();
    }
}
