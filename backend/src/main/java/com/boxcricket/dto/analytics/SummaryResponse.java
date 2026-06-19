package com.boxcricket.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SummaryResponse {
    private BigDecimal totalRevenue;
    private long totalBookings;
    private double occupancyRate;
    private long activeVenues;
    private long totalSlots;
    private long availableSlots;
}
