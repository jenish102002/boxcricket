package com.boxcricket.controller;

import com.boxcricket.dto.ApiResponse;
import com.boxcricket.dto.slot.BulkSlotRequest;
import com.boxcricket.dto.slot.SlotRequest;
import com.boxcricket.dto.slot.SlotResponse;
import com.boxcricket.service.SlotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Slots", description = "Time slot management")
public class SlotController {

    private final SlotService slotService;

    @GetMapping("/api/venues/{venueId}/slots")
    @Operation(summary = "Get available slots for a venue (optionally filtered by date)")
    public ResponseEntity<ApiResponse<List<SlotResponse>>> getSlotsByVenue(
            @PathVariable Long venueId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success(slotService.getSlotsByVenue(venueId, date)));
    }

    @GetMapping("/api/slots")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all slots (admin)")
    public ResponseEntity<ApiResponse<List<SlotResponse>>> getAllSlots() {
        return ResponseEntity.ok(ApiResponse.success(slotService.getAllSlots()));
    }

    @GetMapping("/api/slots/{id}")
    @Operation(summary = "Get slot by ID")
    public ResponseEntity<ApiResponse<SlotResponse>> getSlot(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(slotService.getSlotById(id)));
    }

    @PostMapping("/api/slots")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a single slot (admin)")
    public ResponseEntity<ApiResponse<SlotResponse>> createSlot(@Valid @RequestBody SlotRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Slot created", slotService.createSlot(request)));
    }

    @PostMapping("/api/slots/bulk")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Bulk-generate slots (admin)")
    public ResponseEntity<ApiResponse<List<SlotResponse>>> bulkCreateSlots(@Valid @RequestBody BulkSlotRequest request) {
        List<SlotResponse> slots = slotService.createBulkSlots(request);
        return ResponseEntity.ok(ApiResponse.success(slots.size() + " slots created", slots));
    }

    @PutMapping("/api/slots/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a slot (admin)")
    public ResponseEntity<ApiResponse<SlotResponse>> updateSlot(@PathVariable Long id, @Valid @RequestBody SlotRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Slot updated", slotService.updateSlot(id, request)));
    }

    @DeleteMapping("/api/slots/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a slot (admin)")
    public ResponseEntity<ApiResponse<Void>> deleteSlot(@PathVariable Long id) {
        slotService.deleteSlot(id);
        return ResponseEntity.ok(ApiResponse.success("Slot deleted", null));
    }
}
