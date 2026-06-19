package com.boxcricket.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private Map<String, Object> errorBody(HttpStatus status, String error, String message, String path) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", error);
        body.put("message", message);
        body.put("path", path);
        return body;
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(errorBody(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), req.getRequestURI()));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequest(BadRequestException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(errorBody(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), req.getRequestURI()));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Map<String, Object>> handleForbidden(UnauthorizedException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(errorBody(HttpStatus.FORBIDDEN, "Forbidden", ex.getMessage(), req.getRequestURI()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(errorBody(HttpStatus.FORBIDDEN, "Forbidden", "Access denied", req.getRequestURI()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(errorBody(HttpStatus.UNAUTHORIZED, "Unauthorized", "Invalid email or password", req.getRequestURI()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            fieldErrors.put(fieldName, errorMessage);
        });
        Map<String, Object> body = errorBody(HttpStatus.BAD_REQUEST, "Validation Failed", "Input validation error", req.getRequestURI());
        body.put("fieldErrors", fieldErrors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(Exception ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(errorBody(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", ex.getMessage(), req.getRequestURI()));
    }
}
