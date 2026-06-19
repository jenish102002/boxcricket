package com.boxcricket.controller;

import com.boxcricket.config.JwtService;
import com.boxcricket.dto.ApiResponse;
import com.boxcricket.dto.booking.BookingRequest;
import com.boxcricket.dto.booking.BookingResponse;
import com.boxcricket.entity.User;
import com.boxcricket.repository.UserRepository;
import com.boxcricket.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Booking management")
@SecurityRequirement(name = "bearerAuth")
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    @PostMapping
    @Operation(summary = "Create a booking (user)")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(ApiResponse.success("Booking confirmed", bookingService.createBooking(request, userId)));
    }

    @GetMapping("/me")
    @Operation(summary = "Get my bookings (user)")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(ApiResponse.success(bookingService.getMyBookings(userId)));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel a booking (user can cancel own; admin can cancel any)")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled", bookingService.cancelBooking(id, userId, isAdmin)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all bookings (admin)")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getAllBookings()));
    }

    private Long getUserId(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElseThrow(() -> new com.boxcricket.exception.ResourceNotFoundException("User not found"));
    }
}
