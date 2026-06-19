package com.boxcricket.controller;

import com.boxcricket.dto.ApiResponse;
import com.boxcricket.dto.analytics.RevenueDataPoint;
import com.boxcricket.dto.analytics.SlotStatusBreakdown;
import com.boxcricket.dto.analytics.SummaryResponse;
import com.boxcricket.dto.analytics.VenueAnalyticsResponse;
import com.boxcricket.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Admin analytics and revenue data")
@SecurityRequirement(name = "bearerAuth")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    @Operation(summary = "KPI summary: total revenue, bookings, occupancy, active venues")
    public ResponseEntity<ApiResponse<SummaryResponse>> getSummary() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getSummary()));
    }

    @GetMapping("/revenue")
    @Operation(summary = "Revenue time series (day by day) for a date range")
    public ResponseEntity<ApiResponse<List<RevenueDataPoint>>> getRevenueSeries(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getRevenueSeries(startDate, endDate)));
    }

    @GetMapping("/by-venue")
    @Operation(summary = "Bookings and revenue breakdown by venue")
    public ResponseEntity<ApiResponse<List<VenueAnalyticsResponse>>> getRevenueByVenue() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getRevenueByVenue()));
    }

    @GetMapping("/slot-status")
    @Operation(summary = "Slot status breakdown for donut chart")
    public ResponseEntity<ApiResponse<List<SlotStatusBreakdown>>> getSlotStatusBreakdown() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getSlotStatusBreakdown()));
    }
}
