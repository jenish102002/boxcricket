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
public class RevenueDataPoint {
    private String period;
    private BigDecimal revenue;
    private long bookings;
}
