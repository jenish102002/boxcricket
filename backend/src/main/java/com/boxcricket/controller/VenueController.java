package com.boxcricket.controller;

import com.boxcricket.dto.ApiResponse;
import com.boxcricket.dto.venue.VenueRequest;
import com.boxcricket.dto.venue.VenueResponse;
import com.boxcricket.service.VenueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
@Tag(name = "Venues", description = "Venue management")
public class VenueController {

    private final VenueService venueService;

    @GetMapping
    @Operation(summary = "List all active venues (public)")
    public ResponseEntity<ApiResponse<List<VenueResponse>>> getActiveVenues() {
        return ResponseEntity.ok(ApiResponse.success(venueService.getAllActiveVenues()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all venues including inactive (admin)")
    public ResponseEntity<ApiResponse<List<VenueResponse>>> getAllVenues() {
        return ResponseEntity.ok(ApiResponse.success(venueService.getAllVenues()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get venue by ID")
    public ResponseEntity<ApiResponse<VenueResponse>> getVenue(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(venueService.getVenueById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create venue (admin)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<VenueResponse>> createVenue(@Valid @RequestBody VenueRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Venue created", venueService.createVenue(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update venue (admin)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<VenueResponse>> updateVenue(@PathVariable Long id, @Valid @RequestBody VenueRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Venue updated", venueService.updateVenue(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete venue (admin)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> deleteVenue(@PathVariable Long id) {
        venueService.deleteVenue(id);
        return ResponseEntity.ok(ApiResponse.success("Venue deleted", null));
    }
}
