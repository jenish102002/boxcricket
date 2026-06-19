package com.boxcricket.controller;

import com.boxcricket.config.JwtService;
import com.boxcricket.dto.ApiResponse;
import com.boxcricket.dto.auth.AuthResponse;
import com.boxcricket.dto.auth.LoginRequest;
import com.boxcricket.dto.auth.RegisterRequest;
import com.boxcricket.entity.User;
import com.boxcricket.repository.UserRepository;
import com.boxcricket.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Register, login, and profile endpoints")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Registered successfully", authService.register(request)));
    }

    @PostMapping("/login")
    @Operation(summary = "Login and get JWT")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Login successful", authService.login(request)));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<ApiResponse<AuthResponse>> me(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new com.boxcricket.exception.ResourceNotFoundException("User not found"));
        AuthResponse profile = AuthResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
}
